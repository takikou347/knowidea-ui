import { useEffect, useState } from "react";
import { Alert, Button, Chip, Icon, IconButton, List, SelectionBar, Stack, Status, type ListEntry } from "@knowidea/ui";
import Shell from "./Shell";

type Kind = "working" | "paused" | "success";
interface Row { id: string; title: string; kind: Kind; time: string }
const label: Record<Kind, string> = { working: "処理中", paused: "待機中", success: "完了" };
const seed: Row[] = [
  { id: "r1", title: "デザインの見直し", kind: "working", time: "10/13 09:28" },
  { id: "r2", title: "アイコンの整理", kind: "paused", time: "10/12 18:02" },
  { id: "r3", title: "色の検査", kind: "success", time: "10/12 11:40" },
  { id: "r4", title: "余白の統一", kind: "paused", time: "10/11 16:15" },
  { id: "r5", title: "フォントサイズの確認", kind: "working", time: "10/11 10:03" },
  { id: "r6", title: "ダークモードの見直し", kind: "success", time: "10/10 17:45" },
  { id: "r7", title: "コンポーネントの棚卸し", kind: "paused", time: "10/10 09:20" },
  { id: "r8", title: "文言の統一", kind: "success", time: "10/09 14:30" },
];

export default function ListScreen() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [sel, setSel] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ text: string; undo: Row[] } | null>(null);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [loading]);

  const shown = rows.filter((r) => filter === "all" || r.kind === filter);
  const items: ListEntry[] = shown.map((r) => ({
    id: r.id, title: r.title, href: "#" + r.id,
    meta: <><Status kind={r.kind} label={label[r.kind]} /><span>更新 <time className="ki-list__num">{r.time}</time></span></>,
  }));
  const chosen = sel.filter((id) => shown.some((r) => r.id === id));

  const archive = () => {
    const gone = rows.filter((r) => chosen.includes(r.id));
    setRows(rows.filter((r) => !chosen.includes(r.id)));
    setSel([]);
    setDone({ text: `${gone.length} 件をアーカイブした。`, undo: gone });
  };
  const complete = () => {
    setRows(rows.map((r) => (chosen.includes(r.id) ? { ...r, kind: "success" } : r)));
    setSel([]);
    setDone({ text: `${chosen.length} 件を完了にした。`, undo: [] });
  };
  const undo = () => {
    if (!done) return;
    setRows((r) => [...r, ...done.undo]);
    setDone(null);
  };

  return (
    <Shell
      title="一覧と一括操作"
      current="list"
      actions={<IconButton label="再読み込み" icon={<Icon name="refresh" />} onClick={() => setLoading(true)} />}
    >
      <Alert tone="info">項目はすべてサンプル。操作はこの画面の中だけで動く。</Alert>
      <div className="tpl-chips" role="group" aria-label="状態で絞り込む">
        {(["all", "working", "paused", "success"] as const).map((k) => (
          <Chip key={k} label={k === "all" ? `すべて ${rows.length}` : `${label[k]} ${rows.filter((r) => r.kind === k).length}`} selected={filter === k} onClick={() => { setFilter(k); setSel([]); }} />
        ))}
      </div>
      <SelectionBar
        count={chosen.length}
        note={chosen.length > 0 ? "操作はまとめて 1 回で反映される。" : undefined}
        onClear={() => setSel([])}
        actions={<>
          <Button variant="secondary" icon={<Icon name="check" />} disabled={chosen.length === 0} onClick={complete}>完了にする</Button>
          <Button variant="secondary" icon={<Icon name="archive" />} disabled={chosen.length === 0} onClick={archive}>アーカイブする</Button>
        </>}
      />
      <div aria-live="polite">
        {done ? (
          <Alert tone="success" onClose={() => setDone(null)} action={done.undo.length ? <Button variant="quiet" onClick={undo}>元に戻す</Button> : undefined}>{done.text}</Alert>
        ) : null}
      </div>
      <Stack gap={2}>
        <List
          label="項目の一覧"
          items={items}
          selected={chosen}
          onSelectedChange={setSel}
          state={loading ? "loading" : shown.length === 0 ? "empty" : "ready"}
          emptyText="この状態の項目はない"
          summary={`${shown.length} 件`}
        />
      </Stack>
    </Shell>
  );
}
