import { Select } from "@knowidea/ui";
import type { StateRow } from "./types";

const options = [
  { value: "daily", label: "毎日" },
  { value: "weekly", label: "毎週" },
  { value: "monthly", label: "毎月" },
  { value: "never", label: "実行しない", disabled: true },
];

export function Basic() {
  return (
    <div style={{ width: "min(100%, 240px)" }}>
      <Select aria-label="間隔" options={options} placeholder="間隔を選ぶ" />
    </div>
  );
}

export function Selected() {
  return (
    <div style={{ width: "min(100%, 240px)" }}>
      <Select aria-label="間隔" options={options} defaultValue="weekly" />
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 240px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><Select aria-label="空" options={options} placeholder="間隔を選ぶ" /></W> },
    { label: "Loading", node: <W><Select aria-label="読み込み中" options={options} loading /></W> },
    { label: "Error", node: <W><Select aria-label="エラー" options={options} invalid /></W> },
    { label: "Disabled", node: <W><Select aria-label="無効" options={options} disabled defaultValue="daily" /></W> },
    { label: "Focus", node: <W><Select aria-label="フォーカス" options={options} className="is-focus" defaultValue="daily" /></W> },
    { label: "Hover", node: <W><Select aria-label="ホバー" options={options} className="is-hover" defaultValue="daily" /></W> },
    { label: "Active", na: "押すと選択肢の一覧が開く。開いた状態は上のデモで確認する" },
  ];
}
