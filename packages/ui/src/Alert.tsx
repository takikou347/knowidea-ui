import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import { cx } from "./utils.js";

export type Tone = "info" | "success" | "warn" | "error";
const toneIcon: Record<Tone, IconName> = { info: "info", success: "success", warn: "warning", error: "error" };

export interface AlertProps {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  /** 右に置く操作。1 つ */
  action?: ReactNode;
  /** 渡すと閉じるボタンが出る */
  onClose?: () => void;
  closeLabel?: string;
  /** 読み上げに知らせる(出た後に変わる帯だけ true) */
  live?: boolean;
  className?: string;
}

/** 知らせの帯。文は平叙で短く。色だけでなくアイコンと文字で伝える。 */
export function Alert({ tone = "info", title, children, action, onClose, closeLabel = "閉じる", live, className }: AlertProps) {
  return (
    <div className={cx("ki-alert", className)} data-tone={tone} role={live ? (tone === "error" ? "alert" : "status") : undefined}>
      <span className="ki-alert__icon"><Icon name={toneIcon[tone]} /></span>
      <div className="ki-alert__body">
        {title ? <p className="ki-alert__title">{title}</p> : null}
        {children ? <p className="ki-alert__text">{children}</p> : null}
      </div>
      {action ? <div className="ki-alert__action">{action}</div> : null}
      {onClose ? <IconButton className="ki-alert__close" variant="quiet" label={closeLabel} icon={<Icon name="close" />} onClick={onClose} /> : null}
    </div>
  );
}
