import { useState } from "react";
import { TimePicker } from "knowidea-ui";
import type { StateRow } from "./types";

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 320px)" }}>{children}</div>;

export function Basic() {
  const [v, setV] = useState<string | null>("09:00");
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "min(100%, 320px)" }}>
      <TimePicker label="知らせる時刻" hint="毎日この時刻に知らせる" value={v} onValueChange={setV} />
      <p style={{ margin: 0, color: "var(--color-text-muted)" }}>値: {v ?? "なし"}</p>
    </div>
  );
}

export function Limits() {
  return (
    <W>
      <TimePicker label="受け付けの時刻" hint="9:00 から 18:00 まで。30 分ごと" step={30} min="09:00" max="18:00" name="open_at" required />
    </W>
  );
}

export function Step() {
  return (
    <W>
      <TimePicker label="開始" hint="5 分ごと" step={5} defaultValue="13:05" />
    </W>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><TimePicker label="未選択" /></W>, note: "「時刻を選ぶ」を薄い字で出す" },
    { label: "Loading", na: "時刻は手元で作るため、読み込み中を持たない" },
    { label: "Error", node: <W><TimePicker label="終わり" defaultValue="08:00" error="始まりより後の時刻を選ぶ" /></W>, note: "欄の枠が誤りの色になり、理由を欄の下に出す" },
    { label: "Disabled", node: <W><TimePicker label="無効" defaultValue="09:00" disabled /></W> },
    { label: "Focus", text: "欄に focus すると、Select と同じ 2px のリングが出る。開くと選んだ時刻の行に focus が移る" },
  ];
}
