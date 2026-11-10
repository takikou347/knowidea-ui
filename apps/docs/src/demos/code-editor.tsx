import { lazy, Suspense, useState } from "react";
import { Alert, Button, Skeleton, editorLanguageOfPath } from "knowidea-ui";
import type { CodeEditorProps, EditorDiagnostic } from "knowidea-ui/editor";
import type { StateRow } from "./types";

const LazyEditor = lazy(() => import("knowidea-ui/editor").then((m) => ({ default: m.CodeEditor })));

function CodeEditor(props: CodeEditorProps) {
  // CodeMirror は大きいので、エディタを出す時にだけ読み込む
  return <Suspense fallback={<Skeleton shape="block" />}><LazyEditor {...props} /></Suspense>;
}

const source = `export function total(items: number[]) {
  let sum = 0;
  for (const n of items) sum += n;
  return sum;
}
`;

export function Basic() {
  const [value, setValue] = useState(source);
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--space-2)" }}>
      <CodeEditor label="src/total.ts" language={editorLanguageOfPath("src/total.ts")} value={value} onChange={setValue} />
      <p className="ki-editor-demo__count" style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "var(--font-size-2)" }}>{value.length} 字</p>
    </div>
  );
}

export function Languages() {
  const [css, setCss] = useState(".card {\n  padding: var(--space-3);\n  color: var(--color-text);\n}\n");
  const [md, setMd] = useState("# 使い方\n\n合計を返す。**負**になる時は `RangeError` を投げる。\n");
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--space-3)" }}>
      <CodeEditor label="card.css" language="css" value={css} onChange={setCss} />
      <CodeEditor label="README.md" language="markdown" value={md} onChange={setMd} />
    </div>
  );
}

export function Diagnostics() {
  const [value, setValue] = useState(`const count: number = "3";\nconsole.log(cuont);\n`);
  const found: EditorDiagnostic[] = [];
  if (value.includes(`= "3"`)) found.push({ line: 1, column: 23, endColumn: 26, severity: "error", message: "文字列は number に入らない" });
  const at = value.split("\n")[1]?.indexOf("cuont") ?? -1;
  if (at >= 0) found.push({ line: 2, column: at + 1, endColumn: at + 6, severity: "error", message: "cuont が見つからない。count ではないか" });
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--space-2)" }}>
      <CodeEditor label="src/count.ts" language="typescript" value={value} onChange={setValue} diagnostics={found} />
      <p role="status" style={{ margin: 0, fontSize: "var(--font-size-2)" }}>{found.length ? `書き間違いが ${found.length} 件` : "書き間違いは無い"}</p>
    </div>
  );
}

const parts = [
  { label: "Breadcrumbs", detail: "今いる場所", type: "class" },
  { label: "Badge", detail: "短い印", type: "class" },
  { label: "BottomNavigation", detail: "下の切り替え", type: "class" },
  { label: "DiffView", detail: "変更の表示", type: "class" },
];

export function Completion() {
  const [value, setValue] = useState("import {  } from \"knowidea-ui\";\n");
  return (
    <div style={{ width: "100%" }}>
      <CodeEditor
        label="src/App.tsx"
        language="tsx"
        value={value}
        onChange={setValue}
        complete={({ word }) => parts.filter((p) => p.label.toLowerCase().startsWith(word.toLowerCase()))}
        hover={({ text, offset }) => {
          const hit = parts.find((p) => { const i = text.indexOf(p.label); return i >= 0 && offset >= i && offset <= i + p.label.length; });
          return hit ? `${hit.label}: ${hit.detail}` : null;
        }}
      />
    </div>
  );
}

const files = [
  { path: "src/total.ts", text: source },
  { path: "README.md", text: "# total\n\n合計を返す。\n" },
];

export function Files() {
  const [at, setAt] = useState(0);
  const [texts, setTexts] = useState(files.map((f) => f.text));
  const dirty = texts.some((t, i) => t !== files[i]!.text);
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--space-2)" }}>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {files.map((f, i) => <Button key={f.path} variant={i === at ? "primary" : "secondary"} aria-pressed={i === at} onClick={() => setAt(i)}>{f.path}</Button>)}
      </div>
      <CodeEditor label={files[at]!.path} language={editorLanguageOfPath(files[at]!.path)} value={texts[at]!} onChange={(v) => setTexts((t) => t.map((x, i) => (i === at ? v : x)))} />
      <p role="status" style={{ margin: 0, fontSize: "var(--font-size-2)" }}>{dirty ? "書き換えた" : "書き換えていない"}</p>
    </div>
  );
}

export function ReadOnly() {
  return <div style={{ width: "100%" }}><CodeEditor label="src/total.ts(読むだけ)" language="typescript" value={source} readOnly height="8rem" /></div>;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <div style={{ width: "100%" }}><CodeEditor label="新しいファイル" value="" /></div>, note: "中身が無い時も 6 行ぶんの高さを保つ" },
    { label: "Loading", node: <div style={{ width: "100%" }} aria-busy="true"><Skeleton shape="block" /></div>, note: "ファイルを取っている間は Skeleton で場所を取る" },
    { label: "Error", node: <div style={{ width: "100%" }}><Alert tone="error" title="ファイルを開けなかった">もう一度開き直す。</Alert></div>, note: "エラー状態を持たない。開けない時は Alert に切り替える。中身の書き間違いは diagnostics で下線にする" },
    { label: "Disabled", node: <div style={{ width: "100%" }}><CodeEditor label="読むだけ" language="typescript" value={"const a = 1;\n"} readOnly /></div>, note: "無効でなく readOnly にする。選ぶ、写す、キーで動くはできる" },
    { label: "Focus", text: "エディタの中に入ると、枠の外に 2px のリングが出る。Tab は字下げに使い、Esc を押してから Tab で外へ移る" },
  ];
}
