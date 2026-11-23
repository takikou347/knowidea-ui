import { useThemeScope } from "./ThemeScope.js";
import { useId, useState, type ReactNode } from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { Icon, type IconName } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import type { NavItem } from "./NavItems.js";
import { Tooltip } from "./Tooltip.js";
import { cx } from "./utils.js";

export interface DrawerGroup { label?: string; items: NavItem[] }

export interface DrawerBrand {
  name: string;
  sub?: string;
  /** 渡すと、名前は押すとこの href へ移るリンクになる */
  href?: string;
  /** 名前の前に置く印。文字はアイコンの名前、ほかは要素(img など)をそのまま描く。閉じた時はこれだけが残る */
  logo?: ReactNode | IconName;
}

export interface DrawerCollapseProps {
  /** 左の切り替えを閉じられるようにする(permanent だけ)。既定 false で、今までと同じく閉じない */
  collapsible?: boolean;
  /** 閉じているか(制御)。開け閉めの状態はアプリ側が覚える */
  collapsed?: boolean;
  /** 最初に閉じておくか(非制御) */
  defaultCollapsed?: boolean;
  /** 開け閉めのボタンを押した時 */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 開け閉めのボタンの名前(読み上げ)。開いているかは aria-expanded で伝わる。既定「サイドメニュー」 */
  collapseLabel?: string;
}

/** 制御と非制御の両方を受ける、開け閉めの状態 */
export function useCollapsed({ collapsible, collapsed, defaultCollapsed, onCollapsedChange }: DrawerCollapseProps): [boolean, (next: boolean) => void] {
  const [inner, setInner] = useState(defaultCollapsed ?? false);
  const value = collapsible ? (collapsed ?? inner) : false;
  const set = (next: boolean) => {
    if (collapsed === undefined) setInner(next);
    onCollapsedChange?.(next);
  };
  return [value, set];
}

export interface DrawerProps extends DrawerCollapseProps {
  /** 目次の項目。分類ごとに分けるなら groups */
  items?: NavItem[];
  groups?: DrawerGroup[];
  /** 今いる所の id */
  current?: string;
  /** 上の見出し(名前と小さな補足)。href を渡すとリンク、logo を渡すと印を付ける */
  brand?: DrawerBrand;
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

function Item({ n, current, collapsed }: { n: NavItem; current?: string; collapsed: boolean }) {
  const counted = n.count && n.count > 0 ? n.count : 0;
  // 閉じた時は名前を見せないので、名前(と件数)を aria-label に持ち、Tooltip で見せる
  const link = (
    <a
      className="ki-drawer__item"
      href={n.href}
      aria-current={n.id === current ? "page" : undefined}
      aria-disabled={n.disabled || undefined}
      aria-label={collapsed ? (counted ? `${n.label}、${counted} 件` : n.label) : undefined}
    >
      {n.icon ? <Icon name={n.icon} /> : null}
      {collapsed ? null : n.label}
      {counted ? <span className="ki-count" aria-label={collapsed ? undefined : `${counted} 件`} aria-hidden={collapsed || undefined}>{counted}</span> : null}
    </a>
  );
  return collapsed ? <Tooltip content={n.label} side="right">{link}</Tooltip> : link;
}

function Nav({ groups, current, label, collapsed = false, id }: { groups: DrawerGroup[]; current?: string; label: string; collapsed?: boolean; id?: string }) {
  return (
    <nav aria-label={label} id={id}>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label ? <p className="ki-drawer__group" hidden={collapsed || undefined}>{g.label}</p> : null}
          <ul className="ki-drawer__list">
            {g.items.map((n) => (
              <li key={n.id}>
                <Item n={n} current={current} collapsed={collapsed} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand({ brand, collapsed }: { brand: DrawerBrand; collapsed: boolean }) {
  const logo = brand.logo === undefined || brand.logo === null || brand.logo === false ? null : (
    <span className="ki-drawer__logo">{typeof brand.logo === "string" ? <Icon name={brand.logo as IconName} /> : brand.logo}</span>
  );
  // 閉じた時は印だけを残す。印が無ければ名前も出さない
  if (collapsed && !logo) return null;
  const text = collapsed ? null : <><b>{brand.name}</b>{brand.sub ? <span>{brand.sub}</span> : null}</>;
  const body = logo ? <>{logo}{text ? <span className="ki-drawer__brand-text">{text}</span> : null}</> : text;
  if (brand.href) {
    const a = <a className="ki-drawer__brand" href={brand.href} aria-label={collapsed ? brand.name : undefined}>{body}</a>;
    return collapsed ? <Tooltip content={brand.name} side="right">{a}</Tooltip> : a;
  }
  return <p className="ki-drawer__brand">{body}{collapsed ? <span className="ki-sr-only">{brand.name}</span> : null}</p>;
}

/**
 * サイドの目次。permanent はその場に、temporary は左へ払うか、Esc や外を押して閉じる引き出しになる。
 * permanent に collapsible を渡すと、名前の横のボタンでアイコンだけの細い列に閉じられる。
 */
export function Drawer({ items, groups, current, brand, label = "ナビゲーション", variant = "permanent", open, defaultOpen, onOpenChange, closeLabel = "ナビゲーションを閉じる", footer, className, collapsible = false, collapsed, defaultCollapsed, onCollapsedChange, collapseLabel = "サイドメニュー" }: DrawerProps) {
  const scope = useThemeScope();
  const navId = useId();
  const [isCollapsed, setCollapsed] = useCollapsed({ collapsible, collapsed, defaultCollapsed, onCollapsedChange });
  const g = groups ?? [{ items: items ?? [] }];
  if (variant === "permanent") {
    const shut = collapsible && isCollapsed;
    const toggle = collapsible ? (
      <Tooltip content={shut ? "サイドメニューを開く" : "サイドメニューを閉じる"} side="right">
        <IconButton className="ki-drawer__toggle" variant="quiet" label={collapseLabel} aria-expanded={!shut} aria-controls={navId} icon={<Icon name="sidebar" />} onClick={() => setCollapsed(!shut)} />
      </Tooltip>
    ) : null;
    const head = brand ? <Brand brand={brand} collapsed={shut} /> : null;
    return (
      <aside className={cx("ki-drawer", className)} data-variant="permanent" data-collapsed={shut ? "" : undefined} aria-label={label === "ナビゲーション" ? undefined : label}>
        {head || toggle ? <div className="ki-drawer__head">{head}{toggle}</div> : null}
        <Nav groups={g} current={current} label={label} collapsed={shut} id={collapsible ? navId : undefined} />
        {shut ? null : footer}
      </aside>
    );
  }
  const head = brand ? <Brand brand={brand} collapsed={false} /> : null;
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
