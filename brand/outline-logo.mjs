// logo/logo-horizontal.svg の「KNOW IDEA」を、IBM Plex Sans 700(OFL)から字の path にして置き換える。
// 使い方: node outline-logo.mjs  (元の <text> が残っている SVG が要る。輪郭化済みなら何もしない)
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const opentype = require("opentype.js");
const file = "logo/logo-horizontal.svg";
let svg = fs.readFileSync(file, "utf8");
if (!svg.includes("<text")) { console.log("輪郭化済み"); process.exit(0); }
const m = svg.match(/<text class="t" x="([\d.]+)" y="([\d.]+)"[^>]*font-size="([\d.]+)" letter-spacing="([\d.]+)">([^<]+)<\/text>/);
const [, x0, y0, size, ls, str] = m;
const buf = fs.readFileSync("../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff");
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const scale = +size / font.unitsPerEm;
let x = +x0, d = "";
const gl = font.stringToGlyphs(str);
gl.forEach((g, i) => {
  d += g.getPath(x, +y0, +size).toPathData(2);
  x += g.advanceWidth * scale + +ls;
  if (gl[i + 1]) x += font.getKerningValue(g, gl[i + 1]) * scale;
});
svg = svg.replace(m[0], `<path class="t" d="${d}"/>`);
fs.writeFileSync(file, svg);
console.log("輪郭化した。字の終わりの x =", (x - +ls).toFixed(1));
