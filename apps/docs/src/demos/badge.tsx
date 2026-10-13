import { Badge, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Tones() {
  return (
    <>
      <Badge>下書き</Badge>
      <Badge tone="info" icon={<Icon name="info" />}>案内</Badge>
      <Badge tone="success" icon={<Icon name="check" />}>完了</Badge>
      <Badge tone="warn" icon={<Icon name="warning" />}>注意</Badge>
      <Badge tone="error" icon={<Icon name="error" />}>失敗</Badge>
    </>
  );
}

export function Numeric() {
  return <Badge numeric>24</Badge>;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Badge>なし</Badge>, note: "値がないときも文字を表示する(空のバッジは作らない)" },
    { label: "Loading", na: "バッジは短い文字なので、ローディング状態を持たない。値が届くまではバッジを表示しない" },
    { label: "Error", node: <Badge tone="error" icon={<Icon name="error" />}>失敗</Badge> },
    { label: "Disabled", node: <Badge>停止中</Badge>, note: "無効は neutral のバッジで示し、文字で理由を書く" },
    { label: "Focus", na: "バッジは操作できないため、フォーカスを受けない" },
  ];
}
