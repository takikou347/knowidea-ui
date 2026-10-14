import { useState } from "react";
import { Chart, Sparkline, Button, type ChartPoint } from "knowidea-ui";
import type { StateRow } from "./types";

const days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 8, 14 + i);
  const v = i === 16 ? null : 18000 + ((i * 7919) % 9000) + i * 450;
  return {
    key: `d${i}`,
    label: `${d.getMonth() + 1}/${d.getDate()}`,
    detail: `${d.getMonth() + 1} 月 ${d.getDate()} 日`,
    value: v,
    breakdown: v == null ? undefined : [{ label: "A", value: Math.round(v * 0.5) }, { label: "B", value: Math.round(v * 0.3) }, { label: "C", value: Math.round(v * 0.2) }],
  } satisfies ChartPoint;
});

export function Bars() {
  return <div style={{ width: "100%" }}><Chart data={days} unit="件" ariaLabel="日ごとの件数(棒)" reference={{ value: 25000, label: "目標 25,000" }} /></div>;
}

export function Line() {
  return <div style={{ width: "100%" }}><Chart type="line" data={days.slice(-14)} unit="件" ariaLabel="日ごとの件数(線)" breakdownTitle="内訳" /></div>;
}

export function Tiny() {
  return <Sparkline data={[3, 5, 4, 8, 7, 11, 12]} label="直近 7 日の推移" />;
}

export function Toggle() {
  const [kind, setKind] = useState<"ready" | "loading" | "empty">("ready");
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {(["ready", "loading", "empty"] as const).map((k) => <Button key={k} variant={kind === k ? "primary" : "secondary"} onClick={() => setKind(k)}>{k}</Button>)}
      </div>
      <Chart data={days.slice(-7)} state={kind} ariaLabel="状態の切り替え" />
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><Chart data={[]} state="empty" ariaLabel="空" emptyText="記録なし" /></W> },
    { label: "Loading", node: <W><Chart data={[]} state="loading" ariaLabel="読み込み" /></W> },
    { label: "Error", na: "データを取得できなかったときは、グラフを描かず、近くの Alert で理由を示す" },
    { label: "Disabled", na: "グラフは無効状態を持たない。値のない点は「記録なし」と表示する(上のデモの 9/30)" },
    { label: "Focus", node: <W><Chart data={days.slice(-7)} ariaLabel="フォーカス" /></W>, note: "棒に Tab で移り、矢印キーで選択を移動する。Home と End で先頭と末尾に移動する" },
  ];
}
