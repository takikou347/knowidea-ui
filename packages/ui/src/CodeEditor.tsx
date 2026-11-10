import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, type CompletionContext, type CompletionResult } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab, temporarilySetTabFocusMode } from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { lintKeymap, setDiagnostics, type Diagnostic } from "@codemirror/lint";
import { Compartment, EditorState, StateEffect, StateField, type Extension } from "@codemirror/state";
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, hoverTooltip, keymap, lineNumbers, showTooltip, type Tooltip } from "@codemirror/view";
import { classHighlighter } from "@lezer/highlight";
import { mediaQuery } from "./breakpoints.js";
import { editorOffset, editorPosition, type EditorLanguage } from "./editorText.js";
import { cx } from "./utils.js";

/** エディタの中の場所。line と column は 1 から、offset は 0 から */
export interface EditorPlace {
  line: number;
  column: number;
  offset: number;
}

export interface EditorDiagnostic {
  /** 始まりの行と列(1 から) */
  line: number;
  column: number;
  /** 終わりの行と列。無ければ始まりから 1 字 */
  endLine?: number;
  endColumn?: number;
  severity: "error" | "warning" | "info";
  message: string;
}

export interface EditorCompletion {
  label: string;
  /** 候補の右に出す短い説明(型など) */
  detail?: string;
  /** 選んだ時に横に出す説明 */
  info?: string;
  /** 印の種類。function、variable、property、keyword、type、class など */
  type?: string;
  /** 入れる文字。無ければ label */
  apply?: string;
}

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  /** 読み上げの名前。ファイルの名前など */
  label: string;
  /** 言語。パスから決める時は editorLanguageOfPath(path) */
  language?: EditorLanguage;
  /** 読むだけにする。選ぶ、写す、キーで動くはできる */
  readOnly?: boolean;
  /** 長い行を折り返す。既定は、スマホの幅(600px 未満)だけ折り返す */
  wrap?: boolean;
  /** 書き間違いなどの知らせ。その場所に下線が付き、合わせると中身が出る */
  diagnostics?: EditorDiagnostic[];
  /** 候補を返す。言語が元から持つ候補に足される。無い時は null */
  complete?: (place: EditorPlace & { text: string; word: string; explicit: boolean }) => EditorCompletion[] | null | Promise<EditorCompletion[] | null>;
  /** 合わせた所の型や説明を返す。無い時は null */
  hover?: (place: EditorPlace & { text: string }) => string | null | Promise<string | null>;
  /** 定義へ移る(F12 か、Ctrl か Cmd を押しながら押す)時に呼ぶ。移る先は使う側が決める */
  onDefinition?: (place: EditorPlace & { text: string }) => void;
  /** Ctrl+S か Cmd+S で呼ぶ */
  onSave?: (value: string) => void;
  /** 高さ。CSS の長さ(例 "20rem")。無ければ中身に合わせて伸びる */
  height?: string;
  /** CodeMirror の拡張を足す */
  extensions?: Extension[];
  className?: string;
  style?: CSSProperties;
}

function languageOf(l: EditorLanguage): Extension {
  switch (l) {
    case "typescript": return javascript({ typescript: true });
    case "tsx": return javascript({ typescript: true, jsx: true });
    case "javascript": return javascript();
    case "jsx": return javascript({ jsx: true });
    case "css": return css();
    case "markdown": return markdown();
    case "json": return json();
    case "text": return [];
  }
}

const placeOf = (state: EditorState, offset: number) => {
  const text = state.doc.toString();
  return { ...editorPosition(text, offset), offset, text };
};

function toDiagnostics(text: string, list: EditorDiagnostic[]): Diagnostic[] {
  return list.map((d) => {
    const from = editorOffset(text, d.line, d.column);
    const to = d.endLine !== undefined || d.endColumn !== undefined ? editorOffset(text, d.endLine ?? d.line, d.endColumn ?? d.column + 1) : Math.min(from + 1, text.length);
    return { from: Math.min(from, to), to: Math.max(from, to), severity: d.severity, message: d.message };
  }).sort((a, b) => a.from - b.from);
}

const hoverDom = (text: string) => () => {
  const dom = document.createElement("div");
  dom.className = "ki-editor__hover";
  dom.textContent = text;
  return { dom };
};

