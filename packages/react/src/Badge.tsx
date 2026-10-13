import type { ReactNode } from "react";
import { cx } from "./utils.js";

export interface BadgeProps {
  tone?: "neutral" | "success" | "warn" | "error";
  /** 先頭に置く小さなアイコン */
  icon?: ReactNode;
  numeric?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", icon, numeric, className, children }: BadgeProps) {
  return (
    <span className={cx("ki-badge", className)} data-tone={tone === "neutral" ? undefined : tone} data-numeric={numeric ? "" : undefined}>
      {icon}{children}
    </span>
  );
}
