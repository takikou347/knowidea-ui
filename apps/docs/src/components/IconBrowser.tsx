import { useMemo, useRef, useState } from "react";
import { Button, Chip, CodeBlock, Icon as UiIcon } from "@knowidea/ui";
import data from "@knowidea/icons/dist/icons-data.json";

interface Def { viewBox: string; attrs: Record<string, string>; inner: string }
interface Item { name: string; ja: string; group: string; groupLabel: string }
const items = data.icons as Item[];
const defs = data.data as unknown as Record<string, { regular: Def; bold: Def }>;

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
    return items.filter((i) => i.name.includes(s) || i.ja.toLowerCase().includes(s) || i.groupLabel.includes(s) || pascal(i.name).toLowerCase().includes(s));
  }, [q]);
  const groups = useMemo(() => {
    const m = new Map<string, { label: string; list: Item[] }>();
    for (const i of shown) {
      if (!m.has(i.group)) m.set(i.group, { label: i.groupLabel, list: [] });
      m.get(i.group)!.list.push(i);
    }
    return [...m.values()];
  }, [shown]);

  const copy = async (text: string, what: string) => {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch { /* 下の欄から写せる */ }
    setMsg(ok ? `${what}を写した` : `${what}を写せなかった。下の欄から選んで写す`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(""), 2500);
  };

  const importLine = (n: string) => `import { ${pascal(n)} } from "@knowidea/icons/react";`;
  const choose = (n: string) => { setSel(n); void copy(importLine(n), "import の行"); };
  const item = sel ? items.find((i) => i.name === sel) : null;

  return (
    <div className="ib">
      <div className="ib-bar">
        <div className="ib-search">
          <label htmlFor="ib-q">名前で探す</label>
          <input id="ib-q" className="ki-input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="例: calendar、日付、方向" autoComplete="off" />
        </div>
        <div className="ib-weight" role="group" aria-label="太さ">
          <Chip label="regular" selected={weight === "regular"} onClick={() => setWeight("regular")} />
          <Chip label="bold" selected={weight === "bold"} onClick={() => setWeight("bold")} />
        </div>
      </div>
      <p className="ib-count" role="status">{shown.length} 個{q ? `(全部で ${items.length} 個)` : ""}{msg ? ` / ${msg}` : ""}</p>

      {item ? (
        <div className="ib-detail" aria-label={`${item.name} の詳細`}>
          <div className="ib-detail-head">
            <UiIcon name="info" />
            <strong>{item.name}</strong>
            <span className="muted">{item.ja}</span>
            <Glyph name={item.name} weight={weight} size={32} />
          </div>
          <CodeBlock code={importLine(item.name)} language="ts" label="import の行" />
          <CodeBlock code={svgOf(item.name, weight)} language="html" label="SVG" />
          <div className="ib-detail-actions">
            <Button variant="secondary" onClick={() => copy(importLine(item.name), "import の行")}>import の行を写す</Button>
            <Button variant="secondary" onClick={() => copy(svgOf(item.name, weight), "SVG")}>SVG を写す</Button>
          </div>
        </div>
      ) : <p className="muted">アイコンを押すと、import の行を写し、SVG を見せる。</p>}

      {groups.length === 0 ? <p className="ib-none">「{q}」に合うアイコンは無い。</p> : null}
      {groups.map((g) => (
        <section key={g.label} className="ib-group" aria-label={g.label}>
          <h3>{g.label} <span className="muted num">{g.list.length}</span></h3>
          <ul className="ib-grid">
            {g.list.map((i) => (
              <li key={i.name}>
                <button type="button" className="ib-tile" aria-pressed={sel === i.name} aria-label={`${i.name}(${i.ja})。import の行を写す`} onClick={() => choose(i.name)}>
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
