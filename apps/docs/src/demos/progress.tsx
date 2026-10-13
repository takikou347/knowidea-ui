import { useEffect, useState } from "react";
import { Progress, Button, Stack } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Stack gap={4} style={{ width: "min(100%, 360px)" }}>
      <Progress label="読み込み" value={40} />
      <Progress label="完了" value={100} tone="success" />
      <Progress label="容量" value={85} tone="warn" size="lg" />
    </Stack>
  );
}

export function Running() {
  const [v, setV] = useState<number | null>(null);
  useEffect(() => {
    if (v == null || v >= 100) return;
    const t = setTimeout(() => setV(Math.min(100, v + 20)), 500);
    return () => clearTimeout(t);
  }, [v]);
  return (
    <Stack gap={3} style={{ width: "min(100%, 360px)" }}>
      <Progress label="書き出し" value={v} />
      <div><Button variant="secondary" disabled={v != null && v < 100} onClick={() => setV(0)}>{v == null ? "始める" : v >= 100 ? "もう一度" : "進行中"}</Button></div>
    </Stack>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 360px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><Progress label="始まっていない" value={0} /></W> },
    { label: "読み込み", node: <W><Progress label="進み具合は不明" value={null} /></W>, note: "不明のときは動かさず、破線の枠の線で示す" },
    { label: "失敗", node: <W><Progress label="書き出し(止まった)" value={60} tone="error" /></W> },
    { label: "無効", node: <W><Progress label="書き出し(待機中)" value={30} disabled /></W> },
    { label: "focus", na: "進み具合は押せないので focus を受けない" },
  ];
}
