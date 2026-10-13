import { Menu, Button, IconButton, Icon, type MenuEntry } from "@knowidea/ui";
import type { StateRow } from "./types";

const entries: MenuEntry[] = [
  { label: "名前を変える", icon: <Icon name="edit" /> },
  { label: "複製する", icon: <Icon name="copy" /> },
  { label: "止める", disabled: true },
  { type: "separator" },
  { label: "削除する", tone: "danger", icon: <Icon name="delete" /> },
];

export function Basic() {
  return <Menu items={entries} trigger={<Button variant="secondary" icon={<Icon name="more" />}>操作</Button>} />;
}

export function IconTrigger() {
  return <Menu items={entries} align="end" trigger={<IconButton variant="secondary" label="その他の操作" icon={<Icon name="more" />} />} />;
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "項目の無いメニューは作らない" },
    { label: "読み込み", na: "項目が遅れて届くときは、開く前に Button の loading で待たせる" },
    { label: "失敗", na: "項目の実行の失敗は、メニューの外の Alert か Toast で示す" },
    { label: "無効", node: <Menu items={entries} trigger={<Button variant="secondary" disabled>操作</Button>} />, note: "個々の項目の無効は上のデモの「止める」" },
    { label: "focus", node: <Button variant="secondary" className="is-focus" icon={<Icon name="more" />}>操作</Button>, note: "開くと最初の項目に focus が入る。矢印で動かし、Esc で閉じる" },
    { label: "hover", na: "項目の背景が変わる" },
  ];
}
