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
    { label: "Empty", na: "プレースホルダーは、ローディング中だけ表示する" },
    { label: "Loading", node: <Text />, note: "動かさない(終わらない脈動は使わない)。ラッパーに aria-busy を付ける" },
    { label: "Error", na: "取得に失敗したら、プレースホルダーをやめて、Alert か Empty state に切り替える" },
    { label: "Disabled", na: "無効状態を持たない" },
    { label: "Focus", na: "プレースホルダーは操作できないため、フォーカスを受けない" },
  ];
}
