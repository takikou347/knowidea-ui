// astro build の後に回す。出力した HTML の根からの道(/_astro/...、/favicon.svg など)を、ページの深さに合わせた相対の道に直す。
// これで dist/ を、静的に配れる任意の場所の下(例: https://example.com/a/b/)に置いても、アセットが壊れない。
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
let files = 0, changed = 0, left = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith(".html")) continue;
    files++;
    const depth = relative(dist, p).split(sep).length - 1;
    const prefix = depth === 0 ? "./" : "../".repeat(depth);
    const src = readFileSync(p, "utf8");
    // 引用符か ( の直後の /_astro/ と /favicon.svg ... を相対にする
    const out = src.replace(/(["'(=])\/(_astro\/|favicon\.svg|sprite\.svg|mark\.svg|mark-white\.svg)/g, (_, q, rest) => q + prefix + rest);
    if (out !== src) { writeFileSync(p, out); changed++; }
    const m = out.match(/(?:href|src|component-url|renderer-url|before-hydration-url)="\/(?!\/)[^"]*"/g);
    if (m) { left += m.length; console.log("根からの道が残っている:", relative(dist, p), m.slice(0, 3).join(" ")); }
  }
})(dist);
console.log(`relativize: ${files} ページ中 ${changed} ページを相対にした${left ? `、根からの道が ${left} 件残っている` : ""}`);
process.exit(left ? 1 : 0);
