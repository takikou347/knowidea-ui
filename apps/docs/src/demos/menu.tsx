import { Menu, Button, IconButton, Icon, type MenuEntry } from "knowidea-ui";
import type { StateRow } from "./types";

const entries: MenuEntry[] = [
  { label: "名前を変更", icon: <Icon name="edit" /> },
  { label: "複製", icon: <Icon name="copy" /> },
  { label: "停止", disabled: true },
  { type: "separator" },
  { label: "削除", tone: "danger", icon: <Icon name="delete" /> },
];

export function Basic() {
  return <Menu items={entries} trigger={<Button variant="secondary" icon={<Icon name="more" />}>操作</Button>} />;
}

export function IconTrigger() {
  return <Menu items={entries} align="end" trigger={<IconButton variant="secondary" label="その他の操作" icon={<Icon name="more" />} />} />;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "項目のないメニューは作らない" },
    { label: "Loading", na: "項目の取得に時間がかかるときは、開く前に Button の loading で待たせる" },
    { label: "Error", na: "項目の実行に失敗したときは、メニューの外の Alert か Toast で示す" },
    { label: "Disabled", node: <Menu items={entries} trigger={<Button variant="secondary" disabled>操作</Button>} />, note: "個々の項目の無効は、上のデモの「停止」で確認できる" },
    { label: "Focus", node: <Button variant="secondary" className="is-focus" icon={<Icon name="more" />}>操作</Button>, note: "開くと最初の項目にフォーカスが移る。矢印キーで移動し、Esc で閉じる" },
    { label: "Hover", note: "項目の背景が変わる" },
  ];
}
