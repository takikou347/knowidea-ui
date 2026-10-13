import { Stack, Button, Chip } from "@knowidea/ui";
import type { StateRow } from "./types";

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: "var(--space-2) var(--space-3)", background: "var(--color-surface)", border: "1px solid var(--color-line-strong)", borderRadius: "var(--radius-2)" }}>{children}</div>
);

export function Column() {
  return (
    <Stack gap={3} style={{ width: "min(100%, 320px)" }}>
      <Box>1</Box><Box>2</Box><Box>3</Box>
    </Stack>
  );
}

export function Row() {
  return (
    <Stack direction="row" gap={2} wrap align="center" style={{ width: "100%" }}>
      <Button>保存する</Button>
      <Button variant="secondary">やめる</Button>
      <Chip label="下書き" />
    </Stack>
  );
}

export function Between() {
  return (
    <Stack direction="row" justify="between" align="center" style={{ width: "100%" }}>
      <strong>見出し</strong>
      <Button variant="secondary">操作</Button>
    </Stack>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", node: <Stack style={{ width: "100%" }}><span className="muted">子が無いと高さも無い</span></Stack> },
    { label: "読み込み", na: "並べるだけの部品なので、読み込みを持たない" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", na: "無効を持たない" },
    { label: "focus", na: "Stack 自身は focus を受けない。子の順で Tab が進む" },
  ];
}
