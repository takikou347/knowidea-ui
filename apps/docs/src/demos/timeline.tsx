import { Timeline, type TimelineEntry } from "@knowidea/ui";
import type { StateRow } from "./types";

const items: TimelineEntry[] = [
  { id: "1", time: "10/13 09:28", title: "公開", text: "新しい版を公開した", icon: "broadcast", tone: "success", href: "#1", meta: "公開の担当" },
  { id: "2", time: "10/13 08:10", title: "更新", text: "設定を 3 件変えた", icon: "edit", meta: "設定の担当" },
  { id: "3", time: "10/12 18:02", title: "停止", text: "検査を止めた", icon: "stopped", tone: "error" },
];

export function Basic() {
  return <div style={{ width: "100%" }}><Timeline items={items} /></div>;
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><Timeline items={[]} state="empty" emptyText="まだ出来事は無い" /></W> },
    { label: "読み込み", node: <W><Timeline items={[]} state="loading" /></W> },
    { label: "失敗", node: <W><Timeline items={[]} state="error" /></W> },
    { label: "無効", na: "出来事の記録は書き換えない。無効の行を持たない" },
    { label: "focus", na: "リンクのある行は、リンクに focus が入る(輪は 2px)。上のデモを Tab で確かめる" },
  ];
}
