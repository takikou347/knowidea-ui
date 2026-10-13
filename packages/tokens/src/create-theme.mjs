// テーマを作る。MUI の createTheme に当たる。依存なし。ブラウザでも Node でも動く。
//   const t = createTheme({ primary: "#016C6C", radius: 4, density: "compact", fontSize: 14 });
//   t.css(".brand")  // CSS 変数の上書きの文字列
//   t.warnings       // コントラストが足りない組
// 主の色から、hover の色と、主の面に載せる文字の色を OKLCH で作る。ダークは別に作る(反転しない)。
// 基準の面の値は dist/tokens.css と同じ。scripts/check-contrast.mjs が同じ値かを確かめる。

export const BASE = {
  light: { bg: [0.9729, 0.0029, 264.5], surface: [0.9946, 0.0026, 286.4], surface2: [0.9451, 0.0034, 247.9], onLight: [0.9946, 0.0026, 286.4], onDark: [0.1868, 0.0134, 196.1] },
  dark: { bg: [0.191, 0.0043, 264.5], surface: [0.2348, 0.0041, 264.5], surface2: [0.2756, 0.0047, 248], onLight: [0.9946, 0.0026, 286.4], onDark: [0.1868, 0.0134, 196.1] },
};

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const n4 = (x) => +Number(x).toFixed(4);

/** 線形 sRGB -> [L, C, h] */
function linearToOklch([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  let h = (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return [L, C, C < 1e-4 ? 0 : h];
}

/** [L, C, h] -> 線形 sRGB(色域の外は 0〜1 の外に出る) */
export function oklchToLinear([L, C, h]) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (c) => oklchToLinear(c).every((x) => x > -0.0005 && x < 1.0005);
/** 色域に収まるまで彩度を下げる */
function fit([L, C, h]) {
  if (inGamut([L, C, h])) return [L, C, h];
  let lo = 0, hi = C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut([L, mid, h])) lo = mid; else hi = mid;
  }
  return [L, lo, h];
}

export function luminance(c) {
  const [r, g, b] = oklchToLinear(c).map((x) => clamp(x));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG のコントラスト比 */
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const toLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
/** "#rgb"、"#rrggbb"、"oklch(L C h)" を [L, C, h] にする。読めなければ null */
export function parseColor(input) {
  if (typeof input !== "string") return null;
  const s = input.trim().toLowerCase();
  let m;
  if ((m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/))) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const rgb = [0, 2, 4].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16) / 255));
    return linearToOklch(rgb);
  }
  if ((m = s.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/))) {
    return [m[2] ? +m[1] / 100 : +m[1], +m[3], +m[4]];
  }
  return null;
}

export const hex = (c) => "#" + oklchToLinear(c).map((x) => {
  const v = clamp(x);
  const e = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(clamp(e) * 255).toString(16).padStart(2, "0");
}).join("");
export const oklchString = ([L, C, h]) => `oklch(${n4(L)} ${n4(C)} ${n4(h)})`;

function pickOn(bg, side) {
  const a = BASE[side].onLight, b = BASE[side].onDark;
  return contrast(a, bg) >= contrast(b, bg) ? a : b;
}

/** 主の色と hover が、bg、surface、surface-2 の上で 4.5:1 以上か。主の面の文字が主と hover の上で 4.5:1 以上か */
function checkPrimary(mode, label, p, hover, on, warnings) {
  const faces = ["bg", "surface", "surface2"];
  const names = { bg: "背景", surface: "surface", surface2: "surface-2" };
  const worst = (c) => faces.map((f) => [f, contrast(c, BASE[mode][f])]).sort((a, b) => a[1] - b[1])[0];
  const [pf, pr] = worst(p), [hf, hr] = worst(hover);
  if (pr < 4.5) warnings.push({ id: "primary-bg", mode, ratio: pr, message: `${label}: 主の色と${names[pf]}が ${pr.toFixed(2)}:1。4.5:1 に届かない(主の色で書く文字とリンクが読みにくい)` });
  if (hr < 4.5) warnings.push({ id: "hover-bg", mode, ratio: hr, message: `${label}: hover の色と${names[hf]}が ${hr.toFixed(2)}:1。4.5:1 に届かない` });
  const ro = Math.min(contrast(on, p), contrast(on, hover));
  if (ro < 4.5) warnings.push({ id: "primary-on", mode, ratio: ro, message: `${label}: 主のボタンの文字が ${ro.toFixed(2)}:1。4.5:1 に届かない` });
}

const RADIUS = { none: 0, sm: 2, md: 4, lg: 8 };
function radiusPx(r) {
  if (r == null) return null;
  if (typeof r === "number") return r;
  if (r in RADIUS) return RADIUS[r];
  const m = String(r).match(/^(\d+(?:\.\d+)?)px$/);
  return m ? +m[1] : null;
}

