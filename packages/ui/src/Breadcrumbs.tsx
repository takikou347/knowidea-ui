import type { ReactNode } from "react";
import { cx } from "./utils.js";

export interface BreadcrumbItem { label: ReactNode; href?: string }

export interface BreadcrumbsProps {
  /** 上の階層から順に。最後が今いる所(href は要らない) */
  items: BreadcrumbItem[];
  /** nav の名前。既定「現在地」 */
  label?: string;
  className?: string;
}

/** 今いる所までの道。最後は文字のまま、aria-current="page"。 */
export function Breadcrumbs({ items, label = "現在地", className }: BreadcrumbsProps) {
  return (
    <nav className={cx("ki-breadcrumbs", className)} aria-label={label}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !it.href ? <span aria-current={last ? "page" : undefined}>{it.label}</span> : <a href={it.href}>{it.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
