import type { ReactNode } from "react";
import { Checkbox } from "./Choice.js";
import { EmptyState } from "./EmptyState.js";
import { Icon } from "./Icon.js";
import { Skeleton } from "./Skeleton.js";
import { cx } from "./utils.js";

export interface ListEntry {
  id: string;
  /** 題 */
  title: ReactNode;
  /** あると題がリンクになり、行全体が押せる */
  href?: string;
  /** 題の下の 2 行目。Status、時刻、補足を並べる */
  meta?: ReactNode;
  /** 末尾の操作や印。広い幅では右、狭い幅では 3 行目 */
  side?: ReactNode;
  /** 選べない・押せない行 */
  disabled?: boolean;
}

export interface ListItemProps {
  item: ListEntry;
  /** 選べる一覧のとき、選んでいるか */
  selected?: boolean;
  /** 無ければ選べない行 */
  onSelectedChange?: (selected: boolean) => void;
  /** 選ぶ枠の名前。既定「{題} を選択」 */
  selectLabel?: string;
}

/** 1 行。List の外では使えない(List の中に並べる)。 */
export function ListItem({ item, selected, onSelectedChange, selectLabel }: ListItemProps) {
  const text = typeof item.title === "string" ? item.title : undefined;
  return (
    <li className="ki-list__item" data-selected={selected ? "" : undefined} data-disabled={item.disabled ? "" : undefined}>
      {onSelectedChange ? (
        <div className="ki-list__pick">
          <Checkbox aria-label={selectLabel ?? `${text ?? "この行"} を選択`} checked={!!selected} disabled={item.disabled} onCheckedChange={onSelectedChange} />
        </div>
      ) : null}
      <div className="ki-list__main">
        <h3 className="ki-list__title">{item.href && !item.disabled ? <a href={item.href}>{item.title}</a> : item.title}</h3>
        {item.meta ? <p className="ki-list__meta">{item.meta}</p> : null}
      </div>
      {item.side ? <div className="ki-list__side">{item.side}</div> : null}
    </li>
  );
}

export interface ListProps {
  /** 一覧の名前。必須(読み上げる) */
  label: string;
  items: ListEntry[];
  /** 選んだ行の id。onSelectedChange と一緒に渡すと、選べる一覧になる */
  selected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  state?: "ready" | "loading" | "empty" | "error";
  /** 一覧の上に出す文(例: 8 件) */
  summary?: ReactNode;
  /** 「すべて選択」の文言。選んだ数があれば {count} が数になる */
  selectAllLabel?: string;
  selectedLabel?: string;
  emptyText?: string;
  errorText?: string;
  loadingText?: string;
  className?: string;
}

/** 行の一覧。選べる行(左のチェック)、2 行目のメタ、末尾の操作。幅で組み替える。 */
export function List({
  label, items, selected = [], onSelectedChange, state = "ready", summary, selectAllLabel = "すべて選択", selectedLabel = "{count} 件を選択中",
  emptyText = "一覧は空", errorText = "一覧を取れなかった。", loadingText = "読み込み中", className,
}: ListProps) {
  const sel = new Set(selected);
  const selectable = !!onSelectedChange;
  const selectableItems = items.filter((i) => !i.disabled);
  const all = selectableItems.length > 0 && selectableItems.every((i) => sel.has(i.id));
  const some = items.some((i) => sel.has(i.id));
  return (
    <div className={className}>
      <ul className="ki-list" aria-label={label} aria-busy={state === "loading" || undefined} data-selectable={selectable ? "" : undefined}>
        {selectable && state === "ready" && items.length > 0 ? (
          <li className="ki-list__head">
            <Checkbox
              label={selected.length > 0 ? selectedLabel.replace("{count}", String(selected.length)) : selectAllLabel}
              checked={all}
              indeterminate={some && !all}
              onCheckedChange={(c) => onSelectedChange!(c ? selectableItems.map((i) => i.id) : [])}
            />
            {summary ? <span>{summary}</span> : null}
          </li>
        ) : null}
        {state === "loading"
          ? [0, 1, 2].map((i) => (
              <li key={i} className="ki-list__item" data-state="loading">
                {selectable ? <div className="ki-list__pick" /> : null}
                <div className="ki-list__main"><Skeleton size="long" /><Skeleton size="medium" /></div>
              </li>
            ))
          : null}
        {state === "ready"
          ? items.map((it) => (
              <ListItem key={it.id} item={it} selected={sel.has(it.id)} onSelectedChange={selectable ? (c) => onSelectedChange!(c ? [...selected, it.id] : selected.filter((x) => x !== it.id)) : undefined} />
            ))
          : null}
        {state === "empty" ? <li className="ki-list__state"><EmptyState title={emptyText} icon={<Icon name="inbox" />} /></li> : null}
        {state === "error" ? <li className="ki-list__state"><EmptyState title={errorText} icon={<Icon name="warning" />} /></li> : null}
      </ul>
      {state === "loading" ? <span className="ki-sr-only" role="status">{loadingText}</span> : null}
    </div>
  );
}
