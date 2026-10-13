// ページの元のファイル(リポジトリの根からの道)。"Edit this page" のリンクが使う。
// current は links() が返す、拡張子の無いページの道(例: "components/button")。
import { site } from "../site.config.mjs";
import { bySlug } from "./registry.mjs";

export function sourcePath(current) {
  const d = site.docsDir + "src/";
  if (current === "") return d + "pages/index.astro";
  if (current === "components") return d + "pages/components/index.astro";
  if (current.startsWith("components/")) {
    const c = bySlug[current.slice("components/".length)];
    return c ? d + `data/components/${c.cat}.mjs` : null;
  }
  if (current.startsWith("customization/tokens/")) return d + "pages/customization/tokens/[kind].astro";
  return d + `pages/${current}.astro`;
}

export const editUrl = (current) => {
  const p = sourcePath(current);
  return p ? `${site.repo}/edit/${site.branch}/${p}` : null;
};
