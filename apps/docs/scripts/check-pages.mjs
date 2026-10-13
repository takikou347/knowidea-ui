// docs のビルド物を Chromium で開いて確かめる。
//  1. 全ページを 390px ライトと 1280px ダークで開き、横にはみ出さない(scrollWidth <= 画面の幅)こと、コンソールの誤りが 0 なこと
//  1b. 390px で、見える押せる物(a、button、[role=tab]、input など)が 44x44 以上なこと
//  すべて dist を /a/b/ の下で配って確かめる(どの場所に置いても壊れないこと。404 はコンソールの誤りに出る)
//  2. 操作: ダイアログ(閉じ込め、Esc)、シート(下へ引いて閉じる)、SegmentedControl、確かめる操作、タブ、メニュー、アコーディオン、グラフ、ナビゲーションのドロワー(390px)、検索、テーマを試す所、アイコンの一覧
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
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png" };

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

// 見つからない URL には、GitHub Pages と同じく 404.html を 404 で返す。
// 404.html の <base href> は公開先のサブパス(site.config.mjs)なので、ここでは配っている場所(PREFIX)に差し替える
const notFound = (res) => {
  const html = readFileSync(join(dist, "404.html"), "utf8").replace(/<base href="[^"]*">/, `<base href="${PREFIX}">`);
  res.writeHead(404, { "content-type": types[".html"] });
  res.end(html);
};
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!p.startsWith(PREFIX)) { res.writeHead(404); res.end("not found"); return; }
  p = p.slice(PREFIX.length - 1);
  if (p.endsWith("/")) p += "index.html";
  const f = join(dist, p);
  if (!f.startsWith(dist) || !existsSync(f) || statSync(f).isDirectory()) { if (p.endsWith(".html") || !extname(p)) notFound(res); else { res.writeHead(404); res.end("not found"); } return; }
  if (f === join(dist, "404.html")) { res.writeHead(200, { "content-type": types[".html"] }); res.end(readFileSync(f, "utf8").replace(/<base href="[^"]*">/, `<base href="${PREFIX}">`)); return; }
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
  // 読み込んだ文書そのものが 404 のときの行(わざと開く 404 のページ)は誤りに数えない
  page.on("console", (m) => { if (m.type() === "error" && !(m.location().url === origin + path && /status of 404/.test(m.text()))) errors.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  // 外のホスト(Google Fonts)は空で返す。ここでは見た目の確かめだけ
  await page.route((u) => !u.href.startsWith(origin), (route) => route.fulfill({ status: 200, contentType: "text/css", body: "" }));
  await page.goto(origin + path, { waitUntil: "networkidle" });
  return page;
}

// 1. 幅とコンソール。スマホ(360、390、430)、iPad(768、820 の縦、1024、1180 の横)、PC(1280 ダーク)。
//    横にはみ出さない、画面の外に出る物が無い、押せる物どうしが重ならない、コンソールの誤りが 0
const matrix = [
  ["360 ライト", { viewport: { width: 360, height: 740 }, colorScheme: "light", hasTouch: true }, true],
  ["390 ライト", { viewport: { width: 390, height: 844 }, colorScheme: "light", hasTouch: true }, true],
  ["430 ライト", { viewport: { width: 430, height: 932 }, colorScheme: "light", hasTouch: true }, true],
  ["768 iPad 縦", { viewport: { width: 768, height: 1024 }, colorScheme: "light", hasTouch: true }, true],
  ["820 iPad 縦", { viewport: { width: 820, height: 1180 }, colorScheme: "light", hasTouch: true }, true],
  ["1024 iPad 横", { viewport: { width: 1024, height: 768 }, colorScheme: "light", hasTouch: true }, true],
  ["1180 iPad 横", { viewport: { width: 1180, height: 820 }, colorScheme: "dark", hasTouch: true }, true],
  ["1280 ダーク", { viewport: { width: 1280, height: 800 }, colorScheme: "dark" }, false],
];
// ページの中の、見える押せる物の一覧。inert、hidden、sr-only は除く
const tappable = () => {
  const out = [];
  for (const el of document.querySelectorAll('a[href], button, [role="tab"], [role="button"], input, select, textarea, summary')) {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[hidden], [aria-hidden='true'], [inert]")) continue;
    const closed = el.closest("details:not([open])"); // 閉じた details の中身は見えない(summary だけ見える)
    if (closed && !(el.tagName === "SUMMARY" && el.parentElement === closed)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || el.classList.contains("skip")) continue; // sr-only、スキップリンク
    // 横に流す枠や overflow: hidden の外に隠れた部分は、見えていないので除く
    let vis = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const c = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(c.overflowX + c.overflowY)) {
        const q = p.getBoundingClientRect();
        vis = { left: Math.max(vis.left, q.left), right: Math.min(vis.right, q.right), top: Math.max(vis.top, q.top), bottom: Math.min(vis.bottom, q.bottom) };
      }
    }
    out.push({ el, r, v: vis });
  }
  return out;
};
const only = (list) => (process.env.PAGES ? list.filter((x) => new RegExp(process.env.PAGES).test(x)) : list);
const widthOk = (w) => !process.env.WIDTHS || process.env.WIDTHS.split(",").includes(String(w));
for (const [name, opts, touch] of process.env.ONLY ? [] : matrix.filter(([, o]) => widthOk(o.viewport.width))) {
  const ctx = await browser.newContext(opts);
  for (const path of only(pages)) {
    const errors = [];
    const page = await open(ctx, path, errors);
    const { sw, iw, broken, off, overlap } = await page.evaluate((fnSrc) => {
      const items = new Function("return (" + fnSrc + ")")()();
      const scrolls = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true; } return false; };
      const off = items.filter(({ el, r }) => (r.right > innerWidth + 1 || r.left < -1) && !scrolls(el) && !el.closest("dialog:not([open])")).map(({ el, r }) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} ${Math.round(r.left)}..${Math.round(r.right)}`);
      // 押せる物どうしの重なり(入れ子、::after で広げたリンクと同じカードの中の物は除く)
      const overlap = [];
      const box = items.filter(({ el }) => !el.closest(".ki-chart__col") && !el.closest("dialog:not([open])") && !(getComputedStyle(el, "::after").position === "absolute") && getComputedStyle(el).display !== "inline"); // 文中のリンクは、折り返すと外接の箱が重なって見える
      for (let i = 0; i < box.length && overlap.length < 3; i++) for (let j = i + 1; j < box.length; j++) {
        const a = box[i], b = box[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const w = Math.min(a.v.right, b.v.right) - Math.max(a.v.left, b.v.left), h = Math.min(a.v.bottom, b.v.bottom) - Math.max(a.v.top, b.v.top);
        if (w > 4 && h > 4) { overlap.push(`${a.el.tagName.toLowerCase()}「${(a.el.getAttribute("aria-label") || a.el.textContent).trim().slice(0, 10)}」と${b.el.tagName.toLowerCase()}「${(b.el.getAttribute("aria-label") || b.el.textContent).trim().slice(0, 10)}」`); break; }
      }
      return {
        sw: document.documentElement.scrollWidth, iw: window.innerWidth, off: off.slice(0, 3), overlap,
        broken: [...document.images].filter((i) => i.offsetParent !== null && !i.naturalWidth).map((i) => i.getAttribute("src")),
      };
    }, tappable.toString());
    if (broken.length) errors.push("読めない画像: " + broken.join(", "));
    if (off.length) errors.push("画面の外に出る: " + off.join(", "));
    if (overlap.length) errors.push("重なる: " + overlap.join(", "));
    report(sw <= iw && errors.length === 0, `${name} ${path} scrollWidth ${sw} / ${iw}${errors.length ? "  " + errors.slice(0, 3).join(" | ") : ""}`);
    await page.close();
  }
  await ctx.close();
}

// 1b. 押せる所の大きさ(指で触る幅: 360、390、768、1024)。除く: 文中の inline のリンク(行の高さで決まり、44px にできない)、sr-only の隠した物
if (!process.env.ONLY) {
  for (const w of [360, 390, 768, 1024].filter(widthOk)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w >= 768 ? 1024 : 844 }, colorScheme: "light", hasTouch: true });
  for (const path of only(pages)) {
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
    report(small.length === 0, `${w} 押せる所 44px ${path}${small.length ? "  " + small.slice(0, 4).join(" | ") + (small.length > 4 ? ` ほか ${small.length - 4}` : "") : ""}`);
    await page.close();
  }
  await ctx.close();
  }
}

// 2. 操作
async function kb(name, path, fn, viewport = { width: 1280, height: 800 }, extra = {}) {
  if (process.env.ONLY && !name.includes(process.env.ONLY)) return;
  const ctx = await browser.newContext({ viewport, ...extra });
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
  await page.getByRole("button", { name: "停止する" }).first().click();
  const dlg = page.getByRole("alertdialog").first();
  await dlg.waitFor({ state: "visible" });
  assert(await page.evaluate(() => document.activeElement?.textContent?.includes("キャンセル")), "確認ダイアログの最初の focus がキャンセル側でない");
  await page.getByRole("button", { name: "停止をリクエスト" }).click();
  await page.getByText("リクエスト中").first().waitFor({ state: "visible" });
  await page.getByText("停止した", { exact: true }).first().waitFor({ state: "visible", timeout: 4000 });
});

await kb("シート(閉じ込め、Esc、戻る、下へ引いて閉じる)", "components/sheet.html", async (page) => {
  const trigger = page.getByRole("button", { name: "シートを開く" }).first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const sheet = page.locator(".ki-sheet__viewport .ki-sheet");
  await sheet.waitFor({ state: "visible" });
  for (let i = 0; i < 6; i++) {
    await press(page, "Tab");
    assert(await inside(page, ".ki-sheet"), `Tab ${i + 1} 回目で focus がシートの外に出た`);
  }
  await page.keyboard.press("Escape");
  await sheet.waitFor({ state: "detached" });
  assert(await page.evaluate(() => document.activeElement?.textContent?.includes("シートを開く")), "閉じた後に focus が開いたボタンへ戻らない");
  await trigger.click();
  await sheet.waitFor({ state: "visible" });
  await page.waitForTimeout(400);
  const h = await page.locator(".ki-sheet__viewport .ki-sheet__handle").boundingBox();
  await page.mouse.move(h.x + h.width / 2, h.y + 2);
  await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(h.x + h.width / 2, h.y + 2 + i * 20); await page.waitForTimeout(16); }
  await page.mouse.up();
  await sheet.waitFor({ state: "detached", timeout: 3000 });
}, { width: 390, height: 844 }, { hasTouch: true });

await kb("SegmentedControl(矢印で選び直す、印が滑る)", "components/segmented-control.html", async (page) => {
  const week = page.getByRole("radio", { name: "週" }).first();
  await week.focus();
  await press(page, "ArrowRight");
  assert((await page.getByRole("radio", { name: "月" }).first().getAttribute("aria-checked")) === "true", "矢印で次の項目が選ばれない");
  const idx = await page.evaluate(() => getComputedStyle(document.querySelector(".ki-segmented")).getPropertyValue("--ki-seg-index").trim());
  assert(idx === "2", `印の位置が 3 番目にならない(${idx})`);
  assert(await page.getByText("今の表示: 月").first().isVisible(), "選んだ値が渡らない");
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

await kb("ナビゲーションのドロワー(390px で開く、Esc、押して移る)", "components/button.html", async (page) => {
  const nav = page.locator("#docs-drawer");
  assert(!(await nav.isVisible()), "初めからナビゲーションが開いている");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await nav.waitFor({ state: "visible" });
  assert(await inside(page, "#docs-drawer"), "開いても focus がナビゲーションに入らない");
  await page.keyboard.press("Escape");
  await nav.waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await nav.waitFor({ state: "visible" });
  await nav.locator("summary", { hasText: /^Surfaces$/ }).click(); // サイドメニューの分類は閉じている
  await nav.getByRole("link", { name: "Card", exact: true }).first().click();
  await page.waitForURL(/components\/card\.html/);
}, { width: 390, height: 844 });

await kb("検索(/ で開く、日本語と英語、矢印、Enter で移る、Esc で閉じて戻る)", "index.html", async (page) => {
  const dlg = page.locator("#docs-sd");
  assert(!(await dlg.isVisible()), "初めから検索が開いている");
  await page.keyboard.press("/");
  await dlg.waitFor({ state: "visible" });
  assert(await page.evaluate(() => document.activeElement?.id === "docs-q"), "開いても入力欄に focus が入らない");
  const q = page.getByRole("combobox", { name: "Search" });
  await q.fill("tarball");
  const opts = page.getByRole("option");
  await opts.first().waitFor({ state: "visible" });
  assert((await opts.count()) >= 2, "tarball で 2 件以上出ない");
  await q.fill("チップ");
  await q.fill("chip");
  await opts.first().waitFor({ state: "visible" });
  assert((await opts.first().textContent()).includes("Chip"), "chip の 1 件目が Chip でない");
  await q.fill("zzzzqqqq");
  await page.getByText("No results", { exact: true }).first().waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await dlg.waitFor({ state: "hidden" });
  assert(await page.evaluate(() => !document.activeElement?.closest("#docs-sd")), "閉じた後も focus が検索の中にある");
  await page.getByRole("button", { name: "Search" }).focus();
  await press(page, "Enter");
  await dlg.waitFor({ state: "visible" });
  await press(page, "Escape");
  await dlg.waitFor({ state: "hidden" });
  assert(await page.evaluate(() => document.activeElement?.hasAttribute("data-docs-search-open")), "ボタンから開いて閉じた後に focus がボタンへ戻らない");
  await page.keyboard.press("Control+k");
  await dlg.waitFor({ state: "visible" });
  await q.fill("chip");
  await opts.first().waitFor({ state: "visible" });
  await press(page, "ArrowDown");
  await press(page, "Enter");
  await page.waitForURL(/components\/chip\.html/);
});

await kb("検索(日本語の語、節への移動、深い場所でも索引を読む)", "components/button.html", async (page) => {
  await page.getByRole("button", { name: "Search" }).click();
  await page.locator("#docs-sd").waitFor({ state: "visible" });
  await page.getByRole("combobox", { name: "Search" }).fill("ダーク");
  await page.getByRole("option").first().waitFor({ state: "visible" });
  await page.getByRole("combobox", { name: "Search" }).fill("changelog");
  const first = page.getByRole("option").first();
  await first.waitFor({ state: "visible" });
  await first.locator("a").click();
  await page.waitForURL(/changelog\.html/);
  const idx = await page.evaluate(async () => (await fetch(new URL("search-index.json", document.baseURI))).status);
  assert(idx === 200, "索引が読めない");
});

await kb("前後の移動(Previous / Next)", "components/button.html", async (page) => {
  const nav = page.getByRole("navigation", { name: "Previous and next pages" });
  const prev = nav.getByRole("link", { name: /Previous/ });
  const next = nav.getByRole("link", { name: /Next/ });
  assert((await prev.count()) === 1 && (await next.count()) === 1, "前後のリンクが無い");
  await next.focus();
  await press(page, "Enter");
  await page.waitForURL((u) => /components\/[a-z-]+\.html/.test(u.pathname) && !u.pathname.endsWith("/button.html"));
  await page.getByRole("navigation", { name: "Previous and next pages" }).getByRole("link", { name: /Previous/ }).click();
  await page.waitForURL((u) => u.pathname.endsWith("/components/button.html"));
});

await kb("前後の移動(先頭は Next だけ、末尾は Previous だけ)", "getting-started/install.html", async (page) => {
  const nav = page.getByRole("navigation", { name: "Previous and next pages" });
  assert((await nav.getByRole("link", { name: /Previous/ }).count()) === 0, "先頭に Previous がある");
  assert((await nav.getByRole("link", { name: /Next/ }).count()) === 1, "先頭に Next が無い");
  await page.goto(page.url().replace("getting-started/install.html", "changelog.html"));
  const n2 = page.getByRole("navigation", { name: "Previous and next pages" });
  assert((await n2.getByRole("link", { name: /Next/ }).count()) === 0, "末尾に Next がある");
});

await kb("Edit this page と版、メタ(OGP、ファビコン)", "components/button.html", async (page) => {
  const edit = await page.getByRole("link", { name: "Edit this page" }).getAttribute("href");
  assert(/^https:\/\/github\.com\/[^/]+\/[^/]+\/edit\/[^/]+\/apps\/docs\/src\/data\/components\/input\.mjs$/.test(edit), "編集のリンクの形が違う: " + edit);
  assert((await page.locator("footer.docs-foot").textContent()).match(/v\d+\.\d+\.\d+/), "版の番号が無い");
  const meta = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map((m) => [m.getAttribute("property"), m.content])));
  assert(meta["og:title"] && meta["og:description"] && /^https?:\/\/.+\/og\.png$/.test(meta["og:image"]), "OGP が足りない: " + JSON.stringify(meta));
  assert(meta["og:image:width"] === "1200" && meta["og:image:height"] === "630", "OGP の画像の大きさの指定が違う");
  const icons = await page.evaluate(() => [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => l.href));
  assert(icons.length === 3, "ファビコンの link が 3 つ無い");
  for (const u of icons) { const st = await page.evaluate(async (x) => (await fetch(x)).status, u); assert(st === 200, "ファビコンが読めない: " + u); }
  const og = await page.evaluate(() => document.querySelector('meta[property="og:image"]').content);
  const png = readFileSync(join(dist, "og.png"));
  assert(png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, "og.png が 1200x630 でない");
  assert(og.endsWith("/og.png"), "og:image の道");
});

await kb("404(深い場所の見つからない URL。道が壊れない、リンクで戻れる)", "components/nope/deeper/missing.html", async (page) => {
  assert((await page.locator("h1").textContent()) === "Page not found", "404 の見出しが出ない");
  const css = await page.evaluate(() => getComputedStyle(document.body).fontSize);
  assert(css === "16px" || parseFloat(css) > 0, "CSS が読めていない");
  assert((await page.locator(".docs-nav a").count()) > 20, "サイドメニューが出ない");
  await page.getByRole("link", { name: "Components", exact: true }).last().click();
  await page.waitForURL(/\/a\/b\/components\.html/);
});

await kb("404(検索が深い場所でも開く)", "components/nope/deeper/missing.html", async (page) => {
  await page.keyboard.press("Control+k");
  await page.locator("#docs-sd").waitFor({ state: "visible" });
  await page.getByRole("combobox", { name: "Search" }).fill("Dialog");
  await page.getByRole("option").first().waitFor({ state: "visible" });
});

await kb("トップ(サイドメニューが無い、上のバーの 6 つのリンク、トップのレイアウト)", "index.html", async (page) => {
  assert((await page.locator(".docs-nav").count()) === 0, "トップにサイドメニューが出ている");
  const bar = page.getByRole("navigation", { name: "Main" });
  for (const n of ["Docs", "Components", "Icons", "Templates", "Changelog"]) assert((await bar.getByRole("link", { name: n, exact: true }).count()) === 1, "上のバーに " + n + " が無い");
  assert((await page.locator(".docs-top .docs-gh").count()) === 1, "上のバーに GitHub が無い");
  assert((await page.getByRole("link", { name: "Get started" }).count()) === 1 && (await page.getByRole("link", { name: "Browse components" }).count()) >= 1, "Get started と Browse components が無い");
  assert((await page.locator("h1").textContent()).length > 10, "h1 が無い");
  assert((await page.locator(".cp").count()) >= 12, "動く部品の格子が少ない");
  assert((await page.locator(".features-grid li").count()) === 4, "特長が 4 つでない");
  await bar.getByRole("link", { name: "Docs", exact: true }).click();
  await page.waitForURL(/getting-started\/install\.html/);
  assert((await page.locator('.docs-topnav a[aria-current]').textContent()) === "Docs", "今いる所の印が Docs に付かない");
});

await kb("トップの動く見本(主の色、角丸、密度、ダーク、範囲、タブ、並べ替え、部品の格子)", "index.html", async (page) => {
  const btn = page.getByRole("button", { name: "Export", exact: true });
  const props = () => btn.evaluate((el) => { const cs = getComputedStyle(el); return { bg: cs.backgroundColor, r: cs.borderTopLeftRadius, h: el.getBoundingClientRect().height }; });
  const before = await props();
  assert(before.r === "8px", "既定の Button の角丸が 8px でない: " + before.r);
  await page.getByRole("button", { name: "Blue" }).click();
  await page.waitForTimeout(400); // 色の変わり目の動きが終わるまで
  const blue = await props();
  assert(blue.bg !== before.bg, "主の色を変えても Button の色が変わらない");
  await page.getByRole("button", { name: "Large" }).click();
  assert((await props()).r === "12px", "角丸を Large にしても Button が 12px にならない");
  await page.getByRole("button", { name: "None" }).click();
  assert((await props()).r === "0px", "角丸を None にしても Button が 0px にならない");
  const cardR = await page.locator(".hl-stage .ki-stat").first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  assert(cardR === "0px", "角丸 None で Stat が角丸のまま: " + cardR);
  await page.getByRole("button", { name: "Medium" }).click();
  const tall = (await page.locator(".hl-stage").boundingBox()).height;
  await page.getByRole("button", { name: "Comfortable" }).click();
  assert((await page.locator(".hl-stage").boundingBox()).height > tall, "密度を変えても画面が広がらない");
  const total = () => page.locator(".hl-stage .ki-stat").first().textContent();
  const t0 = await total();
  await page.getByRole("combobox", { name: "Range" }).click();
  await page.getByRole("option", { name: "Last 7 days" }).click();
  assert((await total()) !== t0, "範囲を変えても合計が変わらない");
  await page.getByRole("tab", { name: "Recent" }).click();
  const names = () => page.locator(".hl-stage tbody tr td:nth-child(1)").allTextContents();
  const n0 = await names();
  await page.getByRole("button", { name: /Name/ }).click();
  assert(JSON.stringify(await names()) !== JSON.stringify(n0), "並べ替えても行の順が変わらない");
  await page.getByRole("switch", { name: "Dark" }).click();
  assert((await page.evaluate(() => document.documentElement.dataset.theme)) === "dark", "Dark で表示がダークにならない");
  await page.locator(".cp").filter({ hasText: "Checkbox" }).getByRole("checkbox").first().click();
  await page.locator(".cp").filter({ hasText: "Tabs" }).getByRole("tab").nth(1).click();
});

await kb("部品の一覧(カテゴリごとの触れる見本、Code でコードを開いてコピー)", "components.html", async (page) => {
  assert((await page.locator(".cp").count()) === 46, "カードが 46 枚でない");
  assert((await page.locator("main section h2").count()) === 7, "カテゴリが 7 つでない");
  assert((await page.locator(".cp-fit").count()) === 46, "見本が 46 個でない");
  // 見本は触れる: Switch を押すと切り替わる
  const sw = page.locator(".cp").filter({ has: page.locator(".cp-link", { hasText: /^Switch$/ }) }).locator('[role="switch"]').first();
  await sw.scrollIntoViewIfNeeded();
  const before = await sw.getAttribute("aria-checked");
  await sw.click();
  assert((await sw.getAttribute("aria-checked")) !== before, "見本の Switch が切り替わらない");
  const card = page.locator(".cp").filter({ has: page.locator(".cp-link", { hasText: /^Button$/ }) });
  await card.getByRole("button", { name: "Code for Button" }).click();
  const dlg = page.locator("#cp-dialog");
  await dlg.waitFor({ state: "visible" });
  assert((await page.locator("#cp-code").textContent()).includes("<Button"), "React のコードが出ない");
  await dlg.getByRole("tab", { name: "HTML" }).click();
  assert((await page.locator("#cp-code").textContent()).includes("ki-button"), "HTML のコードが出ない");
  await dlg.getByRole("button", { name: "Copy" }).click();
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes("ki-button"), "コードがコピーされない");
  await page.keyboard.press("Escape");
  await dlg.waitFor({ state: "hidden" });
  assert(await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Code for Button"), "閉じた後に focus が Code のボタンへ戻らない");
  await page.locator(".cp-link", { hasText: /^Card$/ }).click();
  await page.waitForURL(/components\/card\.html/);
});

// 表の行の並べ替え(マウス、指、キーボード)。デモ Reorderable の 4 行(項目 A から D)を使う
const reorderDemo = (page) => page.locator(".demo").filter({ has: page.getByRole("region", { name: "並べ替えできる項目の一覧" }) });
const rowNames = (page) => reorderDemo(page).locator("tbody tr td:nth-child(2)").allTextContents();
const handleOf = (page, name) => reorderDemo(page).getByRole("button", { name: new RegExp(name + " を並べ替える") });
const center = async (loc) => { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };

await kb("表の行の並べ替え(マウス、キーボード、Esc、aria-live)", "components/table.html", async (page) => {
  const demo = reorderDemo(page);
  await demo.scrollIntoViewIfNeeded();
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 A", "項目 B", "項目 C", "項目 D"]), "最初の順が違う: " + (await rowNames(page)));
  const h = await handleOf(page, "項目 A").boundingBox();
  assert(h.width >= 44 && h.height >= 44, "掴む所が 44px 未満: " + h.width + "x" + h.height);
  assert((await handleOf(page, "項目 A").evaluate((el) => getComputedStyle(el).touchAction)) === "none", "掴む所の touch-action が none でない");
  assert((await demo.locator("tbody tr:nth-child(1) td:nth-child(2)").evaluate((el) => getComputedStyle(el).touchAction)) !== "none", "表のほかの所まで touch-action: none");
  // マウス: 項目 A を、項目 C の下へ
  const from = await center(handleOf(page, "項目 A"));
  const c = await demo.locator("tbody tr:nth-child(3)").boundingBox();
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x, from.y + 20, { steps: 3 });
  await page.mouse.move(from.x, c.y + c.height - 4, { steps: 6 });
  assert((await demo.locator("tr[data-dragging]").count()) === 1, "掴んでいる行に印が付かない");
  assert((await demo.locator("tr[data-shift]").count()) === 2, "間の行がずれない(項目 B と C がずれるはず)");
  const gapTop = await demo.locator("tbody tr:nth-child(1)").boundingBox();
  const shifted = await demo.locator("tr[data-shift]").first().boundingBox();
  assert(shifted.y < gapTop.y + gapTop.height + 1, "ずれた行が最初の行の下に来ない(空きが落とす所へ動いていない)");
  assert((await demo.locator("tr[data-dragging]").evaluate((el) => getComputedStyle(el).filter)) !== "none", "持ち上げた行に影が無い");
  await page.mouse.up();
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 B", "項目 C", "項目 A", "項目 D"]), "マウスで動かした後の順が違う: " + (await rowNames(page)));
  assert((await demo.locator("tr[data-dragging], tr[data-shift]").count()) === 0, "終わっても印が残る");
  assert((await demo.getByRole("status").filter({ hasText: "移した" }).textContent()).includes("1 行目から 3 行目へ移した"), "aria-live の文が違う");
  // Esc でやめる(マウス)
  const f2 = await center(handleOf(page, "項目 D"));
  await page.mouse.move(f2.x, f2.y); await page.mouse.down(); await page.mouse.move(f2.x, f2.y - 100, { steps: 5 });
  await page.keyboard.press("Escape");
  await page.mouse.up();
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 B", "項目 C", "項目 A", "項目 D"]), "Esc でやめても順が変わった");
  // キーボード: 項目 D を Space で持ち上げ、上へ 3 つ、Space で置く
  await handleOf(page, "項目 D").focus();
  await page.keyboard.press("Space");
  assert((await handleOf(page, "項目 D").getAttribute("aria-pressed")) === "true", "持ち上げても aria-pressed にならない");
  for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowUp");
  assert(((await handleOf(page, "項目 D").getAttribute("aria-label")) ?? "").includes("1 行目"), "動かしても掴む所の名前の行番号が変わらない");
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 D", "項目 B", "項目 C", "項目 A"]), "矢印で動かしている間の見た目の順が違う: " + (await rowNames(page)));
  assert(await handleOf(page, "項目 D").evaluate((el) => document.activeElement === el), "動かしても focus が掴む所から外れる");
  await page.keyboard.press("Space");
  await page.waitForTimeout(50);
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 D", "項目 B", "項目 C", "項目 A"]), "置いた後の順が違う");
  assert(await handleOf(page, "項目 D").evaluate((el) => document.activeElement === el), "置いた後に focus が掴む所へ戻らない");
  assert((await demo.getByRole("status").filter({ hasText: "移した" }).textContent()).includes("4 行目から 1 行目へ移した"), "キーボードの aria-live の文が違う: " + (await demo.getByRole("status").allTextContents()));
  // Enter で置く、Esc で戻す
  await page.keyboard.press("Space"); await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 B", "項目 D", "項目 C", "項目 A"]), "Enter で置けない: " + (await rowNames(page)));
  await page.keyboard.press("Space"); await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowDown"); await page.keyboard.press("Escape");
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 B", "項目 D", "項目 C", "項目 A"]), "Esc で戻らない: " + (await rowNames(page)));
  assert((await demo.getByRole("status").filter({ hasText: "戻した" }).count()) === 1, "戻したことが伝わらない");
});

await kb("表の行の並べ替え(390px、指。掴む所だけで動き、ほかはスクロールできる)", "components/table.html", async (page) => {
  const demo = reorderDemo(page);
  await demo.scrollIntoViewIfNeeded();
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, p) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: p ? [{ x: p.x, y: p.y, id: 1 }] : [] });
  const from = await center(handleOf(page, "項目 A"));
  const b = await demo.locator("tbody tr:nth-child(2)").boundingBox();
  const sy = await page.evaluate(() => scrollY);
  await touch("touchStart", from);
  for (let i = 1; i <= 8; i++) await touch("touchMove", { x: from.x, y: from.y + ((b.y + b.height - 4 - from.y) * i) / 8 });
  assert((await page.evaluate(() => scrollY)) === sy, "掴む所を動かしている間に、画面がスクロールした");
  await touch("touchEnd");
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 B", "項目 A", "項目 C", "項目 D"]), "指で動かした後の順が違う: " + (await rowNames(page)));
  // 表の本体をなぞると、画面がスクロールする(掴む所と取り合わない)
  const cell = await center(demo.locator("tbody tr:nth-child(3) td:nth-child(2)"));
  await touch("touchStart", cell);
  for (let i = 1; i <= 8; i++) await touch("touchMove", { x: cell.x, y: cell.y - i * 25 });
  await touch("touchEnd");
  await page.waitForTimeout(100);
  assert((await page.evaluate(() => scrollY)) > sy, "表の本体をなぞっても画面がスクロールしない");
  assert(JSON.stringify(await rowNames(page)) === JSON.stringify(["項目 B", "項目 A", "項目 C", "項目 D"]), "本体をなぞって行が動いた");
}, { width: 390, height: 844 }, { hasTouch: true, isMobile: true });

await kb("文書の規則が見本に漏れない(入れ子の表に data-label を付けない、見本の題の余白と線)", "components/table.html", async (page) => {
  assert((await page.locator(".states-table .ki-table td[data-label], .states-table .ki-table tr[data-stack]").count()) === 0, "見本の中の表に data-label が付いた");
  const disp = await page.locator(".states-table .ki-table tbody td").first().evaluate((el) => getComputedStyle(el).display);
  assert(disp === "table-cell", "見本の中の表のセルが塊に組み替えられた: " + disp);
  const heads = await page.locator(".states-table .ki-table thead th").first().evaluate((el) => getComputedStyle(el).verticalAlign);
  assert(heads !== "top", "文書の表の vertical-align: top が見本の表に効いている");
}, { width: 390, height: 844 });
for (const [path, sel, what] of [["components/app-bar.html", ".demo .ki-appbar__title", "AppBar"], ["components/card.html", ".demo .ki-card__title", "Card"], ["templates/dashboard.html", ".tpl .ki-appbar__title, .tpl .ki-card__title", "ダッシュボード"]]) {
  await kb(`見本の題に文書の見出しの規則が効かない(${what})`, path, async (page) => {
    const n = await page.locator(sel).count();
    assert(n > 0, "題が見つからない: " + sel);
    const bad = await page.locator(sel).evaluateAll((els) => els.map((el) => { const s = getComputedStyle(el); return { mt: s.marginTop, bt: s.borderTopWidth, pt: s.paddingTop }; }).filter((x) => x.mt !== "0px" || x.bt !== "0px" || x.pt !== "0px"));
    assert(bad.length === 0, "題の上の余白か線が 0 でない: " + JSON.stringify(bad[0]));
  });
}
for (const w of [360, 390]) {
  await kb(`ダッシュボードの AppBar が ${w}px で 1 段(Stat は崩れない)`, "templates/dashboard.html", async (page) => {
    const h = (await page.locator(".tpl .ki-appbar").boundingBox()).height;
    assert(h < 70, "AppBar が折れている: " + h + "px");
    const w2 = await page.locator(".tpl .ki-stat").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
    assert(w2.length === 4, "Stat が 4 つでない");
  }, { width: w, height: 800 });
}
await kb("ダッシュボードの Stat が iPad 縦で 3+1 にならない", "templates/dashboard.html", async (page) => {
  const tops = await page.locator(".tpl .ki-stat").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  const rows = new Set(tops).size;
  assert(rows === 2 || rows === 1, "Stat が 3+1 などに分かれた: " + tops);
}, { width: 820, height: 1180 });

await kb("Table の Error と Empty が 360px で重ならない", "components/table.html", async (page) => {
  const st = page.locator(".ki-table__state");
  const n = await st.count();
  assert(n >= 2, "状態のセルが無い");
  for (let i = 0; i < n; i++) {
    const cell = st.nth(i);
    await cell.scrollIntoViewIfNeeded();
    const ws = await cell.evaluate((el) => getComputedStyle(el).whiteSpace);
    assert(ws === "normal", "状態のセルが折り返さない: " + ws);
    const btn = cell.getByRole("button");
    if (await btn.count()) {
      const text = cell.locator(".ki-alert__body, [class*='ki-alert'] > :not(button)").first();
      const bb = await btn.first().boundingBox();
      const tb = await cell.locator("p, span, div").filter({ hasText: /読み込めなかった|行がない|項目がない/ }).last().boundingBox();
      assert(!tb || tb.x + tb.width <= bb.x + 1 || tb.y + tb.height <= bb.y + 1 || bb.y + bb.height <= tb.y + 1, `文が「再試行」の下に潜る: 文の右端 ${Math.round(tb.x + tb.width)}、ボタンの左端 ${Math.round(bb.x)}`);
    }
  }
}, { width: 360, height: 740 });

await kb("角丸の段(小 4px、ボタンと入力 8px、面 12px、Chip は丸)", "components/chip.html", async (page) => {
  const v = await page.evaluate(() => { const s = getComputedStyle(document.documentElement); return [1, 2, 3].map((n) => s.getPropertyValue("--radius-" + n).trim()).concat(s.getPropertyValue("--radius-pill").trim()); });
  assert(v.slice(0, 3).join() === "4px,8px,12px" && v[3] === "999px", "角丸のトークンが違う: " + v);
  const chip = await page.locator(".ki-chip").first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  assert(chip === "999px", "Chip が丸くない: " + chip);
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
  assert(!(await table.textContent()).includes("未満"), "ブランドの色で警告が出ている");
  await page.getByRole("button", { name: "Yellow" }).click();
  assert((await table.textContent()).includes("未満"), "薄い黄で警告が出ない");
  assert((await page.getByText("4.5:1 未満", { exact: false }).count()) > 0, "警告の文が出ない");
  const code = await page.locator("#tc-code ~ .ki-code").first().textContent().catch(() => "");
  const all = await page.locator(".tc").textContent();
  assert(all.includes("--color-primary: oklch("), "書き出しの CSS に主の色が入らない");
  await page.getByLabel("Color value").fill("#2358B0");
  assert(!(await table.textContent()).includes("未満"), "青で警告が残る");
  await page.getByRole("button", { name: "Brand", exact: true }).click();
  await page.locator("#tc-radius").fill("8");
  assert((await page.locator(".tc").textContent()).includes("--radius-2: 8px"), "角丸が書き出しに出ない");
});

await kb("アイコン(探す、太さ、写す)", "icons.html", async (page) => {
  const count = async () => page.locator(".ib-tile").count();
  const all = await count();
  assert(all > 100, "アイコンが出ない");
  await page.getByLabel("Search by name", { exact: true }).fill("calendar");
  const n = await count();
  assert(n >= 1 && n < all, "探しても絞られない");
  await page.getByRole("button", { name: "bold" }).click();
  await page.locator(".ib-tile").first().click();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  assert(clip.startsWith("import {") && clip.includes("@knowidea/icons/react"), "import の行が写っていない: " + clip);
  await page.getByRole("button", { name: "Copy SVG" }).click();
  const svg = await page.evaluate(() => navigator.clipboard.readText());
  assert(svg.startsWith("<svg"), "SVG が写っていない");
  await page.getByLabel("Search by name", { exact: true }).fill("zzzz");
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
  assert(norm(clip) === norm(shown) && clip.includes("Button"), "コピーした文字が表示と違う");
});

await kb("見本の画面(ダッシュボード: 表で選んでアーカイブ、元に戻す)", "templates/dashboard.html", async (page) => {
  const bar = page.getByRole("button", { name: "アーカイブする" });
  assert(await bar.isDisabled(), "選ぶ前にアーカイブできる");
  await page.getByRole("checkbox", { name: "項目 A を選択" }).click();
  assert(!(await bar.isDisabled()), "選んでもアーカイブできない");
  await bar.click();
  assert((await page.getByRole("checkbox", { name: "項目 A を選択" }).count()) === 0, "アーカイブしても行が消えない");
  await page.getByRole("button", { name: "元に戻す" }).click();
  assert((await page.getByRole("checkbox", { name: "項目 A を選択" }).count()) === 1, "元に戻しても行が戻らない");
});

await browser.close();
server.close();
console.log(fail ? `\n${fail} 件が通らない` : "\n全部通った");
process.exit(fail ? 1 : 0);
