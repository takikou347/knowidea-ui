import { Button, Icon, type ButtonVariant } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Variants() {
  return (
    <>
      <Button>保存する</Button>
      <Button variant="secondary">下書きにする</Button>
      <Button variant="quiet">あとで</Button>
      <Button variant="danger">削除する</Button>
    </>
  );
}

export function Sizes() {
  return (
    <>
      <Button>標準(44px)</Button>
      <Button size="lg">大きい(52px)</Button>
    </>
  );
}

export function WithIcon() {
  return (
    <>
      <Button icon={<Icon name="check" />}>完了にする</Button>
      <Button variant="secondary" icon={<Icon name="download" />}>書き出す</Button>
    </>
  );
}

const variants: ButtonVariant[] = ["primary", "secondary", "quiet", "danger"];
export function states(): StateRow[] {
  const row = (props: Record<string, unknown>) => variants.map((v) => <Button key={v} variant={v} {...props}>送る</Button>);
  return [
    { label: "空", na: "ラベルの無いボタンは作らない。アイコンだけのときはアイコンボタンを使う" },
    { label: "読み込み", node: row({ loading: true }) },
    { label: "失敗", na: "ボタン自身は失敗を持たない。押した結果の失敗は、近くの Alert か欄の誤りで示す" },
    { label: "無効", node: row({ disabled: true }) },
    { label: "focus", node: row({ className: "is-focus" }) },
    { label: "hover", node: row({ className: "is-hover" }) },
    { label: "押した時", node: row({ className: "is-active" }) },
  ];
}
