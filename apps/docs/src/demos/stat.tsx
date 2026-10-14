import { Stat, Sparkline, Grid } from "knowidea-ui";
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
    { label: "Empty", node: <W><Stat label="件数" icon="list" value={null} delta={{ dir: "none" }} /></W>, note: "数値がないときは「不明」と表示する" },
    { label: "Loading", node: <W><Stat label="件数" icon="list" value={null} state="loading" /></W> },
    { label: "Error", node: <W><Stat label="件数" icon="list" value={null} state="error" error="取得できなかった" /></W> },
    { label: "Disabled", na: "Stat は操作できないため、無効状態を持たない。古い数値には stale でマークを付ける" },
    { label: "Stale", node: <W><Stat label="件数" icon="list" value={1280} unit="件" asOf="10/12 09:28" stale /></W> },
    { label: "Focus", na: "Stat は操作できないため、フォーカスを受けない" },
  ];
}
