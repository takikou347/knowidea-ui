import type { ReactNode } from "react";
import { Icon } from "./Icon.js";
import { Checkbox } from "./Choice.js";
import { Alert } from "./Alert.js";
import { Button } from "./Button.js";
import { EmptyState } from "./EmptyState.js";
import { Skeleton } from "./Skeleton.js";
import { Spinner } from "./Spinner.js";

export type SortDirection = "ascending" | "descending";
export interface SortState { key: string; direction: SortDirection }

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** 数字の列。右寄せ、等幅 */
  numeric?: boolean;
  sortable?: boolean;
  /** 長い文を折り返す列 */
  wrap?: boolean;
  /** 行ごとの表示。無ければ row[key] */
  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  /** 表の名前。読み上げる。必須 */
  label: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** 見える表題 */
  caption?: ReactNode;
  sort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  /** 行を選ぶチェックの名前 */
  rowLabel?: (row: T) => string;
  loading?: boolean;
  /** 失敗の文。あると表の代わりに帯を出す */
  error?: ReactNode;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyText?: string;
  emptyAction?: ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  label, columns, rows, rowKey, caption, sort, onSortChange, selectable, selected = [], onSelectedChange,
  rowLabel, loading, error, onRetry, emptyTitle = "行がない", emptyText, emptyAction,
}: TableProps<T>) {
  const span = columns.length + (selectable ? 1 : 0);
  const keys = rows.map(rowKey);
  const allSelected = keys.length > 0 && keys.every((k) => selected.includes(k));
  const someSelected = keys.some((k) => selected.includes(k));

  const nextSort = (col: Column<T>) => {
    if (!onSortChange) return;
    if (!sort || sort.key !== col.key) onSortChange({ key: col.key, direction: "ascending" });
    else if (sort.direction === "ascending") onSortChange({ key: col.key, direction: "descending" });
    else onSortChange(null);
  };

  return (
    <div className="ki-table-wrap" role="region" aria-label={label} tabIndex={0}>
      <table className="ki-table" aria-busy={loading || undefined}>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {selectable ? (
              <th scope="col" data-select="">
                <Checkbox
                  aria-label="すべての行を選ぶ"
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  disabled={loading || rows.length === 0}
                  onCheckedChange={(c) => onSelectedChange?.(c ? keys : [])}
                />
              </th>
            ) : null}
            {columns.map((col) => {
              const dir = sort && sort.key === col.key ? sort.direction : undefined;
              return (
                <th key={col.key} scope="col" data-numeric={col.numeric ? "" : undefined} aria-sort={col.sortable ? dir ?? "none" : undefined}>
                  {col.sortable ? (
                    <button type="button" className="ki-table__sort" onClick={() => nextSort(col)}>
                      {col.header}
                      <Icon name={dir === "ascending" ? "chevron-up" : dir === "descending" ? "chevron-down" : "sort"} />
                    </button>
                  ) : col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr><td colSpan={span} className="ki-table__state">
              <Alert tone="error" action={onRetry ? <Button variant="secondary" onClick={onRetry}>もう一度</Button> : undefined}>{error}</Alert>
            </td></tr>
          ) : loading ? (
            [0, 1, 2].map((i) => (
              <tr key={i}>
                {Array.from({ length: span }).map((_, j) => (
                  <td key={j}><Skeleton size="long" /></td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr><td colSpan={span} className="ki-table__state">
              <EmptyState title={emptyTitle} action={emptyAction}>{emptyText}</EmptyState>
            </td></tr>
          ) : (
            rows.map((row) => {
              const k = rowKey(row);
              const isSel = selected.includes(k);
              return (
                <tr key={k} aria-selected={selectable ? isSel : undefined}>
                  {selectable ? (
                    <td data-select="">
                      <Checkbox
                        aria-label={rowLabel ? rowLabel(row) + " を選ぶ" : "この行を選ぶ"}
                        checked={isSel}
                        onCheckedChange={(c) => onSelectedChange?.(c ? [...selected, k] : selected.filter((x) => x !== k))}
                      />
                    </td>
                  ) : null}
                  {columns.map((col) => (
                    <td key={col.key} data-numeric={col.numeric ? "" : undefined} data-wrap={col.wrap ? "" : undefined}>
                      {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {loading ? <span className="ki-sr-only" role="status"><Spinner />読み込み中</span> : null}
    </div>
  );
}
