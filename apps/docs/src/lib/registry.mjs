// 部品の一覧。目次、検索、部品のページが同じ物を読む。
// 各部品の中身は data/components/*.mjs(分類ごと)。props、クラス、変数の表で古い物は data/seed.json から引く。
import seed from "../data/seed.json";
import { input } from "../data/components/input.mjs";
import { display } from "../data/components/display.mjs";
import { feedback } from "../data/components/feedback.mjs";
import { surface } from "../data/components/surface.mjs";
import { navigation } from "../data/components/navigation.mjs";
import { layout } from "../data/components/layout.mjs";
import { charts } from "../data/components/charts.mjs";

export const categories = [
  { id: "input", ja: "入力", list: input },
  { id: "display", ja: "データの表示", list: display },
  { id: "feedback", ja: "知らせ", list: feedback },
  { id: "surface", ja: "面", list: surface },
  { id: "navigation", ja: "移動", list: navigation },
  { id: "layout", ja: "レイアウト", list: layout },
  { id: "charts", ja: "グラフ", list: charts },
];

export const components = categories.flatMap((c) => c.list.map((x) => ({ props: [], classes: [], vars: [], a11y: [], demos: [], ...seed[x.slug], ...x, cat: c.id, catJa: c.ja })));
export const bySlug = Object.fromEntries(components.map((c) => [c.slug, c]));
