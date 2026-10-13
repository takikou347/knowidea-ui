import { Alert, Button, Spinner } from "@knowidea/ui";
import { useState } from "react";
import type { StateRow } from "./types";

export function Tones() {
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "100%" }}>
      <Alert tone="info" title="設定を更新した">変更は次の読み込みから使われる。</Alert>
      <Alert tone="success">保存した。</Alert>
      <Alert tone="warn" title="容量が近い">使える容量の 80% を超えた。</Alert>
      <Alert tone="error" title="保存できなかった" action={<Button variant="secondary">もう一度</Button>}>権限が足りない。</Alert>
    </div>
  );
}

export function Closable() {
  const [open, setOpen] = useState(true);
  return open ? (
    <div style={{ width: "100%" }}>
      <Alert tone="info" onClose={() => setOpen(false)}>この知らせは閉じられる。</Alert>
    </div>
  ) : <Button variant="secondary" onClick={() => setOpen(true)}>もう一度出す</Button>;
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", na: "中身の無い知らせは出さない" },
    { label: "読み込み", node: <W><Alert tone="info" live action={<Spinner label="更新中" />}>更新している。</Alert></W> },
    { label: "失敗", node: <W><Alert tone="error" live action={<Button variant="secondary">もう一度</Button>}>保存できなかった。</Alert></W> },
    { label: "無効", na: "知らせは操作できないので無効を持たない。中の操作が無効になるだけ" },
    { label: "focus", node: <W><Alert tone="error" action={<Button variant="secondary" className="is-focus">もう一度</Button>}>保存できなかった。</Alert></W>, note: "知らせの中の操作に focus が入る" },
  ];
}
