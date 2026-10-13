// 上のバーの動き: テーマの切り替え、コンポーネントの検索、右側のページ内目次、ドロワーの閉じ方。
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

// コンポーネントの検索
const q = document.getElementById("docs-q");
const list = document.getElementById("docs-q-list");
const status = document.getElementById("docs-q-status");
const index = window.__docsIndex || [];
let active = -1;
const norm = (s) => s.toLowerCase().replace(/[\s-_]/g, "");
function render() {
  const t = norm(q.value);
  list.textContent = "";
  active = -1;
  if (!t) { list.hidden = true; q.setAttribute("aria-expanded", "false"); status.textContent = ""; return; }
  const hits = index.filter((c) => norm(c.n).includes(t)).slice(0, 8);
  for (const [i, c] of hits.entries()) {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.id = "docs-q-" + i;
    const a = document.createElement("a");
    a.href = c.h;
    a.tabIndex = -1;
    const name = document.createElement("span");
    name.textContent = c.n;
    const sub = document.createElement("span");
    sub.className = "docs-results-sub";
    sub.textContent = c.c;
    a.append(name, sub);
    li.append(a);
    list.append(li);
  }
  if (!hits.length) {
    const li = document.createElement("li");
    li.className = "docs-results-none";
    li.textContent = "No results";
    list.append(li);
  }
  list.hidden = false;
  q.setAttribute("aria-expanded", "true");
  status.textContent = hits.length ? `${hits.length} results` : "No results";
}
function mark(n) {
  const items = [...list.querySelectorAll('[role="option"]')];
  if (!items.length) return;
  active = (n + items.length) % items.length;
  items.forEach((it, i) => it.setAttribute("aria-selected", String(i === active)));
  q.setAttribute("aria-activedescendant", items[active].id);
}
q?.addEventListener("input", render);
q?.addEventListener("focus", render);
q?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); mark(active + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); mark(active - 1); }
  else if (e.key === "Enter") {
    const items = list.querySelectorAll('[role="option"] a');
    const a = items[Math.max(0, active)];
    if (a) { e.preventDefault(); location.href = a.href; }
  } else if (e.key === "Escape") { q.value = ""; render(); }
});
document.addEventListener("click", (e) => { if (!e.target.closest(".docs-search")) { list.hidden = true; q.setAttribute("aria-expanded", "false"); } });
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "") && !document.activeElement?.isContentEditable) { e.preventDefault(); q.focus(); }
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
