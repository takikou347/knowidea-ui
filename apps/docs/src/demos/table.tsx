import { useState } from "react";
import { Table, Badge, Button, Pagination, type Column, type SortState } from "@knowidea/react";

type Row = { id: string; name: string; status: string; runs: number; tokens: number };
const data: Row[] = [
  { id: "review", name: "review", status: "動作中", runs: 24, tokens: 182400 },
  { id: "production", name: "production", status: "動作中", runs: 7, tokens: 96250 },
  { id: "weekly", name: "weekly", status: "止まった", runs: 3, tokens: 41800 },
  { id: "audit", name: "audit", status: "動作中", runs: 12, tokens: 12350 },
];
const columns: Column<Row>[] = [
  { key: "name", header: "routine", sortable: true },
  { key: "status", header: "状態", render: (r) => <Badge tone={r.status === "動作中" ? "success" : "warn"}>{r.status}</Badge> },
  { key: "runs", header: "実行", numeric: true, sortable: true },
  { key: "tokens", header: "使用量のトークン", numeric: true, sortable: true, render: (r) => r.tokens.toLocaleString("ja-JP") },
];

export function Demo() {
  const [sort, setSort] = useState<SortState | null>({ key: "name", direction: "ascending" });
  const [sel, setSel] = useState<string[]>(["review"]);
  const rows = [...data];
  if (sort) rows.sort((a, b) => {
    const x = a[sort.key as keyof Row], y = b[sort.key as keyof Row];
    const c = typeof x === "number" ? x - (y as number) : String(x).localeCompare(String(y));
    return sort.direction === "ascending" ? c : -c;
  });
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Table label="routine の一覧" caption="routine の一覧" columns={columns} rows={rows} rowKey={(r) => r.id}
        sort={sort} onSortChange={setSort} selectable selected={sel} onSelectedChange={setSel} rowLabel={(r) => r.name} />
      <p className="muted" style={{ marginTop: "var(--space-2)" }}>{sel.length} 行を選んでいる</p>
    </div>
  );
}

export function State({ kind }: { kind: "empty" | "loading" | "error" | "disabled" | "focus" | "hover" }) {
  const rows = kind === "empty" || kind === "loading" || kind === "error" ? [] : data.slice(0, 2);
  return (
    <div style={{ width: "100%", minWidth: 0 }} className={kind === "hover" ? "force-row-hover" : kind === "focus" ? "force-focus" : undefined}>
      <Table label={`状態 ${kind}`} columns={columns} rows={rows} rowKey={(r) => r.id}
        loading={kind === "loading"} error={kind === "error" ? "一覧を読み込めなかった。" : undefined} onRetry={() => {}}
        emptyTitle="routine が無い" emptyText="routine を作ると、ここに並ぶ。"
        emptyAction={<Button variant="secondary">routine を作る</Button>}
        selectable={kind === "disabled" || kind === "focus"} selected={kind === "disabled" ? ["review"] : []} />
    </div>
  );
}

export function PagedDemo() {
  const [p, setP] = useState(1);
  return <Pagination page={p} pageCount={9} onPageChange={setP} />;
}
