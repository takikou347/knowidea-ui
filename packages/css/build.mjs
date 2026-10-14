// index.css の @import を展開して dist/ki.css に 1 本にする。素の HTML 用。
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
const src = new URL("./src/", import.meta.url);
const out = new URL("./dist/", import.meta.url);
const index = readFileSync(new URL("index.css", src), "utf8");
const files = [...index.matchAll(/@import "\.\/(.+?)";/g)].map((m) => m[1]);
mkdirSync(out, { recursive: true });
writeFileSync(new URL("ki.css", out), "/* 自動生成。packages/css/src を直し、pnpm --filter knowidea-css build で作り直す */\n" + files.map((f) => readFileSync(new URL(f, src), "utf8")).join("\n"));
copyFileSync(new URL("enhance.js", src), new URL("ki.js", out));
console.log(`dist/ki.css (${files.length} ファイル)、dist/ki.js`);
