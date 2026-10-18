// astro build の後に回す。出力した HTML の根からの道(/assets/...、/favicon.svg など)を、ページの深さに合わせた相対の道に直す。
// og:image と canonical は絶対 URL(site.config.mjs の url)で、"/" で始まらないので、ここでは触らない。
// 検索の索引(search-index.json)は build-search.mjs が作る。中の道は dist の根からの相対で、読む側が索引の場所を基準に解く。
// これで dist/ を、静的に配れる任意の場所の下(例: https://example.com/a/b/)に置いても、アセットが壊れない。
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
let files = 0, changed = 0, left = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    // CSS の中の url(/assets/...)(見出しの書体の woff2 など)は、CSS の場所からの相対にする
    if (name.endsWith(".css")) {
      const css = readFileSync(p, "utf8");
      const up = relative(dirname(p), join(dist, "assets")).split(sep).join("/") || ".";
      const fixed = css.replace(/url\((["']?)\/assets\//g, (_, q) => `url(${q}${up}/`);
      if (fixed !== css) writeFileSync(p, fixed);
      continue;
    }
    if (!name.endsWith(".html")) continue;
    files++;
    const depth = relative(dist, p).split(sep).length - 1;
    const prefix = depth === 0 ? "./" : "../".repeat(depth);
    const src = readFileSync(p, "utf8");
    // 引用符か ( の直後の /assets/ と /favicon.svg ... を相対にする
    const out = src.replace(/(["'(=])\/(assets\/|favicon\.svg|favicon-32\.png|apple-touch-icon\.png|sprite\.svg|mark\.svg|mark-white\.svg)/g, (_, q, rest) => q + prefix + rest);
    if (out !== src) { writeFileSync(p, out); changed++; }
    // 404.html の <base href="/サブパス/"> だけは根からの道のまま残す(どの深さの URL で配られても、相対の道がこれを基準にするため)
    const m = out.replace(/<base\b[^>]*>/g, "").match(/(?:href|src|component-url|renderer-url|before-hydration-url)="\/(?!\/)[^"]*"/g);
    if (m) { left += m.length; console.log("根からの道が残っている:", relative(dist, p), m.slice(0, 3).join(" ")); }
  }
})(dist);
console.log(`relativize: ${files} ページ中 ${changed} ページを相対にした${left ? `、根からの道が ${left} 件残っている` : ""}`);
process.exit(left ? 1 : 0);
