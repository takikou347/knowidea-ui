import { useState } from "react";
import { SelectionBar, Button, Icon } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  const [n, setN] = useState(3);
  return (
    <div style={{ width: "100%" }}>
      <SelectionBar
        count={n}
        note={n > 0 ? "操作はまとめて 1 回で反映される。" : undefined}
        onClear={() => setN(0)}
        actions={<>
          <Button variant="secondary" icon={<Icon name="archive" />} disabled={n === 0}>アーカイブ</Button>
          <Button variant="danger" icon={<Icon name="delete" />} disabled={n === 0}>削除</Button>
        </>}
      />
      <p style={{ marginTop: "var(--space-3)" }}><Button variant="quiet" onClick={() => setN(n + 1)}>1 件追加</Button></p>
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
const acts = <Button variant="secondary" icon={<Icon name="archive" />}>アーカイブ</Button>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><SelectionBar count={0} actions={<Button variant="secondary" disabled>アーカイブ</Button>} /></W>, note: "whenEmpty=\"hide\" を指定すると、何も描画しないこともできる" },
    { label: "Loading", node: <W><SelectionBar count={3} state="loading" actions={<Button variant="secondary" disabled>アーカイブ</Button>} /></W> },
    { label: "Error", node: <W><SelectionBar count={3} state="error" actions={acts} onClear={() => {}} /></W> },
    { label: "Disabled", node: <W><SelectionBar count={3} actions={<Button variant="secondary" disabled>アーカイブ</Button>} /></W> },
    { label: "Focus", node: <W><SelectionBar count={3} actions={<Button variant="secondary" className="is-focus" icon={<Icon name="archive" />}>アーカイブ</Button>} /></W> },
  ];
}
