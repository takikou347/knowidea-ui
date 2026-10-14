import { CodeBlock } from "knowidea-ui";
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
    { label: "Empty", na: "コードのないコードブロックは作らない" },
    { label: "Loading", na: "文字列を渡すコンポーネントなので、ローディング状態を持たない。取得中は Skeleton で場所を確保する" },
    { label: "Error", text: "コピーに失敗したときは、ボタンの隣に失敗のメッセージが表示される" },
    { label: "Disabled", na: "CodeBlock は無効状態を持たない" },
    { label: "Focus", node: <div style={{ width: "100%" }}><CodeBlock language="yaml" code={sample + "\nnote: 長い行は枠の中だけが横にスクロールする。この行は、狭い幅で横にスクロールして確かめるための長さにしてある"} /></div>, note: "横スクロールする領域には Tab で移れる。矢印キーでスクロールする" },
  ];
}
