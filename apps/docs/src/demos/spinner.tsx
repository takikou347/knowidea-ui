import { Spinner } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <>
      <span style={{ display: "inline-flex", gap: "var(--space-2)", alignItems: "center" }}><Spinner label="読み込み中" />読み込み中</span>
      <span style={{ fontSize: "var(--font-size-4)", display: "inline-flex" }}><Spinner label="読み込み中(大)" /></span>
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "スピナーは、ローディング中だけ表示する" },
    { label: "Loading", node: <Basic /> },
    { label: "Error", na: "失敗したらスピナーをやめ、Alert で理由を示す" },
    { label: "Disabled", na: "無効状態を持たない" },
    { label: "Focus", na: "スピナーは操作できないため、フォーカスを受けない" },
  ];
}
