import { cx } from "./utils.js";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  strong?: boolean;
  /** 文の切れ目に出す語(横だけ) */
  label?: string;
  className?: string;
}

export function Divider({ orientation = "horizontal", strong, label, className }: DividerProps) {
  if (label && orientation === "horizontal") {
    return <div className={cx("ki-divider-label", className)} role="separator" aria-label={label}><span>{label}</span></div>;
  }
  return orientation === "vertical" ? (
    <span className={cx("ki-divider", className)} role="separator" aria-orientation="vertical" data-orientation="vertical" data-strong={strong ? "" : undefined} />
  ) : (
    <hr className={cx("ki-divider", className)} data-strong={strong ? "" : undefined} />
  );
}
