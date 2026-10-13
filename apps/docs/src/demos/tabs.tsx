import { Tabs } from "@knowidea/react";
const items = [
  { value: "overview", label: "概要", content: <p>routine の数と、直近の実行。</p> },
  { value: "runs", label: "実行", content: <p>実行の記録を新しい順に並べる。</p> },
  { value: "usage", label: "使用量", content: <p>トークンの使用量を日ごとに示す。</p> },
  { value: "locked", label: "設定", content: <p>設定。</p>, disabled: true },
];
export function Demo({ className }: { className?: string }) {
  return <div style={{ width: "100%", minWidth: 0 }}><Tabs label="routine の表示" items={items} className={className} /></div>;
}
export function Many() {
  const many = Array.from({ length: 9 }, (_, i) => ({ value: "t" + i, label: `routine ${i + 1}`, content: <p>routine {i + 1} の内容。</p> }));
  return <div style={{ width: "100%", minWidth: 0 }}><Tabs label="多いタブ" items={many} /></div>;
}
