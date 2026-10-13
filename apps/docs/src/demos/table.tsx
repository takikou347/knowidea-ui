import { useState } from "react";
import { Table, Badge, Button, type Column, type SortState } from "@knowidea/ui";
import type { StateRow } from "./types";

type Row = { id: string; name: string; status: string; runs: number; size: number };
const data: Row[] = [
  { id: "a", name: "項目 A", status: "完了", runs: 24, size: 182400 },
  { id: "b", name: "項目 B", status: "完了", runs: 7, size: 96250 },
  { id: "c", name: "項目 C", status: "止まった", runs: 3, size: 41800 },
  { id: "d", name: "項目 D", status: "完了", runs: 12, size: 12350 },
];
const columns: Column<Row>[] = [
  { key: "name", header: "名前", sortable: true },
  { key: "status", header: "状態", render: (r) => <Badge tone={r.status === "完了" ? "success" : "warn"}>{r.status}</Badge> },
  { key: "runs", header: "回数", numeric: true, sortable: true },
  { key: "size", header: "大きさ", numeric: true, sortable: true, render: (r) => r.size.toLocaleString("ja-JP") },
];

export function Sortable() {
  const [sort, setSort] = useState<SortState | null>({ key: "name", direction: "ascending" });
  const [sel, setSel] = useState<string[]>(["a"]);
  const rows = [...data];
  if (sort) rows.sort((a, b) => {
    const x = a[sort.key as keyof Row], y = b[sort.key as keyof Row];
    const c = typeof x === "number" ? x - (y as number) : String(x).localeCompare(String(y));
    return sort.direction === "ascending" ? c : -c;
  });
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Table label="項目の一覧" columns={columns} rows={rows} rowKey={(r) => r.id}
        sort={sort} onSortChange={setSort} selectable selected={sel} onSelectedChange={setSel} rowLabel={(r) => r.name} />
      <p className="muted" style={{ marginTop: "var(--space-2)" }}>{sel.length} 行を選んでいる</p>
    </div>
  );
}

const Box = ({ children, cls }: { children: React.ReactNode; cls?: string }) => <div style={{ width: "100%", minWidth: 0 }} className={cls}>{children}</div>;
export function states(): StateRow[] {
  const t = (p: Record<string, unknown>, rows = data.slice(0, 2)) => (
    <Table label="状態の例" columns={columns} rows={rows} rowKey={(r) => r.id} {...p} />
  );
  return [
    { label: "空", node: <Box>{t({ emptyTitle: "項目が無い", emptyText: "項目を作ると、ここに並ぶ。", emptyAction: <Button variant="secondary">項目を作る</Button> }, [])}</Box> },
    { label: "読み込み", node: <Box>{t({ loading: true }, [])}</Box> },
    { label: "失敗", node: <Box>{t({ error: "一覧を読み込めなかった。", onRetry: () => {} }, [])}</Box> },
    { label: "無効", node: <Box>{t({ selectable: true, selected: ["a"] })}</Box>, note: "選べる表で選び済みの行。行ごとの無効は列の中身で示す" },
    { label: "focus", node: <Box cls="force-focus">{t({ selectable: true })}</Box>, note: "表の領域は Tab で入り、矢印で横に動かせる" },
    { label: "hover", node: <Box cls="force-row-hover">{t({})}</Box> },
    { label: "押した時", na: "行は押せない。並べ替えと選ぶ枠は押すと切り替わる" },
  ];
}
