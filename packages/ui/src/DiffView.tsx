import { useSyncExternalStore, type ReactNode } from "react";
import { mediaQuery } from "./breakpoints.js";
import { Icon } from "./Icon.js";
import { diffLineKey, diffWords, pairDiffLines, type DiffFile, type DiffLine, type DiffRow } from "./diff.js";
import { cx } from "./utils.js";

export interface DiffViewProps {
  files: DiffFile[];
  /**
   * 並べ方。unified は 1 列、split は前と後を左右に並べる。
   * auto(既定)は PC の幅(1024px 以上)で split、それより狭い時は unified。サーバーで描く時と最初の 1 回は unified
   */
  layout?: "unified" | "split" | "auto";
  /** 行に一言を付けるボタンを出す。押すとその行が渡る */
  onLineComment?: (file: DiffFile, line: DiffLine) => void;
  /** 行の下に置く物(付いた一言、書く欄など)。無ければ null を返す */
  renderAfterLine?: (file: DiffFile, line: DiffLine) => ReactNode;
  /** 一言を付けるボタンの読み上げの名前。既定「<パス> の <番号> 行目に一言を付ける」。消した行は「<パス> の消した <番号> 行目に一言を付ける」 */
  commentLabel?: (file: DiffFile, line: DiffLine) => string;
  /** ファイルを閉じた形で始める */
  collapsed?: boolean;
  className?: string;
}

const statusName = { added: "新しいファイル", deleted: "消したファイル", modified: "", renamed: "名前を変えた" } as const;
const typeName = { add: "足した行", del: "消した行", context: "" } as const;

function count(file: DiffFile) {
  let add = 0;
  let del = 0;
  for (const h of file.hunks) for (const l of h.lines) { if (l.type === "add") add++; else if (l.type === "del") del++; }
  return { add, del };
}

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(mediaQuery.desktop);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const isDesktop = () => window.matchMedia(mediaQuery.desktop).matches;
const notDesktop = () => false;

type Parts = { prefix: string; mid: string; suffix: string };

/** 対になった消した行と足した行の、行の中で変わった所。行がまるごと違う時は印を付けない */
function wordParts(rows: DiffRow[]): Map<DiffLine, Parts> {
  const map = new Map<DiffLine, Parts>();
  for (const r of rows) {
    if (!r.left || !r.right || r.left.type !== "del" || r.right.type !== "add") continue;
    const w = diffWords(r.left.text, r.right.text);
    // 同じ所が少ない対は、別の行として扱う。片方に足しただけ、消しただけの時は印を付ける
    const common = (w.prefix + w.suffix).trim().length;
    const longer = Math.max(r.left.text.trim().length, r.right.text.trim().length);
    if (common === 0 || (w.left && w.right && common * 2 < longer)) continue;
    if (w.left) map.set(r.left, { prefix: w.prefix, mid: w.left, suffix: w.suffix });
    if (w.right) map.set(r.right, { prefix: w.prefix, mid: w.right, suffix: w.suffix });
  }
  return map;
}

/**
 * 差分の表示。ファイルごとに開け閉めでき、行ごとに前と後の番号、足した印と消した印を出す。行の中で変わった所には印が付く。
 * PC の幅では前と後を左右に並べ、狭い幅では 1 列にまとめる(layout で固定もできる)。
 * onLineComment を渡すと、行の番号が一言を付けるボタンになる(左右の時は、消した行は左、ほかは右の番号。1 列の時は 2 つの番号がまとめて 1 つのボタンになる。指で触る端末では 44px 四方以上になる)。
 */
