// ブラウザで開いたページに、見た目(CSS)が当たっていることと、部品が動くことを確かめる。
// 「エラーが無い」だけでは足りない: CSS が読まれていなくてもエラーは出ない。
// そのため、計算された値(getComputedStyle)を、トークンの値と比べる。

/** 結果の入れ物。ok(名前, 条件, 詳細) */
export function recorder() {
  const results = [];
  return {
    results,
    ok(name, cond, detail = "") { results.push({ name, ok: !!cond, detail: cond ? "" : String(detail) }); },
    failed: () => results.filter((r) => !r.ok),
  };
}

/** ページに道具を入れる(色を RGB にそろえる、変数の値を読む) */
export async function installHelpers(page) {
  await page.evaluate(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    window.__h = {
      rgb(c) { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3]]; },
      varRgb(name, el = document.documentElement) { return this.rgb(getComputedStyle(el).getPropertyValue(name).trim()); },
      lum(c) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); },
      near(a, b, t = 3) { return Math.abs(a[0] - b[0]) <= t && Math.abs(a[1] - b[1]) <= t && Math.abs(a[2] - b[2]) <= t; },
      px(v) { return parseFloat(v); },
    };
  });
}

export const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** 要素が見える(大きさがあり、display:none でない) */
export const visible = (page, sel) => page.locator(sel).first().waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false);

/** トークンの値が当たっているか: 要素の計算値(色)を、変数の値と比べる */
export function colorIs(page, sel, prop, varName, { within } = {}) {
  return page.evaluate(([sel, prop, varName]) => {
    const el = document.querySelector(sel);
    if (!el) return { found: false };
    const h = window.__h;
    const got = h.rgb(getComputedStyle(el)[prop]);
    const want = h.varRgb(varName, el);
    return { found: true, same: h.near(got, want), got, want };
  }, [sel, prop, varName]);
}

/** 見出しの書体: Jacket の題字が "KI Murecho" で、パッケージの woff2 が読めている(道が壊れていない) */
export async function checkDisplayFont(page, { ok }) {
  const f = await page.evaluate(async () => {
    const t = document.querySelector("#ex-jacket .ki-jacket__title");
    if (!t) return null;
    await document.fonts.ready;
    const faces = [...document.fonts].filter((x) => /KI Murecho/.test(x.family));
    return { family: getComputedStyle(t).fontFamily, faces: faces.map((x) => x.status), check: document.fonts.check('800 16px "KI Murecho"', t.textContent.slice(0, 4)) };
  });
  ok("Jacket: 題字が見出しの書体(KI Murecho)で、woff2 が読めている", f && /KI Murecho/.test(f.family) && f.faces.includes("loaded") && !f.faces.includes("error") && f.check, JSON.stringify(f));
}

/**
 * React の 2 つ(Vite、Vite + Tailwind)で共通の確かめ。
 * 約束: 画面は #ex-<部品> の中に部品の例がある。外側に ThemeProvider(primary = opts.primary)。
 */
