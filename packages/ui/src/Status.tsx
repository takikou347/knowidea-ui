import { Icon, type IconName } from "./Icon.js";
import { cx } from "./utils.js";

/** Claude の状態 5 つ。道具の状態 working、blocked、review_ready、completed、failed に当たる(admin の決定 0002) */
export type ClaudeStatus = "working" | "blocked" | "review" | "done" | "failed";
/** 提案とプロジェクトの状態 6 つ */
export type ProposalStatus = "discussing" | "reviewing" | "owner" | "building" | "done" | "dropped";
type Tone = "neutral" | "info" | "success" | "warn" | "error";

interface Def { label: string; icon: IconName; tone: Tone }

export const claudeStatus: Record<ClaudeStatus, Def> = {
  working: { label: "動いている", icon: "working", tone: "success" },
  blocked: { label: "待っている", icon: "paused", tone: "warn" },
  review: { label: "見てほしい", icon: "review", tone: "info" },
  done: { label: "終わった", icon: "success", tone: "neutral" },
  failed: { label: "失敗", icon: "error", tone: "error" },
};
export const proposalStatus: Record<ProposalStatus, Def> = {
  discussing: { label: "議論中", icon: "comment", tone: "neutral" },
  reviewing: { label: "レビュー中", icon: "review", tone: "info" },
  owner: { label: "オーナー待ち", icon: "owner-wait", tone: "warn" },
  building: { label: "実装中", icon: "branch", tone: "info" },
  done: { label: "済み", icon: "success", tone: "success" },
  dropped: { label: "見送り", icon: "stopped", tone: "neutral" },
};

export type StatusMarkProps = (
  | { kind?: "claude"; status: ClaudeStatus }
  | { kind: "proposal"; status: ProposalStatus }
) & {
  /** lg は提案とプロジェクトのカードの大きさ(一目で分かる) */
  size?: "md" | "lg";
  className?: string;
};

/** 状態の印。色だけでなく、形(アイコン)と字で伝える。 */
export function StatusMark(props: StatusMarkProps) {
  const { size = "md", className } = props;
  const def: Def = props.kind === "proposal" ? proposalStatus[props.status] : claudeStatus[props.status as ClaudeStatus];
  return (
    <span className={cx("ki-status", className)} data-tone={def.tone === "neutral" ? undefined : def.tone} data-size={size === "lg" ? "lg" : undefined}>
      <Icon name={def.icon} />
      {def.label}
    </span>
  );
}
