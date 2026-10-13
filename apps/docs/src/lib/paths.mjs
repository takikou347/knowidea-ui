// ページの深さから、相対のリンクを作る。dist/ をどの場所の下に置いても壊れないようにする。
//   const { href, rel } = links(Astro.url.pathname);
//   href("components/button")  -> 本番(build.format "file")は ../components/button.html、dev は ../components/button
const PROD = import.meta.env.PROD;
export function links(pathname) {
  const segs = pathname.replace(/\.html$/, "").split("/").filter(Boolean);
  const depth = Math.max(0, segs.length - 1);
  const rel = depth === 0 ? "./" : "../".repeat(depth);
  const href = (p = "") => {
    const [path, hash] = p.split("#");
    const base = path === "" || path === "/" ? rel + (PROD ? "index.html" : "") : rel + path + (PROD ? ".html" : "");
    return hash ? base + "#" + hash : base;
  };
  const current = segs.length && !(segs.length === 1 && segs[0] === "index") ? segs.join("/") : "";
  return { rel, href, current, depth };
}
