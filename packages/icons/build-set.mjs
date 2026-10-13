// icons.json の全アイコンを、素の SVG、スプライト、React の部品にして dist/ に書く。
// Phosphor は regular と bold を取り出す。自作(custom/*.svg)は線で描いてあり、bold は線を 16 から 24 にする。
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const phos = path.join(root, "node_modules/@phosphor-icons/core");
const { icons } = JSON.parse(fs.readFileSync("icons.json", "utf8"));
const WEIGHTS = ["regular", "bold"];

const pascal = (n) => n.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("") + "Icon";
const camel = (a) => a.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// SVG の文字列を { attrs, inner } に分ける
function split(svg) {
  const m = svg.match(/<svg([^>]*)>([\s\S]*)<\/svg>\s*$/);
  const attrs = {};
  for (const a of m[1].matchAll(/([\w:-]+)="([^"]*)"/g)) if (!["xmlns", "viewBox"].includes(a[1])) attrs[a[1]] = a[2];
  const viewBox = m[1].match(/viewBox="([^"]+)"/)[1];
  return { viewBox, attrs, inner: m[2].replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").trim() };
}
function load(icon, weight) {
  if (icon.custom) {
    let s = fs.readFileSync(path.join("custom", icon.name + ".svg"), "utf8");
    if (weight === "bold") s = s.replace('stroke-width="16"', 'stroke-width="24"');
    return split(s);
  }
  const f = weight === "regular" ? `${icon.phosphor}.svg` : `${icon.phosphor}-bold.svg`;
  return split(fs.readFileSync(path.join(phos, "assets", weight, f), "utf8"));
}

const dist = path.join(root, "dist");
fs.rmSync(path.join(dist, "svg"), { recursive: true, force: true });
fs.rmSync(path.join(dist, "react"), { recursive: true, force: true });
for (const d of ["svg", "react", "react/icons"]) fs.mkdirSync(path.join(dist, d), { recursive: true });

