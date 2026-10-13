import { Textarea } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "min(100%, 360px)" }}>
      <Textarea aria-label="メモ" placeholder="後から読む人に向けて書く" />
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 360px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><Textarea aria-label="空" placeholder="後から読む人に向けて書く" /></W> },
    { label: "Loading", na: "ローディング中は、外側の TextField や Field のスピナーで示す。複数行の入力欄にはスピナーを置く場所がない" },
    { label: "Error", node: <W><Textarea aria-label="エラー" invalid defaultValue="空にできない" /></W> },
    { label: "Disabled", node: <W><Textarea aria-label="無効" disabled defaultValue="書き換えられない" /></W> },
    { label: "Focus", node: <W><Textarea aria-label="フォーカス" className="is-focus" defaultValue="入力の途中" /></W> },
    { label: "Hover", node: <W><Textarea aria-label="ホバー" className="is-hover" defaultValue="枠線の色が変わる" /></W> },
    { label: "Active", na: "入力欄に押下時の見た目はない。入力中は Focus と同じ" },
  ];
}
