import { Icon } from "./Icon.js";
import type { NavItem } from "./NavItems.js";
import { cx } from "./utils.js";

export interface BottomNavigationProps {
  /** 3〜5 個 */
  items: NavItem[];
  /** 今いる所の id */
  current?: string;
  /** nav の名前。既定「画面の切り替え」 */
  label?: string;
  position?: "static" | "sticky";
  className?: string;
}

/** 狭い幅の主な移動。アイコンと短い字。今いる所は aria-current="page"。 */
export function BottomNavigation({ items, current, label = "画面の切り替え", position = "static", className }: BottomNavigationProps) {
  return (
    <nav className={cx("ki-bottomnav", className)} aria-label={label} data-position={position === "sticky" ? "sticky" : undefined}>
      <ul className="ki-bottomnav__list">
        {items.map((n) => (
          <li key={n.id}>
            <a className="ki-bottomnav__item" href={n.href} aria-current={n.id === current ? "page" : undefined} aria-disabled={n.disabled || undefined}>
              {n.icon ? <Icon name={n.icon} /> : null}{n.label}
              {n.count && n.count > 0 ? <span className="ki-count" aria-label={`${n.count} 件`}>{n.count}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
