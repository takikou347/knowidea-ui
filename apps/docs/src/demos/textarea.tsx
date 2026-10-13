import { Textarea } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "min(100%, 360px)" }}>
      <Textarea aria-label="メモ" placeholder="あとで読む人に向けて書く" />
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 360px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><Textarea aria-label="空" placeholder="あとで読む人に向けて書く" /></W> },
    { label: "読み込み", na: "読み込み中は上の欄(TextField や Field)の回転で示す。複数行の入力には回転の置き場が無い" },
    { label: "失敗", node: <W><Textarea aria-label="失敗" invalid defaultValue="空にできない" /></W> },
    { label: "無効", node: <W><Textarea aria-label="無効" disabled defaultValue="書き換えられない" /></W> },
    { label: "focus", node: <W><Textarea aria-label="focus" className="is-focus" defaultValue="書いている途中" /></W> },
    { label: "hover", node: <W><Textarea aria-label="hover" className="is-hover" defaultValue="枠の色が変わる" /></W> },
    { label: "押した時", na: "入力に押した時の見た目は無い。入力中は focus と同じ" },
  ];
}