export async function checkReactApp(page, rec, { primary, tailwind = false }) {
  await installHelpers(page);
  const { ok } = rec;
  const want = hexToRgb(primary);

  // --- 全体: トークンと body の既定
  const body = await page.evaluate(() => {
    const h = window.__h, cs = getComputedStyle(document.body);
    return { bgOk: h.near(h.rgb(cs.backgroundColor), h.varRgb("--color-bg")), colorOk: h.near(h.rgb(cs.color), h.varRgb("--color-text")), font: cs.fontFamily, margin: cs.marginTop, size: cs.fontSize };
  });
  ok("body: 背景が --color-bg", body.bgOk, JSON.stringify(body));
  ok("body: 文字色が --color-text", body.colorOk);
  ok("body: 書体が --font-sans(IBM Plex Sans JP が先頭)", /IBM Plex Sans JP/.test(body.font), body.font);
  ok("body: 余白 0、文字 14px", body.margin === "0px" && body.size === "14px", `${body.margin} ${body.size}`);
  await checkDisplayFont(page, rec);

  // --- Button
  const btn = await page.evaluate(() => {
    const h = window.__h, el = document.querySelector("#ex-button .ki-button");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { h: el.getBoundingClientRect().height, bg: h.rgb(cs.backgroundColor), radius: cs.borderTopLeftRadius, want: h.varRgb("--color-primary", el), radiusVar: getComputedStyle(el).getPropertyValue("--radius-2").trim() };
  });
  ok("Button: ある", btn, "#ex-button .ki-button が無い");
  if (btn) {
    ok("Button: 高さ 44px 以上", btn.h >= 43.5, btn.h);
    ok("Button: 背景が ThemeProvider の primary", Math.abs(btn.bg[0] - want[0]) <= 3 && Math.abs(btn.bg[1] - want[1]) <= 3 && Math.abs(btn.bg[2] - want[2]) <= 3, `${btn.bg} / ${want}`);
    ok("Button: 角丸が --radius-2", btn.radius === btn.radiusVar, `${btn.radius} / ${btn.radiusVar}`);
  }

  // --- TextField
  const tf = await page.evaluate(() => {
    const el = document.querySelector("#ex-text-field .ki-input");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { h: el.getBoundingClientRect().height, border: cs.borderTopWidth, label: !!document.querySelector("#ex-text-field label") };
  });
  ok("TextField: ある", tf);
  if (tf) { ok("TextField: 高さ 44px、枠線あり", tf.h >= 43.5 && parseFloat(tf.border) >= 1, JSON.stringify(tf)); ok("TextField: label がある", tf.label); }

  // --- Select(開く)
  await page.locator("#ex-select .ki-select").first().click();
  ok("Select: 開くと選択肢が出る", await visible(page, ".ki-select__popup"));
  const sel = await page.evaluate(() => { const el = document.querySelector(".ki-select__popup"); if (!el) return null; const cs = getComputedStyle(el); return { shadow: cs.boxShadow, bg: window.__h.near(window.__h.rgb(cs.backgroundColor), window.__h.varRgb("--color-surface")) }; });
  ok("Select: 選択肢のリストに影と背景", sel && sel.shadow !== "none" && sel.bg, JSON.stringify(sel));
  await page.keyboard.press("Escape");

  // --- Checkbox
  const cb = await page.evaluate(() => { const el = document.querySelector("#ex-checkbox [role=checkbox]"); if (!el) return null; const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return { w: r.width, border: cs.borderTopWidth, checked: el.getAttribute("aria-checked") }; });
  ok("Checkbox: ある", cb);
  if (cb) ok("Checkbox: 箱の大きさと枠線", cb.w >= 16 && parseFloat(cb.border) >= 1, JSON.stringify(cb));
  if (cb) { await page.locator("#ex-checkbox [role=checkbox]").first().click(); const after = await page.locator("#ex-checkbox [role=checkbox]").first().getAttribute("aria-checked"); ok("Checkbox: 押すと切り替わる", after !== cb.checked, `${cb.checked} -> ${after}`); }

  // --- Dialog(ポータルに出る。ThemeProvider の外でも primary が当たるか)
  await page.getByRole("button", { name: "ダイアログを開く" }).click();
  ok("Dialog: 開く", await visible(page, ".ki-dialog__popup"));
  const dlg = await page.evaluate(() => {
    const h = window.__h, el = document.querySelector(".ki-dialog__popup"), bd = document.querySelector(".ki-dialog__backdrop");
    if (!el) return null;
    const cs = getComputedStyle(el);
    const primaryBtn = [...el.querySelectorAll(".ki-button")].find((b) => b.textContent.includes("保存"));
    return { pos: cs.position, bg: h.near(h.rgb(cs.backgroundColor), h.varRgb("--color-surface", el)), backdrop: bd ? getComputedStyle(bd).backgroundColor : null, btnBg: primaryBtn ? h.rgb(getComputedStyle(primaryBtn).backgroundColor) : null, shadow: cs.boxShadow };
  });
  ok("Dialog: 位置が fixed、背景が surface、背景幕あり", dlg && dlg.pos === "fixed" && dlg.bg && dlg.backdrop && dlg.backdrop !== "rgba(0, 0, 0, 0)", JSON.stringify(dlg));
  ok("Dialog: ポータルの中でも ThemeProvider の primary が効く", dlg && dlg.btnBg && Math.abs(dlg.btnBg[0] - want[0]) <= 3 && Math.abs(dlg.btnBg[1] - want[1]) <= 3 && Math.abs(dlg.btnBg[2] - want[2]) <= 3, JSON.stringify(dlg?.btnBg) + " / " + want);
  await page.keyboard.press("Escape");
  ok("Dialog: Esc で閉じる", await page.locator(".ki-dialog__popup").first().waitFor({ state: "hidden", timeout: 3000 }).then(() => true, () => false));

  // --- Tabs
  const tabs = await page.evaluate(() => { const el = document.querySelector("#ex-tabs .ki-tabs__tab"); if (!el) return null; return { h: el.getBoundingClientRect().height, sel: el.getAttribute("aria-selected") ?? el.getAttribute("data-active") }; });
  ok("Tabs: ある", tabs);
  if (tabs) {
    ok("Tabs: 高さ 44px 以上", tabs.h >= 43.5, tabs.h);
    const before = await page.locator("#ex-tabs .ki-tabs__panel:visible").first().innerText();
    await page.locator("#ex-tabs .ki-tabs__tab").nth(1).click();
    // 押した直後は前の内容が残ることがあるので、変わるまで少し待つ
    await page.waitForFunction((b) => { const el = [...document.querySelectorAll("#ex-tabs .ki-tabs__panel")].find((p) => p.offsetParent); return el && el.innerText !== b; }, before, { timeout: 2000 }).catch(() => {});
    const after = await page.locator("#ex-tabs .ki-tabs__panel:visible").first().innerText();
    ok("Tabs: 押すと内容が変わる", before !== after, `${before} -> ${after}`);
  }

  // --- Menu
  await page.locator("#ex-menu").getByRole("button", { name: "操作" }).click();
  ok("Menu: 開く", await visible(page, ".ki-menu__popup"));
  const menu = await page.evaluate(() => { const el = document.querySelector(".ki-menu__popup"); if (!el) return null; const cs = getComputedStyle(el); const it = el.querySelector(".ki-menu__item"); return { shadow: cs.boxShadow, itemH: it ? it.getBoundingClientRect().height : 0, pos: window.getComputedStyle(el.closest(".ki-menu__positioner") ?? el).position }; });
  ok("Menu: 影あり、項目の高さ 44px 以上", menu && menu.shadow !== "none" && menu.itemH >= 43.5, JSON.stringify(menu));
  await page.keyboard.press("Escape");

  // --- Toast
  await page.getByRole("button", { name: "情報のトーストを表示" }).click();
  ok("Toast: 出る", await visible(page, ".ki-toast"));
  const toast = await page.evaluate(() => { const v = document.querySelector(".ki-toast-viewport"), t = document.querySelector(".ki-toast"); if (!t) return null; const r = t.getBoundingClientRect(); return { vpPos: v ? getComputedStyle(v).position : null, inView: r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1 && r.top >= 0, w: r.width }; });
  ok("Toast: 画面に固定され、画面の中に収まる", toast && toast.vpPos === "fixed" && toast.inView, JSON.stringify(toast));

  // --- ToastProvider が ThemeProvider の外にある場合
  await page.getByRole("button", { name: "外の Provider から出す" }).click();
  await page.waitForFunction(() => [...document.querySelectorAll(".ki-toast")].some((t) => t.textContent.includes("外の Provider")), null, { timeout: 3000 }).catch(() => {});
  const outer = await page.evaluate(() => { const t = [...document.querySelectorAll(".ki-toast")].find((x) => x.textContent.includes("外の Provider")); if (!t) return null; const h = window.__h; return { attr: t.getAttribute("data-ki-theme"), p: h.rgb(getComputedStyle(t).getPropertyValue("--color-primary").trim()), want: h.rgb("#7a3db8") }; });
  ok("Toast: ToastProvider が ThemeProvider の外でも、呼んだ所のテーマが当たる", outer && outer.attr && outer.p && outer.p.slice(0, 3).every((v, i) => Math.abs(v - outer.want[i]) <= 3), JSON.stringify(outer));

  // --- Table
  const tbl = await page.evaluate(() => { const t = document.querySelector("#ex-table .ki-table"); if (!t) return null; const th = t.querySelector("thead th"); const cs = getComputedStyle(th); const h = window.__h; return { rows: t.querySelectorAll("tbody tr").length, thBg: h.near(h.rgb(cs.backgroundColor), h.varRgb("--color-surface-2", th)), thBorder: cs.borderBottomWidth, pad: cs.paddingLeft }; });
  ok("Table: ある", tbl);
  if (tbl) ok("Table: 見出しの背景(surface-2)と線と余白、行がある", tbl.rows >= 3 && tbl.thBg && parseFloat(tbl.thBorder) >= 1 && parseFloat(tbl.pad) > 0, JSON.stringify(tbl));
  if (tbl) {
    const first = await page.locator("#ex-table tbody tr").first().innerText();
    await page.locator("#ex-table .ki-table__sort").nth(1).click().catch(() => {});
    const firstAfter = await page.locator("#ex-table tbody tr").first().innerText();
    ok("Table: 並べ替えの見出しを押すと行が変わる", first !== firstAfter, `${first} -> ${firstAfter}`);
  }

  // --- Chart
  const chart = await page.evaluate(() => { const s = document.querySelector("#ex-chart .ki-chart__svg"); if (!s) return null; const r = s.getBoundingClientRect(); const bar = s.querySelector(".ki-chart__bar"); return { w: r.width, h: r.height, bars: s.querySelectorAll(".ki-chart__bar").length, fill: bar ? getComputedStyle(bar).fill : null, fillOk: bar ? window.__h.rgb(getComputedStyle(bar).fill)[3] > 0 : false }; });
  ok("Chart: ある", chart);
  if (chart) ok("Chart: 大きさがあり、棒に色が付く", chart.w > 100 && chart.h > 50 && chart.bars >= 10 && chart.fillOk, JSON.stringify(chart));

  // --- アイコン
  const icon = await page.evaluate(() => { const el = document.querySelector("#ex-icons svg.ki-icon"); if (!el) return null; const r = el.getBoundingClientRect(); return { w: r.width, fs: parseFloat(getComputedStyle(el).fontSize), fill: getComputedStyle(el).fill, paths: el.querySelectorAll("path").length }; });
  ok("Icon(React): ある", icon);
  if (icon) ok("Icon(React): 1.25em の大きさで、形(path)がある", Math.abs(icon.w - icon.fs * 1.25) < 0.6 && icon.paths > 0, JSON.stringify(icon));

  const ip = await page.evaluate(() => { const svgs = [...document.querySelectorAll("#ex-icons-page svg")]; return { n: svgs.length, paths: svgs.map((v) => v.querySelectorAll("path").length), w: svgs.map((v) => v.getBoundingClientRect().width), role: svgs.map((v) => v.getAttribute("role")) }; });
  ok("Icons ページの React の例: 3 つ描かれ、title を渡したものだけ role=img", ip.n === 3 && ip.paths.every((x) => x > 0) && ip.role[2] === "img" && ip.role[0] !== "img", JSON.stringify(ip));

  // --- createTheme の CSS(brand クラス)
  const brand = await page.evaluate(() => { const el = document.querySelector("#ex-brand .ki-button"); if (!el) return null; const h = window.__h; return { bg: h.rgb(getComputedStyle(el).backgroundColor), r: getComputedStyle(el).borderTopLeftRadius }; });
  ok("createTheme: brand クラスの Button に primary と角丸 6px", brand && Math.abs(brand.bg[0] - 0x22) <= 3 && Math.abs(brand.bg[1] - 0x55) <= 3 && Math.abs(brand.bg[2] - 0xcc) <= 3 && brand.r === "6px", JSON.stringify(brand));

  // --- Overriding(変数、コンポーネントの変数、クラスを足す)
  const ov = await page.evaluate(() => {
    const h = window.__h, btns = [...document.querySelectorAll("#ex-overriding .ki-button")], save = btns.find((b) => b.classList.contains("save-button"));
    const gap = document.querySelector("#ex-gap .ki-stack");
    return { bg: save ? h.rgb(getComputedStyle(save).backgroundColor) : null, want: h.rgb("oklch(0.48 0.15 260)"), minW: save ? getComputedStyle(save).minWidth : null, styleMin: btns.find((b) => !b.classList.contains("save-button"))?.style.minWidth, gap: gap ? getComputedStyle(gap).rowGap : null };
  });
  ok("Overriding 1: .my-app { --color-primary } で Button の色が変わる", ov.bg && Math.abs(ov.bg[0] - ov.want[0]) <= 3 && Math.abs(ov.bg[2] - ov.want[2]) <= 3, JSON.stringify(ov));
  ok("Overriding 2: .my-list { --ki-gap } で Stack の間隔が変わる(24px)", ov.gap === "24px", ov.gap);
  const nest = await page.evaluate(() => { const o = document.querySelector("#ex-nest > .ki-stack"); if (!o) return null; const [i, g] = o.children; return { outer: getComputedStyle(o).rowGap, inner: getComputedStyle(i).rowGap, grid: getComputedStyle(g).rowGap, align: getComputedStyle(i).alignItems }; });
  ok("入れ子: gap を省いた内側の Stack と Grid は外側の値を受け継がず 12px", nest && nest.outer === "32px" && nest.inner === "12px" && nest.grid === "12px" && nest.align === "stretch", JSON.stringify(nest));
  ok("Overriding 3: .save-button.ki-button { min-width: 8rem } と style の minWidth", ov.minW === "128px" && ov.styleMin === "8rem", JSON.stringify(ov));

  if (tailwind) {
    const tw = await page.evaluate(() => {
      const h = window.__h, box = document.querySelector("#ex-tailwind > div"); if (!box) return null;
      const cs = getComputedStyle(box), wide = [...box.querySelectorAll(".ki-button")].find((b) => b.textContent.includes("余白を足す"));
      return { radius: cs.borderTopLeftRadius, radiusVar: getComputedStyle(box).getPropertyValue("--radius-2").trim(), bg: h.near(h.rgb(cs.backgroundColor), h.varRgb("--color-surface", box)), border: cs.borderTopWidth, borderColor: h.near(h.rgb(cs.borderTopColor), h.varRgb("--color-line", box)), pad: cs.paddingTop, text: h.near(h.rgb(cs.color), h.varRgb("--color-text", box)), padX: wide ? getComputedStyle(wide).paddingLeft : null };
    });
    ok("Tailwind: rounded-2 が --radius-2、bg-surface、border-line、p-4 が 16px、text-text", tw && tw.radius === tw.radiusVar && tw.bg && tw.borderColor && tw.pad === "16px" && tw.text && parseFloat(tw.border) >= 1, JSON.stringify(tw));
    ok("Tailwind: className=\"px-8\" が ki-button の padding に勝つ(32px。layer が無いと 16px のまま)", tw && tw.padX === "32px", tw?.padX);
  }

  // --- ダークモード(ボタンで data-theme を切り替える)
  const lightBg = await page.evaluate(() => window.__h.rgb(getComputedStyle(document.body).backgroundColor));
  const modeBtn = page.getByRole("button", { name: /^表示: / });
  await modeBtn.click(); // auto -> light
  await modeBtn.click(); // light -> dark
  await page.waitForTimeout(500); // 色の transition(160ms)が終わるまで
  const dark = await page.evaluate(() => {
    const h = window.__h, cs = getComputedStyle(document.body);
    const btn = document.querySelector("#ex-button .ki-button");
    return { attr: document.documentElement.dataset.theme, bg: h.rgb(cs.backgroundColor), color: h.rgb(cs.color), btnBg: btn ? h.rgb(getComputedStyle(btn).backgroundColor) : null };
  });
  ok("Dark: data-theme=dark が付く", dark.attr === "dark", dark.attr);
  ok("Dark: ページの背景が暗くなり、文字が明るくなる", dark && lightBg && dark.bg[0] < 80 && dark.color[0] > 150 && lightBg[0] > 200, JSON.stringify({ lightBg, dark }));
  ok("Dark: ThemeProvider の primary はダーク用に別の色になる", dark.btnBg && !(Math.abs(dark.btnBg[0] - want[0]) <= 3 && Math.abs(dark.btnBg[1] - want[1]) <= 3), JSON.stringify(dark.btnBg));
  await page.getByRole("button", { name: "ダイアログを開く" }).click();
  const darkDlg = await page.evaluate(() => { const el = document.querySelector(".ki-dialog__popup"); return el ? window.__h.rgb(getComputedStyle(el).backgroundColor) : null; });
  ok("Dark: ダイアログ(ポータル)も暗い", darkDlg && darkDlg[0] < 80, JSON.stringify(darkDlg));
  await page.keyboard.press("Escape");
  await modeBtn.click(); // dark -> auto
  const autoAttr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  ok("Dark: auto に戻すと data-theme が外れる", autoAttr === null, autoAttr);
}
