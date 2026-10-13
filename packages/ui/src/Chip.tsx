import type { ReactNode } from "react";
import { Icon } from "./Icon.js";
import { Spinner } from "./Spinner.js";
import { cx } from "./utils.js";

export interface ChipProps {
  label: ReactNode;
  /** 先頭の小さなアイコン */
  icon?: ReactNode;
  /** あると押せるチップ(絞り込みなど)になる */
  onClick?: () => void;
  /** 押せるチップの選んだ状態。aria-pressed になる */
  selected?: boolean;
  /** あると右に消すボタンが出る */
  onDelete?: () => void;
  /** 消すボタンの名前。既定は「{label} を外す」 */
  deleteLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/** 小さな札。ただの印、選べる絞り込み、消せるタグのどれにも使う。押せる範囲は 44px。 */
export function Chip({ label, icon, onClick, selected, onDelete, deleteLabel, disabled, loading, className }: ChipProps) {
  const text = typeof label === "string" ? label : undefined;
  const lead = loading ? <Spinner /> : onClick && selected ? <Icon name="check" /> : icon;
  return (
    <span className={cx("ki-chip", className)} data-selected={selected ? "" : undefined} data-disabled={disabled ? "" : undefined} data-loading={loading ? "" : undefined}>
      {onClick ? (
        <button type="button" className="ki-chip__main" aria-pressed={selected ?? false} disabled={disabled || loading} onClick={onClick}>{lead}{label}</button>
      ) : (
        <span className="ki-chip__label">{lead}{label}</span>
      )}
      {onDelete ? (
        <button type="button" className="ki-chip__remove" disabled={disabled || loading} aria-label={deleteLabel ?? `${text ?? "このタグ"} を外す`} onClick={onDelete}><Icon name="close" /></button>
      ) : null}
    </span>
  );
}
