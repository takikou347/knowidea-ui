import { Field, Input, Textarea, Select, Checkbox } from "@knowidea/ui";
import type { StateRow } from "./types";

const opts = [{ value: "daily", label: "毎日" }, { value: "weekly", label: "毎週" }];

export function WithInput() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Field label="名前" required hint="英小文字とハイフンで入力する">
        <Input placeholder="例: sample-name" />
      </Field>
    </div>
  );
}

export function Mixed() {
  return (
    <div style={{ width: "min(100%, 320px)", display: "grid", gap: "var(--space-4)" }}>
      <Field label="間隔" hint="更新の間隔"><Select aria-label="間隔" options={opts} /></Field>
      <Field label="メモ"><Textarea /></Field>
      <Field label="通知"><Checkbox label="完了したら通知する" /></Field>
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 320px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><Field label="名前" required hint="英小文字とハイフンで入力する"><Input placeholder="例: sample-name" /></Field></W> },
    { label: "Loading", node: <W><Field label="名前"><Input defaultValue="sample-name" loading readOnly /></Field></W> },
    { label: "Error", node: <W><Field label="名前" error="英小文字とハイフンだけ使える"><Input defaultValue="Sample Name" invalid /></Field></W> },
    { label: "Disabled", node: <W><Field label="名前" disabled><Input defaultValue="sample-name" disabled /></Field></W> },
    { label: "Focus", node: <W><Field label="名前"><Input defaultValue="sample-name" className="is-focus" /></Field></W> },
    { label: "Hover", na: "中の入力欄が変わる。Field のラベルとヒントは変わらない" },
    { label: "Active", na: "ラベルを押すと、中の入力欄にフォーカスが移る" },
  ];
}
