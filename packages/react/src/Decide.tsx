import { useId, useState, type ReactNode } from "react";
import { Button } from "./Button.js";
import { Icon, type IconName } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import { Badge } from "./Badge.js";
import { Spinner } from "./Spinner.js";
import { Textarea } from "./Input.js";
import { cx } from "./utils.js";

export type DecisionValue = "approve" | "reject" | "comment";

const labels = {
  standard: { approve: "承認", reject: "否認", comment: "コメント" },
  /** オーナーが決める 5 つに当たる物は、はい / いいえ */
  owner: { approve: "はい", reject: "いいえ", comment: "コメント" },
} as const;
const icons: Record<DecisionValue, IconName> = { approve: "approve", reject: "reject", comment: "comment" };

export interface DecisionState { value: DecisionValue | null; comment?: string }

export interface DecisionBarProps {
  /** 対象の名前(読み上げと、トレイの一覧に出る) */
  target: string;
  mode?: "standard" | "owner";
  value?: DecisionValue | null;
  comment?: string;
  /** 押したら送る前の一覧に入る(すぐには送らない) */
  onChange?: (next: DecisionState) => void;
  disabled?: boolean;
  className?: string;
}

/** 承認、否認、コメント。押しても送らず、送る前の一覧(SendTray)に入れる。もう一度押すと外す。 */
export function DecisionBar({ target, mode = "standard", value: valueProp, comment: commentProp, onChange, disabled, className }: DecisionBarProps) {
  const [inner, setInner] = useState<DecisionState>({ value: null });
  const [draft, setDraft] = useState(commentProp ?? "");
  const [open, setOpen] = useState(false);
  const cur: DecisionState = valueProp !== undefined ? { value: valueProp, comment: commentProp } : inner;
  const set = (next: DecisionState) => { if (valueProp === undefined) setInner(next); onChange?.(next); };
  const L = labels[mode];
  const id = useId();

  const press = (v: DecisionValue) => {
    if (v === "comment") { setOpen((o) => !o); return; }
    setOpen(false);
    set(cur.value === v ? { value: null } : { value: v });
  };
  const btn = (v: DecisionValue) => (
    <Button
      key={v}
      variant="secondary"
      className="ki-decide__btn"
      data-choice={v}
      aria-pressed={cur.value === v || (v === "comment" && open)}
      disabled={disabled}
      icon={<Icon name={icons[v]} />}
      aria-label={`${target}に${L[v]}`}
      onClick={() => press(v)}
    >{L[v]}</Button>
  );
  return (
    <div className={cx("ki-decide", className)}>
      <div className="ki-decide__bar" role="group" aria-label={`${target}への返事`}>{btn("approve")}{btn("reject")}{btn("comment")}</div>
      {open ? (
        <div className="ki-decide__comment">
          <label className="ki-sr-only" htmlFor={id}>{target}へのコメント</label>
          <Textarea id={id} value={draft} placeholder="Claude への文を書く" onChange={(e) => setDraft(e.target.value)} />
          <div className="ki-decide__comment-actions">
            <Button variant="primary" disabled={draft.trim() === ""} onClick={() => { set({ value: "comment", comment: draft.trim() }); setOpen(false); }}>一覧に入れる</Button>
            <Button variant="quiet" onClick={() => setOpen(false)}>やめる</Button>
          </div>
        </div>
      ) : null}
      {cur.value ? (
        <p className="ki-decide__note" role="status">
          <Icon name="batch-send" />「{cur.value === "comment" ? `コメント: ${cur.comment ?? ""}` : L[cur.value]}」を送る前の一覧に入れた。{cur.value === "comment" ? "" : "もう一度押すと外す。"}
        </p>
      ) : null}
    </div>
  );
}

/** 考えている。動かさない(終わらない脈動を使わない)。 */
export function Thinking({ label = "考えている" }: { label?: string }) {
  return <p className="ki-thinking" role="status"><Icon name="thinking" />{label}</p>;
}

export interface TalkBoxProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  /** 一覧に入れる。すぐには送らない */
  onSubmit?: (text: string) => void;
  /** queued: 一覧に入れた / thinking: 送った後、答えを待つ / answered: 答えが来た */
  status?: "idle" | "queued" | "thinking" | "answered";
  answer?: ReactNode;
  answerMeta?: string;
  className?: string;
}

/** 話しかける欄。提案、Claude のカード、ホームに置く。 */
export function TalkBox({ label = "Claude に話しかける", placeholder = "頼みたいこと、聞きたいことを書く", value, onValueChange, onSubmit, status = "idle", answer, answerMeta, className }: TalkBoxProps) {
  const [inner, setInner] = useState("");
  const text = value ?? inner;
  const id = useId();
  return (
    <div className={cx("ki-talk", className)}>
      <label className="ki-talk__label" htmlFor={id}>{label}</label>
      <div className="ki-talk__row">
        <Textarea id={id} value={text} placeholder={placeholder} onChange={(e) => { onValueChange?.(e.target.value); if (value === undefined) setInner(e.target.value); }} />
        <div><Button variant="secondary" icon={<Icon name="batch-send" />} disabled={text.trim() === ""} onClick={() => { onSubmit?.(text.trim()); if (value === undefined) setInner(""); }}>送る前の一覧に入れる</Button></div>
      </div>
      {status === "queued" ? <p className="ki-decide__note" role="status"><Icon name="batch-send" />送る前の一覧に入れた。</p> : null}
      {status === "thinking" ? <Thinking /> : null}
      {status === "answered" ? (
        <div className="ki-talk__answer"><span>{answer}</span>{answerMeta ? <span className="ki-talk__answer-meta">{answerMeta}</span> : null}</div>
      ) : null}
    </div>
  );
}

