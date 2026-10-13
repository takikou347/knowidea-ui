import { IconButton, Icon, type ButtonVariant } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Variants() {
  return (
    <>
      <IconButton variant="primary" label="追加" icon={<Icon name="add" />} />
      <IconButton variant="secondary" label="コピー" icon={<Icon name="copy" />} />
      <IconButton label="その他の操作" icon={<Icon name="more" />} />
      <IconButton variant="danger" label="削除" icon={<Icon name="delete" />} />
    </>
  );
}

export function Large() {
  return <IconButton variant="secondary" size="lg" label="閉じる" icon={<Icon name="close" />} />;
}

const variants: ButtonVariant[] = ["primary", "secondary", "quiet", "danger"];
export function states(): StateRow[] {
  const row = (props: Record<string, unknown>) =>
    variants.map((v) => <IconButton key={v} variant={v} label="コピー" icon={<Icon name="copy" />} {...props} />);
  return [
    { label: "Empty", na: "名前(label)のない IconButton は作らない" },
    { label: "Loading", node: row({ loading: true }) },
    { label: "Error", na: "ボタン自身はエラー状態を持たない" },
    { label: "Disabled", node: row({ disabled: true }) },
    { label: "Focus", node: row({ className: "is-focus" }) },
    { label: "Hover", node: row({ className: "is-hover" }) },
    { label: "Active", node: row({ className: "is-active" }) },
  ];
}
