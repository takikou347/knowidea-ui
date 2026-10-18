// index.css の @import を展開して dist/ki.css に 1 本にする。素の HTML 用。
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, cpSync } from "node:fs";
const src = new URL("./src/", import.meta.url);
const out = new URL("./dist/", import.meta.url);
const index = readFileSync(new URL("index.css", src), "utf8");
const files = [...index.matchAll(/@import "\.\/(.+?)";/g)].map((m) => m[1]);
mkdirSync(out, { recursive: true });
writeFileSync(new URL("ki.css", out), "/* 自動生成。packages/css/src を直し、pnpm --filter knowidea-css build で作り直す */\n" + files.map((f) => readFileSync(new URL(f, src), "utf8")).join("\n"));
copyFileSync(new URL("enhance.js", src), new URL("ki.js", out));
// 見出しの書体。ki.css の url("./fonts/…") は dist/fonts/ を指す
cpSync(new URL("fonts/", src), new URL("fonts/", out), { recursive: true });
console.log(`dist/ki.css (${files.length} ファイル)、dist/ki.js、dist/fonts/`);
