// samples/tokens/index.html を作る。外を読まない 1 枚(フォントだけ Google Fonts)。
// 実行: node samples/tokens/build.mjs(先に pnpm --filter @knowidea/tokens build と pnpm --filter @knowidea/icons build)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { themes, color, primitive, ratio, hex, pairs } from "../../packages/tokens/scripts/contrast.mjs";
import core from "../../packages/tokens/src/core.json" with { type: "json" };
import { svg } from "../../packages/icons/dist/render.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const tokensCss = fs.readFileSync(path.join(here, "../../packages/tokens/dist/tokens.css"), "utf8");
const icons = JSON.parse(fs.readFileSync(path.join(here, "../../packages/icons/dist/icons.json"), "utf8"));

const n = (x) => +Number(x).toFixed(4);
const ok = (c) => `oklch(${n(c[0])} ${n(c[1])} ${n(c[2])})`;
const T = { light: themes["ライト"], dark: themes["ダーク"] };
const val = (t, k) => color(T[t], "color." + k);
const names = Object.keys(T.light.color);
const themeVars = (t, extra = {}) =>
  names.map((k) => `--color-${k}: ${extra[k] ? ok(extra[k]) : ok(val(t, k))}`).join("; ") + `; color-scheme: ${t}`;

// 成功の色の候補。now は今の値(#026337、ダーク #5dd68f)
const cands = [
  { id: "now", label: "今", note: "#026337 / #5dd68f", hue: 155.2,
    L: { success: [0.4393, 0.1074, 155.2], "success-soft": [0.95, 0.0355, 154.4] },
    D: { success: [0.7889, 0.1496, 155], "success-soft": [0.2911, 0.051, 154.7] } },
  ...["a", "b", "c"].map((k) => {
    const g = (p) => color(primitive, `ref.success.${k}.${p}`);
    return { id: k, label: k, hue: g("fg")[2],
      L: { success: g("fg"), "success-soft": g("soft") }, D: { success: g("fgDark"), "success-soft": g("softDark") } };
  }),
];
const primaryHue = val("light", "primary")[2];
const white = [1, 0, 0];
const nowWhite = ratio(cands[0].L.success, white);
const nowHueDiff = Math.abs(cands[0].hue - primaryHue);

const f1 = (x) => x.toFixed(2);
const sign = (x, d = 1) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);

function candidateCell(c, t) {
  const ex = t === "light" ? c.L : c.D;
  const style = themeVars(t, ex);
  const col = ex.success;
  const hueDiff = Math.abs(c.hue - primaryHue);
  const white_ = t === "light" ? ratio(col, white) : ratio(col, val("dark", "surface"));
  const base = t === "light" ? nowWhite : ratio(cands[0].D.success, val("dark", "surface"));
  const dHue = hueDiff - nowHueDiff, dR = white_ - base;
  const delta = (d, unit, digits) =>
    c.id === "now" ? `<span class="delta dim">基準</span>` :
    `<span class="delta ${d >= 0 ? "up" : "down"}">${sign(d, digits)}${unit}</span>`;
  return `<div class="cell" style="${style}">
  <h4>${t === "light" ? "ライト" : "ダーク"} <span class="dim num">${hex(col)}</span></h4>
  <div class="row-inline">
    <button type="button" class="btn">承認</button>
    <span class="badge b-primary">今いる所</span>
    <span class="badge b-success">成功</span>
  </div>
  <div class="scroll"><table class="mini">
    <tbody>
      <tr><td>PR 1a 方向の見本</td><td><span class="badge b-success">マージ済み</span></td></tr>
      <tr><td>PR 1b トークン</td><td><span class="badge b-warn">レビュー待ち</span></td></tr>
      <tr><td>成功と主の色</td><td><span class="badge ${hueDiff < 45 ? "b-error" : "b-success"}">${hueDiff < 45 ? "近い" : "離れた"}</span></td></tr>
    </tbody></table></div>
  <div class="stats">
    <div class="stat"><div class="dim">主の色との色相差</div><div class="big num">${hueDiff.toFixed(0)}°</div>${delta(dHue, "°", 0)}</div>
    <div class="stat"><div class="dim">${t === "light" ? "白" : "surface"}に対する比</div><div class="big num">${f1(white_)}</div>${delta(dR, "", 2)}</div>
  </div>
</div>`;
}

