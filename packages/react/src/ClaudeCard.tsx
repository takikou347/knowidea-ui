import type { ReactNode } from "react";
import { Icon } from "./Icon.js";
import { Skeleton } from "./Skeleton.js";
import { StatusMark, type ClaudeStatus, type ProposalStatus } from "./StatusMark.js";
import { cx, formatNumber } from "./utils.js";

/** カード全体を 1 つのリンクにする。href があれば <a>、無ければ onOpen の <button> */
function CardLink({ href, onOpen, className, children }: { href?: string; onOpen?: () => void; className: string; children: ReactNode }) {
  if (href) return <a className={className} href={href}>{children}</a>;
  return <button type="button" className={className} onClick={onOpen}>{children}</button>;
}

export interface ClaudeCardProps {
  /** 役の名前(routine の name かスレッドの題) */
  role: string;
  model: string;
  status: ClaudeStatus;
  /** 今していること 1 行(status_detail) */
  doing?: string;
  /** 最後に動いた時刻(日本時間で整えた文) */
  lastActive?: string;
  /** 今日の使用量(トークン) */
  usage?: number | null;
  /** オーナーに要ること(needs_action) */
  needsAction?: string;
  href?: string;
  onOpen?: () => void;
  state?: "ready" | "loading" | "error";
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function ClaudeCard({ role, model, status, doing, lastActive, usage, needsAction, href, onOpen, state = "ready", error, disabled, className }: ClaudeCardProps) {
  if (state === "loading") {
    return (
      <article className={cx("ki-claude", className)} data-state="loading" aria-busy="true">
        <span className="ki-sr-only" role="status">読み込み中</span>
        <Skeleton size="medium" /><Skeleton size="long" /><Skeleton size="short" />
      </article>
    );
  }
  return (
    <article className={cx("ki-claude", className)} data-state={state === "error" ? "error" : undefined} data-disabled={disabled ? "" : undefined} aria-disabled={disabled || undefined}>
      <header className="ki-claude__head">
        <h3 className="ki-claude__role">
          {disabled ? role : <CardLink className="ki-claude__link" href={href} onOpen={onOpen}>{role}</CardLink>}
        </h3>
        <StatusMark status={status} />
      </header>
      <p className="ki-claude__model">{model}</p>
      {state === "error" ? (
        <p className="ki-claude__error"><Icon name="warning" />{error ?? "状態が取れなかった"}</p>
      ) : (
        <p className="ki-claude__doing" data-empty={doing ? undefined : ""} title={doing}>{doing ?? "今していることは無い"}</p>
      )}
      <dl className="ki-claude__meta">
        <div><dt>最後に動いた</dt><dd>{lastActive ?? "記録なし"}</dd></div>
        <div><dt>今日の使用量</dt><dd>{usage == null ? "不明" : `${formatNumber(usage)} トークン`}</dd></div>
      </dl>
      {needsAction ? <p className="ki-claude__need"><Icon name="owner-wait" /><span><b>オーナーに要ること</b> {needsAction}</span></p> : null}
    </article>
  );
}

export interface ProposalCardProps {
  kind?: "proposal" | "project";
  title: string;
  department: string;
  /** 計画の正本の段の名前(例: 1c 部品) */
  stage: string;
  status: ProposalStatus;
  /** オーナーに要ること。無ければ「無し」と出す */
  needsOwner?: string;
  href?: string;
  onOpen?: () => void;
  /** カードの下に置く操作(承認、否認、コメント) */
  actions?: ReactNode;
  state?: "ready" | "loading";
  className?: string;
}

export function ProposalCard({ kind = "proposal", title, department, stage, status, needsOwner, href, onOpen, actions, state = "ready", className }: ProposalCardProps) {
  if (state === "loading") {
    return (
      <article className={cx("ki-proposal", className)} data-state="loading" aria-busy="true">
        <span className="ki-sr-only" role="status">読み込み中</span>
        <Skeleton size="short" /><Skeleton size="long" /><Skeleton size="medium" />
      </article>
    );
  }
  return (
    <article className={cx("ki-proposal", className)}>
      <p className="ki-proposal__org">
        <span><Icon name="department" />{department}</span>
        <span><Icon name={kind === "project" ? "folder" : "proposal"} />{kind === "project" ? "プロジェクト" : "提案"}</span>
        <span>段 {stage}</span>
      </p>
      <div className="ki-proposal__head">
        <h3 className="ki-proposal__title"><CardLink className="ki-proposal__link" href={href} onOpen={onOpen}>{title}</CardLink></h3>
        <StatusMark kind="proposal" status={status} size="lg" />
      </div>
      {needsOwner ? (
        <p className="ki-proposal__need"><Icon name="owner-wait" /><span><b>オーナーに要ること</b> {needsOwner}</span></p>
      ) : (
        <p className="ki-proposal__none">オーナーに要ること: 無し</p>
      )}
      {actions ? <div className="ki-proposal__foot">{actions}</div> : null}
    </article>
  );
}
