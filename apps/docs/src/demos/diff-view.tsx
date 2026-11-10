import { useState } from "react";
import { Alert, Button, DiffView, EmptyState, Icon, Skeleton, parseUnifiedDiff, diffLineKey, type DiffFile, type DiffLine } from "knowidea-ui";
import type { StateRow } from "./types";

const text = `diff --git a/src/total.ts b/src/total.ts
--- a/src/total.ts
+++ b/src/total.ts
@@ -1,6 +1,7 @@
 export function total(items: number[]) {
-  let sum = 0;
-  for (const n of items) sum += n;
-  return sum;
+  let sum = 0n;
+  for (const n of items) sum += BigInt(n);
+  if (sum < 0n) throw new RangeError("負の合計");
+  return Number(sum);
 }
 
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -3,3 +3,3 @@
 ## 使い方
 
-合計を返す。
+合計を返す。負になる時は RangeError を投げる。
`;

const files = parseUnifiedDiff(text);

export function Basic() {
  return <div style={{ width: "100%" }}><DiffView files={files} /></div>;
}

export function Unified() {
  return <div style={{ width: "100%" }}><DiffView files={files} layout="unified" /></div>;
}

export function Split() {
  return <div style={{ width: "100%" }}><DiffView files={files.slice(0, 1)} layout="split" /></div>;
}

export function Comment() {
  const [notes, setNotes] = useState<Record<string, string>>({ "src/total.ts:n4": "負の数が入る事はあるか。" });
  const [open, setOpen] = useState<string>();
  const id = (f: DiffFile, l: DiffLine) => `${f.path}:${diffLineKey(l)}`;
  return (
    <div style={{ width: "100%" }}>
      <DiffView
        files={files.slice(0, 1)}
        onLineComment={(f, l) => setOpen(id(f, l))}
        renderAfterLine={(f, l) => {
          const k = id(f, l);
          if (open === k) {
            return (
              <form style={{ display: "grid", gap: "var(--space-2)" }} onSubmit={(e) => { e.preventDefault(); const v = new FormData(e.currentTarget).get("note"); if (typeof v === "string" && v.trim()) setNotes((n) => ({ ...n, [k]: v.trim() })); setOpen(undefined); }}>
                <label className="ki-sr-only" htmlFor="diff-note">一言</label>
                <textarea id="diff-note" name="note" className="ki-textarea" rows={2} defaultValue={notes[k] ?? ""} />
                <div style={{ display: "flex", gap: "var(--space-2)" }}><Button type="submit" variant="primary">付ける</Button><Button type="button" variant="quiet" onClick={() => setOpen(undefined)}>やめる</Button></div>
              </form>
            );
          }
          return notes[k] ? <p style={{ margin: 0 }}>{notes[k]}</p> : null;
        }}
      />
    </div>
  );
}

export function Collapsed() {
  return <div style={{ width: "100%" }}><DiffView files={files} collapsed /></div>;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <div style={{ width: "100%" }}><EmptyState title="変更が無い" icon={<Icon name="file" />}>ファイルが 0 件の時、DiffView は何も描かない。空の見せ方は使う側が決める。</EmptyState></div> },
    { label: "Loading", node: <div style={{ width: "100%", display: "grid", gap: "var(--space-2)" }} aria-busy="true"><Skeleton size="short" /><Skeleton shape="block" /></div>, note: "Skeleton でファイルの名前と中身の形をまねる" },
    { label: "Error", node: <div style={{ width: "100%" }}><Alert tone="error" title="差分を読めなかった">もう一度開き直す。</Alert></div>, note: "エラー状態を持たない。取得に失敗したら Alert に切り替える" },
    { label: "Disabled", na: "無効状態を持たない。onLineComment を渡さなければ、行の番号は押せない" },
    { label: "Focus", text: "ファイルの名前の行と、一言を付けるボタン(行の番号)に Tab で移り、2px のリングが出る" },
  ];
}
