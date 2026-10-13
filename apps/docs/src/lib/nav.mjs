import { categories } from "./registry.mjs";

// サイドメニュー。href は links().href に渡すパス(拡張子なし)。children を持つ項目は 1 つ下の階層。
export const nav = [
  { label: "Getting started", items: [
    { href: "getting-started/install", label: "Installation" },
    { href: "getting-started/react", label: "Usage with React" },
    { href: "getting-started/html", label: "Plain HTML" },
    { href: "getting-started/tailwind", label: "Tailwind v4" },
  ] },
  { label: "Customization", items: [
    { href: "customization/theme", label: "Theme" },
    { label: "Tokens", children: [
      { href: "customization/tokens/color", label: "Color" },
      { href: "customization/tokens/typography", label: "Typography" },
      { href: "customization/tokens/spacing", label: "Spacing" },
      { href: "customization/tokens/radius", label: "Radius" },
      { href: "customization/tokens/shadow", label: "Shadow" },
      { href: "customization/tokens/motion", label: "Motion" },
    ] },
    { href: "customization/dark-mode", label: "Dark mode" },
    { href: "customization/overriding", label: "Overriding" },
  ] },
  { label: "Components", href: "components", items: categories.map((c) => ({ label: c.name, id: c.id, children: c.list.map((x) => ({ href: "components/" + x.slug, label: x.name })) })) },
  { label: "Icons", items: [{ href: "icons", label: "Icons" }] },
  { label: "Templates", items: [
    { href: "templates/dashboard", label: "Dashboard" },
  ] },
  { label: "Changelog", items: [{ href: "changelog", label: "Changelog" }] },
];

// 前後に移れる順のページ一覧(Previous / Next)。サイドメニューの上から下の順
export const flat = nav.flatMap((g) => [
  ...(g.href !== undefined ? [{ href: g.href, label: g.label }] : []),
  ...g.items.flatMap((it) => (it.children ? it.children : [it])),
]);

// 上のバー。section は、今いるページがどの項目の下かを決める(パスの先頭)
export const topNav = [
  { label: "Docs", href: "getting-started/install", section: ["getting-started", "customization"] },
  { label: "Components", href: "components", section: ["components"] },
  { label: "Icons", href: "icons", section: ["icons"] },
  { label: "Templates", href: "templates/dashboard", section: ["templates"] },
  { label: "Changelog", href: "changelog", section: ["changelog"] },
];
