import type { ElementType, ReactNode } from "react";
import { Icon } from "./Icon.js";
import { Skeleton } from "./Skeleton.js";
import { cx } from "./utils.js";

export interface CardMeta { label: ReactNode; value: ReactNode }

export interface CardProps {
  /** 見出し。必須 */
  title: ReactNode;
  /** 見出しの下の小さな文(等幅)。識別子や日時 */
  subtitle?: ReactNode;
  /** 見出しの右に置く物。Status や Badge */
  badge?: ReactNode;
  /** 本文 */
  children?: ReactNode;
  /** 名前と値の組。2 列で並ぶ。値は等幅 */
  meta?: CardMeta[];
  /** 下の操作。Button など */
  actions?: ReactNode;
  /** あると見出しがリンクになり、押せる範囲がカード全体に広がる */
  href?: string;
  /** href が無いときの押す操作。見出しがボタンになる */
  onOpen?: () => void;
  /** 見出しの h の段(2〜6)。既定 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  state?: "ready" | "loading" | "error";
  /** state が error のときの理由 */
  error?: string;
  disabled?: boolean;
  /** 描画する要素。既定は article */
  as?: ElementType;
  className?: string;
}

/** 見出し、メタ、本文、操作の枠。入れ子にしない。 */
export function Card({
  title, subtitle, badge, children, meta, actions, href, onOpen, headingLevel = 3, state = "ready", error, disabled, as: Tag = "article", className,
}: CardProps) {
  const H = `h${headingLevel}` as ElementType;
  const interactive = !disabled && (href || onOpen);
  if (state === "loading") {
    return (
      <Tag className={cx("ki-card", className)} data-state="loading" aria-busy="true">
        <span className="ki-sr-only" role="status">読み込み中</span>
        <Skeleton size="medium" /><Skeleton size="long" /><Skeleton size="short" />
      </Tag>
    );
  }
  return (
    <Tag className={cx("ki-card", className)} data-interactive={interactive ? "" : undefined} data-state={state === "error" ? "error" : undefined} data-disabled={disabled ? "" : undefined} aria-disabled={disabled || undefined}>
      <header className="ki-card__header">
        <div className="ki-card__heading">
          <H className="ki-card__title">
            {!interactive ? title : href ? <a className="ki-card__link" href={href}>{title}</a> : <button type="button" className="ki-card__link" onClick={onOpen}>{title}</button>}
          </H>
          {subtitle ? <p className="ki-card__subtitle">{subtitle}</p> : null}
        </div>
        {badge}
      </header>
      {state === "error" ? <p className="ki-card__error"><Icon name="warning" />{error ?? "取れなかった"}</p> : children ? <div className="ki-card__body">{children}</div> : null}
      {meta && meta.length > 0 ? (
        <dl className="ki-card__meta">
          {meta.map((m, i) => <div key={i}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}
        </dl>
      ) : null}
      {actions ? <div className="ki-card__actions">{actions}</div> : null}
    </Tag>
  );
}
