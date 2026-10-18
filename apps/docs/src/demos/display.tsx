import { Display } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Display>夜更けの台所ラジオ</Display>
      <p style={{ margin: 0, maxWidth: "36ch" }}>冷蔵庫の残り物から 1 品を作りながら、その日のニュースを 1 つだけ話す番組。</p>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: "grid", gap: "var(--space-5)" }}>
      <Display as="p">Size 1 ページの題</Display>
      <Display as="p" size={2}>Size 2 節の頭の見出し</Display>
      <p style={{ margin: 0, fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-strong)" }}>ふつうの見出し(18px、IBM Plex Sans JP)</p>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "中身のない見出しは作らない" },
    { label: "Loading", text: "読み込み中は Skeleton で 1 行の形を出す。書体が届くまでは IBM Plex Sans JP で出し、届くと差し替わる(font-display: swap)" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", na: "操作できないので無効状態を持たない" },
    { label: "Focus", na: "見出しは操作できないため、フォーカスを受けない" },
  ];
}
