import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Chart, Chip, CodeBlock, Select, Stat, Switch, Table, Tabs, ThemeProvider, type ChartPoint, type Column, type SortState } from "knowidea-ui";
import { demos } from "../demos/index";

/**
 * トップの動く見本。主の色、角丸、密度、ダークを切り替えると、下の画面と部品の格子が同じ場で変わる。
 * 数値はすべてサンプル。部品は knowidea-ui の本物で、デモのページと同じものを使う。
 */
interface Cell { slug: string; fn: string; name: string; desc: string; href: string; react: string; html: string }
interface Props { cells: Cell[] }

const PRESETS = [
  { id: "#016C6C", label: "Brand" },
  { id: "#2358B0", label: "Blue" },
  { id: "#6B3FA0", label: "Purple" },
  { id: "#B3261E", label: "Red" },
  { id: "#9A4A00", label: "Brown" },
];
const RADII = [{ v: 0, label: "None" }, { v: 4, label: "Small" }, { v: 8, label: "Medium" }, { v: 12, label: "Large" }];
const RANGES = [{ value: "7", label: "Last 7 days" }, { value: "14", label: "Last 14 days" }, { value: "30", label: "Last 30 days" }];

const all: ChartPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 8, 14 + i);
  const v = 1000 + ((i * 7919) % 700) + i * 40;
  return {
    key: `d${i}`, label: `${d.getMonth() + 1}/${d.getDate()}`, detail: `${d.getMonth() + 1} 月 ${d.getDate()} 日`, value: v,
    breakdown: [{ label: "A", value: Math.round(v * 0.5) }, { label: "B", value: Math.round(v * 0.3) }, { label: "C", value: Math.round(v * 0.2) }],
  };
});

type Row = { id: string; name: string; status: "完了" | "待機中" | "停止"; runs: number };
const rowsData: Row[] = [
  { id: "a", name: "デザインの見直し", status: "完了", runs: 24 },
  { id: "b", name: "アイコンの整理", status: "待機中", runs: 7 },
  { id: "c", name: "検査の停止", status: "停止", runs: 3 },
  { id: "d", name: "トークンの更新", status: "完了", runs: 12 },
];
const tone = { 完了: "success", 待機中: "info", 停止: "error" } as const;
const columns: Column<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", render: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
  { key: "runs", header: "Runs", numeric: true, sortable: true },
];

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t === "dark" || (t !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
};

function Dashboard() {
  const [range, setRange] = useState("14");
  const [sort, setSort] = useState<SortState | null>({ key: "runs", direction: "descending" });
  const data = all.slice(-Number(range));
  const total = data.reduce((s, p) => s + (p.value ?? 0), 0);
  const peak = Math.max(...data.map((p) => p.value ?? 0));
  const avg = Math.round(total / data.length);
  const rows = [...rowsData];
  if (sort) rows.sort((a, b) => {
    const x = a[sort.key as keyof Row], y = b[sort.key as keyof Row];
    const c = typeof x === "number" ? x - (y as number) : String(x).localeCompare(String(y));
    return sort.direction === "ascending" ? c : -c;
  });
  return (
    <div className="hl-app">
      <div className="hl-app-head">
        <div>
          <p className="hl-app-title">Usage</p>
          <p className="hl-app-sub">数値はすべてサンプル</p>
        </div>
        <div className="hl-app-actions">
          <div className="hl-select"><Select aria-label="Range" options={RANGES} value={range} onValueChange={(v) => v && setRange(v)} /></div>
          <Button variant="secondary">Share</Button>
          <Button>Export</Button>
        </div>
      </div>
      <div className="hl-stats">
        <Stat label="Total" icon="list" value={total} unit="件" delta={{ dir: "up", text: "+12%" }} />
        <Stat label="Daily average" icon="chart-line" value={avg} unit="件" delta={{ dir: "down", text: "-0.8%" }} />
        <Stat label="Peak" icon="trend-up" value={peak} unit="件" delta={{ dir: "none" }} />
      </div>
      <Tabs label="Usage views" items={[
        { value: "chart", label: "Daily", content: <Chart data={data} unit="件" height={180} ariaLabel="日ごとの件数(サンプル値)" breakdownTitle="内訳" /> },
        { value: "table", label: "Recent", content: (
          <Table label="最近の項目" columns={columns} rows={rows} rowKey={(r) => r.id} sort={sort} onSortChange={setSort} />
        ) },
      ]} />
    </div>
  );
}

