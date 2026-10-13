import { Skeleton, SkeletonText } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Text() {
  return <div style={{ width: "min(100%, 360px)" }}><SkeletonText lines={3} /></div>;
}

export function Shapes() {
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "min(100%, 360px)" }}>
      <Skeleton size="short" />
      <Skeleton size="medium" />
      <Skeleton shape="block" />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "仮の形は読み込み中だけ出る" },
    { label: "読み込み", node: <Text />, note: "動かさない(終わらない脈動は使わない)。包む側に aria-busy を付ける" },
    { label: "失敗", na: "失敗したら仮の形をやめて、Alert や空の状態に切り替える" },
    { label: "無効", na: "無効を持たない" },
    { label: "focus", na: "仮の形は押せないので focus を受けない" },
  ];
}
