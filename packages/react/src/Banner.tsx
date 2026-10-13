import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon.js";
import { cx } from "./utils.js";

export type Tone = "info" | "success" | "warn" | "error";
const toneIcon: Record<Tone, IconName> = { info: "info", success: "check-circle", warn: "warning", error: "warning-circle" };

export interface BannerProps {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  /** 右に置く操作。1 つ */
  action?: ReactNode;
  /** 読み上げに知らせる(出た後に変わる帯だけ true) */
  live?: boolean;
  className?: string;
}

export function Banner({ tone = "info", title, children, action, live, className }: BannerProps) {
  return (
    <div className={cx("ki-banner", className)} data-tone={tone} role={live ? (tone === "error" ? "alert" : "status") : undefined}>
      <span className="ki-banner__icon"><Icon name={toneIcon[tone]} /></span>
      <div className="ki-banner__body">
        {title ? <p className="ki-banner__title">{title}</p> : null}
        {children ? <p className="ki-banner__text">{children}</p> : null}
      </div>
      {action ? <div className="ki-banner__action">{action}</div> : null}
    </div>
  );
}
