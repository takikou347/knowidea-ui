import { Kbd } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return <p style={{ margin: 0 }}>どのページでも <Kbd keys="/" /> を押すと探す欄が開き、<Kbd keys="Esc" /> で閉じる。</p>;
}

export function Combination() {
  const rows: [string[], string][] = [[["⌘", "K"], "探す(Mac)"], [["Ctrl", "K"], "探す(Windows)"], [["⇧", "↵"], "改行を入れる"], [["↑"], "前の行へ"]];
  return (
    <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-2) var(--space-4)", margin: 0, alignItems: "center" }}>
      {rows.map(([k, what]) => (
        <div key={what} style={{ display: "contents" }}>
          <dt><Kbd keys={k} /></dt>
          <dd style={{ margin: 0 }}>{what}</dd>
        </div>
      ))}
    </dl>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "いつもキーを出す" },
    { label: "Loading", na: "読み込みを持たない" },
    { label: "Error", na: "押せる物ではないので、エラー状態を持たない" },
    { label: "Disabled", na: "押せる物ではない。使えないショートカットは出さない" },
    { label: "Focus", na: "押せる物ではないので、focus しない" },
  ];
}
