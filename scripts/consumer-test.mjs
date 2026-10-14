// 配る tarball(release/)を、リポジトリの外の新しいプロジェクトに入れて、文書の手順どおりに動くことを確かめる。
//   pnpm release:pack の後に: pnpm test:consumer
//   a: Vite + React 19 + TypeScript(pnpm)   b: 素の HTML   c: Vite + React + Tailwind v4(npm)
//   a-npm: a と同じ手順を npm で(入れる、型検査、build まで)
// 各々で、文書に載せたコマンドとコードをそのまま流し、tsc --noEmit、vite build、
// Chromium(/opt/pw-browsers を直に指す)で開いて、コンソールの誤り 0 と、部品に CSS が当たっていることを確かめる。
// ネットワークは npm registry だけ使う。文書の例は apps/docs/src/data/examples.mjs が正本。
//
// 環境変数: ONLY=a,b  対象を絞る / KEEP=1  作ったプロジェクトを消さない / DIR=/path  作る場所 /
//           SKIP_PACK=1  release/ を作り直さない / CHROMIUM_PATH  Chromium を指す
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, cpSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { root, run, runScript, serve, launch, openPage } from "./consumer/lib.mjs";
import { reactSnippets, importLines, htmlSnippets } from "./consumer/snippets.mjs";
import { recorder, checkReactApp, installHelpers, hexToRgb } from "./consumer/checks.mjs";
import { install, react, html, tailwind, theme, dark, overriding, icons } from "../apps/docs/src/data/examples.mjs";

// 確かめる版(文書の「最新」を、繰り返せるように固定する)
const subst = {
  "vite@latest": "vite@9.2.1",
  "--template react-ts": "--template react-ts --no-interactive",
  "tailwindcss @tailwindcss/vite": "tailwindcss@4.3.3 @tailwindcss/vite@4.3.3",
  "/path/to/knowidea-ui": root.replace(/\/$/, ""),
};
const PRIMARY = "#2255CC";
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const base = process.env.DIR ?? mkdtempSync(join(tmpdir(), "ki-consumer-"));
mkdirSync(base, { recursive: true });
const write = (dir, rel, text) => { mkdirSync(join(dir, rel, ".."), { recursive: true }); writeFileSync(join(dir, rel), text); };
// テストのテスト: MUTATE=nocss(部品の CSS を読まない)、MUTATE=nolayer(Tailwind の layer を外す)で、確かめが失敗することを見る
const mutate = (where, text) => {
  const m = process.env.MUTATE;
  if (m === "nocss") return text.split("\n").filter((l) => !l.includes("knowidea-css/index.css")).join("\n");
  if (m === "nolayer") return text.replace(" layer(components);", ";");
  return text;
};
const log = (...a) => console.log(...a);
const reports = [];

// ---------- release/ ----------
if (!process.env.SKIP_PACK) { log("pnpm release:pack"); run("pnpm", ["release:pack"], { cwd: root }); }
if (!existsSync(join(root, "release")) || readdirSync(join(root, "release")).filter((f) => f.endsWith(".tgz")).length !== 4) throw new Error("release/ に tarball が 4 つ無い。pnpm release:pack を先に流す");

