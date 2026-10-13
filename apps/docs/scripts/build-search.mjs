// astro build と relativize の後に回す。dist/ の HTML から、静的な検索の索引 dist/search-index.json を作る。
// 外のサービスも依存も使わない。HTML を 1 度なめて、<main> の中の本文を「ページの頭」と「h2、h3 の節」に分ける。
//   索引の 1 行: { t: ページの題, h: 節の見出し(ページの頭は ""), u: dist からの相対の道(#id 付き)、x: 本文の抜粋 }
// u は dist の根からの相対にしてある。読む側(src/scripts/chrome.js)が、索引の場所を基準に解く。
// なので、dist/ をどの場所の下に置いても壊れない。
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
// 本文に入れない物: コードやデモ、見本の画面、操作の部品
const SKIP_TAGS = new Set(["script", "style", "pre", "svg", "dialog", "nav", "aside", "header", "footer", "button", "select", "textarea", "template", "noscript"]);
const SKIP_CLASS = /(^|\s)(demo|states-table|tpl|tc|ib|ki-code|code-gap|skip)(\s|$)/;
const MAX_TEXT = 400;
// 前後に区切りを入れる要素。インラインの要素(code、a、span)は、日本語の文が切れないよう空白を入れない
const BLOCK = new Set(["p", "li", "ul", "ol", "td", "th", "tr", "table", "div", "section", "br", "h1", "h2", "h3", "h4", "dd", "dt", "dl", "details", "summary", "figure", "figcaption", "blockquote"]);

const decode = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const squash = (s) => decode(s).replace(/\s+/g, " ").trim();

function entriesOf(html, file) {
  const title = squash((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || file).replace(/ \| KNOW IDEA UI$/, "");
  const m = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/);
  if (!m) return [];
  const body = m[1];
  const rows = [];
  let cur = { h: "", id: "", parts: [] };
  const flush = () => {
    const x = squash(cur.parts.join(""));
    if (cur.h || x) rows.push({ t: title, h: cur.h, u: file + (cur.id ? "#" + cur.id : ""), x: x.slice(0, MAX_TEXT) });
  };
  const stack = [];
  let skipAt = -1;     // skip を始めた stack の高さ
  let heading = null;  // 見出しの中: { level, id, parts }
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>|([^<]+)/g;
  let t;
  while ((t = re.exec(body))) {
    if (t[4] !== undefined) {
      if (skipAt >= 0) continue;
      (heading ? heading.parts : cur.parts).push(t[4]);
      continue;
    }
    const closing = t[1] === "/", name = t[2].toLowerCase(), attrs = t[3];
    if (BLOCK.has(name) && skipAt < 0) (heading ? heading.parts : cur.parts).push(" ");
    if (!closing) {
      const selfClose = VOID.has(name) || /\/\s*$/.test(attrs);
      if (!selfClose) {
        stack.push(name);
        const cls = (attrs.match(/\bclass="([^"]*)"/) || [])[1] || "";
        if (skipAt < 0 && (SKIP_TAGS.has(name) || SKIP_CLASS.test(cls) || /\bhidden\b/.test(attrs.replace(/class="[^"]*"/, "")))) skipAt = stack.length - 1;
        if (skipAt < 0 && /^h[23]$/.test(name)) heading = { level: +name[1], id: (attrs.match(/\bid="([^"]*)"/) || [])[1] || "", parts: [] };
      }
    } else {
      const i = stack.lastIndexOf(name);
      if (i < 0) continue;
      if (heading && /^h[23]$/.test(name)) {
        const h = squash(heading.parts.join(""));
        if (h && heading.id) { flush(); cur = { h, id: heading.id, parts: [] }; }
        else if (h) cur.parts.push(h);
        heading = null;
      }
      stack.length = i;
      if (skipAt >= 0 && stack.length <= skipAt) skipAt = -1;
    }
  }
  flush();
  return rows;
}

const out = [];
let pages = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== "assets") walk(p); continue; }
    if (!name.endsWith(".html") || name === "404.html") continue;
    pages++;
    out.push(...entriesOf(readFileSync(p, "utf8"), relative(dist, p).split(sep).join("/")));
  }
})(dist);

// 同じ題の節が重ならないよう、順は道の順に固定する(差分が安定する)
out.sort((a, b) => (a.u < b.u ? -1 : a.u > b.u ? 1 : 0));
writeFileSync(join(dist, "search-index.json"), JSON.stringify(out));
console.log(`search: ${pages} ページから ${out.length} 件の索引を作った(${(JSON.stringify(out).length / 1024).toFixed(0)} KB)`);
