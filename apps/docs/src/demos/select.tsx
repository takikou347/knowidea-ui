import { Select } from "@knowidea/ui";
import type { StateRow } from "./types";

const options = [
  { value: "daily", label: "毎日" },
  { value: "weekly", label: "毎週" },
  { value: "monthly", label: "毎月" },
  { value: "never", label: "しない", disabled: true },
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
    { label: "空", node: <W><Select aria-label="空" options={options} placeholder="間隔を選ぶ" /></W> },
    { label: "読み込み", node: <W><Select aria-label="読み込み" options={options} loading /></W> },
    { label: "失敗", node: <W><Select aria-label="失敗" options={options} invalid /></W> },
    { label: "無効", node: <W><Select aria-label="無効" options={options} disabled defaultValue="daily" /></W> },
    { label: "focus", node: <W><Select aria-label="focus" options={options} className="is-focus" defaultValue="daily" /></W> },
    { label: "hover", node: <W><Select aria-label="hover" options={options} className="is-hover" defaultValue="daily" /></W> },
    { label: "押した時", na: "押すと選択肢の一覧が開く。開いた状態は上のデモで確かめる" },
  ];
}
