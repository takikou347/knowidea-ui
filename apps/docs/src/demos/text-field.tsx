import { TextField } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <TextField label="名前" required hint="英小文字とハイフンで書く" placeholder="例: sample-name" />
    </div>
  );
}

export function Multiline() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <TextField label="メモ" multiline rows={3} hint="あとで読む人に向けて書く" />
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 320px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><TextField label="名前" placeholder="例: sample-name" /></W> },
    { label: "読み込み", node: <W><TextField label="名前" defaultValue="sample-name" loading readOnly /></W> },
    { label: "失敗", node: <W><TextField label="名前" defaultValue="Sample Name" error="英小文字とハイフンだけが使える" /></W> },
    { label: "無効", node: <W><TextField label="名前" defaultValue="sample-name" disabled /></W> },
    { label: "focus", node: <W><TextField label="名前" defaultValue="sample-name" className="is-focus" /></W> },
    { label: "hover", na: "入力の枠の色が変わる。ラベルと補足は変わらない" },
    { label: "押した時", na: "入力に押した時の見た目は無い。入力中は focus と同じ" },
  ];
}
