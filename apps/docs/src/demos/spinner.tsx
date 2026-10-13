import { Spinner } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <>
      <span style={{ display: "inline-flex", gap: "var(--space-2)", alignItems: "center" }}><Spinner label="読み込み中" />読み込み中</span>
      <span style={{ fontSize: "var(--font-size-4)", display: "inline-flex" }}><Spinner label="大きい読み込み" /></span>
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "回転は読み込み中だけ出る" },
    { label: "読み込み", node: <Basic /> },
    { label: "失敗", na: "失敗したら回転をやめ、Alert で理由を示す" },
    { label: "無効", na: "無効を持たない" },
    { label: "focus", na: "回転は押せないので focus を受けない" },
  ];
}
