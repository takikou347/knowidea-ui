// 管理アプリの見本の数。形は会社の物(使用量のトークン、PR、routine)。数は見本で、実際の数ではない。
import type { ActivityItem, ClaudeCardProps, NavItem, ThreadItem, TrendPoint } from "@knowidea/react";

export const departments = ["コンテンツ部", "本社", "本社(レビュー部)", "開発部", "デザイン部", "スレッド"] as const;

// 30 日(9/14〜10/13)。決定 0002 の部署で内訳を出す。9/30 だけ数の無い日。
function rng(seed: number) { let s = seed; return () => (s = (s * 48271) % 2147483647) / 2147483647; }
const r = rng(20261013);
const wd = ["日", "月", "火", "水", "木", "金", "土"];
export const usageDays: TrendPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 8, 14 + i));
  const m = d.getUTCMonth() + 1, day = d.getUTCDate();
  const key = `2026-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const base = 70000 + i * 3500 + Math.round(r() * 60000);
  const none = key === "2026-09-30";
  const shares = departments.map(() => 0.05 + r());
  const sum = shares.reduce((a, b) => a + b, 0);
  const parts = departments.map((label, k) => ({ label, value: Math.round((base * shares[k]!) / sum) }));
  const total = parts.reduce((a, b) => a + b.value, 0);
  return {
    key, label: `${m}/${day}`, detail: `${m} 月 ${day} 日(${wd[d.getUTCDay()]})`,
    value: none ? null : total, breakdown: none ? undefined : parts,
  };
});
export const usageSpark = usageDays.slice(-7).map((d) => d.value ?? 0);

export const claudes: ClaudeCardProps[] = [
  { role: "制作", model: "Sonnet", status: "done", doing: "今日の回を公開した", lastActive: "03:24", usage: 182400, href: "#" },
  { role: "レビュー", model: "Opus", status: "working", doing: "ruleru #61 の判定を書いている", lastActive: "09:42", usage: 96250, href: "#" },
  { role: "デザイン部のスレッド", model: "Sonnet", status: "working", doing: "管理アプリの部品の CSS を書いている", lastActive: "09:47", usage: 41800, href: "#" },
  { role: "経営会議", model: "Opus", status: "blocked", doing: "管理アプリの置き場の決めを待っている", lastActive: "08:10", usage: 12350, needsAction: "置き場とログインに はい か いいえ", href: "#" },
  { role: "ネタ探し", model: "Haiku", status: "review", doing: "種を 3 件 inbox に置いた", lastActive: "08:00", usage: 7020, href: "#" },
  { role: "週報", model: "Sonnet", status: "failed", doing: "PR を作れなかった", lastActive: "昨日 21:05", usage: 33100, href: "#" },
];

export const threads: ThreadItem[] = [
  { id: "t1", title: "管理アプリの部品を作る(デザイン部)", status: "working", lastActive: "09:47", pr: { number: 3, state: "open", ci: "running", review: "none", href: "#" }, href: "#" },
  { id: "t2", title: "ruleru #61 守りの網と憲法の参照先", status: "review", lastActive: "07:59", waiting: "オーナーのマージ", waitingOwner: true, pr: { number: 61, state: "queued", ci: "pass", review: "ok", href: "#" }, href: "#" },
  { id: "t3", title: "トークンとコンテキストの点検", status: "done", lastActive: "昨日 18:38", pr: { number: 113, state: "merged", ci: "pass", review: "ok", href: "#" }, href: "#" },
  { id: "t4", title: "管理アプリの置き場とログイン", status: "blocked", lastActive: "08:10", waiting: "はい か いいえ", waitingOwner: true, href: "#" },
  { id: "t5", title: "週報の PR を作る", status: "failed", lastActive: "昨日 21:05", waiting: "権限の確認", pr: { number: 142, state: "draft", ci: "fail", review: "ng", href: "#" }, href: "#" },
  { id: "t6", title: "ネタ探しの種の整理", status: "working", lastActive: "09:30", pr: { number: 130, state: "closed", ci: "none", review: "conditional", href: "#" }, href: "#" },
];

export const activity: ActivityItem[] = [
  { id: "a1", time: "10/13 09:28", role: "レビュー部", kind: "merge", text: "develop-docs #130 をマージした", href: "#" },
  { id: "a2", time: "10/13 08:41", role: "コンテンツ作成部", kind: "publish", text: "今日の回を公開した", href: "#" },
  { id: "a3", time: "10/13 08:12", role: "本社", kind: "record", text: "経営会議の記録を書いた", href: "#" },
  { id: "a4", time: "10/13 07:59", role: "オーナー", kind: "merge", text: "ruleru #61 をマージした", href: "#" },
  { id: "a5", time: "10/13 07:10", role: "本社", kind: "stop", text: "「ネタ探し」を止めた", href: "#" },
  { id: "a6", time: "10/13 03:24", role: "コンテンツ作成部", kind: "record", text: "制作の記録を書いた", href: "#" },
];

export const nav: NavItem[] = [
  { id: "home", label: "ホーム", icon: "home", href: "/screens/home/" },
  { id: "claude", label: "Claude", icon: "user", href: "#claude" },
  { id: "proposals", label: "提案", icon: "proposal", href: "#proposals", count: 2 },
  { id: "threads", label: "スレッドと PR", icon: "thread", href: "/screens/threads/" },
  { id: "settings", label: "設定", icon: "settings", href: "#settings" },
];
