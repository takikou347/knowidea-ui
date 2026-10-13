import { useState } from "react";
import { SelectionBar, Button, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  const [n, setN] = useState(3);
  return (
    <div style={{ width: "100%" }}>
      <SelectionBar
        count={n}
        note={n > 0 ? "操作はまとめて 1 回で効く。" : undefined}
        onClear={() => setN(0)}
        actions={<>
          <Button variant="secondary" icon={<Icon name="archive" />} disabled={n === 0}>保管する</Button>
          <Button variant="danger" icon={<Icon name="delete" />} disabled={n === 0}>削除する</Button>
        </>}
      />
      <p style={{ marginTop: "var(--space-3)" }}><Button variant="quiet" onClick={() => setN(n + 1)}>1 件足す</Button></p>
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
const acts = <Button variant="secondary" icon={<Icon name="archive" />}>保管する</Button>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><SelectionBar count={0} actions={<Button variant="secondary" disabled>保管する</Button>} /></W>, note: "whenEmpty=\"hide\" で何も描かなくもできる" },
    { label: "読み込み", node: <W><SelectionBar count={3} state="loading" actions={<Button variant="secondary" disabled>保管する</Button>} /></W> },
    { label: "失敗", node: <W><SelectionBar count={3} state="error" actions={acts} onClear={() => {}} /></W> },
    { label: "無効", node: <W><SelectionBar count={3} actions={<Button variant="secondary" disabled>保管する</Button>} /></W> },
    { label: "focus", node: <W><SelectionBar count={3} actions={<Button variant="secondary" className="is-focus" icon={<Icon name="archive" />}>保管する</Button>} /></W> },
  ];
}
