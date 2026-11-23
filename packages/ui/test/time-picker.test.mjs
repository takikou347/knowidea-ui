// TimePicker と時刻の一覧のテスト。pnpm --filter knowidea-ui build の後に node --test で回す
import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TimePicker } from "../dist/index.js";
import { listTimes, parseTime } from "../dist/time.js";

test("既定は 15 分ごとで、00:00 から 23:45 までの 96 個", () => {
  const t = listTimes({});
  assert.equal(t.length, 96);
  assert.equal(t[0], "00:00");
  assert.equal(t[1], "00:15");
  assert.equal(t.at(-1), "23:45");
});

test("step=5 で 5 分ごとの 288 個", () => {
  const t = listTimes({ step: 5 });
  assert.equal(t.length, 288);
  assert.equal(t[1], "00:05");
});

test("min と max の間だけを、両端を含めて出す", () => {
  assert.deepEqual(listTimes({ step: 60, min: "09:00", max: "12:00" }), ["09:00", "10:00", "11:00", "12:00"]);
});

test("min が刻みの途中なら、次の刻みから出す (刻みは 00:00 から数える)", () => {
  assert.deepEqual(listTimes({ step: 15, min: "09:10", max: "09:50" }), ["09:15", "09:30", "09:45"]);
});

test("刻みに無い今の値は、消さずに順の位置へ足す", () => {
  assert.deepEqual(listTimes({ step: 30, min: "09:00", max: "10:00", value: "09:07" }), ["09:00", "09:07", "09:30", "10:00"]);
});

test("形の合わない値と、1 から 720 の整数でない step は使わない", () => {
  assert.equal(parseTime("9:00"), null);
  assert.equal(parseTime("24:00"), null);
  assert.equal(parseTime("09:60"), null);
  assert.equal(parseTime("09:30"), 570);
  assert.equal(listTimes({ value: "25:00" }).length, 96);
  assert.equal(listTimes({ step: 0 }).length, 96);
  assert.equal(listTimes({ step: 7.5 }).length, 96);
});

const picker = (props) => renderToStaticMarkup(createElement(TimePicker, { label: "知らせる時刻", ...props }));

test("ラベルと欄を 1 つに描き、未選択では「時刻を選ぶ」を出す", () => {
  const html = picker({});
  assert.match(html, /<label[^>]*class="ki-field__label"[^>]*>知らせる時刻<\/label>/);
  assert.match(html, /class="ki-select ki-timepicker__trigger"/);
  assert.match(html, /role="combobox"/);
  assert.match(html, /時刻を選ぶ/);
});

test("値は HH:MM で欄に出し、name があれば同じ値をフォームで送る", () => {
  const html = picker({ defaultValue: "09:30", name: "notify_at" });
  assert.match(html, /<span class="ki-timepicker__value"[^>]*>09:30<\/span>/);
  assert.match(html, /name="notify_at"[^>]*value="09:30"|value="09:30"[^>]*name="notify_at"/);
});

test("説明と誤りの文を欄の下に出し、誤りがあると欄は aria-invalid になる", () => {
  const html = picker({ hint: "毎日この時刻に知らせる", error: "時刻を選ぶ" });
  assert.match(html, /class="ki-field__hint"[^>]*>毎日この時刻に知らせる</);
  assert.match(html, /class="ki-field__error"/);
  assert.match(html, /aria-invalid="true"/);
});

test("disabled で欄を押せなくする", () => {
  assert.match(picker({ disabled: true, defaultValue: "09:00" }), /<button[^>]*disabled=""/);
});
