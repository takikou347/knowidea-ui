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
    { label: "空", na: "幅を絞るだけの部品なので、子が無いと何も出ない" },
    { label: "読み込み", na: "読み込みを持たない" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", na: "無効を持たない" },
    { label: "focus", na: "Container 自身は focus を受けない" },
  ];
}
