import { Switch } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ display: "grid", gap: "var(--space-1)" }}>
      <Switch label="自動で更新する" defaultChecked />
      <Switch label="通知を出す" />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", node: <Switch label="切っている" /> },
    { label: "読み込み", node: <Switch label="反映している" loading defaultChecked /> },
    { label: "失敗", na: "切り替えが失敗したら、近くの Alert で理由を示し、スイッチは元の位置に戻す" },
    { label: "無効", node: <><Switch label="無効(切っている)" disabled /><Switch label="無効(入れている)" disabled defaultChecked /></> },
    { label: "focus", node: <Switch label="focus" className="is-focus" defaultChecked /> },
    { label: "hover", node: <Switch label="hover" className="is-hover" /> },
    { label: "押した時", na: "押すと切り替わる。押している間だけの見た目は無い" },
  ];
}