// キーで出した説明(Ctrl+Shift+Space。Ctrl+K は、アプリの探す欄などに使われやすいので避けた)。打つか、カーソルを動かすか、Esc で消える
const setInfo = StateEffect.define<Tooltip | null>();
const infoField = StateField.define<Tooltip | null>({
  create: () => null,
  update(value, tr) {
    for (const e of tr.effects) if (e.is(setInfo)) return e.value;
    return tr.docChanged || tr.selection ? null : value;
  },
  provide: (f) => showTooltip.from(f),
});

/**
 * コードを書く欄(CodeMirror 6)。色分け、括弧の対応、折り畳み、候補、書き間違いの下線を持つ。スマホでも動く。
 * Tab は字下げに使う。Esc を押してから Tab を押すと、エディタの外へ移る。
 * 外から value を替えると(別のファイルを開いた時など)、onChange は呼ばず、元に戻す履歴を空にする。
 * knowidea-ui/editor から読み込む(CodeMirror を、使う画面でだけ読み込むため)。
 */
export function CodeEditor({ value, onChange, label, language = "text", readOnly = false, wrap, diagnostics, complete, hover, onDefinition, onSave, height, extensions, className, style }: CodeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  // ready は、エディタを作った回数と、外から中身を入れ替えた回数。替わるたびに、下の effect が今の設定を送り直す
  const [ready, setReady] = useState(0);
  const base = useRef<Extension[]>([]);
  const hint = useId();
  // キーで出した説明を、読み上げに伝える文。初めから在る role="status" に入れる
  const [spoken, setSpoken] = useState("");
  // 呼ぶ物は ref に入れて、渡す関数が替わってもエディタを作り直さない
  const cb = useRef({ onChange, complete, hover, onDefinition, onSave });
  cb.current = { onChange, complete, hover, onDefinition, onSave };
  const parts = useRef({ language: new Compartment(), readOnly: new Compartment(), wrap: new Compartment(), extra: new Compartment(), label: new Compartment() });

  useEffect(() => {
    if (!host.current) return;
    const p = parts.current;
    const completion = async (ctx: CompletionContext): Promise<CompletionResult | null> => {
      const fn = cb.current.complete;
      if (!fn) return null;
      const word = ctx.matchBefore(/[\w$-]*/);
      if (!ctx.explicit && (!word || word.from === word.to) && !/[.<"'/ ]/.test(ctx.state.sliceDoc(ctx.pos - 1, ctx.pos))) return null;
      const items = await fn({ ...placeOf(ctx.state, ctx.pos), word: word?.text ?? "", explicit: ctx.explicit });
      if (!items || !items.length || ctx.aborted) return null;
      return { from: word ? word.from : ctx.pos, options: items.map((i) => ({ label: i.label, detail: i.detail, info: i.info, type: i.type, apply: i.apply })), validFor: /^[\w$-]*$/ };
    };
    const definition = (v: EditorView, offset: number) => {
      const fn = cb.current.onDefinition;
      if (!fn) return false;
      fn(placeOf(v.state, offset));
      return true;
    };
    const info = async (kv: EditorView) => {
      const pos = kv.state.selection.main.head;
      const text = await cb.current.hover?.(placeOf(kv.state, pos));
      if (!text || kv.state.selection.main.head !== pos) return;
      kv.dispatch({ effects: setInfo.of({ pos, above: true, create: hoverDom(text) }) });
      setSpoken(text);
    };
    base.current = [
          lineNumbers(), highlightActiveLineGutter(), foldGutter(), history(), drawSelection(), indentOnInput(), bracketMatching(), closeBrackets(), highlightActiveLine(),
          indentUnit.of("  "), EditorState.tabSize.of(2),
          syntaxHighlighting(classHighlighter),
          autocompletion(),
          EditorState.languageData.of(() => [{ autocomplete: completion }]),
          hoverTooltip(async (hv, pos) => {
            const text = await cb.current.hover?.(placeOf(hv.state, pos));
            return text ? { pos, above: true, create: hoverDom(text) } : null;
          }),
          infoField,
          keymap.of([
            { key: "Mod-s", run: (kv) => { const fn = cb.current.onSave; if (!fn) return false; fn(kv.state.doc.toString()); return true; } },
            { key: "F12", run: (kv) => definition(kv, kv.state.selection.main.head) },
            { key: "Mod-Shift-Space", run: (kv) => { if (!cb.current.hover) return false; void info(kv); return true; } },
            { key: "Escape", run: (kv) => { if (!kv.state.field(infoField)) return false; kv.dispatch({ effects: setInfo.of(null) }); setSpoken(""); return true; } },
            ...closeBracketsKeymap, ...completionKeymap, ...lintKeymap, ...foldKeymap, ...historyKeymap,
            { key: "Escape", run: temporarilySetTabFocusMode },
            indentWithTab, ...defaultKeymap,
          ]),
          EditorView.domEventHandlers({
            mousedown: (e, mv) => {
              if (!(e.metaKey || e.ctrlKey) || e.button !== 0 || !cb.current.onDefinition) return false;
              const pos = mv.posAtCoords({ x: e.clientX, y: e.clientY });
              if (pos === null) return false;
              e.preventDefault();
              return definition(mv, pos);
            },
          }),
          EditorView.updateListener.of((u) => { if (u.docChanged) cb.current.onChange?.(u.state.doc.toString()); }),
          p.label.of([]), p.language.of([]), p.readOnly.of([]), p.wrap.of([]), p.extra.of([]),
    ];
    const v = new EditorView({ parent: host.current, state: EditorState.create({ doc: value, extensions: base.current }) });
    view.current = v;
    setReady((n) => n + 1);
    return () => { v.destroy(); view.current = null; setReady(0); };
    // 最初の 1 回だけ作る。後の変わり方は下の effect が送る
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 外から value が替わった時だけ、中身を入れ替える(打った字は onChange で同じ値が戻るので、何もしない)。
  // 状態ごと作り直すので、onChange は呼ばれず、元に戻す履歴に前の中身は残らない
  useEffect(() => {
    const v = view.current;
    if (!v || v.state.doc.toString() === value) return;
    v.setState(EditorState.create({ doc: value, extensions: base.current }));
    setReady((n) => n + 1);
  }, [value, ready]);

  useEffect(() => {
    view.current?.dispatch({ effects: parts.current.label.reconfigure(EditorView.contentAttributes.of({ "aria-label": label, "aria-describedby": hint })) });
  }, [label, hint, ready]);
  useEffect(() => { view.current?.dispatch({ effects: parts.current.language.reconfigure(languageOf(language)) }); }, [language, ready]);
  useEffect(() => {
    view.current?.dispatch({ effects: parts.current.readOnly.reconfigure(readOnly ? [EditorState.readOnly.of(true), EditorView.contentAttributes.of({ "aria-readonly": "true" })] : []) });
  }, [readOnly, ready]);
  useEffect(() => { view.current?.dispatch({ effects: parts.current.extra.reconfigure(extensions ?? []) }); }, [extensions, ready]);
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const set = (on: boolean) => v.dispatch({ effects: parts.current.wrap.reconfigure(on ? EditorView.lineWrapping : []) });
    if (wrap !== undefined) { set(wrap); return; }
    const mq = window.matchMedia(mediaQuery.phone);
    const onChangeWidth = () => set(mq.matches);
    onChangeWidth();
    mq.addEventListener("change", onChangeWidth);
    return () => mq.removeEventListener("change", onChangeWidth);
  }, [wrap, ready]);
  useEffect(() => {
    const v = view.current;
    if (v) v.dispatch(setDiagnostics(v.state, toDiagnostics(v.state.doc.toString(), diagnostics ?? [])));
  }, [diagnostics, value, ready]);

  return (
    <div className={cx("ki-editor", className)} style={height ? { ...style, ["--ki-editor-height" as string]: height } : style} data-readonly={readOnly ? "" : undefined} data-fixed={height ? "" : undefined}>
      <div ref={host} className="ki-editor__host" />
      {/* 動き出す前(サーバーで描いた時)は、同じ中身を等幅で見せる */}
      {ready ? null : <pre className="ki-editor__fallback" role="textbox" aria-readonly="true" aria-multiline="true" aria-label={label} tabIndex={0}>{value}</pre>}
      <span role="status" className="ki-sr-only">{spoken}</span>
      <span id={hint} className="ki-sr-only">Tab は字下げ。Esc を押してから Tab を押すと、エディタの外へ移る。</span>
    </div>
  );
}
