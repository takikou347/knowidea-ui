import { useState } from "react";
import { Alert, Button, Card, Chart, Grid, IconButton, Icon, List, SelectionBar, Stat, Status, Table, Timeline, type ChartPoint, type Column, type ListEntry, type TimelineEntry } from "@knowidea/ui";
import Shell from "./Shell";

// 数値はすべてサンプル。
const days: ChartPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 9, i);
  const v = 1000 + ((i * 7919) % 700) + i * 40;
  return {
    key: `d${i}`, label: `${d.getMonth() + 1}/${d.getDate()}`, detail: `${d.getMonth() + 1} 月 ${d.getDate()} 日`, value: v,
    breakdown: [{ label: "A", value: Math.round(v * 0.5) }, { label: "B", value: Math.round(v * 0.3) }, { label: "C", value: Math.round(v * 0.2) }],
  };
});
const trend = [12, 14, 13, 18, 17, 22, 24];
const events: TimelineEntry[] = [
  { id: "1", time: "10/13 09:28", title: "公開", text: "新しいバージョンを公開した", icon: "broadcast", tone: "success", href: "#e1" },
  { id: "2", time: "10/13 08:10", title: "更新", text: "設定を 3 件変更した", icon: "edit", href: "#e2" },
  { id: "3", time: "10/12 18:02", title: "停止", text: "検査を停止した", icon: "stopped", tone: "error", href: "#e3" },
];
const waiting: ListEntry[] = [
  { id: "w1", title: "デザインの見直し", href: "#w1", meta: <><Status kind="paused" label="待機中" /><span>10/13 09:12</span></> },
  { id: "w2", title: "アイコンの整理", href: "#w2", meta: <><Status kind="paused" label="待機中" /><span>10/12 18:02</span></> },
];

type Row = { id: string; name: string; status: string; runs: number };
const rows: Row[] = [
  { id: "a", name: "項目 A", status: "完了", runs: 24 },
  { id: "b", name: "項目 B", status: "待機中", runs: 7 },
  { id: "c", name: "項目 C", status: "停止", runs: 3 },
  { id: "d", name: "項目 D", status: "完了", runs: 12 },
];
const columns: Column<Row>[] = [
  { key: "name", header: "名前" },
  { key: "status", header: "状態" },
  { key: "runs", header: "回数", numeric: true },
];

export default function Dashboard() {
  const [sel, setSel] = useState<string[]>([]);
  const [archived, setArchived] = useState<string[]>([]);
  const shown = rows.filter((r) => !archived.includes(r.id));
  return (
    <Shell
      title="ダッシュボード"
      current="home"
      meta={<><span>更新</span><time>10/13 09:28</time></>}
      actions={<IconButton label="更新" icon={<Icon name="refresh" />} />}
    >
      <Alert tone="info">この画面の数値はすべてサンプルであり、実際の値ではない。</Alert>
      <Grid minItemWidth={170}>
        <Stat label="件数" icon="list" value={1280} unit="件" delta={{ dir: "up", text: "+12%" }} spark={trend} sparkLabel="直近 7 日の件数(サンプル値)" />
        <Stat label="待ち時間" icon="clock" value="4.2" unit="分" delta={{ dir: "down", text: "-0.8 分" }} />
        <Stat label="完了" icon="check" value="96.5" unit="%" delta={{ dir: "up", text: "+0.4" }} />
        <Stat label="失敗" icon="error" value={7} unit="件" delta={{ dir: "none" }} />
      </Grid>
      <Card title="日ごとの件数(サンプル値)" headingLevel={3}>
        <Chart data={days} unit="件" ariaLabel="日ごとの件数(サンプル値)" breakdownTitle="内訳" />
      </Card>
      <Grid minItemWidth={260}>
        <Card title="最近のイベント" headingLevel={3}><Timeline items={events} /></Card>
        <Card title="確認待ち" headingLevel={3}><List label="確認待ちの項目" items={waiting} /></Card>
      </Grid>
      <Card title="項目の一覧(サンプル値)" headingLevel={3}>
        <Table label="項目の一覧" columns={columns} rows={shown} rowKey={(r) => r.id} selectable selected={sel} onSelectedChange={setSel} rowLabel={(r) => r.name}
          emptyTitle="項目がない" emptyText="アーカイブしていない項目は、ここに表示される。" />
        <SelectionBar
          count={sel.length}
          actions={<Button variant="secondary" disabled={sel.length === 0} onClick={() => { setArchived([...archived, ...sel]); setSel([]); }}>アーカイブする</Button>}
          onClear={() => setSel([])}
        />
        {archived.length > 0 && <Button variant="quiet" onClick={() => setArchived([])}>元に戻す</Button>}
      </Card>
    </Shell>
  );
}