// ---------- React のアプリ(a、a-npm、c で共通) ----------
function writeReactApp(dir, { tailwind: tw }) {
  const docs = (name, code) => write(dir, `src/docs/${name}.tsx`, code + "\n");
  docs("Basic", react.basic);
  docs("Theme", react.theme);
  docs("Toast", react.toast);
  docs("Icons", react.icons);
  docs("ColorMode", react.colorMode);
  docs("Overriding", overriding.react);
  docs("IconsPage", icons.react);
  if (tw) docs("TailwindUse", tailwind.use);

  const rs = reactSnippets();
  for (const s of rs) write(dir, `src/examples/${s.slug}__${s.fn}.tsx`, s.code + `\nexport { ${s.fn} };\n`);
  for (const s of importLines()) write(dir, `src/examples/import__${s.slug}.ts`, s.code + `\nexport { ${s.code.match(/\{(.*)\}/)[1].trim()} };\n`);

  const pick = [["button", "Variants"], ["text-field", "Basic"], ["select", "Basic"], ["checkbox", "Basic"], ["dialog", "Basic"], ["tabs", "Basic"], ["menu", "Basic"], ["toast", "Tones"], ["table", "Sortable"], ["chart", "Bars"]];
  const imp = pick.map(([s, f], i) => `import { ${f} as E${i} } from "./examples/${s}__${f}";`).join("\n");
  const sections = pick.map(([s], i) => `        <section id="ex-${s}"><E${i} /></section>`).join("\n");
  write(dir, "src/App.tsx", `import { lazy, Suspense } from "react";
import { ThemeProvider } from "knowidea-ui";
import "./brand.css";
import "./overrides.css";
import { Basic } from "./docs/Basic";
import { Theme } from "./docs/Theme";
import { Toast } from "./docs/Toast";
import { Icons } from "./docs/Icons";
import { IconsPageExample } from "./docs/IconsPage";
import { ColorModeButton } from "./docs/ColorMode";
import { Buttons as OverrideButtons } from "./docs/Overriding";
${tw ? 'import { TailwindUse } from "./docs/TailwindUse";\n' : ""}${imp}
import { Button, Stack, Grid, ToastProvider, useToast } from "knowidea-ui";

// ToastProvider を ThemeProvider の外に置いても、useToast を呼んだ所のテーマが当たるか
function OuterToastButton() {
  const toast = useToast();
  return <Button onClick={() => toast.show({ title: "外の Provider" })}>外の Provider から出す</Button>;
}
function OuterToast() {
  return <ToastProvider><ThemeProvider theme={{ primary: "#7a3db8" }}><OuterToastButton /></ThemeProvider></ToastProvider>;
}

const All = lazy(() => import("./all"));

export default function App() {
  if (location.hash === "#all") return <Suspense fallback={null}><All /></Suspense>;
  return (
    <ThemeProvider theme={{ primary: "${PRIMARY}", radius: 8, density: "compact", fontSize: 14 }}>
      <main style={{ padding: 16, display: "grid", gap: 16 }}>
        <ColorModeButton />
        <section id="doc-basic"><Basic /></section>
        <section id="doc-theme"><Theme /></section>
        <section id="doc-toast"><Toast /></section>
        <section id="ex-icons"><Icons /></section>
        <section id="ex-icons-page"><IconsPageExample /></section>
        <section id="ex-overriding"><div className="my-app"><OverrideButtons /></div></section>
        <section id="ex-gap"><Stack className="my-list"><span>a</span><span>b</span></Stack></section>
        <section id="ex-nest"><Stack gap={6} align="center"><Stack><span>a</span><span>b</span></Stack><Grid><span>c</span><span>d</span></Grid></Stack></section>
        <section id="ex-brand"><div className="brand"><Button>brand</Button></div></section>
        <section id="ex-toast-outer"><OuterToast /></section>
${tw ? '        <section id="ex-tailwind"><TailwindUse /></section>\n' : ""}${sections}
      </main>
    </ThemeProvider>
  );
}
`);
  // doc の App は default export。名前付きで取り込めるようにそろえる
  for (const [f, name] of [["Basic", "Basic"], ["Theme", "Theme"], ["Toast", "Toast"], ["TailwindUse", "TailwindUse"]]) {
    const p = join(dir, `src/docs/${f}.tsx`);
    if (existsSync(p)) writeFileSync(p, readFileSync(p, "utf8").replace("export default function App()", `export function ${name}()`));
  }
  // 部品ページのコード例を、全部並べて描くページ(#all)
  const all = rs.map((s, i) => `import { ${s.fn} as C${i} } from "./examples/${s.slug}__${s.fn}";`).join("\n");
  const items = rs.map((s, i) => `      <section data-example="${s.slug}/${s.fn}"><C${i} /></section>`).join("\n");
  write(dir, "src/all.tsx", `${all}\nexport default function All() {\n  return (\n    <div style={{ padding: 16, display: "grid", gap: 16 }}>\n${items}\n    </div>\n  );\n}\n`);
  write(dir, "src/brand.css", "/* 後で knowidea-theme が上書きする */\n");
  // Overriding のページの CSS(3 つ)をそのまま読み込む
  write(dir, "src/overrides.css", [overriding.vars, overriding.cls, overriding.own].join("\n\n") + "\n");
}

