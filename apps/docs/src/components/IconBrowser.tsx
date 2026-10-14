import { useMemo, useRef, useState } from "react";
import { Button, Chip, CodeBlock, Icon as UiIcon } from "knowidea-ui";
import data from "knowidea-icons/dist/icons-data.json";

interface Def { viewBox: string; attrs: Record<string, string>; inner: string }
interface Item { name: string; ja: string; group: string; groupLabel: string }
const items = data.icons as Item[];
const defs = data.data as unknown as Record<string, { regular: Def; bold: Def }>;

// 分類の英語名
const GROUP_NAMES: Record<string, string> = {
  nav: "Navigation", action: "Actions", status: "Status", object: "Objects", chat: "Conversation",
  dev: "Development", data: "Data", calendar: "Date and time", text: "Text", media: "Media",
};
const groupName = (i: Item) => GROUP_NAMES[i.group] ?? i.groupLabel;

const pascal = (n: string) => n.split("-").map((s) => s[0]!.toUpperCase() + s.slice(1)).join("") + "Icon";
const svgOf = (name: string, w: "regular" | "bold") => {
  const d = defs[name]![w];
  const attrs = Object.entries(d.attrs).map(([k, v]) => ` ${k}="${v}"`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${d.viewBox}"${attrs}>${d.inner}</svg>`;
};

function Glyph({ name, weight, size = 24 }: { name: string; weight: "regular" | "bold"; size?: number }) {
  const d = defs[name]![weight];
  return (
    <svg className="ib-glyph" width={size} height={size} viewBox={d.viewBox} fill="currentColor" aria-hidden="true" dangerouslySetInnerHTML={{ __html: d.inner }} />
  );
}

export default function IconBrowser() {
  const [q, setQ] = useState("");
  const [weight, setWeight] = useState<"regular" | "bold">("regular");
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => i.name.includes(s) || i.ja.toLowerCase().includes(s) || groupName(i).toLowerCase().includes(s) || pascal(i.name).toLowerCase().includes(s));
  }, [q]);
  const groups = useMemo(() => {
    const m = new Map<string, { label: string; list: Item[] }>();
    for (const i of shown) {
      if (!m.has(i.group)) m.set(i.group, { label: groupName(i), list: [] });
      m.get(i.group)!.list.push(i);
    }
    return [...m.values()];
  }, [shown]);

  const copy = async (text: string, what: string) => {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch { /* 下のコードから手でコピーできる */ }
    setMsg(ok ? `Copied ${what}` : `Could not copy ${what}. Select it below`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(""), 2500);
  };

  const importLine = (n: string) => `import { ${pascal(n)} } from "knowidea-icons/react";`;
  const choose = (n: string) => { setSel(n); void copy(importLine(n), "import line"); };
  const item = sel ? items.find((i) => i.name === sel) : null;

  return (
    <div className="ib">
      <div className="ib-bar">
        <div className="ib-search">
          <label htmlFor="ib-q">Search by name</label>
          <input id="ib-q" className="ki-input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="calendar、日付、方向 など" autoComplete="off" />
        </div>
        <div className="ib-weight" role="group" aria-label="Weight">
          <Chip label="regular" selected={weight === "regular"} onClick={() => setWeight("regular")} />
          <Chip label="bold" selected={weight === "bold"} onClick={() => setWeight("bold")} />
        </div>
      </div>
      <p className="ib-count" role="status">{shown.length} icons{q ? ` (of ${items.length})` : ""}{msg ? ` / ${msg}` : ""}</p>

      {item ? (
        <div className="ib-detail" aria-label={`${item.name} details`}>
          <div className="ib-detail-head">
            <UiIcon name="info" />
            <strong>{item.name}</strong>
            <span className="muted">{item.ja}</span>
            <Glyph name={item.name} weight={weight} size={32} />
          </div>
          <CodeBlock code={importLine(item.name)} language="ts" label="import line" />
          <CodeBlock code={svgOf(item.name, weight)} language="html" label="SVG" />
          <div className="ib-detail-actions">
            <Button variant="secondary" onClick={() => copy(importLine(item.name), "import line")}>Copy import line</Button>
            <Button variant="secondary" onClick={() => copy(svgOf(item.name, weight), "SVG")}>Copy SVG</Button>
          </div>
        </div>
      ) : <p className="muted">アイコンをクリックすると、import 文がコピーされ、SVG が表示される。</p>}

      {groups.length === 0 ? <p className="ib-none">「{q}」に一致するアイコンはない。</p> : null}
      {groups.map((g) => (
        <section key={g.label} className="ib-group" aria-label={g.label}>
          <h3>{g.label} <span className="muted num">{g.list.length}</span></h3>
          <ul className="ib-grid">
            {g.list.map((i) => (
              <li key={i.name}>
                <button type="button" className="ib-tile" aria-pressed={sel === i.name} aria-label={`${i.name}(${i.ja})。import 文をコピーする`} onClick={() => choose(i.name)}>
                  <Glyph name={i.name} weight={weight} />
                  <span className="ib-name">{i.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
