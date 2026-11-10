// メディアクエリの幅が、トークンの幅の区切り(knowidea-tokens の breakpoint)だけなことを確かめる。
// CSS の変数はメディアクエリに使えないので、src/*.css には同じ値を直に書く。
// 使ってよい形: (min-width: 600px)、(max-width: 599.98px)、(min-width: 1024px)、(max-width: 1023.98px)
import { readFileSync, readdirSync } from "node:fs";

const core = JSON.parse(readFileSync(new URL("../../tokens/src/core.json", import.meta.url), "utf8"));
const allowed = new Set();
for (const t of Object.values(core.breakpoint)) {
  const px = t.$value.value;
  allowed.add(`min-width: ${px}px`);
  allowed.add(`max-width: ${px - 0.02}px`);
}

const dir = new URL("../src/", import.meta.url);
const bad = [];
for (const f of readdirSync(dir).filter((n) => n.endsWith(".css"))) {
  const css = readFileSync(new URL(f, dir), "utf8");
  for (const m of css.matchAll(/\((min|max)-width:\s*([\d.]+)px\)/g)) {
    // @media と @container のどちらも。@container は入れ物の幅なので除く
    const before = css.slice(0, m.index);
    const at = before.lastIndexOf("@");
    if (css.slice(at, at + 10).startsWith("@container")) continue;
    if (!allowed.has(`${m[1]}-width: ${m[2]}px`)) bad.push(`${f}: (${m[1]}-width: ${m[2]}px)`);
  }
}
if (bad.length) {
  console.error(`幅の区切りがトークンと違う(使ってよい: ${[...allowed].join("、")})\n  ` + bad.join("\n  "));
  process.exit(1);
}
console.log(`ok 幅の区切り(${[...allowed].join("、")})`);

// knowidea-ui の breakpoints(JS の値)もトークンと同じか
const ts = readFileSync(new URL("../../ui/src/breakpoints.ts", import.meta.url), "utf8");
for (const [name, t] of Object.entries(core.breakpoint)) {
  if (!new RegExp(`\\b${name}: ${t.$value.value}\\b`).test(ts)) {
    console.error(`knowidea-ui の breakpoints.${name} がトークン(${t.$value.value}px)と違う`);
    process.exit(1);
  }
}
console.log("ok knowidea-ui の breakpoints がトークンと同じ");