export type TrayKind = "approve" | "reject" | "comment" | "talk" | "yes" | "no";
export type TrayItemState = "queued" | "sending" | "received" | "thinking" | "done" | "failed";
export type TrayPhase = "idle" | "sending" | "received" | "failed";

export interface TrayItem {
  id: string;
  kind: TrayKind;
  /** 対象(提案の題、PR の番号など) */
  target: string;
  /** コメントと話しかけた文 */
  text?: string;
  state: TrayItemState;
}

const kindDef: Record<TrayKind, { label: string; icon: IconName }> = {
  approve: { label: "承認", icon: "approve" },
  reject: { label: "否認", icon: "reject" },
  yes: { label: "はい", icon: "approve" },
  no: { label: "いいえ", icon: "reject" },
  comment: { label: "コメント", icon: "comment" },
  talk: { label: "話しかけ", icon: "thinking" },
};
const stateDef: Record<TrayItemState, { label: string; tone?: "info" | "success" | "warn" | "error"; icon: IconName }> = {
  queued: { label: "送る前", icon: "batch-send" },
  sending: { label: "送っている", tone: "info", icon: "send" },
  received: { label: "受けた", tone: "info", icon: "success" },
  thinking: { label: "考えている", icon: "thinking" },
  done: { label: "済み", tone: "success", icon: "success" },
  failed: { label: "届かなかった", tone: "error", icon: "error" },
};

export interface SendTrayProps {
  items: TrayItem[];
  /** 送りの進み方。sending: 送っている / received: 受けた、答えを待つ / failed: 届かなかった */
  phase?: TrayPhase;
  onRemove?: (id: string) => void;
  onSend?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** まとめて送るトレイ。1 回の送りで Claude を呼ぶのは 1 回。送っている間も貯められる。 */
export function SendTray({ items, phase = "idle", onRemove, onSend, open: openProp, defaultOpen = false, onOpenChange, className }: SendTrayProps) {
  const [openInner, setOpenInner] = useState(defaultOpen);
  const open = openProp ?? openInner;
  const setOpen = (o: boolean) => { if (openProp === undefined) setOpenInner(o); onOpenChange?.(o); };
  const listId = useId();
  const waiting = items.filter((i) => i.state === "queued" || i.state === "failed").length;
  const sending = phase === "sending";
  const phaseText: Record<TrayPhase, ReactNode> = {
    idle: waiting > 0 ? "まとめて 1 回で送る。送る前は 1 件ずつ消せる。" : "送る物は無い。",
    sending: <><Spinner />送っている。この間も貯められる。</>,
    received: <><Icon name="success" />受けた。Claude が答えを書いている。</>,
    failed: <><Icon name="error" />届かなかった。一覧はそのまま残っている。</>,
  };
  return (
    <section className={cx("ki-tray", className)} aria-label="送る前の一覧">
      <div className="ki-tray__head">
        <div className="ki-tray__summary">
          <p className="ki-tray__count">送る前の一覧 <b>{waiting}</b> 件</p>
          <p className="ki-tray__phase" data-phase={phase} role="status">{phaseText[phase]}</p>
        </div>
        <div className="ki-tray__actions">
          <Button variant="secondary" aria-expanded={open} aria-controls={listId} icon={<Icon name={open ? "chevron-down" : "chevron-up"} />} onClick={() => setOpen(!open)}>{open ? "一覧を閉じる" : "一覧を開く"}</Button>
          <Button variant="primary" icon={sending ? undefined : <Icon name="send" />} loading={sending} loadingLabel="送っている" disabled={waiting === 0 && !sending} onClick={onSend}>
            {phase === "failed" ? "もう一度送る" : "まとめて送る"}
          </Button>
        </div>
      </div>
      <div id={listId} hidden={!open}>
        {items.length === 0 ? <p className="ki-tray__empty">承認、否認、コメント、話しかけた文がここに貯まる。</p> : (
          <ul className="ki-tray__list">
            {items.map((it) => {
              const k = kindDef[it.kind], s = stateDef[it.state];
              const removable = it.state === "queued" || it.state === "failed";
              return (
                <li key={it.id} className="ki-tray__item">
                  <span className="ki-tray__kind"><Icon name={k.icon} />{k.label}</span>
                  <div className="ki-tray__body">
                    <p className="ki-tray__target">{it.target}</p>
                    {it.text ? <p className="ki-tray__text" title={it.text}>{it.text}</p> : null}
                  </div>
                  <IconButton variant="quiet" label={`取り消す: ${k.label} ${it.target}`} icon={<Icon name="delete" />} disabled={!removable} onClick={() => onRemove?.(it.id)} />
                  <span className="ki-tray__state"><Badge tone={s.tone ?? "neutral"} icon={<Icon name={s.icon} />}>{s.label}</Badge></span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
