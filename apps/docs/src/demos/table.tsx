import { useState } from "react";
import { Table, Badge, Button, type Column, type SortState } from "knowidea-ui";
import type { StateRow } from "./types";

type Row = { id: string; name: string; status: string; runs: number; size: number };
const data: Row[] = [
  { id: "a", name: "項目 A", status: "完了", runs: 24, size: 182400 },
  { id: "b", name: "項目 B", status: "完了", runs: 7, size: 96250 },
  { id: "c", name: "項目 C", status: "停止", runs: 3, size: 41800 },
  { id: "d", name: "項目 D", status: "完了", runs: 12, size: 12350 },
];
const columns: Column<Row>[] = [
  { key: "name", header: "名前", sortable: true },
  { key: "status", header: "状態", render: (r) => <Badge tone={r.status === "完了" ? "success" : "warn"}>{r.status}</Badge> },
  { key: "runs", header: "回数", numeric: true, sortable: true },
  { key: "size", header: "サイズ", numeric: true, sortable: true, render: (r) => r.size.toLocaleString("ja-JP") },
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
      <p className="muted" style={{ marginTop: "var(--space-2)" }}>{sel.length} 件を選択中</p>
    </div>
  );
}

export function Reorderable() {
  const [rows, setRows] = useState<Row[]>(data);
  const [log, setLog] = useState("まだ動かしていない");
  const onReorder = (from: number, to: number) => {
    const next = rows.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved as Row);
    setRows(next);
    setLog(`${moved?.name} を ${from + 1} 行目から ${to + 1} 行目へ移した`);
  };
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Table label="並べ替えできる項目の一覧" columns={columns.map((c) => ({ ...c, sortable: false }))} rows={rows} rowKey={(r) => r.id}
        rowLabel={(r) => r.name} reorderable onReorder={onReorder} />
      <p className="muted" style={{ marginTop: "var(--space-2)" }}>{log}</p>
    </div>
  );
}

const Box = ({ children, cls }: { children: React.ReactNode; cls?: string }) => <div style={{ width: "100%", minWidth: 0 }} className={cls}>{children}</div>;
export function states(): StateRow[] {
  const t = (p: Record<string, unknown>, rows = data.slice(0, 2)) => (
    <Table label="状態の例" columns={columns} rows={rows} rowKey={(r) => r.id} {...p} />
  );
  return [
    { label: "Empty", node: <Box>{t({ emptyTitle: "項目がない", emptyText: "項目を作成すると、ここに表示される。", emptyAction: <Button variant="secondary">項目を作成</Button> }, [])}</Box> },
    { label: "Loading", node: <Box>{t({ loading: true }, [])}</Box> },
    { label: "Error", node: <Box>{t({ error: "一覧を読み込めなかった。", onRetry: () => {} }, [])}</Box> },
    { label: "Disabled", node: <Box>{t({ selectable: true, selected: ["a"] })}</Box>, note: "選択できる表で、選択済みの行。行ごとの無効は列の内容で示す" },
    { label: "Disabled (reorder)", node: <Box>{t({ reorderable: true, onReorder: () => {} }, data.slice(0, 1))}</Box>, note: "行が 1 つ以下、読み込み中、失敗のときは、掴む所が押せない" },
    { label: "Focus", node: <Box cls="force-focus">{t({ selectable: true })}</Box>, note: "表の領域には Tab で移り、矢印キーで横にスクロールできる" },
    { label: "Focus (reorder handle)", node: <Box cls="force-focus-handle">{t({ reorderable: true, onReorder: () => {} })}</Box>, note: "掴む所に Tab で移る。Space で持ち上げる" },
    { label: "Hover", node: <Box cls="force-row-hover">{t({})}</Box> },
    { label: "Active", na: "行は操作できない。並べ替えとチェックボックスは、押すと切り替わる。掴んでいる間の見た目(行の影と、間の行がずれてできる空き)は、Reorderable のデモで確かめる" },
  ];
}
