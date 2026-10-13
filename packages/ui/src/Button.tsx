import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from "react";
import { Spinner } from "./Spinner.js";
import { cx } from "./utils.js";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: "md" | "lg";
  /** 押せなくなり、aria-busy になる。ラベルはそのまま */
  loading?: boolean;
  /** 読み込み中に読み上げる文 */
  loadingLabel?: string;
  /** ラベルの前に置くアイコン(ReactNode) */
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = "primary", size = "md", loading = false, loadingLabel = "処理中", icon, children,
  className, type = "button", onClick, ...rest
}: ButtonProps) {
  const handle = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) { e.preventDefault(); return; }
    onClick?.(e);
  };
  return (
    <button
      type={type}
      className={cx("ki-button", className)}
      data-variant={variant}
      data-size={size === "lg" ? "lg" : undefined}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      onClick={handle}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children != null ? <span>{children}</span> : null}
      {loading ? <span className="ki-sr-only">{loadingLabel}</span> : null}
    </button>
  );
}