export function DiffView({ files, layout = "auto", onLineComment, renderAfterLine, commentLabel, collapsed = false, className }: DiffViewProps) {
  const desktop = useSyncExternalStore(subscribeDesktop, isDesktop, notDesktop);
  const split = layout === "split" || (layout === "auto" && desktop);

  const code = (l: DiffLine, parts?: Parts) => (
    <span className="ki-diff__code">
      {typeName[l.type] ? <span className="ki-sr-only">{typeName[l.type]} </span> : null}
      {parts ? <>{parts.prefix}<mark className="ki-diff__word">{parts.mid}</mark>{parts.suffix}</> : l.text || " "}
    </span>
  );
  const sign = (l: DiffLine) => <span className="ki-diff__sign" aria-hidden="true">{l.type === "add" ? "+" : l.type === "del" ? "−" : ""}</span>;
  const labelOf = (f: DiffFile, l: DiffLine) =>
    commentLabel
      ? commentLabel(f, l)
      : l.newNumber !== undefined ? `${f.path} の ${l.newNumber} 行目に一言を付ける` : `${f.path} の消した ${l.oldNumber} 行目に一言を付ける`;
  const number = (f: DiffFile, l: DiffLine, n: number | undefined, button: boolean) => {
    if (!button || !onLineComment) return <span className="ki-diff__num" aria-hidden="true">{n ?? ""}</span>;
    return <button type="button" className="ki-diff__num ki-diff__comment" aria-label={labelOf(f, l)} onClick={() => onLineComment(f, l)}>{n ?? ""}</button>;
  };

  return (
    <div className={cx("ki-diff", className)} data-layout={split ? "split" : "unified"} data-commentable={onLineComment ? "" : undefined}>
      {files.map((f) => {
        const c = count(f);
        const st = f.status ? statusName[f.status] : "";
        return (
          <details key={f.oldPath ? `${f.oldPath}->${f.path}` : f.path} className="ki-diff__file" open={!collapsed}>
            <summary className="ki-diff__head">
              <Icon name="chevron-right" />
              <span className="ki-diff__path">{f.oldPath ? <>{f.oldPath}<span aria-hidden="true"> → </span><span className="ki-sr-only">から</span></> : null}{f.path}</span>
              {st ? <span className="ki-diff__status">{st}</span> : null}
              <span className="ki-diff__count">
                <span data-type="add" aria-hidden="true">+{c.add}</span><span className="ki-sr-only">{c.add} 行足した</span>
                <span data-type="del" aria-hidden="true">−{c.del}</span><span className="ki-sr-only">{c.del} 行消した</span>
              </span>
            </summary>
            <div className="ki-diff__body">
              {f.hunks.map((h, hi) => {
                const rows = pairDiffLines(h.lines);
                const words = wordParts(rows);
                return (
                  <div key={hi} className="ki-diff__hunk">
                    <div className="ki-diff__hunk-head">{h.header}</div>
                    {split
                      ? rows.map((r) => {
                          const same = r.left === r.right;
                          const afterLeft = r.left && !same ? renderAfterLine?.(f, r.left) : null;
                          const afterRight = r.right ? renderAfterLine?.(f, r.right) : null;
                          return (
                            <div key={`${r.left ? diffLineKey(r.left) : ""}:${r.right ? diffLineKey(r.right) : ""}`} className="ki-diff__row">
                              <div className="ki-diff__pair">
                                {r.left
                                  ? <div className="ki-diff__line" data-side="left" data-type={same ? "context" : r.left.type} aria-hidden={same ? true : undefined}>{number(f, r.left, r.left.oldNumber, !same)}{same ? <span className="ki-diff__sign" aria-hidden="true" /> : sign(r.left)}{code(r.left, words.get(r.left))}</div>
                                  : <div className="ki-diff__line" data-side="left" data-type="none" />}
                                {r.right
                                  ? <div className="ki-diff__line" data-side="right" data-type={r.right.type}>{number(f, r.right, r.right.newNumber, true)}{sign(r.right)}{code(r.right, words.get(r.right))}</div>
                                  : <div className="ki-diff__line" data-side="right" data-type="none" />}
                              </div>
                              {afterLeft ? <div className="ki-diff__after">{afterLeft}</div> : null}
                              {afterRight ? <div className="ki-diff__after">{afterRight}</div> : null}
                            </div>
                          );
                        })
                      : h.lines.map((l) => {
                          const after = renderAfterLine?.(f, l);
                          return (
                            <div key={diffLineKey(l)} className="ki-diff__row">
                              <div className="ki-diff__line" data-type={l.type}>
                                {onLineComment
                                  ? (
                                    <button type="button" className="ki-diff__nums ki-diff__comment" aria-label={labelOf(f, l)} onClick={() => onLineComment(f, l)}>
                                      <span className="ki-diff__num">{l.oldNumber ?? ""}</span>
                                      <span className="ki-diff__num">{l.newNumber ?? ""}</span>
                                    </button>
                                  )
                                  : <><span className="ki-diff__num" aria-hidden="true">{l.oldNumber ?? ""}</span><span className="ki-diff__num" aria-hidden="true">{l.newNumber ?? ""}</span></>}
                                {sign(l)}
                                {code(l, words.get(l))}
                              </div>
                              {after ? <div className="ki-diff__after">{after}</div> : null}
                            </div>
                          );
                        })}
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
