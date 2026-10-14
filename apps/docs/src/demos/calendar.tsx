import { useState } from "react";
import { Calendar } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  const t = new Date();
  const day = (n: number) => new Date(t.getFullYear(), t.getMonth(), n);
  const [v, setV] = useState<Date | null>(day(Math.min(t.getDate() + 2, 28)));
  // 予定のある日(サンプル)
  const marked = new Set([3, 8, 14, 15, 22].map((n) => day(n).toDateString()));
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Calendar value={v} onValueChange={setV} isDateMarked={(d) => marked.has(d.toDateString())} />
      <p style={{ margin: 0, color: "var(--color-text-muted)" }}>選んだ日: {v ? v.toLocaleDateString("ja-JP") : "なし"}(点は予定のある日のサンプル)</p>
    </div>
  );
}

export function Limits() {
  const t = new Date();
  const min = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  const max = new Date(t.getFullYear(), t.getMonth() + 1, t.getDate());
  return <Calendar weekStartsOn={1} min={min} max={max} isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} label="受け取る日" />;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Calendar />, note: "未選択。今日に枠が付き、Tab で今日に移る" },
    { label: "Loading", na: "日付は手元で作るため、読み込み中を持たない。予定の点だけが後から付く" },
    { label: "Error", na: "エラー状態を持たない。選べない日は Disabled にする" },
    { label: "Disabled", text: "min、max、isDateDisabled で選べない日は、薄い字と取り消し線になり、押しても選ばれない。上の Limits の例" },
    { label: "Focus", text: "日に Tab で移ると、2px のリングが出る。矢印キーで日、PageUp と PageDown で月、Shift と一緒に押すと年を移る" },
  ];
}
