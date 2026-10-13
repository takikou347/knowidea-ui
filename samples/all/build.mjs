// samples/all/index.html を作る。外の物を読まない 1 つの HTML(CSS、JS、SVG を埋め込む。フォントだけ Google Fonts)。
// 使い方: pnpm -r build の後に pnpm --filter sample-all build
import { build, createServer } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../..");
const read = (p) => fs.readFileSync(path.join(repo, p), "utf8");

// 1. トークンの表とアイコンのデータ
const { themes, color, ratio, hex, pairs } = await import(path.join(repo, "packages/tokens/scripts/contrast.mjs"));
const n = (x) => +Number(x).toFixed(4);
const css = (c) => `oklch(${n(c[0])} ${n(c[1])} ${n(c[2])})`;
const names = Object.keys(themes["ライト"].color).filter((k) => !k.startsWith("$"));
const colors = names.map((k) => {
  const l = color(themes["ライト"], "color." + k), d = color(themes["ダーク"], "color." + k);
  return { name: k, light: { css: css(l), hex: hex(l) }, dark: { css: css(d), hex: hex(d) } };
});
const pr = pairs.map(([fg, bg, need]) => ({
  fg, bg, need,
  l: ratio(color(themes["ライト"], "color." + fg), color(themes["ライト"], "color." + bg)),
  d: ratio(color(themes["ダーク"], "color." + fg), color(themes["ダーク"], "color." + bg)),
}));
fs.mkdirSync(path.join(root, "gen"), { recursive: true });
fs.writeFileSync(path.join(root, "gen/tokens.json"), JSON.stringify({ colors, pairs: pr }));
fs.copyFileSync(path.join(repo, "packages/icons/dist/icons-data.json"), path.join(root, "gen/icons.json"));

// 2. 描画(SSR)
const server = await createServer({ root, configFile: false, appType: "custom", logLevel: "error", server: { middlewareMode: true, fs: { allow: [repo] } }, esbuild: { jsx: "automatic" }, ssr: { noExternal: [/@knowidea/, /^icons/] } });
const { render } = await server.ssrLoadModule("/ssr.tsx");
const body = render();
await server.close();

// 3. 手元の JS(hydrate)
const out = await build({
  root, configFile: false, mode: "production", logLevel: "error", esbuild: { jsx: "automatic", jsxDev: false }, define: { "process.env.NODE_ENV": '"production"' },
  build: { write: false, lib: { entry: path.join(root, "entry.tsx"), name: "Sample", formats: ["iife"], fileName: "s" }, minify: true, rollupOptions: { onwarn() {} } },
});
const js = (Array.isArray(out) ? out[0] : out).output.find((o) => o.type === "chunk").code.replace(/<\/script/g, "<\\/script");

// 4. CSS
const style = [
  read("packages/tokens/dist/tokens.css"), read("packages/tokens/themes/admin.css"), read("packages/tokens/themes/logru.css"), read("packages/tokens/themes/ruleru.css"),
  read("packages/css/dist/ki.css"), fs.readFileSync(path.join(root, "page.css"), "utf8"),
].join("\n");

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>KNOW IDEA 基本デザイン</title>
<meta name="robots" content="noindex" />
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans+JP:wght@400;600&display=swap" rel="stylesheet" />
<style>
${style}
</style>
</head>
<body>
<div id="root">${body}</div>
<footer class="license"><h2>使った物のライセンス</h2><ul><li>Phosphor Icons(MIT)Copyright (c) 2023 Phosphor Icons</li><li>React(MIT)</li><li>Base UI(MIT)</li><li>IBM Plex(SIL OFL 1.1)Google Fonts から読む</li></ul></footer>
<script>
${js}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, "index.html"), html);
console.log(`samples/all/index.html ${(html.length / 1024).toFixed(0)} KB`);
