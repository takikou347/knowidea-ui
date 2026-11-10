import { useState } from "react";
import { EmptyState, Icon, List, ListDetail, Skeleton, Alert, type ListEntry } from "knowidea-ui";
import type { StateRow } from "./types";

const rows = [
  { id: "a", title: "デザインの見直し", text: "見出しの大きさと余白の段をそろえる。" },
  { id: "b", title: "アイコンの整理", text: "使っていないアイコンを外し、名前をそろえる。" },
  { id: "c", title: "色の検査", text: "本文と線の差を、すべてのページで確かめる。" },
];

function Sample({ initial }: { initial?: string }) {
  const [id, setId] = useState<string | undefined>(initial);
  const [show, setShow] = useState(false);
  const row = rows.find((r) => r.id === id);
  const items: ListEntry[] = rows.map((r) => ({ id: r.id, title: r.title, href: `#${r.id}` }));
  return (
    <div style={{ width: "100%" }} onClick={(e) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      const next = a?.getAttribute("href")?.slice(1);
      if (next && rows.some((r) => r.id === next)) { e.preventDefault(); setId(next); setShow(true); }
    }}>
      <ListDetail
        list={<List label="仕事の一覧" items={items} />}
        detail={row ? <article><h3 style={{ marginTop: 0 }}>{row.title}</h3><p>{row.text}</p></article> : undefined}
        showDetail={show && !!row}
        onBack={() => setShow(false)}
        empty={<EmptyState title="仕事を選ぶ" icon={<Icon name="file" />}>左の一覧から選ぶと、ここに中身が出る。</EmptyState>}
      />
    </div>
  );
}

export function Basic() {
  return <Sample initial="a" />;
}

export function Unselected() {
  return <Sample />;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Sample />, note: "2 列で何も選んでいない時は、詳細の側に empty を出す。1 列の時は一覧だけが出る" },
    { label: "Loading", node: <div style={{ width: "100%" }} aria-busy="true"><ListDetail list={<div style={{ display: "grid", gap: "var(--space-2)" }}><Skeleton size="long" /><Skeleton size="long" /></div>} detail={<div style={{ display: "grid", gap: "var(--space-2)" }}><Skeleton size="short" /><Skeleton shape="block" /></div>} /></div>, note: "一覧と詳細のそれぞれに Skeleton を置く" },
    { label: "Error", node: <div style={{ width: "100%" }}><ListDetail list={<List label="仕事の一覧" items={rows.map((r) => ({ id: r.id, title: r.title, href: `#${r.id}` }))} />} detail={<Alert tone="error" title="中身を読めなかった">もう一度選び直す。</Alert>} /></div>, note: "エラー状態を持たない。詳細の側に Alert を置く" },
    { label: "Disabled", na: "無効状態を持たない" },
    { label: "Focus", text: "1 列で詳細を出している時、一覧へ戻るボタンに Tab で移り、2px のリングが出る" },
  ];
}
