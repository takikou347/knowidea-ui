import { themes, color, ratio, hex, pairs } from "knowidea-tokens/scripts/contrast.mjs";
import core from "knowidea-tokens/src/core.json" with { type: "json" };

export { ratio, hex, pairs, color, core };

const n = (x) => +Number(x).toFixed(4);
export const oklchStr = (c) => `oklch(${n(c[0])} ${n(c[1])} ${n(c[2])})`;
export const colorNames = Object.keys(themes["ライト"].color).filter((k) => !k.startsWith("$"));
export const themeKeys = { light: "ライト", dark: "ダーク" };

export function value(theme, name) {
  return color(themes[themeKeys[theme]], "color." + name);
}
// 面の見本を、その場でライトかダークにするための変数
export function themeStyle(theme) {
  return colorNames.map((k) => `--color-${k}: ${oklchStr(value(theme, k))}`).join("; ") + `; color-scheme: ${theme}`;
}
export function pairRatio(theme, fg, bg) {
  return ratio(value(theme, fg), value(theme, bg));
}
