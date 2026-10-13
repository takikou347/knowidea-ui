import { useState } from "react";
import { Drawer, Button, Icon, type NavItem } from "@knowidea/ui";
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
      <Drawer brand={{ name: "見本", sub: "サイドの目次" }} items={items} current="list" />
    </div>
  );
}

export function Temporary() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" icon={<Icon name="menu" />} onClick={() => setOpen(true)}>目次を開く</Button>
      <Drawer variant="temporary" open={open} onOpenChange={setOpen} brand={{ name: "見本" }} items={items} current="home" />
    </>
  );
}

export function states(): StateRow[] {
  const dis: NavItem[] = [{ ...items[0]! }, { ...items[1]!, disabled: true }];
  return [
    { label: "空", na: "項目の無い目次は作らない" },
    { label: "読み込み", na: "目次の項目は先に決まっているので、読み込みを持たない。件数の印だけが遅れて出る" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", node: <div style={{ width: "min(100%, 280px)", border: "1px solid var(--color-line)" }}><Drawer items={dis} current="home" /></div>, note: "「一覧」は押せない(aria-disabled)" },
    { label: "focus", node: <div style={{ width: "min(100%, 280px)", border: "1px solid var(--color-line)" }}><Drawer items={items.slice(0, 2)} current="home" /></div>, note: "項目に Tab で入ると、2px の輪が出る" },
  ];
}