async function typecheckAndBuild(dir, pm) {
  run("npx", ["tsc", "--noEmit", "-p", "tsconfig.app.json"], { cwd: dir });
  run(pm === "pnpm" ? "pnpm" : "npm", pm === "pnpm" ? ["exec", "vite", "build"] : ["exec", "--", "vite", "build"], { cwd: dir });
}

async function browserReact(name, dir, { tailwind: tw }) {
  const browser = await launch();
  const rec = recorder();
  const srv = await serve(join(dir, "dist"));
  try {
    // 1. 画面。ライト
    let { page, context, problems } = await openPage(browser, srv.url, { scheme: "light" });
    await page.waitForSelector("#ex-chart .ki-chart__svg");
    await checkReactApp(page, rec, { primary: PRIMARY, tailwind: tw });
    rec.ok("コンソールの誤りと失敗した要求が 0(操作を含む)", problems.length === 0, problems.join(" | "));
    await context.close();

    // 2. OS がダークのとき(data-theme なし)
    ({ page, context, problems } = await openPage(browser, srv.url, { scheme: "dark" }));
    await page.waitForSelector("#ex-chart .ki-chart__svg");
    await installHelpers(page);
    const bg = await page.evaluate(() => window.__h.rgb(getComputedStyle(document.body).backgroundColor));
    rec.ok("OS がダークなら、何もしなくても背景が暗い", bg[0] < 80, bg);
    rec.ok("OS がダークのときもコンソールの誤り 0", problems.length === 0, problems.join(" | "));
    await context.close();

    // 3. 部品ページのコード例を全部描く
    ({ page, context, problems } = await openPage(browser, srv.url + "#all", { scheme: "light" }));
    await page.waitForSelector("[data-example]");
    const n = await page.locator("[data-example]").count();
    const empty = await page.evaluate(() => [...document.querySelectorAll("[data-example]")].filter((s) => s.getBoundingClientRect().height < 4).map((s) => s.dataset.example));
    rec.ok(`部品ページのコード例 ${reactSnippets().length} 個がすべて描かれる`, n === reactSnippets().length && empty.length === 0, `${n} 個、高さ 0: ${empty.join(", ")}`);
    rec.ok("全コード例の表示でコンソールの誤り 0", problems.length === 0, problems.slice(0, 5).join(" | "));
    await context.close();
  } finally { await srv.close(); await browser.close(); }
  return rec;
}

// ---------- a: Vite + React + TypeScript(pnpm)、a-npm ----------
async function scenarioReact(name, pm) {
  const dir = join(base, name);
  mkdirSync(dir, { recursive: true });
  const proj = runScript(react.create[pm], { cwd: dir, subst });
  runScript(install.copy, { cwd: proj, subst });
  runScript(install[pm], { cwd: proj, subst });
  runScript(react.clean, { cwd: proj });
  write(proj, "src/main.tsx", mutate("main", react.main) + "\n");
  let idx = readFileSync(join(proj, "index.html"), "utf8");
  idx = idx.replace("</head>", install.fonts.split("\n").map((l) => "    " + l).join("\n") + "\n  </head>");
  write(proj, "index.html", idx);
  writeReactApp(proj, { tailwind: false });
  runScript(theme.cli, { cwd: proj, subst });
  await typecheckAndBuild(proj, pm);
  return proj;
}

// ---------- c: Vite + React + Tailwind v4(npm) ----------
async function scenarioTailwind() {
  const dir = join(base, "c");
  mkdirSync(dir, { recursive: true });
  const proj = runScript(tailwind.create.npm, { cwd: dir, subst });
  runScript(install.copy, { cwd: proj, subst });
  runScript(install.npm, { cwd: proj, subst });
  write(proj, "vite.config.ts", tailwind.vite + "\n");
  write(proj, "src/index.css", mutate("css", tailwind.css) + "\n");
  write(proj, "src/main.tsx", tailwind.main + "\n");
  runScript("rm src/App.css", { cwd: proj });
  let idx = readFileSync(join(proj, "index.html"), "utf8");
  idx = idx.replace("</head>", install.fonts.split("\n").map((l) => "    " + l).join("\n") + "\n  </head>");
  write(proj, "index.html", idx);
  writeReactApp(proj, { tailwind: true });
  runScript(theme.cli, { cwd: proj, subst });
  await typecheckAndBuild(proj, "npm");
  return proj;
}

