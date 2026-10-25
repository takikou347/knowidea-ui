import { Children, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cx } from "./utils.js";

export interface FeaturedListProps extends ComponentPropsWithoutRef<"ul"> {
  /** 1 つ目が大きな 1 つ、残りが小さな行。中身(題、添える 1 行、日付、画像)は子で渡す */
  children?: React.ReactNode;
}

/** 大きな 1 つと小さな行で並べる。配置だけを持つ。className と style は外側の div.ki-featured、aria-* などは ul に渡る。入れ物の幅が 720 以上なら 2 列、狭ければ縦に積む。0 の時は何も描かない。 */
export function FeaturedList({ children, className, style, ...rest }: FeaturedListProps) {
  const items = Children.toArray(children);
  if (items.length === 0) return null;
  const vars = { "--ki-rows": Math.max(items.length - 1, 1) } as CSSProperties;
  return (
    <div className={cx("ki-featured", className)} style={style}>
      <ul className="ki-featured__list" style={vars} {...rest}>
        {items.map((item, i) => <li key={i} data-lead={i === 0 ? "" : undefined}>{item}</li>)}
      </ul>
    </div>
  );
}
