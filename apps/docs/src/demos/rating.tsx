import { useState } from "react";
import { Rating } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  const [v, setV] = useState(3);
  return (
    <div style={{ display: "grid", gap: "var(--space-2)", justifyItems: "start" }}>
      <Rating label="この回の評価" value={v} onValueChange={setV} />
      <p style={{ margin: 0, color: "var(--color-text-muted)" }}>今の評価: 5 段階中 {v}</p>
    </div>
  );
}

export function ReadOnly() {
  return (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Rating label="読者の評価" value={4} /><span>4 / 5(サンプルの数値)</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Rating label="読者の評価" value={2} max={3} /><span>2 / 3(サンプルの数値)</span>
      </div>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Rating label="まだ付けていない評価" onValueChange={() => {}} />, note: "値が 0 の時は星が全部線だけ。どの星も選んでいない" },
    { label: "Loading", na: "評価を保存する間の待ちは、使う側が disabled にして示す。Rating は読み込みの状態を持たない" },
    { label: "Error", na: "エラー状態を持たない。必須にしたい時は Field の error に書く" },
    { label: "Disabled", node: <Rating label="無効の評価" defaultValue={3} onValueChange={() => {}} disabled /> },
    { label: "Focus", text: "Tab で選んでいる星(無ければ先頭)に移り、2px のリングが出る。矢印キーで選び直す" },
  ];
}
