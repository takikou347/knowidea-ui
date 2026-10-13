// docs のビルド物を Chromium で開いて確かめる。
//  1. 全ページを 390px ライトと 1280px ダークで開き、横にはみ出さない(scrollWidth <= 画面の幅)こと、コンソールの誤りが 0 なこと
//  1b. 390px で、見える押せる物(a、button、[role=tab]、input など)が 44x44 以上なこと
//  すべて dist を /a/b/ の下で配って確かめる(どの場所に置いても壊れないこと。404 はコンソールの誤りに出る)
//  2. 操作: ダイアログ(閉じ込め、Esc)、確かめる操作、タブ、メニュー、アコーディオン、グラフ、目次の引き出し(390px)、検索、テーマを試す所、アイコンの一覧
// 使い方: pnpm --filter @knowidea/docs build の後に pnpm --filter @knowidea/docs check:pages
// ONLY=メニュー のように名前の一部を渡すと、その操作だけ回す
// Chromium は /opt/pw-browsers の中を直に指す(playwright install はしない)。CHROMIUM_PATH で上書きできる。
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const failedRequests = [];
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

// 場所に依らないことを確かめるため、わざと深い場所の下で配る
const PREFIX = "/a/b/";
function pagesIn(dir, rel = "") {
  const out = [];
  for (const name of readdirSync(join(dir, rel))) {
    const r = join(rel, name);
    if (statSync(join(dir, r)).isDirectory()) { if (name !== "assets") out.push(...pagesIn(dir, r)); }
    else if (name.endsWith(".html")) out.push(PREFIX + r.split("\\").join("/"));
  }
  return out.sort();
}

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!p.startsWith(PREFIX)) { res.writeHead(404); res.end("not found"); return; }
  p = p.slice(PREFIX.length - 1);
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
for (const [name, opts] of process.env.ONLY ? [] : matrix) {
  const ctx = await browser.newContext(opts);
  for (const path of pages) {
    const errors = [];
    const page = await open(ctx, path, errors);
    const { sw, iw, broken } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, iw: window.innerWidth,
      broken: [...document.images].filter((i) => i.offsetParent !== null && !i.naturalWidth).map((i) => i.getAttribute("src")),
    }));
    if (broken.length) errors.push("読めない画像: " + broken.join(", "));
    report(sw <= iw && errors.length === 0, `${name} ${path} scrollWidth ${sw} / ${iw}${errors.length ? "  " + errors.slice(0, 3).join(" | ") : ""}`);
    await page.close();
  }
  await ctx.close();
}

