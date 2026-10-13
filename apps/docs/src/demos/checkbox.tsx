import { Checkbox } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ display: "grid", gap: "var(--space-1)" }}>
      <Checkbox label="完了したら通知する" defaultChecked />
      <Checkbox label="まとめて受け取る" />
    </div>
  );
}

export function Indeterminate() {
  return <Checkbox label="すべて選択" indeterminate />;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Checkbox label="未選択" /> },
    { label: "Loading", node: <Checkbox label="確認中" loading /> },
    { label: "Error", node: <Checkbox label="同意が必要" invalid /> },
    { label: "Disabled", node: <><Checkbox label="無効(未選択)" disabled /><Checkbox label="無効(選択済み)" disabled defaultChecked /></> },
    { label: "Focus", node: <Checkbox label="フォーカス" defaultChecked className="is-focus" /> },
    { label: "Hover", node: <Checkbox label="ホバー" className="is-hover" /> },
    { label: "Active", na: "押すと選択が切り替わる。押している間だけの見た目はない" },
  ];
}
