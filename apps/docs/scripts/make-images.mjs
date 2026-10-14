// OGP の画像(1200x630)、ファビコンの PNG、Apple のアイコンを作り直す。assets-src/ に置いて git に入れる。
// ブランドの正本は brand/logo/。ロゴや版を変えたときだけ回す(ビルドでは回さない)。
//   node apps/docs/scripts/make-images.mjs
// Chromium は /opt/pw-browsers の中を直に指す(CHROMIUM_PATH で上書きできる)。
import { chromium } from "playwright-core";
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const out = fileURLToPath(new URL("../assets-src/", import.meta.url));
mkdirSync(out, { recursive: true });
const version = JSON.parse(readFileSync(root + "packages/ui/package.json", "utf8")).version;

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

const fonts = root + "node_modules/@fontsource/ibm-plex-sans/files/";
const url = (p) => pathToFileURL(p).href;
const mark = readFileSync(root + "brand/logo/mark.svg", "utf8").replace(/<title>.*<\/title>/, "").replace(' role="img" aria-label="KNOW IDEA マーク"', ' aria-hidden="true"');

const ogHtml = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="${url(root + "packages/tokens/dist/tokens.css")}">
<style>
@font-face { font-family: "Plex"; font-weight: 400; src: url(${url(fonts + "ibm-plex-sans-latin-400-normal.woff2")}); }
@font-face { font-family: "Plex"; font-weight: 600; src: url(${url(fonts + "ibm-plex-sans-latin-600-normal.woff2")}); }
html { color-scheme: light; }
body { margin: 0; width: 1200px; height: 630px; background: var(--color-bg); color: var(--color-text); font-family: "Plex", "IPAPGothic", "Noto Sans CJK JP", sans-serif; position: relative; overflow: hidden; }
.bar { position: absolute; left: 0; top: 0; bottom: 0; width: 16px; background: var(--color-primary); }
.wrap { position: absolute; left: 96px; right: 96px; top: 96px; bottom: 80px; display: flex; flex-direction: column; }
.mark { width: 112px; height: 112px; }
h1 { margin: 56px 0 0; font-size: 96px; line-height: 1.1; font-weight: 600; letter-spacing: 0; }
p { margin: 28px 0 0; font-size: 38px; line-height: 1.5; color: var(--color-text-muted); }
.foot { margin-top: auto; display: flex; gap: 24px; align-items: baseline; font-size: 30px; color: var(--color-text-muted); border-top: 2px solid var(--color-line-strong); padding-top: 24px; font-variant-numeric: tabular-nums; }
.foot b { font-weight: 600; color: var(--color-text); }
</style>
<div class="bar"></div>
<div class="wrap">
  <div class="mark">${mark}</div>
  <h1>KNOW IDEA UI</h1>
  <p>特定のアプリに依存しない UI ライブラリ</p>
  <div class="foot"><b>knowidea-ui</b><span>v${version}</span></div>
</div>`;

const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox", "--allow-file-access-from-files"] });
async function shot(html, file, w, h, scale = 1) {
  const tmp = out + ".tmp.html";
  writeFileSync(tmp, html);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.goto(url(tmp));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out + file, omitBackground: false });
  await ctx.close();
  console.log("wrote", file);
}
await shot(ogHtml, "og.png", 1200, 630);

const svgPage = (svg, bg, size) => `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:${bg};width:${size}px;height:${size}px}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`;
const favicon = readFileSync(root + "brand/logo/favicon.svg", "utf8").replace(/<style>.*<\/style>/, "").replace("<path ", '<path fill="#016C6C" ');
await shot(svgPage(favicon, "transparent", 32), "favicon-32.png", 32, 32);
// Apple のアイコンは角の外が黒く塗られるので、四隅まで塗った正方形で作る
const appIcon = readFileSync(root + "brand/logo/app-icon-light.svg", "utf8").replace(/rx="22"/, "");
await shot(svgPage(appIcon, "#016C6C", 180), "apple-touch-icon.png", 180, 180);

await browser.close();
import("node:fs").then((fs) => { try { fs.unlinkSync(out + ".tmp.html"); } catch {} });