// ---------- b: 素の HTML ----------
async function scenarioHtml() {
  const proj = join(base, "b");
  mkdirSync(proj, { recursive: true });
  runScript(install.copy, { cwd: proj, subst });
  runScript(html.extract, { cwd: proj });
  runScript(theme.cliTgz, { cwd: proj, subst });
  const pickHtml = (slug) => htmlSnippets().find((s) => s.slug === slug).code.replace(/href="#([\w-]+)"/g, 'href="assets/sprite.svg#$1"');
  const sections = ["button", "text-field", "select", "checkbox", "table", "badge", "tabs", "toast", "menu", "alert"].map((s) => `    <section id="ex-${s}">\n${pickHtml(s)}\n    </section>`).join("\n");
  // 部品ページの Plain HTML の例を、全部並べたページ
  const allHtml = htmlSnippets().map((s) => `    <section data-example="${s.slug}">\n${s.code.replace(/href="#([\w-]+)"/g, 'href="assets/sprite.svg#$1"')}\n    </section>`).join("\n");
  write(proj, "all.html", `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>All Plain HTML examples</title>
  ${html.head}
</head>
<body>
  <main style="padding:16px;display:grid;gap:16px">
${allHtml}
  </main>
</body>
</html>
`);
  write(proj, "index.html", `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Plain HTML</title>
  ${html.colorMode}
  ${install.fonts}
  ${html.head}
  <link rel="stylesheet" href="assets/brand.css" />
</head>
<body>
  <main style="padding:16px;display:grid;gap:16px">
    <button type="button" class="ki-button" data-variant="secondary" id="mode">表示: auto</button>
    <section id="doc-body">
${html.body}
    </section>
    <section id="doc-dialog">
${html.dialog}
    </section>
    <section id="doc-icons">${icons.html}</section>
    <section id="ex-brand" class="brand"><button type="button" class="ki-button">brand</button></section>
${sections}
  </main>
  <script>
    ${dark.toggle.replace(/^\/\/.*\n/, "")}
    var order = ["auto", "light", "dark"];
    document.getElementById("mode").addEventListener("click", function () {
      var cur = document.documentElement.dataset.theme || "auto";
      var next = order[(order.indexOf(cur) + 1) % 3];
      setTheme(next);
      this.textContent = "表示: " + next;
    });
  </script>
</body>
</html>
`);
  return proj;
}

