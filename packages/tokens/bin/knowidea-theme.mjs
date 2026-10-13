#!/usr/bin/env node
// テーマの CSS を作って標準出力に出す。React を使わないページや、ビルドの前に CSS ファイルを作りたいときに使う。
//   npx knowidea-theme --primary "#2255CC" --radius 6 --selector .brand > brand.css
// 警告(コントラストが足りない組)は標準エラーに出す。--strict を付けると、警告があれば終了コード 1 で終わる。
import { createTheme } from "../src/create-theme.mjs";

const help = `使い方: knowidea-theme [--primary <色>] [--primary-dark <色>] [--radius <数|none|sm|md|lg>] [--density <compact|comfortable>] [--font-size <px>] [--selector <セレクター>] [--strict]
色は #rrggbb、#rgb、oklch(L C h)。--selector の既定は :root。`;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) { console.log(help); process.exit(0); }
const opts = {};
let selector = ":root", strict = false;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  const next = () => { const v = args[++i]; if (v === undefined) { console.error(`${a} に値が要る\n${help}`); process.exit(2); } return v; };
  if (a === "--primary") opts.primary = next();
  else if (a === "--primary-dark") opts.primaryDark = next();
  else if (a === "--radius") { const v = next(); opts.radius = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v; }
  else if (a === "--density") opts.density = next();
  else if (a === "--font-size") opts.fontSize = Number(next());
  else if (a === "--selector") selector = next();
  else if (a === "--strict") strict = true;
  else { console.error(`知らない引数: ${a}\n${help}`); process.exit(2); }
}
const theme = createTheme(opts);
for (const w of theme.warnings) console.error("警告: " + w.message);
process.stdout.write(theme.css(selector) + "\n");
if (strict && theme.warnings.length) process.exit(1);
