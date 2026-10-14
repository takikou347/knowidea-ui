import { useState } from "react";
import { DatePicker, Field } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  const [v, setV] = useState<Date | null>(null);
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "min(100%, 320px)" }}>
      <Field label="締め切り"><DatePicker aria-label="締め切り" value={v} onValueChange={setV} clearable /></Field>
      <p style={{ margin: 0, color: "var(--color-text-muted)" }}>値: {v ? v.toLocaleDateString("ja-JP") : "なし"}</p>
    </div>
  );
}

export function Limits() {
  const t = new Date();
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Field label="予約する日" hint="今日から 14 日後まで。月曜始まり"><DatePicker aria-label="予約する日" min={t} max={new Date(t.getFullYear(), t.getMonth(), t.getDate() + 14)} weekStartsOn={1} name="date" /></Field>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <DatePicker aria-label="未選択" />, note: "「日付を選ぶ」を薄い字で出す" },
    { label: "Loading", na: "日付は手元で選ぶため、読み込み中を持たない" },
    { label: "Error", node: <DatePicker aria-label="エラー" invalid defaultValue={new Date(2026, 0, 5)} />, note: "Field の error と一緒に使い、理由を文で出す" },
    { label: "Disabled", node: <DatePicker aria-label="無効" disabled defaultValue={new Date(2026, 0, 5)} /> },
    { label: "Focus", node: <DatePicker aria-label="フォーカス" />, note: "Select と同じ 2px のリング。開くと、選んだ日(無ければ今日)に focus が移る" },
  ];
}
