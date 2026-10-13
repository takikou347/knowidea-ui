import { Checkbox } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ display: "grid", gap: "var(--space-1)" }}>
      <Checkbox label="完了したら知らせる" defaultChecked />
      <Checkbox label="まとめて受け取る" />
    </div>
  );
}

export function Indeterminate() {
  return <Checkbox label="全部を選ぶ" indeterminate />;
}

export function states(): StateRow[] {
  return [
    { label: "空", node: <Checkbox label="選んでいない" /> },
    { label: "読み込み", node: <Checkbox label="確かめている" loading /> },
    { label: "失敗", node: <Checkbox label="同意が要る" invalid /> },
    { label: "無効", node: <><Checkbox label="無効(選んでいない)" disabled /><Checkbox label="無効(選んでいる)" disabled defaultChecked /></> },
    { label: "focus", node: <Checkbox label="focus" defaultChecked className="is-focus" /> },
    { label: "hover", node: <Checkbox label="hover" className="is-hover" /> },
    { label: "押した時", na: "押すと選びが切り替わる。押している間だけの見た目は無い" },
  ];
}
