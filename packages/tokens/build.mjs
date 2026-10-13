// DTCG 2025.10 の JSON から dist/tokens.css と dist/theme.css を作る。
// 値の解決(参照、色の OKLCH 文字列)は Style Dictionary v5 に任せ、
// ライトとダークを 1 つの CSS にまとめる所だけ自前。
import StyleDictionary from "style-dictionary";
import fs from "node:fs";

const num = (n) => String(+Number(n).toFixed(4));
const dim = (v) => `${num(v.value)}${v.unit}`;
const oklch = (c) => {
  const [l, ch, h] = c.components;
  return `oklch(${num(l)} ${num(ch)} ${num(h)}${c.alpha !== undefined ? ` / ${num(c.alpha)}` : ""})`;
};

// 標準の size/rem などは px のまま出したいので自前にする(DTCG の {value, unit} を読む)
StyleDictionary.registerTransform({
  name: "ds/dimension",
  type: "value",
  filter: (t) => t.$type === "dimension" || t.$type === "duration",
  transform: (t) => dim(t.$value),
});
StyleDictionary.registerTransform({
  name: "ds/shadow",
  type: "value",
  filter: (t) => t.$type === "shadow",
  transform: (t) => {
    const v = t.$value;
    return `${dim(v.offsetX)} ${dim(v.offsetY)} ${dim(v.blur)} ${dim(v.spread)} ${oklch(v.color)}`;
  },
});
StyleDictionary.registerTransform({
  name: "ds/font-family",
  type: "value",
  filter: (t) => t.$type === "fontFamily",
  transform: (t) => t.$value.map((f) => (/[\s]/.test(f) ? `"${f}"` : f)).join(", "),
});

const transforms = ["name/kebab", "color/oklch", "ds/dimension", "ds/shadow", "ds/font-family", "cubicBezier/css"];

async function resolve(files) {
  const sd = new StyleDictionary({
    usesDtcg: true,
    log: { verbosity: "silent" },
    source: files.map((f) => `src/${f}`),
    platforms: { css: { transforms } },
  });
  await sd.hasInitialized;
  const tokens = await sd.exportPlatform("css");
  // 平らな { 名前: 値 } にする。素の値(ref)は出さない
  const out = {};
  (function walk(o, path) {
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith("$")) continue;
      if (v && typeof v === "object" && "$value" in v) {
        if (path[0] !== "ref") out[[...path, k].join(".")] = v.$value;
      } else if (v && typeof v === "object") walk(v, [...path, k]);
    }
  })(tokens, []);
  return out;
}

const light = await resolve(["primitive.json", "core.json", "semantic-light.json"]);
const dark = await resolve(["primitive.json", "semantic-dark.json"]);

// 変数名: color.bg -> --color-bg、font.size.1 -> --font-size-1
const varName = (p) => "--" + p.replace(/\./g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const block = (map, indent) =>
  Object.entries(map).map(([k, v]) => `${indent}${varName(k)}: ${v};`).join("\n");

const darkOnly = dark; // ダークは別に決める。同じ値でも全部出す(上書きしやすくする)
const header = "/* 自動生成。src/*.json を直し、pnpm --filter @knowidea/tokens build で作り直す */\n";

const css = `${header}:root {
${block(light, "  ")}
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${block(darkOnly, "    ")}
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
${block(darkOnly, "  ")}
  color-scheme: dark;
}
/* 動きを減らす設定のとき、状態の変わり目の動きを止める(スピナーの回転は進行を伝えるので残す) */
@media (prefers-reduced-motion: reduce) {
  :root { --motion-duration-fast: 0ms; --motion-duration-state: 0ms; }
}
`;

// Tailwind v4 の @theme。ライトの値を入れる。ダークは tokens.css が同じ変数を上書きする
const tw = {};
for (const [k, v] of Object.entries(light)) {
  let m;
  if (k.startsWith("color.")) tw["--color-" + k.slice(6)] = v;
  else if (k === "font.sans") tw["--font-sans"] = v;
  else if (k === "font.mono") tw["--font-mono"] = v;
  else if ((m = k.match(/^font\.size\.(\d)$/))) tw[`--text-${m[1]}`] = v;
  else if ((m = k.match(/^font\.line-?[hH]eight\.(\d)$/))) tw[`--text-${m[1]}--line-height`] = v;
  else if ((m = k.match(/^space\.(\d)$/))) tw[`--spacing-${m[1]}`] = v;
  else if ((m = k.match(/^radius\.(\d)$/))) tw[`--radius-${m[1]}`] = v;
  else if (k === "shadow.pop") tw["--shadow-pop"] = v;
  else if (k === "motion.ease") tw["--ease-standard"] = v;
  else if (k.startsWith("motion.duration.")) tw["--duration-" + k.slice(16)] = v;
  else if (k === "size.hit") tw["--size-hit"] = v;
}
const theme = `${header}/* tokens.css も読み込む。@theme の値はライト。ダークは tokens.css の変数の上書きで変わる */
@theme static {
${Object.entries(tw).map(([k, v]) => `  ${k}: ${v};`).join("\n")}
}
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/tokens.css", css);
fs.writeFileSync("dist/theme.css", theme);
console.log(`dist/tokens.css (${Object.keys(light).length} 変数、ダーク ${Object.keys(darkOnly).length})`);
console.log(`dist/theme.css (${Object.keys(tw).length} 変数)`);
