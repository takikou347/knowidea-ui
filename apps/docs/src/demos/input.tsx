import { Input } from "knowidea-ui";
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
    { label: "Empty", node: <W><Input aria-label="空" placeholder="例: sample-name" /></W> },
    { label: "Loading", node: <W><Input aria-label="読み込み中" defaultValue="sample-name" loading readOnly /></W> },
    { label: "Error", node: <W><Input aria-label="エラー" defaultValue="Sample Name" invalid /></W> },
    { label: "Disabled", node: <W><Input aria-label="無効" defaultValue="sample-name" disabled /></W> },
    { label: "Focus", node: <W><Input aria-label="フォーカス" defaultValue="sample-name" className="is-focus" /></W> },
    { label: "Hover", node: <W><Input aria-label="ホバー" defaultValue="sample-name" className="is-hover" /></W> },
    { label: "Active", na: "入力欄に押下時の見た目はない。入力中は Focus と同じ" },
  ];
}
