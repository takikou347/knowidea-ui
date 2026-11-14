import type { CSSProperties, ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation.js";
import { Drawer } from "./Drawer.js";
import type { NavItem } from "./NavItems.js";
import { cx } from "./utils.js";

export interface AppShellProps {
  /** 画面の切り替え。左にはすべてを出す。bottomItems が無い時は下にも同じ物を出すので 3〜5 個にする(6 個以上だと下ではみ出す) */
  items: NavItem[];
  /** 今いる所の id */
  current?: string;
  /** 下の切り替え(1024px 未満)だけに出す項目。3〜5 個。items が 6 個以上の時は必ず渡し、主な物と「その他」を置く。「その他」は、下に出さない画面を並べた画面へ行く項目で、その画面は使う側が作る */
  bottomItems?: NavItem[];
  /** 下の切り替えで今いる所の id。既定は current。current が bottomItems に無いと下には印が付かないので、その時は「その他」の id を渡す */
  bottomCurrent?: string;
  /** 左の切り替えの上に出す名前(PC の幅だけ) */
  brand?: { name: string; sub?: string };
  /** 切り替えの nav の名前。既定「画面の切り替え」 */
  label?: string;
  /** 中身の上に置く物。AppBar など */
  header?: ReactNode;
  /** 左の切り替えの下に置く物(PC の幅だけ) */
  sideFooter?: ReactNode;
  /** 枠の最小の高さ。既定 100dvh。見本の中に置く時に絞る */
  minHeight?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 画面の枠。スマホと iPad(1024px 未満)は下に、PC(1024px 以上)は左に画面の切り替えを出す。
 * 中身は <main> に入る。切り替えは両方を描き、幅で片方だけを見せる(見えない方は読み上げにも出ない)。
 */
export function AppShell({ items, current, bottomItems, bottomCurrent, brand, label = "画面の切り替え", header, sideFooter, minHeight, className, style, children }: AppShellProps) {
  const s = { ...(minHeight ? { "--ki-shell-height": minHeight } : null), ...style } as CSSProperties;
  return (
    <div className={cx("ki-shell", className)} style={s}>
      <Drawer className="ki-shell__side" variant="permanent" items={items} current={current} brand={brand} label={label} footer={sideFooter} />
      <div className="ki-shell__body">
        {header}
        <main className="ki-shell__main">{children}</main>
      </div>
      <BottomNavigation className="ki-shell__bottom" items={bottomItems ?? items} current={bottomCurrent ?? current} label={label} position="sticky" />
    </div>
  );
}