export default function HomeLive({ cells }: Props) {
  const [primary, setPrimary] = useState("#016C6C");
  const [radius, setRadius] = useState(8);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => setDark(isDark());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    return () => { mo.disconnect(); mq.removeEventListener("change", sync); };
  }, []);

  const toggleDark = (on: boolean) => {
    document.documentElement.dataset.theme = on ? "dark" : "light";
    try { localStorage.setItem("ki-docs-theme", on ? "dark" : "light"); } catch {}
  };
  const options = useMemo(() => ({ primary, radius, density }), [primary, radius, density]);
  const code = `<ThemeProvider theme={{ primary: "${primary}", radius: ${radius}, density: "${density}" }}>\n  <App />\n</ThemeProvider>`;

  return (
    <div className="hl">
      <div className="hl-controls" id="hl-controls" role="group" aria-label="Theme controls">
        <div className="hl-ctl">
          <span className="hl-ctl-name" id="hl-primary">Primary</span>
          <div className="hl-row" role="group" aria-labelledby="hl-primary">
            {PRESETS.map((p) => <Chip key={p.id} label={p.label} selected={primary === p.id} onClick={() => setPrimary(p.id)} />)}
          </div>
        </div>
        <div className="hl-ctl">
          <span className="hl-ctl-name" id="hl-radius">Radius</span>
          <div className="hl-row" role="group" aria-labelledby="hl-radius">
            {RADII.map((r) => <Chip key={r.v} label={r.label} selected={radius === r.v} onClick={() => setRadius(r.v)} />)}
          </div>
        </div>
        <div className="hl-ctl">
          <span className="hl-ctl-name" id="hl-density">Density</span>
          <div className="hl-row" role="group" aria-labelledby="hl-density">
            <Chip label="Compact" selected={density === "compact"} onClick={() => setDensity("compact")} />
            <Chip label="Comfortable" selected={density === "comfortable"} onClick={() => setDensity("comfortable")} />
          </div>
        </div>
        <div className="hl-ctl">
          <Switch label="Dark" checked={dark} onCheckedChange={toggleDark} />
        </div>
      </div>

      <ThemeProvider theme={options} onWarn={() => {}}>
        <div className="hl-stage" id="hl-stage">
          <Dashboard />
        </div>
        <ul className="cp-grid" aria-label="Live components">
          {cells.map((c) => {
            const Demo = (demos as Record<string, Record<string, unknown>>)[c.slug]?.[c.fn] as (() => React.JSX.Element) | undefined;
            return (
              <li className="cp" key={c.slug}>
                <div className="cp-view">
                  <div className="cp-stage"><div className="cp-fit" data-slug={c.slug}>{Demo ? <Demo /> : null}</div></div>
                  <div className="cp-bar">
                    <button type="button" className="ki-button cp-codebtn" data-variant="quiet" data-cp-code={c.name} data-cp-react={c.react} data-cp-html={c.html} aria-label={`Code for ${c.name}`}>Code</button>
                  </div>
                </div>
                <div className="cp-text">
                  <h3 className="cp-name"><a className="cp-link" href={c.href}>{c.name}</a></h3>
                  <p className="cp-desc">{c.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </ThemeProvider>
      <CodeBlock code={code} language="tsx" label="ThemeProvider code" />
    </div>
  );
}
