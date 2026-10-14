// 文書サイトの各部品のページに出ているコード例を集める。
// ページと同じ関数(apps/docs/src/lib/snippet.mjs)で、デモのファイルから切り出す。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { components } from "../../apps/docs/src/lib/registry.mjs";
import { snippet } from "../../apps/docs/src/lib/snippet.mjs";

const docs = fileURLToPath(new URL("../../apps/docs/", import.meta.url));

/** [{ slug, fn, title, code }] 部品ページの Demos に出る React のコード例 */
export function reactSnippets() {
  const out = [];
  for (const c of components) {
    const src = readFileSync(`${docs}src/demos/${c.slug}.tsx`, "utf8");
    for (const d of c.demos) out.push({ slug: c.slug, fn: d.fn, title: d.title, code: snippet(src, d.fn) });
  }
  return out;
}

/** 部品ページの import の行(ページ上部) */
export function importLines() {
  return components.map((c) => ({ slug: c.slug, code: `import { ${c.imports.join(", ")} } from "knowidea-ui";` }));
}

/** 部品ページの Plain HTML の例。アイコンは sprite 参照に置き換える */
export function htmlSnippets() {
  const icon = (n) => `<svg class="ki-icon" aria-hidden="true"><use href="#${n}"/></svg>`;
  return components
    .filter((c) => c.html)
    .map((c) => ({ slug: c.slug, code: c.html.replace(/\$\{icon\("([\w-]+)"\)\}/g, (_, n) => icon(n)) }));
}
