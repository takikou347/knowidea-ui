import { Icon, type IconName } from "./Icon.js";
import { cx } from "./utils.js";

export type StatusTone = "neutral" | "info" | "success" | "warn" | "error";
/** 既定の種類。色だけでなく、形(アイコン)と字で伝える */
export type StatusKind = "neutral" | "info" | "success" | "warn" | "error" | "working" | "paused" | "pending" | "stopped";

interface Def { icon: IconName; tone: StatusTone }
/** 種類ごとの既定のアイコンと色。tone と icon を props で渡せば上書きできる */
export const statusKinds: Record<StatusKind, Def> = {
  neutral: { icon: "info", tone: "neutral" },
  info: { icon: "info", tone: "info" },
  success: { icon: "success", tone: "success" },
  warn: { icon: "warning", tone: "warn" },
  error: { icon: "error", tone: "error" },
  working: { icon: "working", tone: "info" },
  paused: { icon: "paused", tone: "warn" },
  pending: { icon: "clock", tone: "neutral" },
  stopped: { icon: "stopped", tone: "neutral" },
};

export interface StatusProps {
  /** 状態の種類。既定は neutral */
  kind?: StatusKind;
  /** 字。必須。色だけに頼らない */
  label: string;
  /** 種類の既定の色を変える */
  tone?: StatusTone;
  /** 種類の既定のアイコンを変える */
  icon?: IconName;
  /** lg は一目で分かる大きさ */
  size?: "md" | "lg";
  className?: string;
}

/** 状態の印。状態の種類は kind で渡し、字は label に書く。 */
export function Status({ kind = "neutral", label, tone, icon, size = "md", className }: StatusProps) {
  const def = statusKinds[kind];
  const t = tone ?? def.tone;
  return (
    <span className={cx("ki-status", className)} data-tone={t === "neutral" ? undefined : t} data-size={size === "lg" ? "lg" : undefined}>
      <Icon name={icon ?? def.icon} />
      {label}
    </span>
  );
}
