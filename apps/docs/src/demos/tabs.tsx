import { Tabs } from "knowidea-ui";
import type { StateRow } from "./types";

const items = [
  { value: "overview", label: "概要", content: <p>項目数と、直近の更新。</p> },
  { value: "history", label: "履歴", content: <p>更新履歴を新しい順に並べる。</p> },
  { value: "usage", label: "使用量", content: <p>使用量を日ごとに示す。</p> },
  { value: "locked", label: "設定", content: <p>設定。</p>, disabled: true },
];

export function Basic() {
  return <div style={{ width: "100%", minWidth: 0 }}><Tabs label="項目の表示" items={items} /></div>;
}

export function Many() {
  const many = Array.from({ length: 9 }, (_, i) => ({ value: "t" + i, label: `タブ ${i + 1}`, content: <p>タブ {i + 1} の内容。</p> }));
  return <div style={{ width: "100%", minWidth: 0 }}><Tabs label="多いタブ" items={many} /></div>;
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%", minWidth: 0 }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", na: "タブのないタブ一覧は作らない。内容が空なら、内容の中に Empty state を表示する" },
    { label: "Loading", na: "コンテンツの取得中は、選択中のタブの内側に Skeleton を表示する" },
    { label: "Error", na: "コンテンツの取得に失敗したときは、選択中のタブの内側に Alert を表示する" },
    { label: "Disabled", node: <W><Tabs label="無効の例" items={items} defaultValue="locked" /></W>, note: "「設定」は選択できない" },
    { label: "Focus", node: <W><Tabs label="フォーカスの例" items={items.slice(0, 2)} className="is-focus" /></W> },
    { label: "Hover", note: "タブの背景が変わる" },
    { label: "Active", note: "押すと選択が移り、選択中のタブの下にプライマリカラーの 2px の線が表示される" },
  ];
}
