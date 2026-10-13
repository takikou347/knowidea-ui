import { categories } from "./registry.mjs";

// 目次。href は links().href に渡す道(拡張子なし)。children を持つ物は 1 つ下の分類。
export const nav = [
  { label: "はじめに", items: [
    { href: "", label: "概要" },
    { href: "getting-started/install", label: "入れ方" },
    { href: "getting-started/react", label: "使い方 React" },
    { href: "getting-started/html", label: "素の HTML で使う" },
    { href: "getting-started/tailwind", label: "Tailwind v4 で使う" },
  ] },
  { label: "カスタマイズ", items: [
    { href: "customization/theme", label: "テーマ" },
    { label: "トークン", children: [
      { href: "customization/tokens/color", label: "色" },
      { href: "customization/tokens/typography", label: "字" },
      { href: "customization/tokens/spacing", label: "余白" },
      { href: "customization/tokens/radius", label: "角丸" },
      { href: "customization/tokens/shadow", label: "影" },
      { href: "customization/tokens/motion", label: "動き" },
    ] },
    { href: "customization/dark-mode", label: "ダークモード" },
    { href: "customization/overriding", label: "部品の上書き" },
  ] },
  { label: "部品", href: "components", items: categories.map((c) => ({ label: c.ja, id: c.id, children: c.list.map((x) => ({ href: "components/" + x.slug, label: x.ja, en: x.name })) })) },
  { label: "アイコン", items: [{ href: "icons", label: "アイコン" }] },
  { label: "見本の画面", items: [
    { href: "templates/dashboard", label: "ダッシュボード" },
    { href: "templates/list", label: "一覧と一括の操作" },
  ] },
];
