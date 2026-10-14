import { BottomNavigation, type NavItem } from "knowidea-ui";
import type { StateRow } from "./types";

const items: NavItem[] = [
  { id: "home", label: "ホーム", icon: "home", href: "#home" },
  { id: "list", label: "一覧", icon: "list", href: "#list", count: 3 },
  { id: "calendar", label: "予定", icon: "calendar", href: "#calendar" },
  { id: "settings", label: "設定", icon: "settings", href: "#settings" },
];

export function Basic() {
  return (
    <div style={{ width: "min(100%, 390px)", border: "1px solid var(--color-line)", borderRadius: "var(--radius-3)", overflow: "hidden" }}>
      <BottomNavigation items={items} current="home" />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "項目のないナビゲーションは作らない" },
    { label: "Loading", na: "項目は先に決まっているため、ローディング状態を持たない" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", node: <div style={{ width: "min(100%, 390px)", border: "1px solid var(--color-line)" }}><BottomNavigation items={[items[0]!, { ...items[1]!, disabled: true }, items[2]!]} current="home" /></div> },
    { label: "Focus", node: <div style={{ width: "min(100%, 390px)", border: "1px solid var(--color-line)" }}><BottomNavigation items={items.slice(0, 3)} current="list" /></div>, note: "項目に Tab で移ると、2px のリングが表示される" },
  ];
}
