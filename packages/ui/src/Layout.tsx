import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils.js";

/** 間隔の段。--space-1(4px)から --space-7(48px) */
export type Space = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const gapVar = (g: Space) => `var(--space-${g})`;

export interface StackProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** column は縦(既定)、row は横 */
  direction?: "column" | "row";
  /** 間隔の段(1〜7)。省略すると 3(12px)。CSS の --ki-gap で上書きできる(gap を渡すと、そちらが勝つ) */
  gap?: Space;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  /** row のとき、入りきらなければ折り返す */
  wrap?: boolean;
  /** 描画する要素。既定は div。ul や section など */
  as?: ElementType;
  children?: ReactNode;
}
const alignMap = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" } as const;
const justifyMap = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const;

/** 子を 1 方向に並べ、間隔をそろえる。 */
export function Stack({ direction = "column", gap, align, justify, wrap, as: Tag = "div", className, style, children, ...rest }: StackProps) {
  const s = { ...(gap ? { "--ki-gap": gapVar(gap) } : null), ...(align ? { "--ki-align": alignMap[align] } : null), ...(justify ? { "--ki-justify": justifyMap[justify] } : null), ...style } as CSSProperties;
  return <Tag className={cx("ki-stack", className)} data-direction={direction === "row" ? "row" : undefined} data-wrap={wrap ? "" : undefined} style={s} {...rest}>{children}</Tag>;
}

export interface GridProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** 列の数を固定する。狭い幅(600px 以下)では 1 列になる。無ければ minItemWidth で自動 */
  columns?: number;
  /** columns が無いとき、1 つの最小の幅(px)。既定 240 */
  minItemWidth?: number;
  /** columns を狭い幅でも保つ */
  keepColumns?: boolean;
  gap?: Space;
  as?: ElementType;
  children?: ReactNode;
}

/** 格子。列の数を決めるか、1 つの最小の幅で自動に詰める。 */
export function Grid({ columns, minItemWidth, keepColumns, gap, as: Tag = "div", className, style, children, ...rest }: GridProps) {
  const s = {
    ...(gap ? { "--ki-gap": gapVar(gap) } : null),
    ...(columns ? { "--ki-cols": columns } : null),
    ...(!columns && minItemWidth ? { "--ki-min": `${minItemWidth}px` } : null),
    ...style,
  } as CSSProperties;
  return <Tag className={cx("ki-grid", className)} data-columns={columns ? "" : undefined} data-keep={columns && keepColumns ? "" : undefined} style={s} {...rest}>{children}</Tag>;
}

export interface ContainerProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** sm 640px、md 960px(既定)、lg 1200px、fluid は絞らない */
  size?: "sm" | "md" | "lg" | "fluid";
  as?: ElementType;
  children?: ReactNode;
}

/** 中身の幅を絞り、左右に余白(16px)を付けて中央に置く。 */
export function Container({ size = "md", as: Tag = "div", className, children, ...rest }: ContainerProps) {
  return <Tag className={cx("ki-container", className)} data-size={size === "md" ? undefined : size} {...rest}>{children}</Tag>;
}
