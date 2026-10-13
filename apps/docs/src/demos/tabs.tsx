import { Tabs } from "@knowidea/ui";
import type { StateRow } from "./types";

const items = [
  { value: "overview", label: "概要", content: <p>項目の数と、直近の更新。</p> },
  { value: "history", label: "履歴", content: <p>更新の記録を新しい順に並べる。</p> },
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
    { label: "空", na: "タブの無いタブ一覧は作らない。中身が空なら、中に空の状態を出す" },
    { label: "読み込み", na: "中身の読み込みは、選んだタブの中に Skeleton を出す" },
    { label: "失敗", na: "中身の失敗は、選んだタブの中に Alert を出す" },
    { label: "無効", node: <W><Tabs label="無効の例" items={items} defaultValue="locked" /></W>, note: "「設定」は選べない" },
    { label: "focus", node: <W><Tabs label="focus の例" items={items.slice(0, 2)} className="is-focus" /></W> },
    { label: "hover", na: "タブの背景が変わる" },
    { label: "押した時", na: "押すと選びが移る。選んだタブの下に 2px の主の色が出る" },
  ];
}
