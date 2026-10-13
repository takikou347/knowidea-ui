import { CodeBlock } from "@knowidea/ui";
import type { StateRow } from "./types";

const sample = `name: sample
schedule: "0 18 * * *"
retry: 3`;

export function Basic() {
  return <div style={{ width: "100%", minWidth: 0 }}><CodeBlock language="yaml" code={sample} /></div>;
}

export function LineNumbers() {
  return <div style={{ width: "100%", minWidth: 0 }}><CodeBlock language="yaml" code={sample} lineNumbers /></div>;
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "コードの無いコードブロックは作らない" },
    { label: "読み込み", na: "文字を渡す部品なので読み込みを持たない。取得中は Skeleton で場所を取る" },
    { label: "失敗", na: "写せなかったときは、ボタンの隣に「写せない」と出る" },
    { label: "無効", na: "コードブロックは無効にならない" },
    { label: "focus", node: <div style={{ width: "100%" }}><CodeBlock language="yaml" code={sample + "\nnote: 長い行は枠の中だけが横に動く。この行は狭い幅で横に動かして確かめる長さにしてある"} /></div>, note: "横に動く領域は Tab で入れる。矢印で動かす" },
  ];
}
