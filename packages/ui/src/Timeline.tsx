import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState.js";
import { Icon, type IconName } from "./Icon.js";
import { Skeleton } from "./Skeleton.js";
import { cx } from "./utils.js";

export interface TimelineEntry {
  id: string;
  /** 時刻の文(例: 10/13 09:28)。等幅で出る */
  time: string;
  /** 太字の短い題(例: 公開) */
  title: string;
  /** 1 行の中身 */
  text: ReactNode;
  icon?: IconName;
  /** 印の色 */
  tone?: "success" | "warn" | "error" | "info";
  /** あると中身がリンクになり、行全体が押せる */
  href?: string;
  /** 時刻の隣に出す補足(誰が、どこで) */
  meta?: ReactNode;
}

export interface TimelineProps {
  items: TimelineEntry[];
  state?: "ready" | "loading" | "empty" | "error";
  emptyText?: string;
  errorText?: string;
  loadingText?: string;
  className?: string;
}

/** 新しい順の出来事の一覧。 */
export function Timeline({ items, state = "ready", emptyText = "まだ出来事は無い", errorText = "出来事を取れなかった。", loadingText = "読み込み中", className }: TimelineProps) {
  if (state === "empty") return <EmptyState title={emptyText} icon={<Icon name="pulse" />} />;
  if (state === "error") return <EmptyState title={errorText} icon={<Icon name="warning" />} />;
  if (state === "loading") {
    return (
      <ul className={cx("ki-timeline", className)} aria-busy="true">
        <li className="ki-timeline__item" style={{ gridTemplateColumns: "1fr" }}><span className="ki-sr-only" role="status">{loadingText}</span><Skeleton size="long" /><Skeleton size="medium" /></li>
        <li className="ki-timeline__item" style={{ gridTemplateColumns: "1fr" }}><Skeleton size="long" /><Skeleton size="short" /></li>
      </ul>
    );
  }
  return (
    <ul className={cx("ki-timeline", className)}>
      {items.map((it) => (
        <li key={it.id} className="ki-timeline__item" data-tone={it.tone}>
          <span className="ki-timeline__icon"><Icon name={it.icon ?? "note"} /></span>
          <div className="ki-timeline__body">
            <p className="ki-timeline__text"><span className="ki-timeline__title">{it.title}</span> {it.href ? <a href={it.href}>{it.text}</a> : it.text}</p>
            <p className="ki-timeline__meta">{it.meta ? <span>{it.meta}</span> : null}<time>{it.time}</time></p>
          </div>
        </li>
      ))}
    </ul>
  );
}
