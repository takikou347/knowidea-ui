import { Popover, Button, IconButton, Icon, Switch, SegmentedControl } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Popover trigger={<Button variant="secondary" icon={<Icon name="settings" />}>表示</Button>} title="表示の設定" closable>
      <SegmentedControl label="表示の形" fullWidth defaultValue="list" options={[{ value: "list", label: "リスト" }, { value: "calendar", label: "カレンダー" }]} />
      <Switch label="完了した項目を表示する" placement="end" defaultChecked />
    </Popover>
  );
}

export function Info() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
      使用量
      <Popover trigger={<IconButton variant="quiet" label="使用量の説明" icon={<Icon name="info" />} />} title="使用量" description="その日の 0 時からの合計。日付が変わると 0 から数え直す。" side="top" align="center" />
    </span>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "中身の無い Popover は開かない" },
    { label: "Loading", na: "中身の中で Skeleton を使う" },
    { label: "Error", na: "中身の中で Alert を使う" },
    { label: "Disabled", na: "開くボタンを Disabled にする" },
    { label: "Focus", text: "開くと中の最初の押せる物に focus が移る。Esc か外を押すと閉じ、開いたボタンに戻る" },
  ];
}
