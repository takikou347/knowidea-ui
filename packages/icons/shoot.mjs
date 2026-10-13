// 自作のアイコンを、大きさ違いで Phosphor の近い物と並べて撮る。samples/shots/icons-custom-*.png に置く。
// 使い方: node shoot.mjs(playwright-core と /opt/pw-browsers の Chromium を直に指す)
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("/opt/node-tools/");
const { chromium } = require("playwright-core");
const { icons, data } = JSON.parse(fs.readFileSync("dist/icons-data.json", "utf8"));
const svg = (n, w, s) => { const v = data[n][w]; const a = Object.entries(v.attrs).map(([k, x]) => `${k}="${x}"`).join(" "); return `<svg width="${s}" height="${s}" viewBox="${v.viewBox}" ${a}>${v.inner}</svg>`; };
const custom = icons.filter((i) => i.custom).map((i) => i.name);
const row = (n, w) => `<td>${[96, 40, 20, 16].map((s) => svg(n, w, s)).join("</td><td>")}</td>`;
const html = (theme) => `<!doctype html><meta charset=utf-8><style>
body{margin:0;padding:24px;font:14px sans-serif;background:${theme === "dark" ? "#1F2328" : "#fff"};color:${theme === "dark" ? "#E6EDF3" : "#1F2328"}}
table{border-collapse:collapse}td,th{padding:10px 16px;text-align:left;vertical-align:middle;border-bottom:1px solid ${theme === "dark" ? "#3a4048" : "#e3e6e8"}}svg{display:block}</style>
<table><tr><th>名前</th><th>太さ</th><th>96px</th><th>40px</th><th>20px</th><th>16px</th></tr>
${custom.flatMap((n) => ["regular", "bold"].map((w) => `<tr><td>${n}</td><td>${w}</td>${row(n, w)}</tr>`)).join("")}
${["usage", "thread", "comment", "review"].map((n) => `<tr><td>${n}(Phosphor)</td><td>regular</td>${row(n, "regular")}</tr>`).join("")}
</table>`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (const theme of ["light", "dark"]) {
  const page = await browser.newPage({ viewport: { width: 640, height: 600 }, deviceScaleFactor: 2 });
  await page.setContent(html(theme));
  await page.screenshot({ path: `../../samples/shots/icons-custom-${theme}.png`, fullPage: true });
}
await browser.close();
