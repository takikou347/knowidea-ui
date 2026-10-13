// コントラスト検査。落ちた組があれば exit 1。
import { primitive, themes, pairs, color, ratio, hex, inGamut } from "./contrast.mjs";
import { BASE, createTheme } from "../src/create-theme.mjs";

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

// createTheme の基準の面が tokens.css の値と同じこと。会社の主の色から作った値が、決めた値と近いこと
const oklchOf = (c) => c;
const near = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 0.0006);
for (const [mode, name] of [["light", "ライト"], ["dark", "ダーク"]]) {
  const T = themes[name];
  for (const k of ["bg", "surface", "surface-2"]) if (!near(BASE[mode][k === "surface-2" ? "surface2" : k], color(T, "color." + k))) { fail++; console.log(`NG  createTheme の ${mode}.${k} が tokens と違う`); }
}
{
  const t = createTheme({ primary: "#016C6C" });
  const wantL = oklchOf(color(themes.ライト, "color.primary")), wantD = oklchOf(color(themes.ダーク, "color.primary"));
  const close = (str, w) => { const m = str.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/); return m && Math.abs(m[1] - w[0]) < 0.01 && Math.abs(m[2] - w[1]) < 0.01; };
  if (t.warnings.length || !close(t.light["--color-primary"], wantL) || !close(t.dark["--color-primary"], wantD)) { fail++; console.log("NG  会社の主の色 #016C6C から作った値が、決めた主の色と合わない、または警告が出た"); }
  const sw = createTheme({ primary: "oklch(0.5 0.4 30)" });
  if (!/^oklch\(0\.5 0\.[0-3]/.test(sw.light["--color-primary"])) { fail++; console.log("NG  色域の外のライトの主の色を fit しない"); }
  if (!createTheme({ primary: "#016C6C", radius: 40 }).warnings.some((w) => w.id === "radius-large")) { fail++; console.log("NG  大きな角丸で警告が出ない"); }
  if (createTheme({ primary: "#016C6C", radius: 12 }).warnings.length) { fail++; console.log("NG  12px の角丸で警告が出た"); }
  if (!createTheme({ primary: "#016C6C", radius: 13 }).warnings.some((w) => w.id === "radius-large")) { fail++; console.log("NG  13px の角丸で警告が出ない"); }
  if (createTheme({ radius: 0 }).common["--radius-pill"] !== "0px") { fail++; console.log("NG  角丸 0 のテーマで --radius-pill が 0 にならない"); }
  if (!createTheme({ primary: "#88cccc" }).warnings.some((w) => w.id === "primary-bg")) { fail++; console.log("NG  薄い主の色で警告が出ない"); }
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
