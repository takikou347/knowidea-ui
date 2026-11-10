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

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "項目のない切り替えは作らない。中身が空の時の見せ方は、中に置く画面が決める" },
    { label: "Loading", na: "枠は先に決まっているため、ローディング状態を持たない。中身の読み込みは、中に置く画面が Skeleton で示す" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", node: <div style={frame}><AppShell items={[items[0]!, { ...items[1]!, disabled: true }, items[2]!]} current="home" minHeight="12rem"><div style={{ padding: "var(--space-4)" }}>中身</div></AppShell></div>, note: "押せない項目は、切り替えの中で薄く出る" },
    { label: "Focus", text: "切り替えの項目に Tab で移り、2px のリングが出る。見えていない方の切り替えには focus が移らない" },
  ];
}
