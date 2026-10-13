import { Timeline, type TimelineEntry } from "@knowidea/ui";
import type { StateRow } from "./types";

const items: TimelineEntry[] = [
  { id: "1", time: "10/13 09:28", title: "公開", text: "新しいバージョンを公開した", icon: "broadcast", tone: "success", href: "#1", meta: "公開担当" },
  { id: "2", time: "10/13 08:10", title: "更新", text: "設定を 3 件変更した", icon: "edit", meta: "設定担当" },
  { id: "3", time: "10/12 18:02", title: "停止", text: "検査を停止した", icon: "stopped", tone: "error" },
];

export function Basic() {
  return <div style={{ width: "100%" }}><Timeline items={items} /></div>;
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><Timeline items={[]} state="empty" emptyText="まだイベントはない" /></W> },
    { label: "Loading", node: <W><Timeline items={[]} state="loading" /></W> },
    { label: "Error", node: <W><Timeline items={[]} state="error" /></W> },
    { label: "Disabled", na: "イベントの履歴は書き換えない。無効の行を持たない" },
    { label: "Focus", text: "リンクのある行では、リンクにフォーカスが移る(リングは 2px)。上のデモを Tab で確認する" },
  ];
}
