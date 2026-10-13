import { Quote } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return <Quote cite="KNOW IDEA のロゴに添える一言">答えはまだない。だから試す。</Quote>;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "中身のない引用は作らない" },
    { label: "Loading", na: "文字列を渡すコンポーネントなので、ローディング状態を持たない" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", na: "無効状態を持たない" },
    { label: "Focus", na: "引用は操作できないため、フォーカスを受けない" },
  ];
}
