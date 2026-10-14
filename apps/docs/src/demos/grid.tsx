import { Grid } from "knowidea-ui";
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
    { label: "Empty", na: "並べるだけのコンポーネントなので、子要素がなければ何も表示されない" },
    { label: "Loading", na: "ローディング状態を持たない" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", na: "無効状態を持たない" },
    { label: "Focus", na: "Grid 自身はフォーカスを受けない" },
  ];
}
