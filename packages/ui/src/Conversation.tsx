import type { ReactNode } from "react";
import { Avatar } from "./Avatar.js";
import { cx } from "./utils.js";

export interface ConversationMessage {
  id: string;
  /** self は自分(右)、other は相手(左) */
  from: "self" | "other";
  /** 話した人の名前。相手の時は吹き出しの上に出る。続けて同じ人が話した時は省く */
  author: string;
  /** 相手の顔の画像。無ければ頭文字 */
  avatar?: string;
  /** 時刻(ISO)。<time> の datetime になる */
  time?: string;
  /** 見せる時刻。既定は time のまま */
  timeLabel?: string;
  body: ReactNode;
  /** sending は送っている途中、failed は送れなかった */
  status?: "sending" | "failed";
}

export interface ConversationProps {
  messages: ConversationMessage[];
  /** 読み上げの名前。既定「会話」 */
  label?: string;
  /** 相手が返事を書いている時の 1 行(例「社長が返事を書いている」)。動かさない */
  pending?: string;
  /** 話が 1 つも無い時に出す物 */
  empty?: ReactNode;
  className?: string;
}

const statusText = { sending: "送っている", failed: "送れなかった" } as const;

/** 会話の流れ。話しかけ(自分、右)と返事(相手、左)を時の順に並べる。新しい話は下に足す。 */
export function Conversation({ messages, label = "会話", pending, empty, className }: ConversationProps) {
  if (messages.length === 0 && !pending) return <div className={cx("ki-convo", className)} role="log" aria-label={label}>{empty}</div>;
  return (
    <div className={cx("ki-convo", className)} role="log" aria-label={label}>
      <ol className="ki-convo__list">
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const cont = !!prev && prev.from === m.from && prev.author === m.author;
          return (
            <li key={m.id} className="ki-convo__msg" data-from={m.from} data-continued={cont ? "" : undefined} data-status={m.status}>
              {m.from === "other" ? <span className="ki-convo__avatar">{cont ? null : <Avatar name={m.author} src={m.avatar} size="sm" shape="circle" />}</span> : null}
              <div className="ki-convo__main">
                {cont ? null : <p className="ki-convo__author">{m.from === "self" ? <span className="ki-sr-only">{m.author}</span> : m.author}</p>}
                <div className="ki-convo__bubble">{m.body}</div>
                {m.time || m.status ? (
                  <p className="ki-convo__meta">
                    {m.time ? <time dateTime={m.time}>{m.timeLabel ?? m.time}</time> : null}
                    {m.status ? <span className="ki-convo__status">{statusText[m.status]}</span> : null}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {pending ? <p className="ki-convo__pending">{pending}</p> : null}
    </div>
  );
}
