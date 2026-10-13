import { useState } from "react";
import {
  ActivityList, AppShell, Button, ClaudeCard, DecisionBar, Icon, IconButton, ProposalCard, SendTray, Sparkline, StatCard, StatusMark,
  StopButton, TalkBox, Thinking, ThreadList, TrendChart,
  type ClaudeStatus, type ProposalStatus, type TrayItem, type TrayPhase,
} from "@knowidea/react";
import { activity, claudes, nav, threads, usageDays, usageSpark } from "../data/admin.ts";

const grid = { display: "grid", gap: "var(--space-3)", width: "100%" } as const;
const cards = { display: "grid", gap: "var(--space-3)", width: "100%", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))" } as const;

export function Stats({ forceHover }: { forceHover?: boolean } = {}) {
  return (
    <div style={cards}>
      <StatCard label="今日の使用量" icon="usage" value={412300} unit="トークン" delta={{ dir: "up", text: "+12%" }} spark={usageSpark} sparkLabel="直近 7 日の使用量" asOf="10/13 09:41" />
      <StatCard label="動いている Claude" icon="working" value={3} unit="/ 全体 9" delta={{ dir: "down", text: "-1" }} asOf="10/13 09:41" />
      <StatCard label="オーナー待ち" icon="owner-wait" value={2} unit="件" delta={{ dir: "none" }} asOf="10/13 07:52" />
      <StatCard label="今日の成果" icon="merge" value={4} unit="本" sub="PR 3、作品 1" delta={{ dir: "flat" }} asOf="10/13 09:41" stale staleLabel="古い数(GitHub は 2 時間まで)" />
    </div>
  );
}
export function StatStates({ kind }: { kind: "loading" | "error" | "empty" | "stale" | "focus" }) {
  if (kind === "loading") return <div style={{ width: "min(100%, 260px)" }}><StatCard label="今日の使用量" icon="usage" value={0} state="loading" /></div>;
  if (kind === "error") return <div style={{ width: "min(100%, 260px)" }}><StatCard label="今日の使用量" icon="usage" value={null} state="error" error="セッションの数を取れなかった" asOf="10/12 07:52" /></div>;
  if (kind === "stale") return <div style={{ width: "min(100%, 260px)" }}><StatCard label="今日の成果" icon="merge" value={4} unit="本" delta={{ dir: "up", text: "+1 本" }} asOf="10/13 07:30" stale staleLabel="古い数" /></div>;
  return <div style={{ width: "min(100%, 260px)" }}><StatCard label="今日の使用量" icon="usage" value={null} unit="トークン" delta={{ dir: "none" }} sub="今日はまだ記録が無い" /></div>;
}
export function Sparks() {
  return <Sparkline data={usageSpark} label="直近 7 日の使用量" width={160} height={40} />;
}

export function Trend({ type = "bar", compact }: { type?: "bar" | "line"; compact?: boolean }) {
  return (
    <div style={{ width: "100%" }}>
      <TrendChart data={usageDays} type={type} unit="トークン" ariaLabel="日ごとの使用量(30 日)" height={compact ? 140 : 200} breakdownTitle="部署ごとの内訳" emptyText="記録なし" />
    </div>
  );
}
export function TrendToggle() {
  const [type, setType] = useState<"bar" | "line">("bar");
  return (
    <div style={{ ...grid }}>
      <div style={{ display: "flex", gap: "var(--space-2)" }} role="group" aria-label="グラフの形">
        <Button variant="secondary" aria-pressed={type === "bar"} icon={<Icon name="chart-bar" />} onClick={() => setType("bar")}>棒</Button>
        <Button variant="secondary" aria-pressed={type === "line"} icon={<Icon name="chart-line" />} onClick={() => setType("line")}>折れ線</Button>
      </div>
      <TrendChart data={usageDays} type={type} unit="トークン" ariaLabel="日ごとの使用量(30 日)" breakdownTitle="部署ごとの内訳" />
    </div>
  );
}
export function TrendStates({ kind }: { kind: "loading" | "empty" | "none" | "focus" | "ref" }) {
  if (kind === "loading") return <div style={{ width: "100%" }}><TrendChart data={[]} state="loading" ariaLabel="日ごとの使用量" /></div>;
  if (kind === "empty") return <div style={{ width: "100%" }}><TrendChart data={[]} state="empty" emptyText="この期間の記録は無い" ariaLabel="日ごとの使用量" /></div>;
  if (kind === "none") return <div style={{ width: "100%" }}><TrendChart data={usageDays} selectedKey="2026-09-30" ariaLabel="日ごとの使用量" unit="トークン" height={140} /></div>;
  if (kind === "ref") return <div style={{ width: "100%" }}><TrendChart data={usageDays.slice(-14)} type="line" unit="トークン" height={160} ariaLabel="日ごとの使用量" reference={{ value: 300000, label: "枠の目安 30 万" }} /></div>;
  return <div style={{ width: "100%" }}><TrendChart data={usageDays.slice(-10)} unit="トークン" height={120} ariaLabel="日ごとの使用量" /></div>;
}

