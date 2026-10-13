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
    { label: "空", node: <Badge>なし</Badge>, note: "値が無いときも、字を出す(空の札は作らない)" },
    { label: "読み込み", na: "札は短い字なので読み込みの形を持たない。値が来るまでは札を出さない" },
    { label: "失敗", node: <Badge tone="error" icon={<Icon name="error" />}>失敗</Badge> },
    { label: "無効", node: <Badge>停止中</Badge>, note: "無効は中立の札で示し、字で理由を書く" },
    { label: "focus", na: "札は押せないので focus を受けない" },
  ];
}
