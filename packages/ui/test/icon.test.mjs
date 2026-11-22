// Icon の名前の引き方のテスト。pnpm --filter knowidea-ui build の後に node --test で回す
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeIcon, iconNames } from "knowidea-icons/react";
import { Icon, registerIcons } from "../dist/index.js";

const src = new URL("../src/", import.meta.url);

test("部品の中で名前で描くアイコンは、すべて最初から持つ表にあり、読み込みを待たずに描く", () => {
  const names = new Set();
  for (const f of readdirSync(src).filter((f) => f.endsWith(".tsx") && f !== "Icon.tsx")) {
    const s = readFileSync(new URL(f, src), "utf8");
    // <Icon name="x" /> と <Icon name={a ? "x" : "y"} /> の中の名前
    for (const m of s.matchAll(/<Icon name=(?:"([a-z-]+)"|\{([^}]*)\})/g)) {
      if (m[1]) names.add(m[1]);
      for (const q of (m[2] ?? "").matchAll(/"([a-z-]+)"/g)) names.add(q[1]);
    }
    // 名前を値で持つ表 (Alert と Toast の toneIcon、Status の def の icon)
    for (const line of s.split("\n").filter((l) => /Record<[^>]*IconName>|\{ icon: "/.test(l))) {
      for (const q of line.matchAll(/: "([a-z-]+)"/g)) names.add(q[1]);
    }
  }
  const iconTsx = readFileSync(new URL("Icon.tsx", src), "utf8");
  const builtIn = iconTsx.slice(iconTsx.indexOf("const BUILT_IN"), iconTsx.indexOf("};", iconTsx.indexOf("const BUILT_IN")));
  // 拾い方が壊れて 0 件で通らないように、今ある数を下限にする
  assert.ok(names.size >= 25, `拾えた名前が少ない: ${[...names].join(", ")}`);
  for (const n of names) {
    // 拾った文字のうち、アイコンの名前の物だけを見る
    if (!iconNames.includes(n)) continue;
    const html = renderToStaticMarkup(createElement(Icon, { name: n }));
    if (html.startsWith("<span")) assert.fail(`${n} が BUILT_IN に無い (${builtIn.includes(n) ? "表にはある" : "表に無い"})`);
  }
});

test("表に無い名前は、読み終えるまで同じ大きさの空きを描き、label があれば名前を読み上げる", () => {
  assert.equal(renderToStaticMarkup(createElement(Icon, { name: "lightbulb" })), '<span aria-hidden="true" class="ki-icon"></span>');
  assert.equal(renderToStaticMarkup(createElement(Icon, { name: "lightbulb", label: "案" })), '<span role="img" aria-label="案" class="ki-icon"></span>');
});

test("表に無い名前に size を渡すと、空きも同じ幅と高さになる", () => {
  assert.equal(renderToStaticMarkup(createElement(Icon, { name: "lightbulb", size: 16 })), '<span aria-hidden="true" class="ki-icon" style="width:16px;height:16px"></span>');
  const css = readFileSync(new URL("../../css/src/base.css", import.meta.url), "utf8");
  assert.match(css, /\.ki-icon:where\(span\) \{ display: inline-block;/);
});

test("registerIcons で足した名前は、最初の描画から絵を描く", () => {
  registerIcons({ home: HomeIcon });
  assert.match(renderToStaticMarkup(createElement(Icon, { name: "home" })), /^<svg[^>]*class="ki-icon"/);
});
