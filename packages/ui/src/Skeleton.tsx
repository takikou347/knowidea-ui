import { cx } from "./utils.js";

export interface SkeletonProps {
  size?: "short" | "medium" | "long";
  shape?: "text" | "block";
  className?: string;
}

/** 読み込みの仮の形。動かさない */
export function Skeleton({ size = "long", shape = "text", className }: SkeletonProps) {
  return <span className={cx("ki-skeleton", className)} data-size={size} data-shape={shape === "block" ? "block" : undefined} aria-hidden="true" />;
}

export interface SkeletonTextProps {
  lines?: number;
  /** 読み上げる文 */
  label?: string;
}

export function SkeletonText({ lines = 3, label = "読み込み中" }: SkeletonTextProps) {
  return (
    <div className="ki-skeleton-stack" aria-busy="true">
      <span className="ki-sr-only" role="status">{label}</span>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} size={i === lines - 1 ? "medium" : "long"} />
      ))}
    </div>
  );
}
