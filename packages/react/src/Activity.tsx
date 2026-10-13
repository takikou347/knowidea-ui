import { EmptyState } from "./EmptyState.js";
import { Icon, type IconName } from "./Icon.js";
import { Skeleton } from "./Skeleton.js";
import { cx } from "./utils.js";

export type ActivityKind = "merge" | "publish" | "record" | "stop";
export interface ActivityItem {
  id: string;
  /** 日本時間で整えた時刻(例: 10/13 09:28) */
  time: string;
  /** Claude の役 */
  role: string;
  kind: ActivityKind;
  /** 1 行の中身 */
  text: string;
  href?: string;
}
const kindDef: Record<ActivityKind, { label: string; icon: IconName }> = {
  merge: { label: "マージ", icon: "merge" },
  publish: { label: "公開", icon: "broadcast" },
  record: { label: "記録", icon: "note" },
  stop: { label: "止めた", icon: "stopped" },
};

export interface ActivityListProps {
  items: ActivityItem[];
  state?: "ready" | "loading" | "empty" | "error";
  emptyText?: string;
  errorText?: string;
  className?: string;
}

/** 最近の動き。新しい順。 */
export function ActivityList({ items, state = "ready", emptyText = "まだ動きは無い", errorText = "最近の動きを取れなかった。", className }: ActivityListProps) {
  if (state === "empty") return <EmptyState title={emptyText} icon={<Icon name="pulse" />} />;
  if (state === "error") return <EmptyState title={errorText} icon={<Icon name="warning" />} />;
  if (state === "loading") {
    return (
      <ul className={cx("ki-activity", className)} aria-busy="true">
        <li className="ki-activity__item" style={{ gridTemplateColumns: "1fr" }}><span className="ki-sr-only" role="status">読み込み中</span><Skeleton size="long" /><Skeleton size="medium" /></li>
        <li className="ki-activity__item" style={{ gridTemplateColumns: "1fr" }}><Skeleton size="long" /><Skeleton size="short" /></li>
      </ul>
    );
  }
  return (
    <ul className={cx("ki-activity", className)}>
      {items.map((it) => {
        const k = kindDef[it.kind];
        return (
          <li key={it.id} className="ki-activity__item" data-kind={it.kind}>
            <span className="ki-activity__icon"><Icon name={k.icon} /></span>
            <div className="ki-activity__body">
              <p className="ki-activity__text"><span className="ki-activity__kind">{k.label}</span> {it.href ? <a href={it.href}>{it.text}</a> : it.text}</p>
              <p className="ki-activity__meta"><span>{it.role}</span><time>{it.time}</time></p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
