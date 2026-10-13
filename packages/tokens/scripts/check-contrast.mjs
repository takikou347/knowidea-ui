// コントラスト検査。落ちた組があれば exit 1。
import { primitive, themes, pairs, color, ratio, hex, inGamut } from "./contrast.mjs";

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
