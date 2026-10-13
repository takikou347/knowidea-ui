import { Quote } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return <Quote cite="KNOW IDEA のロゴに添える一言">答えはまだ無い。だから試す。</Quote>;
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "中身の無い引用は作らない" },
    { label: "読み込み", na: "文字を渡す部品なので読み込みを持たない" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", na: "無効にならない" },
    { label: "focus", na: "引用は押せないので focus を受けない" },
  ];
}
