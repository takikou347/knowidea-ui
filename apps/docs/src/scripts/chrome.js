// 上のバーの動き: テーマの切り替え、検索、右側のページ内目次、ドロワーの閉じ方。
const root = document.documentElement;

// テーマ: Auto -> Light -> Dark
const tb = document.getElementById("theme-toggle");
const order = ["auto", "light", "dark"];
const label = { auto: "Auto", light: "Light", dark: "Dark" };
const cur = () => (root.dataset.theme === "light" || root.dataset.theme === "dark" ? root.dataset.theme : "auto");
const show = () => { if (tb) tb.textContent = "Theme: " + label[cur()]; };
tb?.addEventListener("click", () => {
  const next = order[(order.indexOf(cur()) + 1) % 3];
  if (next === "auto") delete root.dataset.theme; else root.dataset.theme = next;
  try { next === "auto" ? localStorage.removeItem("ki-docs-theme") : localStorage.setItem("ki-docs-theme", next); } catch {}
  show();
});
show();

// 検索。索引(search-index.json)はビルドのときに作る静的なファイル。開いたときに 1 回だけ読む。
// 索引が無いとき(dev)は、コンポーネントの名前だけで探す。
const dlg = document.getElementById("docs-sd");
const q = document.getElementById("docs-q");
const list = document.getElementById("docs-q-list");
const hint = document.getElementById("docs-q-hint");
const status = document.getElementById("docs-q-status");
let entries = null, loading = false, active = -1;
const norm = (s) => s.normalize("NFKC").toLowerCase();

function load() {
  if (entries || loading) return;
  loading = true;
  const base = new URL(dlg.dataset.index, document.baseURI);
  fetch(base)
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then((rows) => { entries = rows.map((e) => ({ ...e, u: new URL(e.u, new URL("./", base)).href })); })
    .catch(() => { entries = (window.__docsIndex || []).map((c) => ({ t: c.n, h: "", u: new URL(c.h, document.baseURI).href, x: c.c })); })
    .finally(() => { loading = false; render(); });
}

function search(text) {
  const words = norm(text).split(/\s+/).filter(Boolean);
  const hits = [];
  for (const e of entries) {
    e._t ??= norm(e.t); e._h ??= norm(e.h); e._x ??= norm(e.x);
    let score = 0, ok = true;
    for (const w of words) {
      const s = (e._t === w ? 120 : e._t.startsWith(w) ? 90 : e._t.includes(w) ? 60 : 0) + (e._h.includes(w) ? 30 : 0) + (e._x.includes(w) ? 5 : 0);
      if (!s) { ok = false; break; }
      score += s;
    }
    if (ok) hits.push({ e, score: score - (e.h ? 1 : 0) });
  }
  hits.sort((a, b) => b.score - a.score);
  // 同じページから出すのは 2 件まで
  const per = new Map(), out = [];
  for (const h of hits) {
    const n = per.get(h.e.t) ?? 0;
    if (n >= 2) continue;
    per.set(h.e.t, n + 1);
    out.push(h.e);
    if (out.length >= 10) break;
  }
  return { out, words };
}

function snippet(e, words) {
  const text = e.x;
  if (!text) return null;
  const low = e._x;
  let at = -1;
  for (const w of words) { const i = low.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; }
  const from = Math.max(0, at < 0 ? 0 : at - 24);
  const part = text.slice(from, from + 110);
  const frag = document.createDocumentFragment();
  if (from > 0) frag.append("…");
  const lp = norm(part);
  const marks = [];
  for (const w of words) { let i = lp.indexOf(w); while (i >= 0 && lp.length === part.length) { marks.push([i, i + w.length]); i = lp.indexOf(w, i + w.length); } }
  marks.sort((a, b) => a[0] - b[0]);
  let pos = 0;
  for (const [s0, e0] of marks) {
    if (s0 < pos) continue;
    frag.append(part.slice(pos, s0));
    const b = document.createElement("b"); b.textContent = part.slice(s0, e0); frag.append(b);
    pos = e0;
  }
  frag.append(part.slice(pos));
  if (from + 110 < text.length) frag.append("…");
  return frag;
}

