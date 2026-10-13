import type { ReactNode, MouseEvent } from "react";
import { Spinner } from "./Spinner.js";
import type { ButtonProps } from "./Button.js";
import { cx } from "./utils.js";

export interface IconButtonProps extends Omit<ButtonProps, "icon" | "children" | "loadingLabel"> {
  /** 読み上げる名前。必須 */
  label: string;
  icon: ReactNode;
}

export function IconButton({
  label, icon, variant = "quiet", size = "md", loading = false, className, type = "button", onClick, ...rest
}: IconButtonProps) {
  const handle = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) { e.preventDefault(); return; }
    onClick?.(e);
  };
  return (
    <button
      type={type}
      className={cx("ki-button", "ki-icon-button", className)}
      data-variant={variant}
      data-size={size === "lg" ? "lg" : undefined}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      aria-label={label}
      onClick={handle}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
    </button>
  );
}