const data = {};
const symbols = [];
for (const icon of icons) {
  data[icon.name] = {};
  for (const w of WEIGHTS) {
    const v = load(icon, w);
    data[icon.name][w] = v;
    const id = w === "regular" ? icon.name : `${icon.name}-bold`;
    const a = Object.entries(v.attrs).map(([k, x]) => `${k}="${x}"`).join(" ");
    fs.writeFileSync(path.join(dist, "svg", id + ".svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v.viewBox}" ${a}>${v.inner}</svg>\n`);
    symbols.push(`<symbol id="${id}" viewBox="${v.viewBox}" ${a}>${v.inner}</symbol>`);
  }
}
fs.writeFileSync(path.join(dist, "sprite.svg"), `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>\n`);
fs.writeFileSync(path.join(dist, "icons-data.json"), JSON.stringify({ icons, data }));

// ライセンス
fs.copyFileSync(path.join(phos, "LICENSE"), path.join(dist, "LICENSE-phosphor.txt"));
fs.writeFileSync(path.join(dist, "NOTICE.txt"), `このフォルダのアイコンの大半は Phosphor Icons(MIT、Copyright (c) 2023 Phosphor Icons)から取り出した。
ライセンス全文は LICENSE-phosphor.txt。
custom に入っている ${icons.filter((i) => i.custom).map((i) => i.name).join("、")} は KNOW IDEA の自作で、Phosphor と同じ格子(256)と線(16)で描いた。
`);

// React の部品。JSX を使わず createElement だけで書く(ビルドの道具が要らない)
function parseInner(inner) {
  const els = [];
  const re = /<(\w+)([^>]*?)\/>/g;
  let rest = inner, m;
  while ((m = re.exec(inner))) {
    const props = {};
    for (const a of m[2].matchAll(/([\w:-]+)="([^"]*)"/g)) props[camel(a[1])] = a[2];
    els.push([m[1], props]);
    rest = rest.replace(m[0], "");
  }
  if (rest.trim()) throw new Error("自己閉じでない要素がある: " + inner);
  return els;
}
const def = {};
for (const icon of icons) {
  def[icon.name] = {};
  for (const w of WEIGHTS) {
    const v = data[icon.name][w];
    const attrs = Object.fromEntries(Object.entries(v.attrs).map(([k, x]) => [camel(k), x]));
    def[icon.name][w] = { v: v.viewBox, a: attrs, c: parseInner(v.inner) };
  }
}
const R = path.join(dist, "react");
fs.writeFileSync(path.join(R, "create.js"), `import { createElement } from "react";

// 1 つのアイコンの部品を作る。size は px(既定 20)、weight は regular(既定)か bold。
// title を渡すと role="img" で名前を読み上げ、渡さなければ飾り(aria-hidden)。
export function createIcon(name, def) {
  function Icon({ size = 20, weight = "regular", title, children, ...rest }) {
    const d = def[weight] ?? def.regular;
    const label = title
      ? { role: "img" }
      : { "aria-hidden": true, focusable: "false" };
    return createElement(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: d.v, ...d.a, ...label, ...rest },
      title ? createElement("title", null, title) : null,
      ...d.c.map(([tag, props], i) => createElement(tag, { key: i, ...props })),
      children,
    );
  }
  Icon.displayName = name;
  return Icon;
}
`);
fs.writeFileSync(path.join(R, "create.d.ts"), `import type { FC } from "react";
import type { IconProps } from "./types.js";
export function createIcon(name: string, def: Record<string, unknown>): FC<IconProps>;
`);
fs.writeFileSync(path.join(R, "types.d.ts"), `import type { SVGProps } from "react";

export type IconWeight = "regular" | "bold";
export type IconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  /** px。既定 20。表の中は 16(細くなるので weight="bold" を試す)。24 以上は使わない */
  size?: number | string;
  /** 既定 regular。16px の所は bold */
  weight?: IconWeight;
  /** 渡すと role="img" で読み上げる。渡さなければ飾りで読み上げない */
  title?: string;
};
`);
const names = icons.map((i) => i.name);
for (const icon of icons) {
  const P = pascal(icon.name);
  fs.writeFileSync(path.join(R, "icons", P + ".js"), `import { createIcon } from "../create.js";
export const ${P} = createIcon(${JSON.stringify(icon.name)}, ${JSON.stringify(def[icon.name])});
export default ${P};
`);
  fs.writeFileSync(path.join(R, "icons", P + ".d.ts"), `import type { FC } from "react";
import type { IconProps } from "../types.js";
export declare const ${P}: FC<IconProps>;
export default ${P};
`);
}
fs.writeFileSync(path.join(R, "data.js"), `export const iconDefs = ${JSON.stringify(def)};\nexport const iconNames = ${JSON.stringify(names)};\n`);
fs.writeFileSync(path.join(R, "Icon.js"), `import { createElement } from "react";
import { createIcon } from "./create.js";
import { iconDefs } from "./data.js";

const cache = new Map();
// <Icon name="chevron-right" size={20} weight="regular" />
export function Icon({ name, ...props }) {
  let C = cache.get(name);
  if (!C) {
    if (!iconDefs[name]) throw new Error("知らないアイコン: " + name);
    C = createIcon(name, iconDefs[name]);
    cache.set(name, C);
  }
  return createElement(C, props);
}
`);
fs.writeFileSync(path.join(R, "Icon.d.ts"), `import type { FC } from "react";
import type { IconProps } from "./types.js";
import type { IconName } from "./names.js";
export declare const Icon: FC<IconProps & { name: IconName }>;
`);
fs.writeFileSync(path.join(R, "names.d.ts"), `export type IconName =\n${names.map((n) => `  | "${n}"`).join("\n")};\nexport declare const iconNames: readonly IconName[];\n`);
fs.writeFileSync(path.join(R, "index.js"), `export { Icon } from "./Icon.js";
export { iconNames } from "./data.js";
${icons.map((i) => `export { ${pascal(i.name)} } from "./icons/${pascal(i.name)}.js";`).join("\n")}
`);
fs.writeFileSync(path.join(R, "index.d.ts"), `export { Icon } from "./Icon.js";
export type { IconProps, IconWeight } from "./types.js";
export type { IconName } from "./names.js";
export { iconNames } from "./names.js";
${icons.map((i) => `export { ${pascal(i.name)} } from "./icons/${pascal(i.name)}.js";`).join("\n")}
`);
console.log(`dist/svg: ${icons.length * 2} 枚、sprite.svg、react: ${icons.length} 部品 + Icon`);