// 1b. 押せる所の大きさ(390px)。除く: 文中の inline のリンク(行の高さで決まり、44px にできない)、sr-only の隠した物
if (!process.env.ONLY) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
  for (const path of pages) {
    const page = await open(ctx, path, []);
    const small = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('a[href], button, [role="tab"], [role="button"], input, select, textarea, summary')) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[hidden], [aria-hidden='true'], [inert]")) continue;
        if (el.tagName === "A" && cs.display === "inline" && el.parentElement && el.parentElement.textContent.trim() !== el.textContent.trim()) continue;
        if (el.closest(".ki-chart__col")) continue; // 30 本の棒は 44px に収まらない。前の日と次の日のボタンで同じ操作ができる
        let box = el;
        if (el.tagName === "INPUT" && ["checkbox", "radio"].includes(el.type)) box = el.closest("label") ?? document.querySelector(`label[for="${el.id}"]`) ?? el; // 選ぶ枠は label 全体で押せる
        if (getComputedStyle(el, "::after").position === "absolute") { // ::after で行全体に広げたリンクは、広げた先の箱で測る
          let p = el.parentElement;
          while (p && getComputedStyle(p).position === "static") p = p.parentElement;
          if (p) box = p;
        }
        const r = box.getBoundingClientRect();
        if (r.right < 0 || r.bottom < 0 || r.left >= innerWidth) continue; // 画面の外(スキップリンクは focus で出る)
        if (r.width === 0 || r.height === 0) continue;
        if (r.width < 43.5 || r.height < 43.5) out.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""} ${Math.round(r.width)}x${Math.round(r.height)}${box !== el ? " in ." + String(box.className).split(" ")[0] : ""} 「${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 16)}」`);
      }
      return out;
    });
    report(small.length === 0, `390 押せる所 44px ${path}${small.length ? "  " + small.slice(0, 4).join(" | ") + (small.length > 4 ? ` ほか ${small.length - 4}` : "") : ""}`);
    await page.close();
  }
  await ctx.close();
}

// 2. 操作
async function kb(name, path, fn, viewport = { width: 1280, height: 800 }) {
  if (process.env.ONLY && !name.includes(process.env.ONLY)) return;
  const ctx = await browser.newContext({ viewport });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin }).catch(() => {});
  const errors = [];
  const page = await open(ctx, PREFIX + path, errors);
  try { await fn(page); report(errors.length === 0, `操作 ${name}`); if (errors.length) console.log("   ", errors.join(" | ")); }
  catch (e) { report(false, `操作 ${name}: ${e.message.split("\n").slice(0, process.env.ONLY ? 8 : 1).join(" / ")}`); }
  await ctx.close();
}
const inside = (page, sel) => page.evaluate((s) => !!document.activeElement?.closest(s), sel);
const assert = (c, m) => { if (!c) throw new Error(m); };
const press = async (page, key) => { await page.keyboard.press(key); await page.waitForTimeout(120); };

await kb("ダイアログ(閉じ込め、Esc、戻る)", "components/dialog.html", async (page) => {
  const trigger = page.getByRole("button", { name: "ダイアログを開く" }).first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dlg = page.getByRole("dialog").first();
  await dlg.waitFor({ state: "visible" });
  for (let i = 0; i < 8; i++) {
    await press(page, "Tab");
    assert(await inside(page, '[role="dialog"]'), `Tab ${i + 1} 回目で focus がダイアログの外に出た`);
  }
  for (let i = 0; i < 8; i++) {
    await press(page, "Shift+Tab");
    assert(await inside(page, '[role="dialog"]'), `Shift+Tab ${i + 1} 回目で focus が外に出た`);
  }
  await page.keyboard.press("Escape");
  await dlg.waitFor({ state: "hidden" });
  assert(await page.evaluate(() => document.activeElement?.textContent?.includes("ダイアログを開く")), "閉じた後に focus が開いたボタンへ戻らない");
});

await kb("確かめる操作(取り消し側が先 → 依頼中 → 止めた)", "components/dialog.html", async (page) => {
  await page.getByRole("button", { name: "止める" }).first().click();
  const dlg = page.getByRole("alertdialog").first();
  await dlg.waitFor({ state: "visible" });
  assert(await page.evaluate(() => document.activeElement?.textContent?.includes("やめる")), "確かめる画面の初めの focus が取り消し側でない");
  await page.getByRole("button", { name: "止める依頼を出す" }).click();
  await page.getByText("依頼中").first().waitFor({ state: "visible" });
  await page.getByText("止めた", { exact: true }).first().waitFor({ state: "visible", timeout: 4000 });
});

await kb("タブ(矢印、Tab で中身へ)", "components/tabs.html", async (page) => {
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  assert((await tabs.first().getAttribute("aria-selected")) === "true", "初めのタブが選ばれていない");
  await press(page, "ArrowRight");
  assert(await tabs.nth(1).evaluate((el) => el === document.activeElement), "ArrowRight で focus が次のタブに移らない");
  await press(page, "Enter");
  assert((await tabs.nth(1).getAttribute("aria-selected")) === "true", "Enter で選べない");
  await press(page, "Tab");
  assert(await page.evaluate(() => document.activeElement?.getAttribute("role") === "tabpanel"), "Tab で選んだタブの中身へ入らない");
});

await kb("メニュー(矢印、Esc)", "components/menu.html", async (page) => {
  const trigger = page.getByRole("button", { name: "操作", exact: true }).first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.locator('[role="menu"][data-open]').first();
  await menu.waitFor({ state: "visible" });
  await press(page, "ArrowDown");
  assert(await page.evaluate(() => document.activeElement?.getAttribute("role") === "menuitem"), "矢印で項目に focus が入らない");
  const first = await page.evaluate(() => document.activeElement?.textContent);
  await press(page, "ArrowDown");
  assert(first !== (await page.evaluate(() => document.activeElement?.textContent)), "ArrowDown で次の項目に移らない");
  await press(page, "Escape");
  await menu.waitFor({ state: "detached" });
  // Base UI は popup を外した後の次のフレームで focus を戻す。detached の直後は body にいる瞬間があるので、戻るまで待つ
  const back = await page
    .waitForFunction(() => document.activeElement?.textContent?.includes("操作"), null, { timeout: 2000 })
    .then(() => true, () => false);
  assert(back, "閉じた後に focus が開いたボタンへ戻らない");
});

await kb("アコーディオン(Enter で開く、閉じる)", "components/accordion.html", async (page) => {
  const trig = page.locator('button[aria-expanded]').filter({ hasText: /./ }).first();
  await trig.focus();
  const before = await trig.getAttribute("aria-expanded");
  await press(page, "Enter");
  assert((await trig.getAttribute("aria-expanded")) !== before, "Enter で開閉しない");
  await press(page, "Enter");
  assert((await trig.getAttribute("aria-expanded")) === before, "もう一度 Enter で戻らない");
});

await kb("グラフ(矢印で選ぶ、押すと値)", "components/chart.html", async (page) => {
  const readout = page.locator(".ki-chart__readout-main").first();
  const before = await readout.textContent();
  const cols = page.locator(".ki-chart").first().locator('.ki-chart__col[role="button"]');
  await cols.last().focus();
  await press(page, "ArrowLeft");
  assert((await readout.textContent()) !== before, "ArrowLeft で選んだ日が変わらない");
  assert((await cols.nth(28).getAttribute("aria-pressed")) === "true", "ArrowLeft で 1 つ前の列が選ばれない");
  await press(page, "Home");
  assert((await readout.textContent()).includes("9 月 14 日"), "Home で先頭の日に移らない");
  await cols.nth(16).click();
  assert((await readout.textContent()).includes("記録なし"), "数の無い日(9/30)が「記録なし」にならない");
});

await kb("目次の引き出し(390px で開く、Esc、押して移る)", "components/button.html", async (page) => {
  const nav = page.locator("#docs-drawer");
  assert(!(await nav.isVisible()), "初めから目次が開いている");
  await page.getByRole("button", { name: "目次を開く" }).click();
  await nav.waitFor({ state: "visible" });
  assert(await inside(page, "#docs-drawer"), "開いても focus が目次に入らない");
  await page.keyboard.press("Escape");
  await nav.waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "目次を開く" }).click();
  await nav.waitFor({ state: "visible" });
  await nav.locator("summary", { hasText: /^面$/ }).click(); // 目次の分類は閉じている
  await nav.getByRole("link", { name: "カード", exact: true }).first().click();
  await page.waitForURL(/components\/card\.html/);
}, { width: 390, height: 844 });

await kb("検索(入力、矢印、Enter で移る)", "index.html", async (page) => {
  const q = page.getByRole("combobox", { name: "部品を名前で探す" });
  await q.fill("chip");
  const opts = page.getByRole("option");
  await opts.first().waitFor({ state: "visible" });
  await press(page, "ArrowDown");
  await press(page, "Enter");
  await page.waitForURL(/components\/chip\.html/);
});

await kb("ダークとライトの切り替え", "index.html", async (page) => {
  const t = page.locator("#theme-toggle");
  const seen = new Set();
  for (let i = 0; i < 3; i++) { await t.click(); seen.add(await page.evaluate(() => document.documentElement.dataset.theme ?? "auto")); }
  assert(seen.has("dark") && seen.has("light"), "ライトとダークの両方に切り替わらない: " + [...seen].join(","));
});

await kb("テーマを試す所(色を変えると比が変わる、警告、書き出し)", "customization/theme.html", async (page) => {
  const table = page.locator('[data-testid="contrast"]');
  const first = await table.textContent();
  assert(first.includes("5.77:1") || /\d\.\d\d:1/.test(first), "初めの比が出ない");
  assert(!(await table.textContent()).includes("届かない"), "ブランドの色で警告が出ている");
  await page.getByRole("button", { name: "黄(足りない例)" }).click();
  assert((await table.textContent()).includes("届かない"), "薄い黄で警告が出ない");
  assert((await page.getByText("4.5:1 に届かない", { exact: false }).count()) > 0, "警告の文が出ない");
  const code = await page.locator("#tc-code ~ .ki-code").first().textContent().catch(() => "");
  const all = await page.locator(".tc").textContent();
  assert(all.includes("--color-primary: oklch("), "書き出しの CSS に主の色が入らない");
  await page.getByLabel("色の値").fill("#2358B0");
  assert(!(await table.textContent()).includes("届かない"), "青で警告が残る");
  await page.getByRole("button", { name: "ブランド" }).click();
  await page.locator("#tc-radius").fill("8");
  assert((await page.locator(".tc").textContent()).includes("--radius-2: 8px"), "角丸が書き出しに出ない");
});

await kb("アイコン(探す、太さ、写す)", "icons.html", async (page) => {
  const count = async () => page.locator(".ib-tile").count();
  const all = await count();
  assert(all > 100, "アイコンが出ない");
  await page.getByLabel("名前で探す", { exact: true }).fill("calendar");
  const n = await count();
  assert(n >= 1 && n < all, "探しても絞られない");
  await page.getByRole("button", { name: "bold" }).click();
  await page.locator(".ib-tile").first().click();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  assert(clip.startsWith("import {") && clip.includes("@knowidea/icons/react"), "import の行が写っていない: " + clip);
  await page.getByRole("button", { name: "SVG を写す" }).click();
  const svg = await page.evaluate(() => navigator.clipboard.readText());
  assert(svg.startsWith("<svg"), "SVG が写っていない");
  await page.getByLabel("名前で探す", { exact: true }).fill("zzzz");
  assert((await count()) === 0, "合わない語で 0 件にならない");
});

await kb("「コードを見る」と写す(部品のページ)", "components/button.html", async (page) => {
  const d = page.locator("details.demo-code").first();
  await d.locator("summary").focus();
  await press(page, "Enter");
  assert(await d.evaluate((el) => el.open), "コードを見るが開かない");
  await d.getByRole("button", { name: /写す|コピー/ }).first().click();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  const shown = await d.locator("pre").first().textContent();
  const norm = (t) => t.replace(/[\s\u200b]/g, "");
  assert(norm(clip) === norm(shown) && clip.includes("Button"), "写した文字が表示と違う");
});

await kb("見本の画面(一覧: 選んで保管、元に戻す)", "templates/list.html", async (page) => {
  const bar = page.getByRole("button", { name: "保管する" });
  assert(await bar.isDisabled(), "選ぶ前に保管できる");
  await page.getByRole("checkbox", { name: "デザインの見直し を選ぶ" }).click();
  assert(!(await bar.isDisabled()), "選んでも保管できない");
  await bar.click();
  await page.getByText("1 件を保管した。").waitFor({ state: "visible" });
  await page.getByRole("button", { name: "元に戻す" }).click();
});

await browser.close();
server.close();
console.log(fail ? `\n${fail} 件が通らない` : "\n全部通った");
process.exit(fail ? 1 : 0);
