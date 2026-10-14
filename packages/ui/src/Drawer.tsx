import { useThemeScope } from "./ThemeScope.js";
import type { ReactNode } from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { Icon } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import type { NavItem } from "./NavItems.js";
import { cx } from "./utils.js";

export interface DrawerGroup { label?: string; items: NavItem[] }

export interface DrawerProps {
  /** 目次の項目。分類ごとに分けるなら groups */
  items?: NavItem[];
  groups?: DrawerGroup[];
  /** 今いる所の id */
  current?: string;
  /** 上の見出し(名前と小さな補足) */
  brand?: { name: string; sub?: string };
  /** 目次の名前(読み上げ)。既定「目次」 */
  label?: string;
  /** permanent はその場に置く。temporary は開け閉めする引き出し(狭い幅) */
  variant?: "permanent" | "temporary";
  /** temporary のとき */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 引き出しを閉じるボタンの名前 */
  closeLabel?: string;
  /** 下に置く物 */
  footer?: ReactNode;
  className?: string;
}

function Nav({ groups, current, label }: { groups: DrawerGroup[]; current?: string; label: string }) {
  return (
    <nav aria-label={label}>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label ? <p className="ki-drawer__group">{g.label}</p> : null}
          <ul className="ki-drawer__list">
            {g.items.map((n) => (
              <li key={n.id}>
                <a className="ki-drawer__item" href={n.href} aria-current={n.id === current ? "page" : undefined} aria-disabled={n.disabled || undefined}>
                  {n.icon ? <Icon name={n.icon} /> : null}{n.label}
                  {n.count && n.count > 0 ? <span className="ki-count" aria-label={`${n.count} 件`}>{n.count}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** サイドの目次。permanent はその場に、temporary は左へ払うか、Esc や外を押して閉じる引き出しになる。 */
export function Drawer({ items, groups, current, brand, label = "ナビゲーション", variant = "permanent", open, defaultOpen, onOpenChange, closeLabel = "ナビゲーションを閉じる", footer, className }: DrawerProps) {
  const scope = useThemeScope();
  const g = groups ?? [{ items: items ?? [] }];
  const head = brand ? <p className="ki-drawer__brand"><b>{brand.name}</b>{brand.sub ? <span>{brand.sub}</span> : null}</p> : null;
  if (variant === "permanent") {
    return (
      <aside className={cx("ki-drawer", className)} data-variant="permanent" aria-label={label === "ナビゲーション" ? undefined : label}>
        {head ? <div className="ki-drawer__head">{head}</div> : null}
        <Nav groups={g} current={current} label={label} />
        {footer}
      </aside>
    );
  }
  return (
    <BaseDrawer.Root swipeDirection="left" open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange ? (o) => onOpenChange(o) : undefined}>
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="ki-drawer__backdrop" {...scope} />
        <BaseDrawer.Viewport className="ki-drawer__viewport" {...scope}>
          <BaseDrawer.Popup className={cx("ki-drawer", className)} data-variant="temporary" aria-label={label}>
            <div className="ki-drawer__head">
              {head ?? <span />}
              <BaseDrawer.Close render={<IconButton variant="quiet" label={closeLabel} icon={<Icon name="close" />} />} />
            </div>
            <Nav groups={g} current={current} label={label} />
            {footer}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