async function browserHtml(proj) {
  const browser = await launch();
  const rec = recorder();
  const srv = await serve(proj);
  try {
    const { page, context, problems } = await openPage(browser, srv.url, { scheme: "light" });
    await installHelpers(page);
    const { ok } = rec;
    const st = await page.evaluate(() => {
      const h = window.__h, q = (s) => document.querySelector(s), cs = (el) => getComputedStyle(el);
      const btn = q("#doc-body .ki-button"), alert = q("#doc-body .ki-alert"), icon = q("#doc-body .ki-icon"), input = q("#ex-text-field .ki-input"), sel = q("#ex-select .ki-select"), th = q("#ex-table thead th"), badge = q("#ex-badge .ki-badge"), tab = q("#ex-tabs .ki-tabs__tab"), toast = q("#ex-toast .ki-toast"), brand = q("#ex-brand .ki-button");
      const body = cs(document.body);
      return {
        body: { bg: h.near(h.rgb(body.backgroundColor), h.varRgb("--color-bg")), font: body.fontFamily, margin: body.marginTop },
        btn: btn && { h: btn.getBoundingClientRect().height, bg: h.near(h.rgb(cs(btn).backgroundColor), h.varRgb("--color-primary")), r: cs(btn).borderTopLeftRadius, rv: cs(btn).getPropertyValue("--radius-2").trim() },
        alert: alert && { bg: cs(alert).backgroundColor, pad: cs(alert).paddingTop },
        icon: icon && { w: icon.getBoundingClientRect().width, fs: parseFloat(cs(icon).fontSize), fill: h.rgb(cs(icon).fill), shapes: icon.querySelector("use") ? icon.querySelector("use").getBoundingClientRect().width : 0 },
        input: input && { h: input.getBoundingClientRect().height, b: cs(input).borderTopWidth },
        sel: sel && { h: sel.getBoundingClientRect().height, b: cs(sel).borderTopWidth },
        th: th && { bg: h.near(h.rgb(cs(th).backgroundColor), h.varRgb("--color-surface-2")), pad: cs(th).paddingLeft },
        badge: badge && { r: cs(badge).borderTopLeftRadius, pad: cs(badge).paddingLeft },
        tab: tab && { h: tab.getBoundingClientRect().height },
        toast: toast && { sh: cs(toast).boxShadow, pad: cs(toast).paddingTop },
        brand: brand && { bg: h.rgb(cs(brand).backgroundColor), r: cs(brand).borderTopLeftRadius },
      };
    });
    ok("body: 背景、IBM Plex Sans JP、余白 0", st.body.bg && /IBM Plex Sans JP/.test(st.body.font) && st.body.margin === "0px", JSON.stringify(st.body));
    ok("Button: 高さ 44px、背景が primary、角丸が --radius-2", st.btn && st.btn.h >= 43.5 && st.btn.bg && st.btn.r === st.btn.rv, JSON.stringify(st.btn));
    ok("Alert: 背景と余白が当たる", st.alert && st.alert.bg !== "rgba(0, 0, 0, 0)" && parseFloat(st.alert.pad) > 0, JSON.stringify(st.alert));
    ok("Icon(sprite): 1.25em で、外部の sprite.svg の形が描かれる", st.icon && Math.abs(st.icon.w - st.icon.fs * 1.25) < 0.6, JSON.stringify(st.icon));
    ok("TextField: 高さ 44px、枠線", st.input && st.input.h >= 43.5 && parseFloat(st.input.b) >= 1, JSON.stringify(st.input));
    ok("Select: 高さ 44px、枠線", st.sel && st.sel.h >= 43.5 && parseFloat(st.sel.b) >= 1, JSON.stringify(st.sel));
    ok("Table: 見出しの背景(surface-2)と余白", st.th && st.th.bg && parseFloat(st.th.pad) > 0, JSON.stringify(st.th));
    ok("Badge: 角丸と余白", st.badge && parseFloat(st.badge.pad) > 0, JSON.stringify(st.badge));
    ok("Tabs: 高さ 44px", st.tab && st.tab.h >= 43.5, JSON.stringify(st.tab));
    ok("Toast: 影と余白", st.toast && st.toast.sh !== "none" && parseFloat(st.toast.pad) > 0, JSON.stringify(st.toast));
    ok("createTheme CLI(tarball 指定)の CSS: brand クラスで primary #2255CC、角丸 6px", st.brand && Math.abs(st.brand.bg[0] - 0x22) <= 3 && Math.abs(st.brand.bg[2] - 0xcc) <= 3 && st.brand.r === "6px", JSON.stringify(st.brand));
    // sprite の形が出ているか: アイコン部分のスクリーンショットが空白でないこと
    const shot = await page.locator("#doc-body .ki-icon").first().screenshot();
    const pixels = await page.evaluate(async (b64) => { const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode(); const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0; const bg = [d[0], d[1], d[2]]; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 40) n++; return n; }, shot.toString("base64"));
    ok("Icon(sprite): 形が実際に描かれている(画素)", pixels > 10, pixels);

    // Dialog: ki.js
    await page.getByRole("button", { name: "削除する" }).first().click();
    ok("Dialog: data-ki-dialog-open で開く(ki.js)", await page.locator("dialog#confirm[open]").count() === 1);
    const dlg = await page.evaluate(() => { const d = document.getElementById("confirm"), cs = getComputedStyle(d), h = window.__h; return { bg: h.near(h.rgb(cs.backgroundColor), h.varRgb("--color-surface")), pos: cs.position, sh: cs.boxShadow }; });
    ok("Dialog: 背景が surface、位置が fixed", dlg.bg && dlg.pos === "fixed", JSON.stringify(dlg));
    await page.keyboard.press("Escape");
    ok("Dialog: Esc で閉じる", await page.locator("dialog#confirm[open]").count() === 0);
    await page.getByRole("button", { name: "削除する" }).first().click();
    await page.locator("dialog#confirm [data-ki-dialog-close]").first().click();
    ok("Dialog: data-ki-dialog-close で閉じる", await page.locator("dialog#confirm[open]").count() === 0);

    // ダーク
    const lightBg = await page.evaluate(() => window.__h.rgb(getComputedStyle(document.body).backgroundColor));
    await page.locator("#mode").click(); await page.locator("#mode").click();
    const d = await page.evaluate(() => { const h = window.__h; return { attr: document.documentElement.dataset.theme, bg: h.rgb(getComputedStyle(document.body).backgroundColor), c: h.rgb(getComputedStyle(document.body).color), saved: localStorage.getItem("theme") }; });
    ok("Dark: setTheme('dark') で背景が暗く、文字が明るい", d.attr === "dark" && d.bg[0] < 80 && d.c[0] > 150 && lightBg[0] > 200 && d.saved === "dark", JSON.stringify({ lightBg, d }));
    await page.reload();
    const keep = await page.evaluate(() => document.documentElement.dataset.theme);
    ok("Dark: 再読み込みしても保存した値が先頭の script で適用される", keep === "dark", keep);
    rec.ok("コンソールの誤りと失敗した要求が 0", problems.length === 0, problems.join(" | "));
    await context.close();

    // 部品ページの Plain HTML の例を全部並べる
    const all = await openPage(browser, srv.url + "all.html", { scheme: "light" });
    const sections = await all.page.evaluate(() => [...document.querySelectorAll("[data-example]")].map((s) => ({ name: s.dataset.example, h: s.getBoundingClientRect().height })));
    const sprites = await all.page.evaluate(async () => { const uses = [...document.querySelectorAll("use")]; return uses.length; });
    rec.ok(`部品ページの Plain HTML の例 ${htmlSnippets().length} 個がすべて描かれる(sprite の参照 ${sprites} 個)`, sections.length === htmlSnippets().length && sections.every((x) => x.h > 4), JSON.stringify(sections.filter((x) => x.h <= 4)));
    rec.ok("全 Plain HTML の例でコンソールの誤りと失敗した要求が 0", all.problems.length === 0, all.problems.join(" | "));
    await all.context.close();
  } finally { await srv.close(); await browser.close(); }
  return rec;
}

