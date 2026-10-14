import { useState } from "react";
import { List, Status, Button, SelectionBar, Stack, Alert, Icon, Badge, type ListEntry } from "@knowidea/ui";
import type { StateRow } from "./types";

const items: ListEntry[] = [
  { id: "a", title: "デザインの見直し", href: "#a", meta: <><Status kind="working" label="処理中" /><span>更新 <time className="ki-list__num">10/13 09:28</time></span></> },
  { id: "b", title: "アイコンの整理", href: "#b", meta: <><Status kind="paused" label="待機中" /><span>更新 <time className="ki-list__num">10/12 18:02</time></span></>, side: <Badge tone="warn">確認待ち</Badge> },
  { id: "c", title: "色の検査", href: "#c", meta: <><Status kind="success" label="完了" /><span>更新 <time className="ki-list__num">10/12 11:40</time></span></> },
];

export function Basic() {
  return (
    <div style={{ width: "100%" }}>
      <List label="項目の一覧" items={items} />
    </div>
  );
}

export function Selectable() {
  const [sel, setSel] = useState<string[]>(["b"]);
  return (
    <div style={{ width: "100%" }}>
      <List label="項目の一覧" items={items} selected={sel} onSelectedChange={setSel} summary={`${items.length} 件`} />
    </div>
  );
}

/** キューに追加してから送信する形: 選択した項目への操作を「送信待ち」の一覧に追加し、まとめて 1 回で送信する */
export function Queue() {
  const [sel, setSel] = useState<string[]>([]);
  const [queue, setQueue] = useState<{ id: string; action: string }[]>([]);
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const add = (action: string) => {
    setQueue((q) => [...q.filter((x) => !sel.includes(x.id)), ...sel.map((id) => ({ id, action }))]);
    setSel([]);
  };
  const send = () => {
    setPhase("sending");
    setTimeout(() => { setPhase("sent"); setQueue([]); }, 900);
  };
  const title = (id: string) => String(items.find((i) => i.id === id)?.title);
  return (
    <Stack gap={3} style={{ width: "100%" }}>
      <List label="項目の一覧" items={items} selected={sel} onSelectedChange={setSel} />
      <SelectionBar
        count={sel.length}
        actions={<>
          <Button variant="secondary" icon={<Icon name="check" />} disabled={sel.length === 0} onClick={() => add("承認")}>承認</Button>
          <Button variant="secondary" icon={<Icon name="close" />} disabled={sel.length === 0} onClick={() => add("却下")}>却下</Button>
        </>}
        onClear={() => setSel([])}
      />
      <Stack gap={2}>
        <p style={{ margin: 0 }}><b>送信待ち</b> <span className="num">{queue.length}</span> 件</p>
        {queue.length === 0 ? <p className="muted" style={{ margin: 0 }}>{phase === "sent" ? "送信した。" : "項目を選択して操作すると、ここに追加される。"}</p> : (
          <ul className="plain" style={{ margin: 0 }}>
            {queue.map((q) => <li key={q.id}>{q.action}: {title(q.id)} <Button variant="quiet" onClick={() => setQueue((x) => x.filter((y) => y.id !== q.id))}>取り消し</Button></li>)}
          </ul>
        )}
        <div><Button loading={phase === "sending"} loadingLabel="送信中" disabled={queue.length === 0} onClick={send} icon={<Icon name="send" />}>まとめて送信</Button></div>
        {phase === "sent" ? <Alert tone="success" live>まとめて 1 回で送信した。</Alert> : null}
      </Stack>
    </Stack>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><List label="空" items={[]} state="empty" emptyText="項目がない" /></W> },
    { label: "Loading", node: <W><List label="読み込み中" items={[]} state="loading" /></W> },
    { label: "Error", node: <W><List label="エラー" items={[]} state="error" errorText="一覧を取得できなかった。" /></W> },
    { label: "Disabled", node: <W><List label="無効" items={[{ ...items[0]!, disabled: true, href: undefined }, items[2]!]} selected={[]} onSelectedChange={() => {}} /></W>, note: "選択できない行は文字が薄くなり、チェックボックスも操作できない" },
    { label: "Focus", node: <W><List label="フォーカス" items={items.slice(0, 1)} /></W>, note: "タイトルのリンクにフォーカスが移ると、2px のリングが表示される。実物は Tab で確認する" },
    { label: "Hover", node: <W><List label="ホバー" items={items.slice(0, 2)} /></W>, note: "行にポインターを置くと背景が変わる" },
    { label: "Selected", node: <W><List label="選択中" items={items.slice(0, 2)} selected={["a"]} onSelectedChange={() => {}} /></W> },
  ];
}

/** 足す、消す、並べ替える時に、行が滑る */
export function Motion() {
  const [rows, setRows] = useState<ListEntry[]>(items);
  const [n, setN] = useState(1);
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        <Button variant="secondary" onClick={() => { setRows([{ id: `n${n}`, title: `新しい項目 ${n}` }, ...rows]); setN(n + 1); }}>上に足す</Button>
        <Button variant="secondary" disabled={rows.length === 0} onClick={() => setRows(rows.slice(1))}>先頭を消す</Button>
        <Button variant="secondary" disabled={rows.length < 2} onClick={() => setRows([...rows].reverse())}>逆に並べる</Button>
      </div>
      <List label="動きの見本" items={rows} state={rows.length ? "ready" : "empty"} />
    </div>
  );
}
