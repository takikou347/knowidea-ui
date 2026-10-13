import { IconButton, Icon, type ButtonVariant } from "@knowidea/react";
const variants: ButtonVariant[] = ["primary", "secondary", "quiet", "danger"];
export function Row({ kind }: { kind?: "demo" | "loading" | "disabled" | "focus" | "hover" | "active" }) {
  const cls = kind === "focus" ? "is-focus" : kind === "hover" ? "is-hover" : kind === "active" ? "is-active" : undefined;
  return (
    <>
      {variants.map((v) => (
        <IconButton key={v} variant={v} label="コピー" icon={<Icon name="copy" />} className={cls}
          loading={kind === "loading"} disabled={kind === "disabled"} />
      ))}
    </>
  );
}
export function Large() {
  return <IconButton variant="secondary" size="lg" label="閉じる" icon={<Icon name="x" />} />;
}
