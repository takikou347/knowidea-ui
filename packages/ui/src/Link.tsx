import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils.js";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: "default" | "muted";
  /** 文の外に単独で置くとき true。44px の高さにする */
  standalone?: boolean;
  /** 別のタブで開く。読み上げる文を足す */
  external?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export function Link({ tone = "default", standalone, external, disabled, className, children, ...rest }: LinkProps) {
  return (
    <a
      className={cx("ki-link", className)}
      data-tone={tone === "muted" ? "muted" : undefined}
      data-standalone={standalone ? "" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : rest.tabIndex}
      target={external ? "_blank" : rest.target}
      rel={external ? "noopener noreferrer" : rest.rel}
      {...rest}
      href={disabled ? undefined : rest.href}
    >
      {children}
      {external ? <span className="ki-sr-only">(新しいタブで開く)</span> : null}
    </a>
  );
}
