import { Container } from "@knowidea/ui";
import type { StateRow } from "./types";

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: "var(--space-3)", background: "var(--color-surface)", border: "1px solid var(--color-line-strong)", borderRadius: "var(--radius-2)" }}>{children}</div>
);

export function Sizes() {
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--space-3)" }}>
      {(["sm", "md", "lg"] as const).map((s) => (
        <Container key={s} size={s} style={{ padding: 0 }}><Box>size="{s}"</Box></Container>
      ))}
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "幅を制限するだけのコンポーネントなので、子要素がなければ何も表示されない" },
    { label: "Loading", na: "ローディング状態を持たない" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", na: "無効状態を持たない" },
    { label: "Focus", na: "Container 自身はフォーカスを受けない" },
  ];
}
