import type { ReactNode } from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cx } from "./utils.js";

export interface ProgressProps {
  /** 0 から max。null は進み具合が不明(動かさず、破線の枠で示す) */
  value: number | null;
  max?: number;
  /** 何の進み具合か。必須(読み上げの名前になる) */
  label: ReactNode;
  /** 値を文字でも出す(例: 40%)。既定は true */
  showValue?: boolean;
  tone?: "primary" | "success" | "warn" | "error";
  size?: "md" | "lg";
  disabled?: boolean;
  className?: string;
}

/** 進み具合の線。値は文字でも出す。終わらない動きは使わない。 */
export function Progress({ value, max = 100, label, showValue = true, tone = "primary", size = "md", disabled, className }: ProgressProps) {
  const known = value != null;
  const pct = known ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <BaseProgress.Root
      value={value}
      max={max}
      className={cx("ki-progress", className)}
      data-tone={tone === "primary" ? undefined : tone}
      data-size={size === "lg" ? "lg" : undefined}
      data-indeterminate={known ? undefined : ""}
      data-disabled={disabled ? "" : undefined}
      getAriaValueText={(formatted) => (known ? `${Math.round(pct)}%` : "不明")}
    >
      <div className="ki-progress__head">
        <BaseProgress.Label className="ki-progress__label">{label}</BaseProgress.Label>
        {showValue ? <span className="ki-progress__value">{known ? `${Math.round(pct)}%` : "不明"}</span> : null}
      </div>
      <BaseProgress.Track className="ki-progress__track">
        <BaseProgress.Indicator className="ki-progress__bar" style={known ? { width: `${pct}%` } : undefined} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
