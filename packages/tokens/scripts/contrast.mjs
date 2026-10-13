// 依存なしの色の計算。src の DTCG JSON を読み、OKLCH -> sRGB -> 相対輝度で比を出す。
// check-contrast.mjs と apps/docs が使う。
import primitiveJson from "../src/primitive.json" with { type: "json" };
import semanticLight from "../src/semantic-light.json" with { type: "json" };
import semanticDark from "../src/semantic-dark.json" with { type: "json" };

const merge = (...os) => os.reduce((a, o) => Object.assign(a, o), {});
export const primitive = primitiveJson;

function get(tree, p) {
  return p.split(".").reduce((o, k) => o?.[k], tree);
}
export function color(tree, p, seen = 0) {
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
export const inGamut = (c) => oklchToSrgb(c).every((x) => x > -0.002 && x < 1.002);
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
export const hex = (c) => "#" + oklchToSrgb(c).map((x) => {
  const v = clamp(x);
  const e = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(clamp(e) * 255).toString(16).padStart(2, "0");
}).join("");

export const themes = {
  ライト: merge({}, primitive, semanticLight),
  ダーク: merge({}, primitive, semanticDark),
};

// [前景, 背景, 必要な比, 何の組か]
export const text = 4.5, ui = 3;
export const pairs = [];
for (const bg of ["bg", "surface", "surface-2"]) pairs.push(["text", bg, text], ["text-muted", bg, text]);
for (const bg of ["bg", "surface"]) {
  pairs.push(["primary", bg, text], ["line-strong", bg, ui], ["focus", bg, ui]);
  for (const s of ["info", "success", "warn", "error"]) pairs.push([s, bg, text]);
}
for (const s of ["info", "success", "warn", "error"]) pairs.push([s, s + "-soft", text]);
pairs.push(["on-primary", "primary", text], ["on-primary", "primary-hover", text]);