// 色のトークンの表
const fgOnSurface = ["text", "text-muted", "primary", "success", "warn", "error", "line-strong", "focus"];
function colorTable(t) {
  const rows = names.map((k) => {
    const c = val(t, k);
    const r = fgOnSurface.includes(k) ? f1(ratio(c, val(t, "surface"))) : "";
    return `<tr><td><span class="sw" style="background:var(--color-${k})"></span><code>${k}</code></td><td class="num">${ok(c)}</td><td class="num">${hex(c)}</td><td class="num">${r}</td></tr>`;
  }).join("");
  return `<div class="panel" style="${themeVars(t)}"><h3>${t === "light" ? "ライト" : "ダーク"}</h3><div class="scroll"><table>
<thead><tr><th>名前</th><th class="num">OKLCH</th><th class="num">HEX</th><th class="num">surface 比</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
const pairRows = pairs.map(([fg, bg, need]) => {
  const l = ratio(val("light", fg), val("light", bg)), d = ratio(val("dark", fg), val("dark", bg));
  const cls = (r) => (r >= need ? "ok" : "ng");
  return `<tr><td><code>${fg}</code></td><td><code>${bg}</code></td><td class="num">${need}:1</td><td class="num ${cls(l)}">${f1(l)}</td><td class="num ${cls(d)}">${f1(d)}</td></tr>`;
}).join("");

// アイコン
const sets = [["phosphor", "Phosphor regular"], ["tabler", "Tabler outline"], ["lucide", "Lucide"]];
const iconRows = icons.roles.map((r) =>
  `<tr><td>${r.ja}</td>${sets.map(([s]) => `<td class="ic">${svg(icons, s, r.role, 20)}</td><td class="ic">${svg(icons, s, r.role, 16)}</td>`).join("")}</tr>`).join("");

// 字、余白、角丸
const px = (t) => `${t.$value.value}px`;
const sizeRows = Object.entries(core.font.size).map(([k, t]) =>
  `<tr><td><code>font-size-${k}</code></td><td class="num">${px(t)}</td><td class="num">${core.font.lineHeight[k].$value}</td><td style="font-size:${px(t)};line-height:${core.font.lineHeight[k].$value}">ログを確かめる 1234567890</td></tr>`).join("");
const spaceRows = Object.entries(core.space).map(([k, t]) =>
  `<tr><td><code>space-${k}</code></td><td class="num">${px(t)}</td><td><span class="bar" style="width:${px(t)}"></span></td></tr>`).join("");
const radiusRows = Object.entries(core.radius).map(([k, t]) =>
  `<tr><td><code>radius-${k}</code></td><td class="num">${px(t)}</td><td><span class="rad" style="border-radius:${px(t)}"></span></td></tr>`).join("");

const aL = cands[1];
const rec = {
  l: hex(aL.L.success), d: hex(aL.D.success),
  hueDiff: Math.abs(aL.hue - primaryHue).toFixed(0),
};

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>トークンと成功の色</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans+JP:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokensCss}
* { box-sizing: border-box; }
html { background: var(--color-bg); -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--color-bg); color: var(--color-text); font: 400 var(--font-size-3)/var(--font-line-height-3) var(--font-sans); overflow-wrap: anywhere; }
h1, h2, h3, h4 { font-weight: 600; margin: 0; }
h1 { font-size: var(--font-size-5); line-height: var(--font-line-height-5); }
h2 { font-size: var(--font-size-4); line-height: var(--font-line-height-4); margin-bottom: var(--space-3); }
h3 { font-size: var(--font-size-3); margin-bottom: var(--space-3); }
h4 { font-size: var(--font-size-2); margin-bottom: var(--space-3); display: flex; justify-content: space-between; gap: var(--space-2); }
p { margin: 0 0 var(--space-3); }
code, .num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
code { font-size: var(--font-size-2); }
.dim { color: var(--color-text-muted); }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
.wrap { max-width: 1120px; margin: 0 auto; padding: 0 16px; }
header.top { padding: var(--space-6) 0 var(--space-4); display: flex; gap: var(--space-4); justify-content: space-between; align-items: flex-start; flex-wrap: wrap; }
header.top p { max-width: 64ch; margin: var(--space-2) 0 0; color: var(--color-text-muted); }
section { padding: var(--space-6) 0; border-top: 1px solid var(--color-line); }
.lead { color: var(--color-text-muted); max-width: 70ch; }
.toggle { min-height: var(--size-hit); padding: 0 var(--space-3); border: 1px solid var(--color-line-strong); background: var(--color-surface); color: var(--color-text); border-radius: var(--radius-2); font: inherit; cursor: pointer; }
.toggle:hover { background: var(--color-surface-2); }
.scroll { overflow-x: auto; max-width: 100%; border: 1px solid var(--color-line); border-radius: var(--radius-2); background: var(--color-surface); }
table { width: 100%; border-collapse: collapse; font-size: var(--font-size-2); line-height: var(--font-line-height-2); }
.scroll > table { min-width: 460px; }
.scroll > table.mini { min-width: 0; }
td:first-child { white-space: nowrap; }
.panel .scroll > table { min-width: 480px; }
th, td { padding: 8px 12px; text-align: left; vertical-align: middle; border-bottom: 1px solid var(--color-line); }
th { background: var(--color-surface-2); color: var(--color-text-muted); font-weight: 400; font-size: var(--font-size-1); white-space: nowrap; }
tbody tr:last-child td { border-bottom: 0; }
td.num, th.num { text-align: right; white-space: nowrap; }
.ok { color: var(--color-success); } .ng { color: var(--color-error); }
.sw { display: inline-block; width: 28px; height: 14px; border-radius: var(--radius-1); border: 1px solid var(--color-line-strong); vertical-align: -2px; margin-right: 8px; }
.panel { background: var(--color-bg); color: var(--color-text); border: 1px solid var(--color-line-strong); border-radius: var(--radius-3); padding: var(--space-4); min-width: 0; }
.grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); }
.picks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); }
.pick { border: 1px solid var(--color-line-strong); border-radius: var(--radius-3); background: var(--color-surface); padding: var(--space-4); }
.pick p { margin: 0 0 var(--space-2); }
.cand { margin-top: var(--space-5); }
.cand > h3 { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-3); align-items: baseline; }
.cell { background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-line-strong); border-radius: var(--radius-3); padding: var(--space-4); min-width: 0; display: grid; gap: var(--space-3); align-content: start; }
.cell h4 { margin: 0; }
.row-inline { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
.btn { min-height: var(--size-hit); padding: 0 var(--space-4); border: 1px solid var(--color-primary); border-radius: var(--radius-2); background: var(--color-primary); color: var(--color-on-primary); font: 600 var(--font-size-3)/1 var(--font-sans); cursor: pointer; }
.btn:hover { background: var(--color-primary-hover); }
.badge { display: inline-block; padding: 2px 8px; border-radius: var(--radius-1); font-size: var(--font-size-1); line-height: 1.4; white-space: nowrap; }
.b-success { background: var(--color-success-soft); color: var(--color-success); }
.b-warn { background: var(--color-warn-soft); color: var(--color-warn); }
.b-error { background: var(--color-error-soft); color: var(--color-error); }
.b-primary { background: var(--color-surface-2); color: var(--color-primary); border: 1px solid var(--color-primary); }
.stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
.stat { border: 1px solid var(--color-line); border-radius: var(--radius-2); padding: var(--space-3); font-size: var(--font-size-1); min-width: 0; }
.stat .big { font-size: var(--font-size-5); line-height: var(--font-line-height-5); font-weight: 600; color: var(--color-text); }
.delta { font-family: var(--font-mono); font-size: var(--font-size-2); }
.delta.up { color: var(--color-success); } .delta.down { color: var(--color-error); }
td.ic { color: var(--color-text); } td.ic svg { display: block; }
.bar { display: inline-block; height: 12px; background: var(--color-primary); }
.rad { display: inline-block; width: 48px; height: 24px; border: 1px solid var(--color-line-strong); background: var(--color-surface-2); }
@media (max-width: 800px) {
  .grid2, .picks { grid-template-columns: minmax(0, 1fr); }
  header.top { padding-top: var(--space-5); }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <div>
    <h1>トークン、成功の色、アイコン</h1>
    <p>1b の土台。方向 B の値を DTCG のトークンに起こし、成功の色の候補とアイコンの組を比べる。</p>
  </div>
  <button type="button" class="toggle" id="toggle" aria-label="テーマを切り替える">テーマ: 自動</button>
</header>

<section>
  <h2>結論</h2>
  <div class="picks">
    <div class="pick"><h3>成功の色</h3><p class="num">候補 a(色相 145)  ${rec.l} / ${rec.d}</p><p>主の色(色相 195)との色相差が ${nowHueDiff.toFixed(0)}° から ${rec.hueDiff}° に開き、彩度が高いので緑と青緑が分かれる。本文として白と surface に 4.5:1 以上、ダークも同じ。b と c は黄みが強く、警告の琥珀に近づく。</p></div>
    <div class="pick"><h3>アイコンの組</h3><p class="num">Phosphor の regular</p><p>20px で線 1.25px、16px で 1px。本文(IBM Plex Sans JP 400)と同じ重さ。Tabler と Lucide は 1 段重い。太さを light と bold に変えられる。</p></div>
  </div>
  <p class="lead" style="margin-top: var(--space-3)">どちらもオーナーの選択待ち。選ぶと、トークンの参照とアイコンの <code>map.json</code> を 1 か所変えるだけで済む。</p>
</section>

<section>
  <h2>色のトークン</h2>
  <p class="lead">ライトとダークは別に決めた(反転ではない)。部品は役割の名前(<code>--color-*</code>)だけを参照し、素の値は参照しない。アプリはこの変数を上書きして主の色や角丸を変える。</p>
  <div class="grid2">${colorTable("light")}${colorTable("dark")}</div>
  <h3 style="margin-top: var(--space-5)">コントラスト比</h3>
  <p class="lead">本文は 4.5:1 以上、線と focus の輪は 3:1 以上。<code>pnpm --filter @knowidea/tokens check</code> が同じ計算で判定し、落ちると失敗にする。</p>
  <div class="scroll"><table>
    <thead><tr><th>前景</th><th>背景</th><th class="num">必要</th><th class="num">ライト</th><th class="num">ダーク</th></tr></thead>
    <tbody>${pairRows}</tbody></table></div>
</section>

<section>
  <h2>成功の色の候補</h2>
  <p class="lead">今の成功(#026337)は主の色と近い(色相差 ${nowHueDiff.toFixed(0)}°)。色相を離した 3 つを、主の色のボタンとバッジ、表の行、数のカードの増減で並べる。数は実際の値(色相差と比)。</p>
  ${cands.map((c) => `<div class="cand"><h3>${c.id === "now" ? "今" : "候補 " + c.label}<span class="dim num">色相 ${c.hue}</span>${c.id === "a" ? '<span class="badge b-success">おすすめ</span>' : ""}</h3>
  <div class="grid2">${candidateCell(c, "light")}${candidateCell(c, "dark")}</div></div>`).join("")}
</section>

<section>
  <h2>アイコン 3 組の比較</h2>
  <p class="lead">管理アプリで要る 16 個を 20px と 16px で。Phosphor は線が細く、文字と同じ重さ。Tabler と Lucide は線 2px の枠で、20px では 1.67px。枠や丸で囲まない。</p>
  <div class="scroll"><table style="min-width: 640px">
    <thead><tr><th rowspan="2">役</th>${sets.map(([, l]) => `<th colspan="2">${l}</th>`).join("")}</tr>
    <tr>${sets.map(() => "<th>20px</th><th>16px</th>").join("")}</tr></thead>
    <tbody>${iconRows}</tbody></table></div>
</section>

<section>
  <h2>字、余白、角丸</h2>
  <div class="scroll"><table>
    <thead><tr><th>段</th><th class="num">大きさ</th><th class="num">行の高さ</th><th>見え方</th></tr></thead>
    <tbody>${sizeRows}</tbody></table></div>
  <p class="lead" style="margin-top: var(--space-3)">書体は IBM Plex Sans JP(見出し、本文)と IBM Plex Mono(数字、コード)。本文は 400、強調は 600。</p>
  <div class="grid2">
    <div class="scroll"><table style="min-width:0"><thead><tr><th>余白</th><th class="num">値</th><th>見え方</th></tr></thead><tbody>${spaceRows}</tbody></table></div>
    <div class="scroll"><table style="min-width:0"><thead><tr><th>角丸</th><th class="num">値</th><th>見え方</th></tr></thead><tbody>${radiusRows}</tbody></table></div>
  </div>
  <p class="lead" style="margin-top: var(--space-3)">押せる所は 44px(<code>--size-hit</code>)。動きは 120ms と 160ms、イージングは 1 つ。</p>
</section>
</div>
<script>
(function () {
  var b = document.getElementById("toggle"), root = document.documentElement;
  var order = ["auto", "light", "dark"], label = { auto: "自動", light: "ライト", dark: "ダーク" };
  function cur() { var t = root.getAttribute("data-theme"); return t === "light" || t === "dark" ? t : "auto"; }
  function show() { b.textContent = "テーマ: " + label[cur()]; }
  b.addEventListener("click", function () {
    var next = order[(order.indexOf(cur()) + 1) % 3];
    if (next === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", next);
    show();
  });
  show();
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(here, "index.html"), html);
console.log("samples/tokens/index.html", (html.length / 1024).toFixed(0) + "KB");
