import type { ReactNode } from "react";
import { Badge } from "./Badge.js";
import { Checkbox } from "./Choice.js";
import { EmptyState } from "./EmptyState.js";
import { Icon, type IconName } from "./Icon.js";
import { Skeleton } from "./Skeleton.js";
import { StatusMark, type ClaudeStatus } from "./StatusMark.js";
import { cx } from "./utils.js";

export type PrState = "open" | "draft" | "merged" | "closed" | "queued";
export type CiState = "pass" | "fail" | "running" | "none";
export type Verdict = "ok" | "conditional" | "ng" | "none";

export interface PrInfo {
  number: number;
  state: PrState;
  ci: CiState;
  /** レビュー部の判定 */
  review: Verdict;
  href?: string;
}
export interface ThreadItem {
  id: string;
  title: string;
  status: ClaudeStatus;
  /** 最後に動いた時刻(日本時間で整えた文) */
  lastActive: string;
  /** 何を待っているか(needs_action) */
  waiting?: string;
  /** 待っているのがオーナーの判断 */
  waitingOwner?: boolean;
  href?: string;
  pr?: PrInfo;
}

const prDef: Record<PrState, { label: string; icon: IconName; tone: "neutral" | "info" | "success" | "warn" | "error" }> = {
  open: { label: "開いている", icon: "pr", tone: "info" },
  draft: { label: "下書き", icon: "edit", tone: "neutral" },
  merged: { label: "マージ済み", icon: "merge", tone: "success" },
  closed: { label: "閉じた", icon: "close", tone: "neutral" },
  queued: { label: "マージ待ち", icon: "clock", tone: "warn" },
};
const ciDef: Record<Exclude<CiState, "none">, { label: string; icon: IconName; tone: "info" | "success" | "error" }> = {
  pass: { label: "CI 通過", icon: "success", tone: "success" },
  fail: { label: "CI 失敗", icon: "error", tone: "error" },
  running: { label: "CI 実行中", icon: "loading", tone: "info" },
};
const verdictDef: Record<Verdict, { label: string; tone?: "success" | "warn" | "error" }> = {
  ok: { label: "レビュー 可", tone: "success" },
  conditional: { label: "レビュー 条件つき可", tone: "warn" },
  ng: { label: "レビュー 不可", tone: "error" },
  none: { label: "レビュー 未" },
};

export function PrMarks({ pr }: { pr: PrInfo }) {
  const s = prDef[pr.state];
  const body = <><Icon name="pr" />#{pr.number}</>;
  return (
    <>
      {pr.href ? <a className="ki-row__pr" href={pr.href}>{body}</a> : <span className="ki-row__pr">{body}</span>}
      <span className="ki-status" data-tone={s.tone === "neutral" ? undefined : s.tone}><Icon name={s.icon} />{s.label}</span>
      {pr.ci !== "none" ? (() => { const c = ciDef[pr.ci]; return <span className="ki-status" data-tone={c.tone}><Icon name={c.icon} />{c.label}</span>; })() : null}
      <Badge tone={verdictDef[pr.review].tone ?? "neutral"}>{verdictDef[pr.review].label}</Badge>
    </>
  );
}

export interface ThreadRowProps {
  item: ThreadItem;
  selected?: boolean;
  /** 無ければ選べない行 */
  onSelectedChange?: (selected: boolean) => void;
}

export function ThreadRow({ item, selected, onSelectedChange }: ThreadRowProps) {
  const title = item.href ? <a href={item.href}>{item.title}</a> : item.title;
  return (
    <li className="ki-row" data-selected={selected ? "" : undefined}>
      <div className="ki-row__pick">
        {onSelectedChange ? <Checkbox aria-label={`「${item.title}」を選ぶ`} checked={!!selected} onCheckedChange={onSelectedChange} /> : null}
      </div>
      <div className="ki-row__main">
        <h3 className="ki-row__title">{title}</h3>
        <p className="ki-row__meta">
          <StatusMark status={item.status} />
          <span>最後に動いた <time className="ki-row__num">{item.lastActive}</time></span>
          {item.waiting ? (
            <span className="ki-row__wait" data-owner={item.waitingOwner ? "" : undefined}><Icon name={item.waitingOwner ? "owner-wait" : "clock"} />待っているのは: {item.waiting}</span>
          ) : null}
        </p>
      </div>
      {item.pr ? <div className="ki-row__side"><PrMarks pr={item.pr} /></div> : null}
    </li>
  );
}

export interface ThreadListProps {
  items: ThreadItem[];
  /** 選んだ行の id */
  selected?: string[];
  /** 無ければ選べない一覧 */
  onSelectedChange?: (ids: string[]) => void;
  state?: "ready" | "loading" | "empty" | "error";
  /** 一覧の上に出す文(例: 8 件) */
  summary?: ReactNode;
  errorText?: string;
  emptyText?: string;
  className?: string;
}

export function ThreadList({ items, selected = [], onSelectedChange, state = "ready", summary, errorText = "スレッドの一覧を取れなかった。", emptyText = "スレッドは無い", className }: ThreadListProps) {
  const sel = new Set(selected);
  const all = items.length > 0 && items.every((i) => sel.has(i.id));
  const some = items.some((i) => sel.has(i.id));
  return (
    <div className={className}>
      <ul className={cx("ki-rows")} aria-busy={state === "loading" || undefined} aria-label="スレッドと PR">
        {onSelectedChange && state === "ready" && items.length > 0 ? (
          <li className="ki-rows__head">
            <Checkbox
              label={selected.length > 0 ? `${selected.length} 件を選んだ` : "全部を選ぶ"}
              checked={all}
              indeterminate={some && !all}
              onCheckedChange={(c) => onSelectedChange(c ? items.map((i) => i.id) : [])}
            />
            {summary ? <span>{summary}</span> : null}
          </li>
        ) : null}
        {state === "loading" ? (
          [0, 1, 2].map((i) => (
            <li key={i} className="ki-row" data-state="loading">
              <div className="ki-row__pick" />
              <div className="ki-row__main"><Skeleton size="long" /><Skeleton size="medium" /></div>
            </li>
          ))
        ) : null}
        {state === "ready" ? items.map((it) => (
          <ThreadRow key={it.id} item={it} selected={sel.has(it.id)} onSelectedChange={onSelectedChange ? (c) => onSelectedChange(c ? [...selected, it.id] : selected.filter((x) => x !== it.id)) : undefined} />
        )) : null}
        {state === "empty" ? <li className="ki-rows__state"><EmptyState title={emptyText} icon={<Icon name="inbox" />} /></li> : null}
        {state === "error" ? <li className="ki-rows__state"><EmptyState title={errorText} icon={<Icon name="warning" />} /></li> : null}
      </ul>
      {state === "loading" ? <span className="ki-sr-only" role="status">読み込み中</span> : null}
    </div>
  );
}