function render() {
  list.textContent = "";
  active = -1;
  q.removeAttribute("aria-activedescendant");
  const t = q.value.trim();
  if (!t || !entries) {
    hint.hidden = !!t && !!entries;
    q.setAttribute("aria-expanded", "false");
    status.textContent = "";
    return;
  }
  const { out, words } = search(t);
  hint.hidden = true;
  for (const [i, e] of out.entries()) {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.id = "docs-q-" + i;
    const a = document.createElement("a");
    a.href = e.u;
    a.tabIndex = -1;
    const title = document.createElement("span");
    title.className = "docs-results-title";
    title.textContent = e.h ? `${e.t} / ${e.h}` : e.t;
    a.append(title);
    const sn = snippet(e, words);
    if (sn) { const sub = document.createElement("span"); sub.className = "docs-results-sub"; sub.append(sn); a.append(sub); }
    li.append(a);
    list.append(li);
  }
  if (!out.length) {
    const li = document.createElement("li");
    li.className = "docs-results-none";
    li.textContent = "No results";
    list.append(li);
  }
  q.setAttribute("aria-expanded", String(out.length > 0));
  status.textContent = out.length ? `${out.length} results` : "No results";
}
function mark(n) {
  const items = [...list.querySelectorAll('[role="option"]')];
  if (!items.length) return;
  active = (n + items.length) % items.length;
  items.forEach((it, i) => it.setAttribute("aria-selected", String(i === active)));
  q.setAttribute("aria-activedescendant", items[active].id);
  items[active].scrollIntoView({ block: "nearest" });
}
function openSearch() {
  if (!dlg) return;
  if (!dlg.open) dlg.showModal();
  load();
  q.focus();
  q.select();
  render();
}
document.querySelectorAll("[data-docs-search-open]").forEach((b) => b.addEventListener("click", openSearch));
document.querySelectorAll("[data-docs-search-close]").forEach((b) => b.addEventListener("click", () => dlg.close()));
dlg?.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // 背景を押したら閉じる
q?.addEventListener("input", render);
q?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); mark(active + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); mark(active - 1); }
  else if (e.key === "Escape") { e.preventDefault(); dlg.close(); } // type=search は Esc で文字を消すだけなので、閉じるのはここで受ける
  else if (e.key === "Enter") {
    const a = list.querySelectorAll('[role="option"] a')[Math.max(0, active)];
    if (a) { e.preventDefault(); location.href = a.href; }
  }
});
document.addEventListener("keydown", (e) => {
  if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey) && !e.altKey) {
    e.preventDefault();
    if (dlg?.open) dlg.close(); else openSearch();
    return;
  }
  const el = document.activeElement;
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName || "") || el?.isContentEditable;
  if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey && !document.querySelector("dialog[open]")) { e.preventDefault(); openSearch(); }
});

// ドロワーの中のリンクをクリックしたら閉じる
document.getElementById("docs-drawer")?.addEventListener("click", (e) => {
  if (e.target.closest("a")) e.currentTarget.close();
});
// ドロワーが開いたまま幅が広くなったら閉じる
matchMedia("(min-width: 1024px)").addEventListener("change", (m) => { if (m.matches) document.getElementById("docs-drawer")?.close(); });

// 右側のページ内目次。h2 と h3 から作り、表示中の見出しに印を付ける
const tocList = document.getElementById("docs-toc-list");
if (tocList) {
  const heads = [...document.querySelectorAll("#main h2, #main h3")].filter((h) => !h.closest(".demo, .states-table, .tpl, .tc-pane, .tc-live"));
  const used = new Set();
  for (const h of heads) {
    if (!h.id) {
      let id = h.textContent.trim().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "") || "section";
      while (used.has(id)) id += "-2";
      h.id = id;
    }
    used.add(h.id);
    const li = document.createElement("li");
    li.dataset.level = h.tagName === "H3" ? "3" : "2";
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.append(a);
    tocList.append(li);
  }
  if (!heads.length) tocList.closest("aside")?.setAttribute("hidden", "");
  const links = new Map([...tocList.querySelectorAll("a")].map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) {
      links.forEach((a) => a.removeAttribute("aria-current"));
      links.get(en.target.id)?.setAttribute("aria-current", "location");
    }
  }, { rootMargin: "0px 0px -70% 0px" });
  heads.forEach((h) => io.observe(h));
}
