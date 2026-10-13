import type { ReactNode } from "react";
import { cx } from "./utils.js";

export interface QuoteProps {
  /** 出典 */
  cite?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Quote({ cite, className, children }: QuoteProps) {
  return (
    <figure className={cx("ki-quote", className)}>
      <blockquote>{children}</blockquote>
      {cite ? <figcaption>{cite}</figcaption> : null}
    </figure>
  );
}
