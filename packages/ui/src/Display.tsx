import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils.js";

export interface DisplayProps extends HTMLAttributes<HTMLHeadingElement> {
  /** 見出しの段。既定は h1(ページの題) */
  as?: "h1" | "h2" | "h3" | "p";
  /** 1 は画面で一番大きな字(1 画面に 1 か所)、2 は節の頭の大きな見出し */
  size?: 1 | 2;
  children: ReactNode;
}

/** 大きな見出し。書体は --font-display。ページの題と大きな見出しだけに使い、1 画面に 1〜2 か所にする。 */
export function Display({ as: Tag = "h1", size = 1, className, children, ...rest }: DisplayProps) {
  return (
    <Tag className={cx("ki-display", className)} data-size={size === 2 ? "2" : undefined} {...rest}>
      {children}
    </Tag>
  );
}
