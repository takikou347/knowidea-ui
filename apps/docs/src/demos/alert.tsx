import { Alert, Button, Spinner } from "knowidea-ui";
import { useState } from "react";
import type { StateRow } from "./types";

export function Tones() {
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "100%" }}>
      <Alert tone="info" title="設定を更新した">変更は次回の読み込みから反映される。</Alert>
      <Alert tone="success">保存した。</Alert>
      <Alert tone="warn" title="容量の上限が近い">使用量が上限の 80% を超えた。</Alert>
      <Alert tone="error" title="保存できなかった" action={<Button variant="secondary">再試行</Button>}>権限が不足している。</Alert>
    </div>
  );
}

export function Closable() {
  const [open, setOpen] = useState(true);
  return open ? (
    <div style={{ width: "100%" }}>
      <Alert tone="info" onClose={() => setOpen(false)}>このアラートは閉じられる。</Alert>
    </div>
  ) : <Button variant="secondary" onClick={() => setOpen(true)}>もう一度表示する</Button>;
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", na: "中身のないアラートは表示しない" },
    { label: "Loading", node: <W><Alert tone="info" live action={<Spinner label="更新中" />}>更新中。</Alert></W> },
    { label: "Error", node: <W><Alert tone="error" live action={<Button variant="secondary">再試行</Button>}>保存できなかった。</Alert></W> },
    { label: "Disabled", na: "アラート自体は操作できないため、無効状態を持たない。中の操作が無効になるだけ" },
    { label: "Focus", node: <W><Alert tone="error" action={<Button variant="secondary" className="is-focus">再試行</Button>}>保存できなかった。</Alert></W>, note: "アラートの中の操作にフォーカスが移る" },
  ];
}
