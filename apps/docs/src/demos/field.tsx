import { Field, Input, Textarea, Select, Checkbox } from "@knowidea/ui";
import type { StateRow } from "./types";

const opts = [{ value: "daily", label: "毎日" }, { value: "weekly", label: "毎週" }];

export function WithInput() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Field label="名前" required hint="英小文字とハイフンで書く">
        <Input placeholder="例: sample-name" />
      </Field>
    </div>
  );
}

export function Mixed() {
  return (
    <div style={{ width: "min(100%, 320px)", display: "grid", gap: "var(--space-4)" }}>
      <Field label="間隔" hint="更新する間隔"><Select aria-label="間隔" options={opts} /></Field>
      <Field label="メモ"><Textarea /></Field>
      <Field label="通知"><Checkbox label="完了したら知らせる" /></Field>
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 320px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><Field label="名前" required hint="英小文字とハイフンで書く"><Input placeholder="例: sample-name" /></Field></W> },
    { label: "読み込み", node: <W><Field label="名前"><Input defaultValue="sample-name" loading readOnly /></Field></W> },
    { label: "失敗", node: <W><Field label="名前" error="英小文字とハイフンだけが使える"><Input defaultValue="Sample Name" invalid /></Field></W> },
    { label: "無効", node: <W><Field label="名前" disabled><Input defaultValue="sample-name" disabled /></Field></W> },
    { label: "focus", node: <W><Field label="名前"><Input defaultValue="sample-name" className="is-focus" /></Field></W> },
    { label: "hover", na: "中の入力が変わる。Field のラベルと補足は変わらない" },
    { label: "押した時", na: "ラベルを押すと中の入力に focus が移る" },
  ];
}
