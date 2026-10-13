import { Field, Input, Textarea, Select, Checkbox } from "@knowidea/react";
const opts = [{ value: "daily", label: "毎日" }, { value: "weekly", label: "毎週" }];
type K = "demo" | "empty" | "loading" | "error" | "disabled" | "focus";
export function InputField({ kind = "demo" }: { kind?: K }) {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Field
        label="routine 名"
        required
        hint={kind === "error" ? undefined : "英小文字とハイフンで書く"}
        error={kind === "error" ? "英小文字とハイフンだけが使える" : undefined}
        disabled={kind === "disabled"}
      >
        <Input
          placeholder="例: review"
          defaultValue={kind === "error" ? "Review Daily" : kind === "loading" ? "review" : undefined}
          loading={kind === "loading"}
          readOnly={kind === "loading"}
          className={kind === "focus" ? "is-focus" : undefined}
        />
      </Field>
    </div>
  );
}
export function Mixed() {
  return (
    <div style={{ width: "min(100%, 320px)", display: "grid", gap: "var(--space-4)" }}>
      <Field label="間隔" hint="実行の間隔"><Select aria-label="間隔" options={opts} /></Field>
      <Field label="メモ"><Textarea /></Field>
      <Field label="通知"><Checkbox label="完了したら知らせる" /></Field>
    </div>
  );
}
