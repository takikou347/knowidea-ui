import { useState } from "react";
import {
  ActivityList, AppShell, Banner, Button, ClaudeCard, Icon, IconButton, Input, SendTray, StatCard, TalkBox, ThreadList, TrendChart,
  type TrayItem, type TrayPhase,
} from "@knowidea/react";
import { activity, claudes, nav, threads, usageDays, usageSpark } from "../data/admin.ts";

const top = (
  <>
    <IconButton variant="quiet" label="数を更新する" icon={<Icon name="refresh" />} />
    <IconButton variant="quiet" label="通知" icon={<Icon name="notification" />} />
  </>
);

function Section({ title, note, children, action }: { title: string; note?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="ki-section">
      <div className="ki-section__head"><h2 className="ki-section__title">{title}</h2>{action ?? (note ? <p className="ki-section__note">{note}</p> : null)}</div>
      {children}
    </section>
  );
}

export function HomeScreen({ width, height }: { width: number; height: number }) {
  const [type, setType] = useState<"bar" | "line">("bar");
  return (
    <div style={{ width, maxWidth: "100%" }}>
      <AppShell nav={nav} current="home" title="ホーム" asOf="10/13 09:41" frame={height} actions={top}>
        <Banner tone="warn" title="GitHub の数が古い">10/13 07:30 の数を出している。2 時間より古い。</Banner>
        <p className="muted" style={{ margin: 0 }}>見本の数</p>
        <div className="ki-stats">
          <StatCard label="今日の使用量" icon="usage" value={412300} unit="トークン" delta={{ dir: "up", text: "+12%" }} spark={usageSpark} sparkLabel="直近 7 日の使用量" asOf="10/13 09:41" />
          <StatCard label="動いている Claude" icon="working" value={3} unit="/ 全体 9" delta={{ dir: "down", text: "-1" }} asOf="10/13 09:41" />
          <StatCard label="オーナー待ち" icon="owner-wait" value={2} unit="件" delta={{ dir: "none" }} asOf="10/13 07:52" />
          <StatCard label="今日の成果" icon="merge" value={4} unit="本" sub="PR 3、作品 1" delta={{ dir: "up", text: "+1 本" }} asOf="10/13 07:30" stale staleLabel="古い数" />
        </div>
        <div className="ki-screen" data-cols="2">
          <div className="ki-screen__col">
            <Section title="使用量の推移" note="見本の数" action={
              <div className="ki-bar" role="group" aria-label="グラフの形">
                <Button variant="secondary" aria-pressed={type === "bar"} icon={<Icon name="chart-bar" />} onClick={() => setType("bar")}>棒</Button>
                <Button variant="secondary" aria-pressed={type === "line"} icon={<Icon name="chart-line" />} onClick={() => setType("line")}>折れ線</Button>
              </div>
            }>
              <div className="ki-panel"><TrendChart data={usageDays} type={type} unit="トークン" ariaLabel="日ごとの使用量(30 日)" breakdownTitle="部署ごとの内訳" /></div>
            </Section>
            <Section title="Claude" note="見本の数">
              <div className="ki-claude-grid">{claudes.map((c) => <ClaudeCard key={c.role} {...c} />)}</div>
            </Section>
          </div>
          <div className="ki-screen__col">
            <Section title="最近の動き"><div className="ki-panel"><ActivityList items={activity} /></div></Section>
            <Section title="話しかける"><div className="ki-panel"><TalkBox /></div></Section>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

export function ThreadsScreen({ width, height }: { width: number; height: number }) {
  const [picked, setPicked] = useState<string[]>(["t2", "t4"]);
  const [tray, setTray] = useState<TrayItem[]>([]);
  const [phase, setPhase] = useState<TrayPhase>("idle");
  const [comment, setComment] = useState("");
  const title = (id: string) => threads.find((t) => t.id === id)!.title;
  const stack = (kind: TrayItem["kind"], text?: string) => {
    setTray((l) => [...l, ...picked.filter((id) => !l.some((i) => i.id === `${id}-${kind}`)).map((id) => ({ id: `${id}-${kind}`, kind, target: title(id), text, state: "queued" as const }))]);
    setPicked([]);
  };
  const send = () => {
    setPhase("sending");
    setTray((l) => l.map((i) => (i.state === "queued" || i.state === "failed" ? { ...i, state: "sending" } : i)));
    setTimeout(() => { setPhase("received"); setTray((l) => l.map((i) => (i.state === "sending" ? { ...i, state: "received" } : i))); }, 900);
    setTimeout(() => { setPhase("idle"); setTray((l) => l.map((i) => (i.state === "received" ? { ...i, state: i.kind === "comment" ? "thinking" : "done" } : i))); }, 2000);
  };
  const n = picked.length;
  return (
    <div style={{ width, maxWidth: "100%" }}>
      <AppShell nav={nav} current="threads" title="スレッドと PR" asOf="10/13 09:41" frame={height} actions={top}>
        <Section title="スレッド" note="見本の数。選んでまとめて送る">
          <div className="ki-bar" role="group" aria-label="選んだ行への返事">
            <p className="ki-bar__label" role="status">{n} 件を選んでいる</p>
            <Button variant="secondary" disabled={n === 0} icon={<Icon name="approve" />} onClick={() => stack("approve")}>承認</Button>
            <Button variant="secondary" disabled={n === 0} icon={<Icon name="reject" />} onClick={() => stack("reject")}>否認</Button>
          </div>
          <div className="ki-bar">
            <div style={{ flex: "1 1 220px", minWidth: 0 }}><Input aria-label="選んだ行へのコメント" placeholder="選んだ行に同じコメントを付ける" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
            <Button variant="secondary" disabled={n === 0 || comment.trim() === ""} icon={<Icon name="comment" />} onClick={() => { stack("comment", comment.trim()); setComment(""); }}>コメント</Button>
          </div>
          <ThreadList items={threads} selected={picked} onSelectedChange={setPicked} summary={`${threads.length} 件`} />
        </Section>
        <div className="ki-dock">
          <SendTray items={tray} phase={phase} onRemove={(id) => setTray((l) => l.filter((i) => i.id !== id))} onSend={send} defaultOpen />
        </div>
      </AppShell>
    </div>
  );
}
