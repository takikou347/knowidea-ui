import { useState } from "react";
import { Button } from "./Button.js";
import { ConfirmDialog } from "./Dialog.js";
import { Icon } from "./Icon.js";
import { Spinner } from "./Spinner.js";
import { cx } from "./utils.js";

export interface StopButtonProps {
  /** 止める物の名前(routine の name) */
  name: string;
  /** idle: 押せる / requested: 依頼中 / stopped: 止めた / failed: 依頼が届かなかった */
  state?: "idle" | "requested" | "stopped" | "failed";
  /** 確かめる画面で「止める依頼を出す」を押した */
  onConfirm?: () => void;
  onResume?: () => void;
  /** 届かなかったとき、チャットへ貼る文面 */
  fallbackText?: string;
  disabled?: boolean;
  className?: string;
}

/** 止めるボタン。押すと確かめる画面、もう一度押すと依頼、押した後は「依頼中」、写しに載ると「止めた」。 */
export function StopButton({ name, state = "idle", onConfirm, onResume, fallbackText, disabled, className }: StopButtonProps) {
  const [copied, setCopied] = useState<"" | "ok" | "ng">("");
  const copy = async () => {
    try { await navigator.clipboard.writeText(fallbackText ?? ""); setCopied("ok"); } catch { setCopied("ng"); }
    setTimeout(() => setCopied(""), 1600);
  };
  return (
    <div className={cx("ki-stop", className)}>
      {state === "idle" ? (
        <ConfirmDialog
          title={`「${name}」を止める`}
          description="止める依頼を出す。会社の写しに載ると「止めた」になる。載るまでは動いていることがある。"
          confirmLabel="止める依頼を出す"
          cancelLabel="やめる"
          onConfirm={onConfirm}
          trigger={<Button variant="secondary" className="ki-stop__btn" disabled={disabled} aria-label={`${name}を止める`} icon={<Icon name="stop" />}>止める</Button>}
        />
      ) : null}
      {state === "requested" ? <p className="ki-stop__state" role="status"><Spinner />依頼中(写しに載るまで待つ)</p> : null}
      {state === "stopped" ? (
        <>
          <span className="ki-status"><Icon name="stopped" />止めた</span>
          {onResume ? <Button variant="quiet" icon={<Icon name="resume" />} aria-label={`${name}を再開する`} onClick={onResume}>再開</Button> : null}
        </>
      ) : null}
      {state === "failed" ? (
        <div className="ki-stop__fail" role="alert">
          <span>止める依頼が届かなかった。チャットへ貼る文面を写せる。</span>
          <div className="ki-stop__fail-actions">
            <Button variant="secondary" icon={<Icon name="copy" />} onClick={copy}>{copied === "ok" ? "写した" : copied === "ng" ? "写せない" : "文面を写す"}</Button>
            <Button variant="quiet" icon={<Icon name="refresh" />} onClick={onConfirm}>もう一度依頼する</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

