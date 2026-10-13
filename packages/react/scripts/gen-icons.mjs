// 部品の中で使う小さなアイコンの path を、Phosphor regular から写して src/icon-data.ts にする。
// packages/icons ができるまでの当面の置き方。icon は外から渡せるので、後で差し替えられる。
import { readFileSync, writeFileSync } from "node:fs";
const dir = new URL("../node_modules/@phosphor-icons/core/assets/regular/", import.meta.url).pathname;
const names = ["check", "x", "info", "warning", "warning-circle", "check-circle", "caret-down", "caret-up", "caret-left", "caret-right", "copy", "tray", "arrows-down-up", "dots-three", "trash", "plus", "magnifying-glass"];
const out = {};
for (const n of names) {
  const svg = readFileSync(dir + n + ".svg", "utf8");
  out[n] = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]).join("");
}
writeFileSync(new URL("../src/icon-data.ts", import.meta.url),
  "// 自動生成。pnpm --filter @knowidea/react gen:icons。出どころ: @phosphor-icons/core 2.1.1 regular(MIT)\nexport const iconPaths = " +
  JSON.stringify(out, null, 2) + " as const;\nexport type IconName = keyof typeof iconPaths;\n");
console.log(names.length + " 個");
