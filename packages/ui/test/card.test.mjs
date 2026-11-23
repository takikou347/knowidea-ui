// Card の見出しの大きさと操作の寄せ方のテスト。pnpm --filter knowidea-ui build の後に node --test で回す
import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Card } from "../dist/index.js";

const card = (props) => renderToStaticMarkup(createElement(Card, { title: "通知", actions: createElement("button", null, "保存"), ...props }, "本文"));

test("既定では見出しの大きさと操作の寄せ方の印を付けず、今までと同じ形で描く", () => {
  const html = card({});
  assert.match(html, /^<article class="ki-card">/);
  assert.doesNotMatch(html, /data-title-size|data-actions-align/);
  assert.match(html, /<div class="ki-card__actions"><button>保存<\/button><\/div>/);
});

test("titleSize=\"md\" と actionsAlign=\"start\" は既定と同じで、印を付けない", () => {
  assert.equal(card({ titleSize: "md", actionsAlign: "start" }), card({}));
});

test("titleSize=\"lg\" で、本体に見出しを 1 段大きくする印が付く", () => {
  assert.match(card({ titleSize: "lg" }), /^<article class="ki-card" data-title-size="lg">/);
});

test("actionsAlign=\"end\" で、本体に操作を右下に寄せる印が付く", () => {
  assert.match(card({ actionsAlign: "end" }), /^<article class="ki-card" data-actions-align="end">/);
});

test("読み込み中の形にも見出しの大きさの印が付く", () => {
  assert.match(card({ titleSize: "lg", state: "loading" }), /^<article class="ki-card" data-title-size="lg" data-state="loading"/);
});
