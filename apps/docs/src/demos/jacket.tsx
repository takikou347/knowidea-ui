import { Jacket } from "knowidea-ui";
import type { StateRow } from "./types";

const tiles = { width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "var(--space-3)" } as const;

export function Basic() {
  return (
    <div style={{ width: "100%", maxWidth: 280 }}>
      <Jacket title={"夜更けの\n台所ラジオ"} meta="第 12 回 しょうがと鶏の話" />
    </div>
  );
}

export function Tones() {
  return (
    <div style={tiles}>
      <Jacket title="歴史の寄り道" meta="primary" />
      <Jacket title="数字で読む今週" tone="ink" meta="ink" />
      <Jacket title="Weekend Notes" tone="paper" meta="paper" />
      <Jacket title="町の音" color="oklch(0.34 0.05 230)" textColor="#fff" meta="color と textColor" />
    </div>
  );
}

export function Layouts() {
  return (
    <div style={tiles}>
      <Jacket title="雨の日の本棚" orientation="vertical" meta="vertical" />
      <Jacket title={"朝の\n5 分"} align="end" meta="align end" />
      <Jacket title="長い題の時は字を小さくして、読める大きさで組む" ratio="portrait" meta="portrait" />
    </div>
  );
}

export function WithTitle() {
  return (
    <div style={{ width: "100%", display: "grid", gridTemplateColumns: "72px 1fr", gap: "var(--space-3)", alignItems: "center" }}>
      <Jacket title="歴史の寄り道" decorative />
      <p style={{ margin: 0 }}><strong style={{ display: "block" }}>歴史の寄り道</strong><span style={{ color: "var(--color-text-muted)" }}>第 8 回 港の地図</span></p>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "題の無いジャケットは作らない。題が決まる前は Skeleton で同じ形の面を出す" },
    { label: "Loading", text: "書体が届くまでは IBM Plex Sans JP で出し、届くと差し替わる(font-display: swap)。面の形は変わらない" },
    { label: "Error", na: "画像を読まないので、読み込みの失敗が無い" },
    { label: "Disabled", na: "操作できないので無効状態を持たない" },
    { label: "Focus", text: "Jacket 自体は focus しない。押せる物にする時は外の <a> が focus の輪を出す" },
  ];
}
