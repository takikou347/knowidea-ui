import { Switch } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ display: "grid", gap: "var(--space-1)" }}>
      <Switch label="自動で更新する" defaultChecked />
      <Switch label="通知を表示する" />
    </div>
  );
}

export function Settings() {
  return (
    <div style={{ display: "grid", width: "min(100%, 420px)" }}>
      <Switch label="通知を表示する" description="予定の 10 分前に知らせる" placement="end" defaultChecked />
      <Switch label="自動で更新する" description="開いている間、1 分ごとに読み直す" placement="end" />
      <Switch label="音を鳴らす" placement="end" disabled />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Switch label="オフ" /> },
    { label: "Loading", node: <Switch label="反映中" loading defaultChecked /> },
    { label: "Error", na: "切り替えに失敗したら、近くの Alert で理由を伝え、Switch を元の位置に戻す" },
    { label: "Disabled", node: <><Switch label="無効(オフ)" disabled /><Switch label="無効(オン)" disabled defaultChecked /></> },
    { label: "Focus", node: <Switch label="フォーカス" className="is-focus" defaultChecked /> },
    { label: "Hover", node: <Switch label="ホバー" className="is-hover" /> },
    { label: "Active", na: "押すと切り替わる。押している間だけの見た目はない" },
  ];
}
