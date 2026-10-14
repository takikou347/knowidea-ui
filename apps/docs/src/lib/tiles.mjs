// 部品のタイルに置くデモ。トップの格子と、Components の一覧が同じ表を読む。
// fn: demos/<slug>.tsx の関数。wide: 大きな部品の印(今は 1 列なので幅は変わらない)。
import { snippet } from "./snippet.mjs";

export const pick = {
  button: { fn: "Variants" }, "icon-button": { fn: "Variants" }, "text-field": { fn: "Basic" }, input: { fn: "Basic" },
  textarea: { fn: "Basic" }, select: { fn: "Basic" }, combobox: { fn: "Basic" }, "date-picker": { fn: "Basic" }, calendar: { fn: "Basic" }, checkbox: { fn: "Basic" }, radio: { fn: "Basic" }, switch: { fn: "Basic" }, "segmented-control": { fn: "Basic" }, slider: { fn: "Basic" }, stepper: { fn: "Basic" }, "file-upload": { fn: "Basic" },
  field: { fn: "WithInput" }, avatar: { fn: "Sizes" }, badge: { fn: "Tones" }, chip: { fn: "Filter" }, status: { fn: "Kinds" },
  stat: { fn: "Basic", wide: true }, table: { fn: "Sortable", wide: true }, list: { fn: "Basic", wide: true }, timeline: { fn: "Basic", wide: true },
  tooltip: { fn: "Basic" }, popover: { fn: "Basic" }, "code-block": { fn: "Basic", wide: true }, kbd: { fn: "Combination" }, quote: { fn: "Basic" }, alert: { fn: "Closable" }, toast: { fn: "Tones" },
  dialog: { fn: "Basic" }, sheet: { fn: "Basic" }, progress: { fn: "Basic" }, skeleton: { fn: "Shapes" }, spinner: { fn: "Basic" }, "empty-state": { fn: "Basic" },
  card: { fn: "Basic", wide: true }, accordion: { fn: "Basic" }, "selection-bar": { fn: "Basic", wide: true }, link: { fn: "Basic" },
  tabs: { fn: "Basic" }, menu: { fn: "Basic" }, breadcrumbs: { fn: "Basic" }, pagination: { fn: "Basic" }, "app-bar": { fn: "Basic", wide: true },
  drawer: { fn: "Permanent", wide: true }, "bottom-navigation": { fn: "Basic" }, stack: { fn: "Column" }, grid: { fn: "Fixed", wide: true },
  container: { fn: "Sizes", wide: true }, divider: { fn: "Basic" }, chart: { fn: "Line", wide: true },
};

const icon = (n) => `<svg class="ki-icon" aria-hidden="true"><use href="#${n}"/></svg>`;

/** タイルのコード。React はデモそのもの、HTML は Plain HTML の例(あれば) */
export function tileCode(c, src, fn) {
  let react = "";
  try { react = snippet(src, fn); } catch { react = ""; }
  const html = c.html ? c.html.replace(/\$\{icon\("([\w-]+)"\)\}/g, (_, n) => icon(n)) : "";
  return { react, html };
}
