import { AppBar, IconButton, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "100%", border: "1px solid var(--color-line)", borderRadius: "var(--radius-3)", overflow: "hidden" }}>
      <AppBar
        title="ホーム"
        leading={<IconButton label="目次を開く" icon={<Icon name="menu" />} />}
        meta={<><span>更新</span><time>10/13 09:28</time></>}
        actions={<><IconButton label="更新" icon={<Icon name="refresh" />} /><IconButton label="設定" icon={<Icon name="settings" />} /></>}
      />
    </div>
  );
}

export function Plain() {
  return (
    <div style={{ width: "100%", border: "1px solid var(--color-line)", borderRadius: "var(--radius-3)", overflow: "hidden" }}>
      <AppBar title="とても長い画面の題が入ったときは、1 行に収めて末尾を省く" actions={<IconButton label="検索" icon={<Icon name="search" />} />} />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "題の無いバーは作らない" },
    { label: "読み込み", na: "題は先に分かるので、読み込みを持たない。中身の読み込みは本文側で示す" },
    { label: "失敗", na: "失敗を持たない。画面の失敗は本文側の Alert で示す" },
    { label: "無効", node: <div style={{ width: "100%" }}><AppBar title="見本" actions={<IconButton label="更新" icon={<Icon name="refresh" />} disabled />} /></div> },
    { label: "focus", node: <div style={{ width: "100%" }}><AppBar title="見本" actions={<IconButton label="更新" icon={<Icon name="refresh" />} className="is-focus" />} /></div> },
  ];
}
