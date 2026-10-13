// docs のビルド物を Chromium で開いて確かめる。
//  1. 全ページを 390px ライトと 1280px ダークで開き、横にはみ出さない(scrollWidth <= 画面の幅)こと、コンソールの誤りが 0 なこと
//  2. キーボード: ダイアログ(閉じ込め、Esc)、タブ(矢印)、メニュー(矢印、Esc)
// 使い方: pnpm --filter docs build の後に pnpm --filter docs check:pages
// Chromium は /opt/pw-browsers の中を直に指す(playwright install はしない)。CHROMIUM_PATH で上書きできる。
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".json": "application/json" };

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = "/opt/pw-browsers";
  for (const d of readdirSync(base).sort().reverse()) {
    for (const rel of ["chrome-linux/chrome", "chrome-linux/headless_shell", "chrome-linux64/chrome"]) {
      const p = join(base, d, rel);
      if (existsSync(p)) return p;
    }
  }
  throw new Error("Chromium が /opt/pw-browsers に無い");
}

function pagesIn(dir, rel = "") {
  const out = [];
  for (const name of readdirSync(join(dir, rel))) {
    const r = join(rel, name);
    if (statSync(join(dir, r)).isDirectory()) out.push(...pagesIn(dir, r));
    else if (name === "index.html") out.push("/" + rel.split("\\").join("/") + (rel ? "/" : ""));
  }
  return out.sort();
}

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = join(dist, p);
  if (!f.startsWith(dist) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "content-type": types[extname(f)] ?? "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox"] });
const pages = pagesIn(dist);
let fail = 0;
const report = (ok, msg) => { if (!ok) fail++; console.log((ok ? "ok  " : "NG  ") + msg); };

async function open(ctx, path, errors) {
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  // 外のホスト(Google Fonts)は空で返す。ここでは見た目の確かめだけ
  await page.route((u) => !u.href.startsWith(origin), (route) => route.fulfill({ status: 200, contentType: "text/css", body: "" }));
  await page.goto(origin + path, { waitUntil: "networkidle" });
  return page;
}

// 1. 幅とコンソール
const matrix = [
  ["390 ライト", { viewport: { width: 390, height: 844 }, colorScheme: "light" }],
  ["1280 ダーク", { viewport: { width: 1280, height: 800 }, colorScheme: "dark" }],
];
for (const [name, opts] of matrix) {
  const ctx = await browser.newContext(opts);
  for (const path of pages) {
    const errors = [];
    const page = await open(ctx, path, errors);
    const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    report(sw <= iw && errors.length === 0, `${name} ${path} scrollWidth ${sw} / ${iw}${errors.length ? "  " + errors.slice(0, 3).join(" | ") : ""}`);
    await page.close();
  }
  await ctx.close();
}

// 2. キーボード
async function kb(name, path, fn) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  const page = await open(ctx, path, errors);
  try { await fn(page); report(errors.length === 0, `キーボード ${name}`); if (errors.length) console.log("   ", errors.join(" | ")); }
  catch (e) { report(false, `キーボード ${name}: ${e.message.split("\n")[0]}`); }
  await ctx.close();
}
const inside = (page, sel) => page.evaluate((s) => !!document.activeElement?.closest(s), sel);
const assert = (c, m) => { if (!c) throw new Error(m); };

await kb("ダイアログ(閉じ込め、Esc)", "/components/dialog/", async (page) => {
  const trigger = page.getByRole("button", { name: "ダイアログを開く" }).first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dlg = page.getByRole("dialog").first();
  await dlg.waitFor({ state: "visible" });
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    assert(await inside(page, '[role="dialog"]'), `Tab ${i + 1} 回目で focus がダイアログの外に出た`);
  }
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Shift+Tab");
    assert(await inside(page, '[role="dialog"]'), `Shift+Tab ${i + 1} 回目で focus が外に出た`);
  }
  await page.keyboard.press("Escape");
  await dlg.waitFor({ state: "hidden" });
  assert(await page.evaluate(() => document.activeElement?.textContent?.includes("ダイアログを開く")), "閉じた後に focus が開いたボタンへ戻らない");

  // 確かめる形: 初めの focus は取り消し側ではなく、Esc で閉じる
  await page.getByRole("button", { name: "削除する" }).first().click();
  const alert = page.getByRole("alertdialog").first();
  await alert.waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await alert.waitFor({ state: "hidden" });
});

await kb("タブ(矢印、Tab で中身へ)", "/components/tabs/", async (page) => {
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  assert((await tabs.first().getAttribute("aria-selected")) === "true", "初めのタブが選ばれていない");
  await page.keyboard.press("ArrowRight");
  assert((await tabs.nth(1).getAttribute("aria-selected")) === "true", "ArrowRight で次のタブに移らない");
  assert(await tabs.nth(1).evaluate((el) => el === document.activeElement), "ArrowRight で focus が移らない");
  await page.keyboard.press("Tab");
  assert(await page.evaluate(() => document.activeElement?.getAttribute("role") === "tabpanel"), "Tab で選んだタブの中身へ入らない");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Home");
  assert((await tabs.first().getAttribute("aria-selected")) === "true", "Home で先頭に戻らない");
});

await kb("メニュー(矢印、Esc)", "/components/menu/", async (page) => {
  const trigger = page.getByRole("button", { name: "操作" }).first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu").first();
  await menu.waitFor({ state: "visible" });
  await page.keyboard.press("ArrowDown");
  assert(await page.evaluate(() => document.activeElement?.getAttribute("role") === "menuitem"), "矢印で項目に focus が入らない");
  const first = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("ArrowDown");
  const second = await page.evaluate(() => document.activeElement?.textContent);
  assert(first !== second, "ArrowDown で次の項目に移らない");
  await page.keyboard.press("Escape");
  await menu.waitFor({ state: "hidden" });
  assert(await page.evaluate(() => document.activeElement?.textContent?.includes("操作")), "閉じた後に focus が開いたボタンへ戻らない");
});

await browser.close();
server.close();
console.log(fail ? `\n${fail} 件が通らない` : "\n全部通った");
process.exit(fail ? 1 : 0);
