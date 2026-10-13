import { useState } from "react";
import { List, Status, Button, SelectionBar, Stack, Alert, Icon, Badge, type ListEntry } from "@knowidea/ui";
import type { StateRow } from "./types";

const items: ListEntry[] = [
  { id: "a", title: "デザインの見直し", href: "#a", meta: <><Status kind="working" label="処理中" /><span>更新 <time className="ki-list__num">10/13 09:28</time></span></> },
  { id: "b", title: "アイコンの整理", href: "#b", meta: <><Status kind="paused" label="待っている" /><span>更新 <time className="ki-list__num">10/12 18:02</time></span></>, side: <Badge tone="warn">確認待ち</Badge> },
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

/** 貯めて送る形: 選んだ物への操作を「送る前の一覧」に貯め、まとめて 1 回で送る */
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
        <p style={{ margin: 0 }}><b>送る前の一覧</b> <span className="num">{queue.length}</span> 件</p>
        {queue.length === 0 ? <p className="muted" style={{ margin: 0 }}>{phase === "sent" ? "送った。" : "選んで操作すると、ここに貯まる。"}</p> : (
          <ul className="plain" style={{ margin: 0 }}>
            {queue.map((q) => <li key={q.id}>{q.action}: {title(q.id)} <Button variant="quiet" onClick={() => setQueue((x) => x.filter((y) => y.id !== q.id))}>取り消す</Button></li>)}
          </ul>
        )}
        <div><Button loading={phase === "sending"} loadingLabel="送っている" disabled={queue.length === 0} onClick={send} icon={<Icon name="send" />}>まとめて送る</Button></div>
        {phase === "sent" ? <Alert tone="success" live>まとめて 1 回で送った。</Alert> : null}
      </Stack>
    </Stack>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><List label="空" items={[]} state="empty" emptyText="項目は無い" /></W> },
    { label: "読み込み", node: <W><List label="読み込み" items={[]} state="loading" /></W> },
    { label: "失敗", node: <W><List label="失敗" items={[]} state="error" errorText="一覧を取れなかった。" /></W> },
    { label: "無効", node: <W><List label="無効" items={[{ ...items[0]!, disabled: true, href: undefined }, items[2]!]} selected={[]} onSelectedChange={() => {}} /></W>, note: "選べない行は文字が薄くなり、選ぶ枠も押せない" },
    { label: "focus", node: <W><List label="focus" items={items.slice(0, 1)} /></W>, note: "題のリンクに focus が入ると、2px の輪が出る。実物は Tab で確かめる" },
    { label: "hover", node: <W><List label="hover" items={items.slice(0, 2)} /></W>, note: "行にポインタを置くと背景が変わる" },
    { label: "選んでいる", node: <W><List label="選んでいる" items={items.slice(0, 2)} selected={["a"]} onSelectedChange={() => {}} /></W> },
  ];
}
