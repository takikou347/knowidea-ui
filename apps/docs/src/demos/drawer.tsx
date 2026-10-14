import { useState } from "react";
import { Drawer, Button, Icon, type NavItem } from "knowidea-ui";
import type { StateRow } from "./types";

const items: NavItem[] = [
  { id: "home", label: "ホーム", icon: "home", href: "#home" },
  { id: "list", label: "一覧", icon: "list", href: "#list", count: 3 },
  { id: "calendar", label: "予定", icon: "calendar", href: "#calendar" },
  { id: "settings", label: "設定", icon: "settings", href: "#settings" },
];

export function Permanent() {
  return (
    <div style={{ width: "min(100%, 280px)", border: "1px solid var(--color-line)", borderRadius: "var(--radius-3)", overflow: "hidden" }}>
      <Drawer brand={{ name: "サンプル", sub: "サイドナビゲーション" }} items={items} current="list" />
    </div>
  );
}

export function Temporary() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" icon={<Icon name="menu" />} onClick={() => setOpen(true)}>メニューを開く</Button>
      <Drawer variant="temporary" open={open} onOpenChange={setOpen} brand={{ name: "サンプル" }} items={items} current="home" />
    </>
  );
}

export function states(): StateRow[] {
  const dis: NavItem[] = [{ ...items[0]! }, { ...items[1]!, disabled: true }];
  return [
    { label: "Empty", na: "項目のないナビゲーションは作らない" },
    { label: "Loading", na: "項目は先に決まっているため、ローディング状態を持たない。件数のバッジだけが遅れて表示される" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", node: <div style={{ width: "min(100%, 280px)", border: "1px solid var(--color-line)" }}><Drawer items={dis} current="home" /></div>, note: "「一覧」は操作できない(aria-disabled)" },
    { label: "Focus", node: <div style={{ width: "min(100%, 280px)", border: "1px solid var(--color-line)" }}><Drawer items={items.slice(0, 2)} current="home" /></div>, note: "項目に Tab で移ると、2px のリングが表示される" },
  ];
}
