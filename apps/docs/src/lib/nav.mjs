import { categories } from "./registry.mjs";

// サイドメニュー。href は links().href に渡すパス(拡張子なし)。children を持つ項目は 1 つ下の階層。
export const nav = [
  { label: "Getting started", items: [
    { href: "", label: "Overview" },
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
    { href: "templates/list", label: "List" },
  ] },
];
