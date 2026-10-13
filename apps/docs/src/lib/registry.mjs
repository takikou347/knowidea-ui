// コンポーネントの一覧。サイドメニュー、検索、各コンポーネントのページが同じものを読む。
// 各コンポーネントの内容は data/components/*.mjs(カテゴリごと)。
// props、クラス、変数の表と素の HTML の例のうち、共通のものは data/seed.mjs から引く。
import seed from "../data/seed.mjs";
import { input } from "../data/components/input.mjs";
import { display } from "../data/components/display.mjs";
import { feedback } from "../data/components/feedback.mjs";
import { surface } from "../data/components/surface.mjs";
import { navigation } from "../data/components/navigation.mjs";
import { layout } from "../data/components/layout.mjs";
import { charts } from "../data/components/charts.mjs";

export const categories = [
  { id: "input", name: "Inputs", list: input },
  { id: "display", name: "Data display", list: display },
  { id: "feedback", name: "Feedback", list: feedback },
  { id: "surface", name: "Surfaces", list: surface },
  { id: "navigation", name: "Navigation", list: navigation },
  { id: "layout", name: "Layout", list: layout },
  { id: "charts", name: "Charts", list: charts },
];

export const components = categories.flatMap((c) => c.list.map((x) => ({ props: [], classes: [], vars: [], a11y: [], demos: [], ...seed[x.slug], ...x, cat: c.id, catName: c.name })));
export const bySlug = Object.fromEntries(components.map((c) => [c.slug, c]));