/**
 * @param {{ primary?: string, primaryDark?: string, radius?: number|string, density?: "compact"|"comfortable", fontSize?: number }} options
 */
export function createTheme(options = {}) {
  const warnings = [];
  const light = {}, dark = {}, common = {};

  if (options.primary != null) {
    const parsed = parseColor(options.primary);
    const p = parsed && fit(parsed);
    if (!p) {
      warnings.push({ id: "primary-parse", message: `主の色を読めない: ${options.primary}(#rrggbb か oklch(L C h) で書く)` });
    } else {
      // ライト: 主、hover(少し暗く)、主の面に載せる文字
      const hoverL = p[0] > 0.3 ? p[0] - 0.07 : p[0] + 0.07;
      const hover = fit([hoverL, p[1], p[2]]);
      const on = pickOn(p, "light");
      light["--color-primary"] = oklchString(p);
      light["--color-primary-hover"] = oklchString(hover);
      light["--color-on-primary"] = oklchString(on);
      light["--color-focus"] = oklchString(p);
      checkPrimary("light", "ライト", p, hover, on, warnings);

      // ダーク: 同じ色相で明るくし、別に決める
      let pd;
      if (options.primaryDark != null) {
        pd = parseColor(options.primaryDark);
        if (!pd) warnings.push({ id: "primary-dark-parse", message: `ダークの主の色を読めない: ${options.primaryDark}` });
      }
      if (!pd) pd = fit([Math.max(0.74, p[0]), Math.min(p[1] * 1.25, 0.2), p[2]]);
      const hoverD = fit([Math.min(0.95, pd[0] + 0.06), pd[1] * 0.9, pd[2]]);
      const onD = pickOn(pd, "dark");
      dark["--color-primary"] = oklchString(pd);
      dark["--color-primary-hover"] = oklchString(hoverD);
      dark["--color-on-primary"] = oklchString(onD);
      dark["--color-focus"] = oklchString(pd);
      checkPrimary("dark", "ダーク", pd, hoverD, onD, warnings);
    }
  }

  const r = radiusPx(options.radius);
  if (options.radius != null && r == null) warnings.push({ id: "radius", message: `角丸を読めない: ${options.radius}(数、"none"、"sm"、"md"、"lg"、"6px")` });
  if (r != null) {
    if (r > 8) warnings.push({ id: "radius-large", message: `角丸 ${r}px は大きい。8px(lg)を超えると、部品が柔らかすぎて業務の画面に合わない` });
    common["--radius-1"] = `${Math.max(0, Math.round(r / 2))}px`;
    common["--radius-2"] = `${r}px`;
    common["--radius-3"] = `${Math.round(r * 1.5)}px`;
  }

  if (options.density === "comfortable") {
    Object.assign(common, {
      "--space-2": "10px", "--space-3": "16px", "--space-4": "20px", "--space-5": "28px", "--space-6": "40px",
      "--font-line-height-3": "1.7",
    });
  } else if (options.density != null && options.density !== "compact") {
    warnings.push({ id: "density", message: `密度を読めない: ${options.density}("compact" か "comfortable")` });
  }

  if (options.fontSize != null) {
    const f = Number(options.fontSize);
    if (!(f >= 12 && f <= 20)) {
      warnings.push({ id: "fontSize", message: `本文の字の大きさは 12〜20px: ${options.fontSize}` });
    } else {
      Object.assign(common, {
        "--font-size-1": `${Math.max(11, f - 2)}px`, "--font-size-2": `${f - 1}px`, "--font-size-3": `${f}px`,
        "--font-size-4": `${Math.round(f * 1.29)}px`, "--font-size-5": `${Math.round(f * 1.71)}px`,
      });
    }
  }

  const block = (sel, vars) => `${sel} {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;
  /** selector の下に効く CSS。":root" か、クラス、[data-*] など */
  function css(selector = ":root") {
    const out = [];
    const base = { ...common, ...light };
    if (Object.keys(base).length) out.push(block(selector, base));
    if (Object.keys(dark).length) {
      const darkSel = selector === ":root" ? [":root[data-theme=\"dark\"]"] : [`:root[data-theme="dark"] ${selector}`, `:root[data-theme="dark"]${selector}`];
      const autoSel = selector === ":root" ? [":root:not([data-theme=\"light\"])"] : [`:root:not([data-theme="light"]) ${selector}`, `:root:not([data-theme="light"])${selector}`];
      const decl = Object.entries(dark).map(([k, v]) => `    ${k}: ${v};`).join("\n");
      out.push(`@media (prefers-color-scheme: dark) {\n  ${autoSel.join(",\n  ")} {\n${decl}\n  }\n}`);
      out.push(block(darkSel.join(",\n"), dark));
    }
    return out.join("\n");
  }

  return { options: { ...options }, light, dark, common, warnings, css };
}
