import { Icon } from "./Icon.js";
import { cx } from "./utils.js";

export interface PaginationProps {
  /** 今のページ(1 から) */
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** 渡すとボタンでなくリンクにする(ページごとに URL がある場合) */
  getHref?: (page: number) => string;
  /** 今のページの前後に出す数 */
  siblings?: number;
  label?: string;
  className?: string;
}

type Item = number | "gap-start" | "gap-end";

export function pageItems(page: number, count: number, siblings: number): Item[] {
  const total = siblings * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, count - 1);
  const out: Item[] = [1];
  if (left > 2) out.push("gap-start");
  for (let i = left; i <= right; i++) out.push(i);
  if (right < count - 1) out.push("gap-end");
  out.push(count);
  return out;
}

export function Pagination({ page, pageCount, onPageChange, getHref, siblings = 1, label = "ページ送り", className }: PaginationProps) {
  const cell = (p: number, content: React.ReactNode, aria: string, disabled = false, current = false) => {
    const common = {
      className: "ki-pagination__item",
      "aria-label": aria,
      "aria-current": current ? ("page" as const) : undefined,
    };
    if (getHref && !disabled) return <a {...common} href={getHref(p)} onClick={onPageChange ? (e) => { e.preventDefault(); onPageChange(p); } : undefined}>{content}</a>;
    return (
      <button type="button" {...common} disabled={disabled} onClick={() => onPageChange?.(p)}>{content}</button>
    );
  };
  return (
    <nav className={cx("ki-pagination", className)} aria-label={label}>
      <ul className="ki-pagination__list">
        <li>{cell(page - 1, <Icon name="chevron-left" />, "前のページ", page <= 1)}</li>
        {pageItems(page, pageCount, siblings).map((it) => (
          <li key={String(it)}>
            {typeof it === "number" ? cell(it, it, `${it} ページ`, false, it === page) : <span className="ki-pagination__gap" aria-hidden="true">…</span>}
          </li>
        ))}
        <li>{cell(page + 1, <Icon name="chevron-right" />, "次のページ", page >= pageCount)}</li>
      </ul>
    </nav>
  );
}
