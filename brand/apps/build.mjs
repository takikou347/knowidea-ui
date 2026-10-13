// 各アプリのアイコンの案を作る。決めた色(面 #016C6C、線と字 白、favicon の #016C6C / #4CBFBF)だけを使う。
// 使い方: node apps/build.mjs(brand/ で)。PNG は Chromium で撮る(playwright-core、/opt/pw-browsers を直に指す)。
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const opentype = require("opentype.js");
const { chromium } = createRequire("/opt/node-tools/")("playwright-core");
const buf = fs.readFileSync("../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff");
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const markD = fs.readFileSync("logo/app-icon-light.svg", "utf8").match(/ d="(M22\.55[^"]+)"/)[1];
const fav = fs.readFileSync("logo/favicon.svg", "utf8");
const apps = { admin: "ADMIN", logru: "LOGRU", ruleru: "RULERU" };
const SIZE = 14, LS = 1.6;
function word(str) {
  const sc = SIZE / font.unitsPerEm, gl = font.stringToGlyphs(str);
  let w = 0; gl.forEach((g, i) => { w += g.advanceWidth * sc + (i < gl.length - 1 ? LS : 0); });
  let x = 50 - w / 2, d = "";
  gl.forEach((g) => { d += g.getPath(x, 76, SIZE).toPathData(2); x += g.advanceWidth * sc + LS; });
  return d;
}
const body = (name) => `<path fill="#FFFFFF" transform="translate(25.4 12.2) scale(0.5)" d="${markD}"/>
  <path fill="#FFFFFF" d="${word(apps[name])}"/>`;
const shots = [];
for (const name of Object.keys(apps)) {
  fs.mkdirSync(`apps/${name}`, { recursive: true });
  const label = `KNOW IDEA ${apps[name]}`;
  fs.writeFileSync(`apps/${name}/app-icon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${label}">
  <title>${label}</title>
  <rect width="100" height="100" rx="22" fill="#016C6C"/>
  ${body(name)}
</svg>
`);
  fs.writeFileSync(`apps/${name}/apple-touch-icon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${label}">
  <title>${label}</title>
  <rect width="100" height="100" fill="#016C6C"/>
  ${body(name)}
</svg>
`);
  fs.writeFileSync(`apps/${name}/favicon.svg`, fav);
  shots.push(name);
}
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (const name of shots) {
  const p = await b.newPage({ viewport: { width: 180, height: 180 } });
  await p.setContent(`<body style="margin:0">${fs.readFileSync(`apps/${name}/apple-touch-icon.svg`, "utf8").replace("<svg", '<svg width="180" height="180"')}`);
  await p.screenshot({ path: `apps/${name}/apple-touch-icon.png` });
  const q = await b.newPage({ viewport: { width: 32, height: 32 } });
  await q.setContent(`<body style="margin:0">${fav.replace("<svg", '<svg width="32" height="32"')}`);
  await q.screenshot({ path: `apps/${name}/favicon-32.png`, omitBackground: true });
}
// 見本: 3 つを並べる(180px、60px、16px の favicon)。
const page = await b.newPage({ viewport: { width: 760, height: 420 }, deviceScaleFactor: 2 });
const sv = (f, s) => `<img width="${s}" height="${s}" src="data:image/svg+xml;base64,${fs.readFileSync(f).toString("base64")}">`;
await page.setContent(`<body style="margin:24px;font:14px sans-serif;color:#1F2328;background:#fff"><div style="display:flex;gap:32px">${shots.map((n) => `<div><div style="border-radius:40px;overflow:hidden;width:180px;height:180px">${sv(`apps/${n}/apple-touch-icon.svg`, 180)}</div><p>${n}(apple-touch-icon 180px)</p><div style="display:flex;gap:16px;align-items:center">${sv(`apps/${n}/app-icon.svg`, 60)}${sv(`apps/${n}/app-icon.svg`, 40)}${sv(`apps/${n}/app-icon.svg`, 29)}${sv(`apps/${n}/favicon.svg`, 16)}</div></div>`).join("")}</div>`);
await page.screenshot({ path: "../samples/shots/icons-apps.png", fullPage: true });
await b.close();
