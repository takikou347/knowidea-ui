import { AppBar, AppShell, type NavItem } from "knowidea-ui";
import type { StateRow } from "./types";

const items: NavItem[] = [
  { id: "home", label: "ホーム", icon: "home", href: "#home" },
  { id: "list", label: "一覧", icon: "list", href: "#list", count: 3 },
  { id: "calendar", label: "予定", icon: "calendar", href: "#calendar" },
  { id: "settings", label: "設定", icon: "settings", href: "#settings" },
];

const frame = { width: "100%", border: "1px solid var(--color-line)", borderRadius: "var(--radius-3)", overflow: "hidden" } as const;

export function Basic() {
  return (
    <div style={frame}>
      <AppShell items={items} current="home" brand={{ name: "見本のアプリ" }} minHeight="24rem" header={<AppBar title="ホーム" headingLevel={3} />}>
        <div style={{ padding: "var(--space-4)" }}>
          <p style={{ marginTop: 0 }}>画面の中身はここに入る。</p>
          <p>幅が 1024px 以上なら左に、それより狭ければ下に、画面の切り替えが出る。</p>
        </div>
      </AppShell>
    </div>
  );
}

const many: NavItem[] = [
  { id: "home", label: "ホーム", icon: "home", href: "#home" },
  { id: "staff", label: "社員と仕事", icon: "users", href: "#staff" },
  { id: "goals", label: "目的", icon: "flag", href: "#goals" },
  { id: "office", label: "オフィス", icon: "buildings", href: "#office" },
  { id: "services", label: "サービス", icon: "lightbulb", href: "#services" },
  { id: "guard", label: "守り", icon: "stop", href: "#guard" },
  { id: "records", label: "記録", icon: "chart-bar", href: "#records" },
  { id: "settings", label: "設定", icon: "settings", href: "#settings" },
];

const manyBottom: NavItem[] = [
  many[0]!,
  many[1]!,
  many[4]!,
  many[5]!,
  { id: "more", label: "その他", icon: "more", href: "#more" },
];

export function Many() {
  return (
    <div style={frame}>
      <AppShell items={many} current="records" bottomItems={manyBottom} bottomCurrent="more" brand={{ name: "見本のアプリ" }} minHeight="24rem" header={<AppBar title="記録" headingLevel={3} />}>
        <div style={{ padding: "var(--space-4)" }}>
          <p style={{ marginTop: 0 }}>左には 8 つの画面がすべて出る。</p>
          <p>下には主な 4 つと「その他」だけが出る。「記録」は下に無いので、「その他」に今いる印が付く。</p>
        </div>
      </AppShell>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "項目のない切り替えは作らない。中身が空の時の見せ方は、中に置く画面が決める" },
    { label: "Loading", na: "枠は先に決まっているため、ローディング状態を持たない。中身の読み込みは、中に置く画面が Skeleton で示す" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", node: <div style={frame}><AppShell items={[items[0]!, { ...items[1]!, disabled: true }, items[2]!]} current="home" minHeight="12rem"><div style={{ padding: "var(--space-4)" }}>中身</div></AppShell></div>, note: "押せない項目は、切り替えの中で薄く出る" },
    { label: "Focus", text: "切り替えの項目に Tab で移り、2px のリングが出る。見えていない方の切り替えには focus が移らない" },
  ];
}