// ---------- 実行 ----------
const want = (n) => !only || only.includes(n);
async function step(name, fn) {
  const t0 = Date.now();
  log(`\n== ${name}`);
  let rec;
  try { rec = await fn(); } catch (e) { rec = recorder(); rec.ok("手順が最後まで通る", false, e.message); }
  const failed = rec.failed();
  for (const r of rec.results) log(`  ${r.ok ? "OK  " : "NG  "} ${r.name}${r.ok ? "" : "\n        " + r.detail}`);
  log(`  -> ${rec.results.length - failed.length}/${rec.results.length} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  reports.push({ name, failed: failed.length });
}

const okRec = (msg) => { const r = recorder(); r.ok(msg, true); return r; };
if (want("a")) await step("a: Vite + React 19 + TypeScript(pnpm)", async () => { const p = await scenarioReact("a", "pnpm"); const r = await browserReact("a", p, { tailwind: false }); r.results.unshift({ name: "手順(作る、入れる、tsc --noEmit、vite build)が通る", ok: true, detail: "" }); return r; });
if (want("a-npm")) await step("a-npm: 同じ手順を npm で", async () => { await scenarioReact("a-npm", "npm"); return okRec("npm で入れる、tsc --noEmit、vite build が通る"); });
if (want("b")) await step("b: 素の HTML(静的サーバー)", async () => { const p = await scenarioHtml(); const r = await browserHtml(p); r.results.unshift({ name: "手順(tarball から取り出す、CLI でテーマを作る)が通る", ok: true, detail: "" }); return r; });
if (want("c")) await step("c: Vite + React + Tailwind v4(npm)", async () => { const p = await scenarioTailwind(); const r = await browserReact("c", p, { tailwind: true }); r.results.unshift({ name: "手順(作る、入れる、tsc --noEmit、vite build)が通る", ok: true, detail: "" }); return r; });

log("\n== 結果");
for (const r of reports) log(`  ${r.failed === 0 ? "PASS" : "FAIL"} ${r.name}${r.failed ? ` (${r.failed} 件)` : ""}`);
if (!process.env.KEEP && !process.env.DIR) rmSync(base, { recursive: true, force: true }); else log(`  作ったプロジェクト: ${base}`);
process.exit(reports.some((r) => r.failed) ? 1 : 0);
