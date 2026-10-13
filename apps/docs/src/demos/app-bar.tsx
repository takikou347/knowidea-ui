import { AppBar, IconButton, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "100%", border: "1px solid var(--color-line)", borderRadius: "var(--radius-3)", overflow: "hidden" }}>
      <AppBar
        title="ホーム"
        leading={<IconButton label="ナビゲーションを開く" icon={<Icon name="menu" />} />}
        meta={<><span>更新</span><time>10/13 09:28</time></>}
        actions={<><IconButton label="更新" icon={<Icon name="refresh" />} /><IconButton label="設定" icon={<Icon name="settings" />} /></>}
      />
    </div>
  );
}

export function Plain() {
  return (
    <div style={{ width: "100%", border: "1px solid var(--color-line)", borderRadius: "var(--radius-3)", overflow: "hidden" }}>
      <AppBar title="とても長い画面のタイトルが入ったときは、1 行に収めて末尾を省略する" actions={<IconButton label="検索" icon={<Icon name="search" />} />} />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "タイトルのないバーは作らない" },
    { label: "Loading", na: "タイトルは先に決まっているため、ローディング状態を持たない。コンテンツの読み込みは本文側で示す" },
    { label: "Error", na: "エラー状態を持たない。画面のエラーは本文側の Alert で示す" },
    { label: "Disabled", node: <div style={{ width: "100%" }}><AppBar title="サンプル" actions={<IconButton label="更新" icon={<Icon name="refresh" />} disabled />} /></div> },
    { label: "Focus", node: <div style={{ width: "100%" }}><AppBar title="サンプル" actions={<IconButton label="更新" icon={<Icon name="refresh" />} className="is-focus" />} /></div> },
  ];
}