const claudeStates: ClaudeStatus[] = ["working", "blocked", "review", "done", "failed"];
export function Statuses({ kind = "claude" }: { kind?: "claude" | "proposal" }) {
  const ps: ProposalStatus[] = ["discussing", "reviewing", "owner", "building", "done", "dropped"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
      {kind === "claude" ? claudeStates.map((s) => <StatusMark key={s} status={s} />) : ps.map((s) => <StatusMark key={s} kind="proposal" status={s} size="lg" />)}
    </div>
  );
}
export function StatusSizes() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
      <StatusMark status="working" /><StatusMark status="working" size="lg" />
      <StatusMark kind="proposal" status="owner" /><StatusMark kind="proposal" status="owner" size="lg" />
    </div>
  );
}

export function Claudes({ n = 6 }: { n?: number }) {
  return <div style={cards}>{claudes.slice(0, n).map((c) => <ClaudeCard key={c.role} {...c} />)}</div>;
}
export function ClaudeStates({ kind }: { kind: "loading" | "error" | "empty" | "disabled" | "hover" | "focus" | "need" }) {
  const base = claudes[1]!;
  const wrap = { width: "min(100%, 300px)" };
  if (kind === "loading") return <div style={wrap}><ClaudeCard {...base} state="loading" /></div>;
  if (kind === "error") return <div style={wrap}><ClaudeCard {...base} state="error" error="セッションの状態を取れなかった" /></div>;
  if (kind === "empty") return <div style={wrap}><ClaudeCard role="ラボ" model="Opus" status="done" lastActive={undefined} usage={null} href="#" /></div>;
  if (kind === "disabled") return <div style={wrap}><ClaudeCard {...base} disabled /></div>;
  if (kind === "need") return <div style={wrap}><ClaudeCard {...claudes[3]!} /></div>;
  return <div style={wrap}><ClaudeCard {...base} className={kind === "hover" ? "is-hover" : "is-focus"} /></div>;
}

export function Proposals() {
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <div style={cards}>
      <ProposalCard title="管理アプリの置き場とログインを決める" department="本社" stage="3 管理アプリ" status="owner" needsOwner="置き場とログインに はい か いいえ" href="#" actions={<DecisionBar target="置き場とログイン" mode="owner" onChange={(s) => setPicked(s.value ? ["x"] : [])} />} />
      <ProposalCard title="基本デザインを各アプリが上書きする" department="デザイン部" stage="1c 部品" status="building" href="#" />
      <ProposalCard kind="project" title="Ruleru の公開サイト" department="コンテンツ部" stage="2 公開" status="reviewing" href="#" />
      <ProposalCard title="ローカル LLM の効果を雲で確かめる" department="本社" stage="ラボ" status="discussing" href="#" />
      <ProposalCard title="見張りの Actions と議論の役" department="本社" stage="2 会社" status="done" href="#" />
      <ProposalCard title="本格的な動画" department="コンテンツ部" stage="保留" status="dropped" href="#" />
      <span className="ki-sr-only" aria-live="polite">{picked.length}</span>
    </div>
  );
}
export function ProposalStates({ kind }: { kind: "loading" | "none" | "focus" | "hover" }) {
  const wrap = { width: "min(100%, 340px)" };
  if (kind === "loading") return <div style={wrap}><ProposalCard title="" department="" stage="" status="owner" state="loading" /></div>;
  if (kind === "none") return <div style={wrap}><ProposalCard title="基本デザインを各アプリが上書きする" department="デザイン部" stage="1c 部品" status="building" href="#" /></div>;
  return <div style={wrap}><ProposalCard className={kind === "hover" ? "is-hover" : "is-focus"} title="管理アプリの置き場とログインを決める" department="本社" stage="3 管理アプリ" status="owner" needsOwner="置き場とログインに はい か いいえ" href="#" /></div>;
}

export function Threads({ state = "ready", picked: init = [] }: { state?: "ready" | "loading" | "empty" | "error"; picked?: string[] }) {
  const [picked, setPicked] = useState<string[]>(init);
  return (
    <div style={{ width: "100%" }}>
      <ThreadList items={threads} selected={picked} onSelectedChange={setPicked} state={state} summary={`${threads.length} 件`} />
    </div>
  );
}
export function ThreadsFixed({ kind }: { kind: "hover" | "readonly" }) {
  return <div style={{ width: "100%" }}><ThreadList items={threads.slice(0, 2)} selected={kind === "hover" ? ["t2"] : []} /></div>;
}

export function Decisions() {
  return (
    <div style={{ display: "grid", gap: "var(--space-5)", width: "100%" }}>
      <DecisionBar target="提案「基本デザインを各アプリが上書きする」" />
      <DecisionBar target="オーナー待ち「置き場とログイン」" mode="owner" />
    </div>
  );
}
export function DecisionStates({ kind }: { kind: "idle" | "approve" | "reject" | "comment" | "disabled" }) {
  if (kind === "idle") return <DecisionBar target="提案" />;
  if (kind === "disabled") return <DecisionBar target="済みの提案" disabled value="approve" />;
  if (kind === "comment") return <DecisionBar target="提案" value="comment" comment="色の比を表にして見せてほしい" />;
  return <DecisionBar target="提案" value={kind} />;
}
export function Talks({ status }: { status?: "idle" | "queued" | "thinking" | "answered" } = {}) {
  return (
    <div style={{ width: "min(100%, 480px)" }}>
      <TalkBox status={status} answer="色の比の表は、トークンのページに足した。ライトとダークで 4.5:1 を超えている。" answerMeta="デザイン部 10/13 09:52" />
    </div>
  );
}

