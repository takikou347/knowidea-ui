import { Conversation, EmptyState, Icon, Skeleton, type ConversationMessage } from "knowidea-ui";
import type { StateRow } from "./types";

const messages: ConversationMessage[] = [
  { id: "1", from: "self", author: "自分", time: "2026-10-13T09:20", timeLabel: "09:20", body: "色の検査の結果を教えて。" },
  { id: "2", from: "other", author: "作る役", time: "2026-10-13T09:21", timeLabel: "09:21", body: "本文と背景の差は、どのページも 4.5:1 以上でした。" },
  { id: "3", from: "other", author: "作る役", time: "2026-10-13T09:21", timeLabel: "09:21", body: "線の差が足りない所が 2 か所あり、直しています。" },
  { id: "4", from: "self", author: "自分", time: "2026-10-13T09:24", timeLabel: "09:24", body: "直ったら知らせて。" },
];

export function Basic() {
  return <div style={{ width: "100%" }}><Conversation messages={messages} /></div>;
}

export function Pending() {
  return <div style={{ width: "100%" }}><Conversation messages={messages} pending="作る役が返事を書いている" /></div>;
}

export function Status() {
  return (
    <div style={{ width: "100%" }}>
      <Conversation
        messages={[
          { id: "1", from: "self", author: "自分", timeLabel: "09:30", time: "2026-10-13T09:30", body: "予定を 1 日延ばして。", status: "sending" },
          { id: "2", from: "self", author: "自分", timeLabel: "09:31", time: "2026-10-13T09:31", body: "理由も書いておいて。", status: "failed" },
        ]}
      />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <div style={{ width: "100%" }}><Conversation messages={[]} empty={<EmptyState title="まだ話が無い" icon={<Icon name="file" />}>下の欄から話しかけると、ここに並ぶ。</EmptyState>} /></div>, note: "話が 0 件の時は empty を出す" },
    { label: "Loading", node: <div style={{ width: "100%", display: "grid", gap: "var(--space-3)" }} aria-busy="true"><Skeleton size="long" /><Skeleton size="short" /><Skeleton size="long" /></div>, note: "Skeleton で吹き出しの形をまねる。相手が書いている間は pending の 1 行を出し、動かさない" },
    { label: "Error", node: <div style={{ width: "100%" }}><Conversation messages={[{ id: "1", from: "self", author: "自分", body: "理由も書いておいて。", status: "failed" }]} /></div>, note: "送れなかった話は枠の色と「送れなかった」の文字で示す。送り直す操作は使う側が置く" },
    { label: "Disabled", na: "無効状態を持たない。押せる所を持たない" },
    { label: "Focus", na: "押せる所を持たない。吹き出しの中のリンクは、ふつうのリンクとして focus を受ける" },
  ];
}
