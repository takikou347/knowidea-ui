// AppShell と Drawer の左上の名前と、左の切り替えの開け閉めのテスト。pnpm --filter knowidea-ui build の後に node --test で回す
import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppShell, Drawer } from "../dist/index.js";

const items = [
  { id: "home", label: "ホーム", icon: "home", href: "#home" },
  { id: "list", label: "一覧", icon: "list", href: "#list", count: 3 },
];
const shell = (props) => renderToStaticMarkup(createElement(AppShell, { items, current: "home", ...props }, "中身"));
const drawer = (props) => renderToStaticMarkup(createElement(Drawer, { items, current: "home", ...props }));

test("brand に href を渡すと、左上は名前のリンクになり、その href へ移る", () => {
  const html = drawer({ brand: { name: "見本のアプリ", href: "/" } });
  assert.match(html, /<a class="ki-drawer__brand" href="\/">/);
  assert.match(html, /<b>見本のアプリ<\/b>/);
});

test("brand に href が無い時は、今までと同じくリンクにしない", () => {
  const html = drawer({ brand: { name: "見本のアプリ" } });
  assert.match(html, /<p class="ki-drawer__brand"><b>見本のアプリ<\/b><\/p>/);
  assert.doesNotMatch(html, /<a class="ki-drawer__brand"/);
});

test("brand の logo にアイコンの名前を渡すと、名前の前にそのアイコンを描く", () => {
  const html = drawer({ brand: { name: "見本のアプリ", href: "/", logo: "sidebar" } });
  assert.match(html, /<a class="ki-drawer__brand" href="\/"><span class="ki-drawer__logo"><svg[^>]*class="ki-icon"/);
});

test("brand の logo に要素を渡すと、そのまま描く", () => {
  const html = drawer({ brand: { name: "見本のアプリ", logo: createElement("img", { src: "/logo.svg", alt: "" }) } });
  assert.match(html, /<span class="ki-drawer__logo"><img src="\/logo.svg" alt=""\/><\/span>/);
});

test("既定では開け閉めのボタンを出さず、閉じない", () => {
  const html = shell({ brand: { name: "見本のアプリ" } });
  assert.doesNotMatch(html, /aria-expanded/);
  assert.doesNotMatch(html, /data-collapsed/);
});

test("collapsible を渡すと、開いた状態で aria-expanded=true のボタンを出す", () => {
  const html = shell({ brand: { name: "見本のアプリ" }, collapsible: true });
  assert.match(html, /<button[^>]*class="ki-button ki-icon-button ki-drawer__toggle"[^>]*aria-label="サイドメニュー"[^>]*aria-expanded="true"|aria-expanded="true"[^>]*aria-label="サイドメニュー"/);
  assert.doesNotMatch(html, /data-collapsed/);
});

test("defaultCollapsed で閉じると、枠と左の切り替えに印が付き、ボタンは aria-expanded=false", () => {
  const html = shell({ brand: { name: "見本のアプリ" }, collapsible: true, defaultCollapsed: true });
  assert.match(html, /<div class="ki-shell" data-side-collapsed="">/);
  assert.match(html, /class="ki-drawer ki-shell__side" data-variant="permanent" data-collapsed=""/);
  assert.match(html, /aria-expanded="false"/);
});

test("閉じた時の項目は、名前を aria-label で持ち、件数も読み上げる", () => {
  const html = drawer({ collapsible: true, collapsed: true });
  assert.match(html, /<a class="ki-drawer__item"[^>]*aria-label="ホーム"/);
  assert.match(html, /<a class="ki-drawer__item"[^>]*aria-label="一覧、3 件"/);
});

test("collapsed を渡すと制御になり、defaultCollapsed より先に効く", () => {
  const html = shell({ collapsible: true, collapsed: false, defaultCollapsed: true });
  assert.doesNotMatch(html, /data-collapsed/);
  assert.match(html, /aria-expanded="true"/);
});

test("collapsible が無い時は collapsed を渡しても閉じない", () => {
  assert.doesNotMatch(shell({ collapsed: true }), /data-collapsed/);
});
