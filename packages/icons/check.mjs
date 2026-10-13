// dist の中身を確かめる: 数、currentColor、React の描画、型。
import fs from "node:fs";
import { execSync } from "node:child_process";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon, ChevronRightIcon, iconNames } from "./dist/react/index.js";

const { icons } = JSON.parse(fs.readFileSync("icons.json", "utf8"));
const fail = (m) => { console.error("NG:", m); process.exit(1); };
if (iconNames.length !== icons.length) fail("数が合わない");
for (const i of icons) for (const s of ["", "-bold"]) {
  const svg = fs.readFileSync(`dist/svg/${i.name}${s}.svg`, "utf8");
  if (!svg.includes("currentColor")) fail(i.name + " に currentColor が無い");
  if (/#[0-9a-f]{3,6}\b/i.test(svg)) fail(i.name + " に色の直書きがある");
}
const sprite = fs.readFileSync("dist/sprite.svg", "utf8");
if ((sprite.match(/<symbol /g) || []).length !== icons.length * 2) fail("sprite の数");
const h = renderToStaticMarkup(createElement(Icon, { name: "chevron-right", size: 16, weight: "bold" }));
if (!h.includes('width="16"') || !h.includes("aria-hidden")) fail("Icon の描画: " + h);
const t = renderToStaticMarkup(createElement(ChevronRightIcon, { title: "進む" }));
if (!t.includes("<title>進む</title>") || !t.includes('role="img"')) fail("title: " + t);
execSync("npx tsc -p test/tsconfig.json", { stdio: "inherit" });
console.log("OK:", icons.length, "個、svg", icons.length * 2, "枚、型もよし");
