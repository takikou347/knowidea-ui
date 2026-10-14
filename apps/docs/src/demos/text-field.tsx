import { TextField } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <TextField label="名前" required hint="英小文字とハイフンで入力する" placeholder="例: sample-name" />
    </div>
  );
}

export function Multiline() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <TextField label="メモ" multiline rows={3} hint="後から読む人に向けて書く" />
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 320px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><TextField label="名前" placeholder="例: sample-name" /></W> },
    { label: "Loading", node: <W><TextField label="名前" defaultValue="sample-name" loading readOnly /></W> },
    { label: "Error", node: <W><TextField label="名前" defaultValue="Sample Name" error="英小文字とハイフンだけ使える" /></W> },
    { label: "Disabled", node: <W><TextField label="名前" defaultValue="sample-name" disabled /></W> },
    { label: "Focus", node: <W><TextField label="名前" defaultValue="sample-name" className="is-focus" /></W> },
    { label: "Hover", na: "入力欄の枠線の色が変わる。ラベルとヒントは変わらない" },
    { label: "Active", na: "入力欄に押下時の見た目はない。入力中は Focus と同じ" },
  ];
}
