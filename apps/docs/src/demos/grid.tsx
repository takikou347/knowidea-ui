import { Grid } from "@knowidea/ui";
import type { StateRow } from "./types";

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: "var(--space-3)", background: "var(--color-surface)", border: "1px solid var(--color-line-strong)", borderRadius: "var(--radius-2)" }}>{children}</div>
);

export function Fixed() {
  return (
    <Grid columns={3} style={{ width: "100%" }}>
      {[1, 2, 3, 4, 5, 6].map((n) => <Box key={n}>{n}</Box>)}
    </Grid>
  );
}

export function Auto() {
  return (
    <Grid minItemWidth={160} style={{ width: "100%" }}>
      {[1, 2, 3, 4, 5].map((n) => <Box key={n}>{n}</Box>)}
    </Grid>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "並べるだけの部品なので、子が無いと何も出ない" },
    { label: "読み込み", na: "読み込みを持たない" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", na: "無効を持たない" },
    { label: "focus", na: "Grid 自身は focus を受けない" },
  ];
}
