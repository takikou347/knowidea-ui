import { Stat, Sparkline, Grid } from "@knowidea/ui";
import type { StateRow } from "./types";

const trend = [12, 14, 13, 18, 17, 22, 24];

export function Basic() {
  return (
    <Grid minItemWidth={220} style={{ width: "100%" }}>
      <Stat label="件数" icon="list" value={1280} unit="件" delta={{ dir: "up", text: "+12%" }} spark={trend} sparkLabel="直近 7 日の件数" asOf="10/13 09:28" />
      <Stat label="待ち時間" icon="clock" value="4.2" unit="分" delta={{ dir: "down", text: "-0.8 分" }} sub="目標 5 分以内" />
    </Grid>
  );
}

export function Spark() {
  return <Sparkline data={trend} label="直近 7 日の推移" />;
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 240px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><Stat label="件数" icon="list" value={null} delta={{ dir: "none" }} /></W>, note: "数が無いときは「不明」と出す" },
    { label: "読み込み", node: <W><Stat label="件数" icon="list" value={null} state="loading" /></W> },
    { label: "失敗", node: <W><Stat label="件数" icon="list" value={null} state="error" error="取れなかった" /></W> },
    { label: "無効", na: "数の表示は押せないので無効を持たない。古い数は stale で印を付ける" },
    { label: "古い数", node: <W><Stat label="件数" icon="list" value={1280} unit="件" asOf="10/12 09:28" stale /></W> },
    { label: "focus", na: "数の表示は押せないので focus を受けない" },
  ];
}
