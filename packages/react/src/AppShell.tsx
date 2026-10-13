import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./Icon.js";
import { cx } from "./utils.js";

export interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  /** 数の印(オーナー待ちの件数など) */
  count?: number;
}

export interface AppShellProps {
  nav: NavItem[];
  /** 今いる所の id */
  current: string;
  /** 上のバーの題(h1) */
  title: string;
  /** いつの数か(日本時間の文) */
  asOf?: string;
  /** 上のバーの右の操作(IconButton) */
  actions?: ReactNode;
  brand?: { name: string; sub?: string };
  /** 下のタブバーに出す id。既定は先頭の 5 つ */
  tabs?: string[];
  /** 見本のための枠(高さ px)。実物は画面全体なので渡さない */
  frame?: number;
  children: ReactNode;
  className?: string;
}

/**
 * アプリの枠。枠の幅が 720px 未満なら上のバーと下のタブバー(iPhone)、
 * 720px 以上ならサイドの目次(iPad)。切り替えは container query。
 */
export function AppShell({ nav, current, title, asOf, actions, brand = { name: "KNOW IDEA", sub: "管理" }, tabs, frame, children, className }: AppShellProps) {
  const tabItems = tabs ? nav.filter((n) => tabs.includes(n.id)) : nav.slice(0, 5);
  const count = (n?: number) => (n && n > 0 ? <span className="ki-count" aria-label={`${n} 件`}>{n}</span> : null);
  return (
    <div className={cx("ki-shell", className)} data-frame={frame ? "" : undefined} style={frame ? ({ "--ki-frame-h": `${frame}px` } as CSSProperties) : undefined}>
      <div className="ki-shell__frame">
        <aside className="ki-side" aria-label="目次">
          <p className="ki-side__brand"><b>{brand.name}</b>{brand.sub ? <span>{brand.sub}</span> : null}</p>
          <nav aria-label="主な画面">
            <ul className="ki-side__list">
              {nav.map((n) => (
                <li key={n.id}>
                  <a className="ki-side__item" href={n.href} aria-current={n.id === current ? "page" : undefined}><Icon name={n.icon} />{n.label}{count(n.count)}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="ki-shell__col">
          <header className="ki-topbar">
            <h1 className="ki-topbar__title">{title}</h1>
            {asOf ? <p className="ki-topbar__meta"><span>日本時間</span><time>{asOf}</time></p> : null}
            {actions ? <div className="ki-topbar__actions">{actions}</div> : null}
          </header>
          <main className="ki-shell__main">{children}</main>
        </div>
        <nav className="ki-tabbar" aria-label="画面の切り替え">
          <ul className="ki-tabbar__list">
            {tabItems.map((n) => (
              <li key={n.id}>
                <a className="ki-tabbar__item" href={n.href} aria-current={n.id === current ? "page" : undefined}><Icon name={n.icon} />{n.label}{count(n.count)}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
