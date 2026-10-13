// 依存なしのコントラスト検査。src の DTCG JSON を読み、OKLCH -> sRGB -> 相対輝度で比を出す。
// 落ちた組があれば exit 1。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const load = (f) => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
const merge = (...os) => os.reduce((a, o) => Object.assign(a, o), {});
const primitive = load("primitive.json");

function get(tree, p) {
  return p.split(".").reduce((o, k) => o?.[k], tree);
}
function color(tree, p, seen = 0) {
  const t = get(tree, p);
  if (!t) throw new Error("トークンが無い: " + p);
  const v = t.$value;
  if (typeof v === "string") {
    if (seen > 10) throw new Error("参照が深すぎる: " + p);
    return color(tree, v.slice(1, -1), seen + 1);
  }
  return v.components;
}

export function oklchToSrgb([L, C, h]) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]; // 線形 sRGB
}
const clamp = (x) => Math.min(1, Math.max(0, x));
const lum = (c) => {
  const [r, g, b] = oklchToSrgb(c).map(clamp);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// 色域の外に出ていないか(出ると clamp で値が変わる)
const inGamut = (c) => oklchToSrgb(c).every((x) => x > -0.002 && x < 1.002);
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const hex = (c) => "#" + oklchToSrgb(c).map((x) => {
  const v = clamp(x);
  const e = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(clamp(e) * 255).toString(16).padStart(2, "0");
}).join("");

const themes = {
  ライト: merge({}, primitive, load("semantic-light.json")),
  ダーク: merge({}, primitive, load("semantic-dark.json")),
};

// [前景, 背景, 必要な比, 何の組か]
const text = 4.5, ui = 3;
const pairs = [];
for (const bg of ["bg", "surface", "surface-2"]) pairs.push(["text", bg, text], ["text-muted", bg, text]);
for (const bg of ["bg", "surface"]) {
  pairs.push(["primary", bg, text], ["line-strong", bg, ui], ["focus", bg, ui]);
  for (const s of ["success", "warn", "error"]) pairs.push([s, bg, text]);
}
for (const s of ["success", "warn", "error"]) pairs.push([s, s + "-soft", text]);
pairs.push(["on-primary", "primary", text], ["on-primary", "primary-hover", text]);

let fail = 0;
const rows = [];
for (const [name, tree] of Object.entries(themes)) {
  for (const [fg, bg, need] of pairs) {
    const f = color(tree, "color." + fg), b = color(tree, "color." + bg);
    const r = ratio(f, b);
    const ok = r >= need;
    if (!ok) fail++;
    rows.push([name, fg, bg, need, r, ok, hex(f), hex(b)]);
  }
  for (const k of Object.keys(tree.color)) {
    if (!inGamut(color(tree, "color." + k))) { console.log(`注意: ${name} ${k} が sRGB の外`); }
  }
}

// 成功の色の候補(白 / surface / soft / ダークの面)
const cand = [];
for (const k of ["a", "b", "c"]) {
  const c = (p) => color(primitive, `ref.success.${k}.${p}`);
  const L = [ratio(c("fg"), [1, 0, 0]), ratio(c("fg"), color(themes.ライト, "color.surface")), ratio(c("fg"), c("soft"))];
  const D = ["bg", "surface", "surface-2"].map((s) => ratio(c("fgDark"), color(themes.ダーク, "color." + s)));
  cand.push({ k, hue: c("fg")[2], lightHex: hex(c("fg")), darkHex: hex(c("fgDark")), L, D });
  for (const r of [...L, ...D]) if (r < 4.5) fail++;
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad("テーマ", 8) + pad("前景", 13) + pad("背景", 15) + pad("必要", 6) + pad("比", 8) + "結果");
for (const [t, fg, bg, need, r, ok, fh, bh] of rows)
  console.log(pad(t, 8) + pad(fg, 13) + pad(bg, 15) + pad(need, 6) + pad(r.toFixed(2), 8) + (ok ? "ok" : "NG") + `  ${fh} / ${bh}`);
console.log("\n成功の色の候補(比は 白 / surface / soft、ダークは bg / surface / surface-2)");
for (const c of cand)
  console.log(`${c.k}  色相 ${c.hue}  ライト ${c.lightHex} ${c.L.map((x) => x.toFixed(2)).join(" / ")}  ダーク ${c.darkHex} ${c.D.map((x) => x.toFixed(2)).join(" / ")}`);
console.log(fail ? `\n${fail} 組が基準に届かない` : "\n全部合格");
process.exit(fail ? 1 : 0);
