import { Input } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Input aria-label="名前" placeholder="例: sample-name" />
    </div>
  );
}

export function Numeric() {
  return (
    <div style={{ width: "min(100%, 160px)" }}>
      <Input aria-label="件数" type="number" defaultValue={24} numeric />
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 320px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><Input aria-label="空" placeholder="例: sample-name" /></W> },
    { label: "読み込み", node: <W><Input aria-label="読み込み" defaultValue="sample-name" loading readOnly /></W> },
    { label: "失敗", node: <W><Input aria-label="失敗" defaultValue="Sample Name" invalid /></W> },
    { label: "無効", node: <W><Input aria-label="無効" defaultValue="sample-name" disabled /></W> },
    { label: "focus", node: <W><Input aria-label="focus" defaultValue="sample-name" className="is-focus" /></W> },
    { label: "hover", node: <W><Input aria-label="hover" defaultValue="sample-name" className="is-hover" /></W> },
    { label: "押した時", na: "入力に押した時の見た目は無い。入力中は focus と同じ" },
  ];
}
