import type { ReactNode } from "react";
import { Button } from "./Button.js";
import { Icon } from "./Icon.js";
import { Spinner } from "./Spinner.js";
import { cx } from "./utils.js";

export interface SelectionBarProps {
  /** 選んだ数 */
  count: number;
  /** 件数の文。{count} が数になる。既定「{count} 件を選んでいる」 */
  countLabel?: string;
  /** 件数の下の 1 行(進み方、注意)。state が error なら失敗の理由 */
  note?: ReactNode;
  /** 一括の操作。Button を並べる */
  actions?: ReactNode;
  /** 選びを解く。渡すと「選びを解く」ボタンが出る */
  onClear?: () => void;
  clearLabel?: string;
  /** 画面の下に貼り付く */
  sticky?: boolean;
  /** 0 件のとき消すか、案内を出すか。既定は案内を出す(hide で何も描かない) */
  whenEmpty?: "hint" | "hide";
  emptyHint?: string;
  state?: "ready" | "loading" | "error";
  /** 読み上げの名前 */
  label?: string;
  className?: string;
}

/** 選んだ物への一括の操作の帯。件数、操作、選びの解除。 */
export function SelectionBar({
  count, countLabel = "{count} 件を選んでいる", note, actions, onClear, clearLabel = "選びを解く", sticky, whenEmpty = "hint",
  emptyHint = "一覧で選ぶと、ここに操作が出る。", state = "ready", label = "選んだ物への操作", className,
}: SelectionBarProps) {
  if (count === 0 && whenEmpty === "hide" && state === "ready") return null;
  const [before, after] = countLabel.split("{count}");
  return (
    <section className={cx("ki-selbar", className)} aria-label={label} data-sticky={sticky ? "" : undefined} data-state={state === "ready" ? undefined : state}>
      <div className="ki-selbar__head">
        <div className="ki-selbar__summary">
          <p className="ki-selbar__count">{before}<b>{count}</b>{after}</p>
          <p className="ki-selbar__note" role="status">
            {state === "loading" ? <><Spinner />処理している。</> : state === "error" ? <><Icon name="error" />{note ?? "処理できなかった。選びはそのまま残っている。"}</> : count === 0 ? emptyHint : note}
          </p>
        </div>
        <div className="ki-selbar__actions">
          {onClear ? <Button variant="quiet" disabled={count === 0 || state === "loading"} onClick={onClear}>{clearLabel}</Button> : null}
          {actions}
        </div>
      </div>
    </section>
  );
}