const initialTray: TrayItem[] = [
  { id: "1", kind: "approve", target: "提案「基本デザインを各アプリが上書きする」", state: "queued" },
  { id: "2", kind: "no", target: "オーナー待ち「置き場とログイン」", state: "queued" },
  { id: "3", kind: "comment", target: "develop-docs #130", text: "docs.html を作るフックを外した後の確かめを足してほしい", state: "queued" },
  { id: "4", kind: "talk", target: "ホーム", text: "今日の使用量が昨日より増えた理由を教えて", state: "queued" },
];
export function Tray({ start = "idle", defaultOpen = true, items = initialTray }: { start?: TrayPhase; defaultOpen?: boolean; items?: TrayItem[] }) {
  const [list, setList] = useState<TrayItem[]>(items);
  const [phase, setPhase] = useState<TrayPhase>(start);
  const send = () => {
    setPhase("sending");
    setList((l) => l.map((i) => (i.state === "queued" || i.state === "failed" ? { ...i, state: "sending" } : i)));
    setTimeout(() => { setPhase("received"); setList((l) => l.map((i) => (i.state === "sending" ? { ...i, state: "received" } : i))); }, 900);
    setTimeout(() => setList((l) => l.map((i) => (i.state === "received" ? { ...i, state: i.kind === "talk" ? "thinking" : "done" } : i))), 1900);
    setTimeout(() => { setPhase("idle"); setList((l) => l.map((i) => (i.state === "thinking" ? { ...i, state: "done" } : i))); }, 3200);
  };
  return <div style={{ width: "100%" }}><SendTray items={list} phase={phase} defaultOpen={defaultOpen} onRemove={(id) => setList((l) => l.filter((i) => i.id !== id))} onSend={send} /></div>;
}
export function TrayFixed({ kind }: { kind: "empty" | "sending" | "failed" | "closed" | "done" }) {
  const q = initialTray.slice(0, 2);
  if (kind === "empty") return <div style={{ width: "100%" }}><SendTray items={[]} defaultOpen /></div>;
  if (kind === "closed") return <div style={{ width: "100%" }}><SendTray items={q} /></div>;
  if (kind === "sending") return <div style={{ width: "100%" }}><SendTray items={q.map((i) => ({ ...i, state: "sending" as const }))} phase="sending" defaultOpen /></div>;
  if (kind === "done") return <div style={{ width: "100%" }}><SendTray items={[{ ...q[0]!, state: "done" }, { ...initialTray[3]!, state: "thinking" }]} phase="received" defaultOpen /></div>;
  return <div style={{ width: "100%" }}><SendTray items={q.map((i) => ({ ...i, state: "failed" as const }))} phase="failed" defaultOpen /></div>;
}
export function ThinkingMark() { return <Thinking />; }

export function Activities({ state = "ready" }: { state?: "ready" | "loading" | "empty" | "error" }) {
  return <div style={{ width: "min(100%, 560px)" }}><ActivityList items={activity} state={state} /></div>;
}

export function Stops() {
  const [s, setS] = useState<"idle" | "requested" | "stopped" | "failed">("idle");
  const routines = ["制作", "レビュー", "経営会議"];
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
        <strong>制作</strong>
        <StopButton name="制作" state={s} onConfirm={() => { setS("requested"); setTimeout(() => setS("stopped"), 1400); }} onResume={() => setS("idle")} fallbackText="company/control.json の routines.production を stopped にする依頼" />
      </div>
      <p className="muted" style={{ margin: 0 }}>押す → 確かめる画面 → 「止める依頼を出す」 → 依頼中 → 止めた(見本では 1.4 秒後)。</p>
    </div>
  );
}
export function StopFixed({ state }: { state: "idle" | "requested" | "stopped" | "failed" | "disabled" }) {
  return <StopButton name="制作" state={state === "disabled" ? "idle" : state} disabled={state === "disabled"} onResume={() => {}} onConfirm={() => {}} fallbackText="company/control.json の routines.production を stopped にする依頼" />;
}

export function Shell({ width, current = "home", frame = 560, tab }: { width: number; current?: string; frame?: number; tab?: boolean }) {
  return (
    <div style={{ width, maxWidth: "100%" }}>
      <AppShell nav={nav} current={current} title="ホーム" asOf="10/13 09:41" frame={frame}
        actions={<><IconButton variant="quiet" label="更新" icon={<Icon name="refresh" />} /><IconButton variant="quiet" label="通知" icon={<Icon name="notification" />} /></>}>
        <div className="ki-panel"><p style={{ margin: 0 }}>{tab ? "幅 390px。下にタブバー。" : "幅 1024px。左にサイドの目次。"}</p></div>
      </AppShell>
    </div>
  );
}
