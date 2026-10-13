import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
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
  /** 行を選択するチェックボックスの名前 */
  rowLabel?: (row: T) => string;
  loading?: boolean;
  /** 失敗の文。あると表の代わりに帯を出す */
  error?: ReactNode;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyText?: string;
  emptyAction?: ReactNode;
  /** 行の先頭に掴む所を出し、ドラッグかキーボードで行を並べ替えられるようにする。onReorder が必要 */
  reorderable?: boolean;
  /** 並べ替えを確定したとき。fromIndex と toIndex は、渡した rows の中の位置(0 から) */
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

/** 動かしている最中の状態。pointer は指かマウスで掴んでいる間、key はキーボードで持ち上げている間 */
type Drag =
  | { mode: "pointer"; from: number; to: number; slot: number; dy: number }
  | { mode: "key"; from: number; to: number };

const move = <T,>(list: T[], from: number, to: number) => {
  const next = list.slice();
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x as T);
  return next;
};

export function Table<T extends Record<string, unknown>>({
  label, columns, rows, rowKey, caption, sort, onSortChange, selectable, selected = [], onSelectedChange,
  rowLabel, loading, error, onRetry, emptyTitle = "行がない", emptyText, emptyAction, reorderable, onReorder,
}: TableProps<T>) {
  const canReorder = !!reorderable && !!onReorder;
  const span = columns.length + (selectable ? 1 : 0) + (canReorder ? 1 : 0);
  const keys = rows.map(rowKey);

  // 行の並べ替え
  const hintId = useId();
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const handles = useRef(new Map<string, HTMLButtonElement>());
  const focusKey = useRef<string | null>(null);
  const origin = useRef<{ y: number; mids: number[] }>({ y: 0, mids: [] });
  const [drag, setDrag] = useState<Drag | null>(null);
  const [live, setLive] = useState("");
  const dragRef = useRef<Drag | null>(null);
  dragRef.current = drag;
  const enabled = canReorder && !loading && !error && rows.length > 1;
  const nameOf = (row: T) => (rowLabel ? rowLabel(row) : "この行");
  const place = (from: number, to: number) => `${from + 1} 行目から ${to + 1} 行目へ`;

  const finish = useCallback((d: Drag, commit: boolean) => {
    setDrag(null);
    if (!commit || d.to === d.from) {
      setLive(commit ? "動かさなかった" : `元の位置(${d.from + 1} 行目)に戻した`);
      return;
    }
    focusKey.current = keys[d.from] ?? null;
    setLive(`${place(d.from, d.to)}移した`);
    onReorder?.(d.from, d.to);
  }, [keys, onReorder]);

  // 並べ替えたあと、行が差し替わっても掴む所へ focus を戻す
  useLayoutEffect(() => {
    if (focusKey.current) { handles.current.get(focusKey.current)?.focus(); }
    if (!drag) focusKey.current = null;
  });

  useEffect(() => {
    if (drag?.mode !== "pointer") return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape" && dragRef.current) finish(dragRef.current, false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drag?.mode, finish]);

  const onHandleDown = (e: PointerEvent<HTMLButtonElement>, index: number) => {
    if (!enabled || (e.pointerType === "mouse" && e.button !== 0)) return;
    const trs = [...(bodyRef.current?.querySelectorAll<HTMLTableRowElement>(":scope > tr") ?? [])];
    origin.current = { y: e.clientY, mids: trs.map((tr) => { const r = tr.getBoundingClientRect(); return r.top + r.height / 2; }) };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ mode: "pointer", from: index, to: index, slot: index, dy: 0 });
    setLive(`${nameOf(rows[index] as T)} を掴んだ。${index + 1} 行目`);
  };
  const onHandleMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || d.mode !== "pointer") return;
    const mids = origin.current.mids;
    const slot = mids.filter((m) => m < e.clientY).length;
    const to = slot > d.from ? slot - 1 : slot;
    if (to !== d.to) setLive(`${to + 1} 行目の位置`);
    setDrag({ mode: "pointer", from: d.from, to, slot, dy: e.clientY - origin.current.y });
  };
  const onHandleUp = (e: PointerEvent<HTMLButtonElement>, commit: boolean) => {
    const d = dragRef.current;
    if (!d || d.mode !== "pointer") return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    finish(d, commit);
  };
  const onHandleKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!enabled) return;
    const d = dragRef.current;
    const lifted = d?.mode === "key" ? d : null;
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (!lifted) {
        if (dragRef.current) return;
        focusKey.current = keys[index] ?? null;
        setDrag({ mode: "key", from: index, to: index });
        setLive(`${nameOf(rows[index] as T)} を持ち上げた。${index + 1} 行目。上下の矢印で動かし、Space で置く`);
      } else finish(lifted, true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (lifted) finish(lifted, true);
    } else if (lifted && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const to = Math.min(rows.length - 1, Math.max(0, lifted.to + (e.key === "ArrowUp" ? -1 : 1)));
      if (to === lifted.to) { setLive(to === 0 ? "いちばん上" : "いちばん下"); return; }
      setDrag({ mode: "key", from: lifted.from, to });
      setLive(`${to + 1} 行目`);
    } else if (lifted && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      finish(lifted, false);
    }
  };
  // 持ち上げたまま Tab などで離れたら、元に戻す
  // 行が入れ替わる間は一瞬 focus が外れるので、少し待ってから確かめる
  const onHandleBlur = () => {
    setTimeout(() => {
      const d = dragRef.current;
      if (d?.mode !== "key") return;
      const el = handles.current.get(keys[d.from] ?? "");
      if (el !== document.activeElement) finish(d, false);
    }, 0);
  };

  // 描く順。キーボードで持ち上げている間は、動かした先の並びを見せる
  const order = rows.map((_, i) => i);
  const view = drag?.mode === "key" ? move(order, drag.from, drag.to) : order;
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
            {canReorder ? <th scope="col" data-handle=""><span className="ki-sr-only">並べ替え</span></th> : null}
            {selectable ? (
              <th scope="col" data-select="">
                <Checkbox
                  aria-label="すべての行を選択"
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
        <tbody ref={bodyRef}>
          {error ? (
            <tr><td colSpan={span} className="ki-table__state">
              <Alert tone="error" action={onRetry ? <Button variant="secondary" onClick={onRetry}>再試行</Button> : undefined}>{error}</Alert>
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
            view.map((i, pos) => {
              const row = rows[i] as T;
              const k = rowKey(row);
              const isSel = selected.includes(k);
              const picked = !!drag && i === drag.from;
              let drop: "before" | "after" | undefined;
              if (drag?.mode === "pointer" && drag.to !== drag.from) {
                if (drag.slot === i) drop = "before";
                else if (drag.slot === rows.length && i === rows.length - 1) drop = "after";
              }
              const lifted = drag?.mode === "key" && picked;
              return (
                <tr
                  key={k}
                  aria-selected={selectable ? isSel : undefined}
                  data-dragging={picked ? "" : undefined}
                  data-drop={drop}
                  style={drag?.mode === "pointer" && picked ? { transform: `translateY(${drag.dy}px)` } : undefined}
                >
                  {canReorder ? (
                    <td data-handle="">
                      <button
                        type="button"
                        className="ki-table__handle"
                        ref={(el) => { if (el) handles.current.set(k, el); else handles.current.delete(k); }}
                        aria-label={`${nameOf(row)} を並べ替える(${i + 1} 行目)`}
                        aria-describedby={hintId}
                        aria-pressed={lifted ? true : undefined}
                        disabled={!enabled}
                        data-active={picked ? "" : undefined}
                        onPointerDown={(e) => onHandleDown(e, i)}
                        onPointerMove={onHandleMove}
                        onPointerUp={(e) => onHandleUp(e, true)}
                        onPointerCancel={(e) => onHandleUp(e, false)}
                        onKeyDown={(e) => onHandleKey(e, i)}
                        onBlur={onHandleBlur}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <Icon name="drag" />
                      </button>
                    </td>
                  ) : null}
                  {selectable ? (
                    <td data-select="">
                      <Checkbox
                        aria-label={rowLabel ? rowLabel(row) + " を選択" : "この行を選択"}
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
      {canReorder ? (
        <>
          <span id={hintId} className="ki-sr-only">Space で持ち上げ、上下の矢印で動かし、Space か Enter で置く。Esc で戻す。マウスや指では、押したまま動かす</span>
          <span className="ki-sr-only" role="status" aria-live="polite">{live}</span>
        </>
      ) : null}
      {loading ? <span className="ki-sr-only" role="status"><Spinner />読み込み中</span> : null}
    </div>
  );
}
