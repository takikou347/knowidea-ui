// map.json の 16 個を 3 組から取り出し、dist/icons.json に書く。
// { 組: { 役: { viewBox, inner } } }。組ごとの描き方(塗りか線か)は attrs にある。
import fs from "node:fs";
import path from "node:path";

const pkgDir = (n) => path.join(process.cwd(), "node_modules", n);
const sets = {
  phosphor: {
    file: (n) => path.join(pkgDir("@phosphor-icons/core"), "assets/regular", n + ".svg"),
    attrs: 'fill="currentColor"',
  },
  tabler: {
    file: (n) => path.join(pkgDir("@tabler/icons"), "icons/outline", n + ".svg"),
    attrs: 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"',
  },
  lucide: {
    file: (n) => path.join(pkgDir("lucide-static"), "icons", n + ".svg"),
    attrs: 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"',
  },
};
const map = JSON.parse(fs.readFileSync("map.json", "utf8"));
const out = { roles: map.map(({ role, ja }) => ({ role, ja })) };
for (const [set, cfg] of Object.entries(sets)) {
  out[set] = { attrs: cfg.attrs, icons: {} };
  for (const m of map) {
    const svg = fs.readFileSync(cfg.file(m[set]), "utf8");
    const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
    const inner = svg
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^[\s\S]*?<svg[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "")
      .replace(/<path stroke="none"[^>]*\/>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    out[set].icons[m.role] = { name: m[set], viewBox, inner };
  }
}
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/icons.json", JSON.stringify(out));
console.log("dist/icons.json:", Object.keys(sets).join(", "), map.length, "個");

// 使う側が呼べる形の関数(docs と見本が同じ描き方を使う)
fs.writeFileSync("dist/render.mjs", `export const set = ${JSON.stringify(Object.fromEntries(Object.entries(sets).map(([k, v]) => [k, v.attrs])))};
export function svg(icons, setName, role, size = 20) {
  const s = icons[setName]; const i = s.icons[role];
  return \`<svg width="\${size}" height="\${size}" viewBox="\${i.viewBox}" \${s.attrs} aria-hidden="true" focusable="false">\${i.inner}</svg>\`;
}
`);
