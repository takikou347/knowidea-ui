import { useMemo, useState, type CSSProperties } from "react";
import { Alert, Button, Card, Chip, CodeBlock, Progress, Switch, TextField, ThemeProvider } from "@knowidea/ui";
import { createTheme, parseColor, contrast, BASE, type ThemeOptions } from "@knowidea/tokens/create-theme";

interface Props {
  /** 基本のライト、ダークの色(themeStyle の出力。サーバー側で作る) */
  baseLight: Record<string, string>;
  baseDark: Record<string, string>;
}

const PRESETS = [
  { id: "#016C6C", label: "ブランド" },
  { id: "#2358B0", label: "青" },
  { id: "#6B3FA0", label: "紫" },
  { id: "#B3261E", label: "赤" },
  { id: "#9A4A00", label: "茶" },
  { id: "#E0B400", label: "黄(足りない例)" },
];

function Preview() {
  return (
    <div className="tc-preview">
      <div className="tc-row">
        <Button>保存</Button>
        <Button variant="secondary">取り消す</Button>
        <Button variant="quiet">あとで</Button>
      </div>
      <TextField label="名前" hint="英小文字とハイフン" placeholder="例: sample-name" />
      <Switch label="自動で更新する" defaultChecked />
      <div className="tc-row">
        <Chip label="選んだ" selected onClick={() => {}} />
        <Chip label="選ばない" onClick={() => {}} />
      </div>
      <Progress label="進み" value={60} />
      <Alert tone="info">保存した。</Alert>
      <Card title="カードの見出し" href="#theme-creator">本文は短く。</Card>
    </div>
  );
}

const toStyle = (o: Record<string, string>) => o as unknown as CSSProperties;

function ratioRows(t: ReturnType<typeof createTheme>) {
  const rows: { mode: string; label: string; ratio: number | null }[] = [];
  for (const mode of ["light", "dark"] as const) {
    const v = t[mode];
    const p = parseColor(v["--color-primary"] ?? "");
    const h = parseColor(v["--color-primary-hover"] ?? "");
    const on = parseColor(v["--color-on-primary"] ?? "");
    const name = mode === "light" ? "ライト" : "ダーク";
    if (!p || !h || !on) continue;
    rows.push({ mode: name, label: "主の色と背景(リンク、文字)", ratio: contrast(p, BASE[mode].bg) });
    rows.push({ mode: name, label: "主のボタンの文字", ratio: contrast(on, p) });
    rows.push({ mode: name, label: "hover のボタンの文字", ratio: contrast(on, h) });
  }
  return rows;
}

export default function ThemeCreator({ baseLight, baseDark }: Props) {
  const [primary, setPrimary] = useState("#016C6C");
  const [radius, setRadius] = useState(4);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [fontSize, setFontSize] = useState(14);
  const [selector, setSelector] = useState<":root" | ".brand">(".brand");

  const options: ThemeOptions = { primary, radius, density, fontSize };
  const theme = useMemo(() => createTheme(options), [primary, radius, density, fontSize]); // eslint-disable-line react-hooks/exhaustive-deps
  const parseError = theme.warnings.find((w) => w.id === "primary-parse");
  // 読めない値の間は、前の有効な値で見せる
  const [lastGood, setLastGood] = useState(theme);
  const shown = parseError ? lastGood : theme;
  if (!parseError && shown !== lastGood) setLastGood(theme);

  const rows = ratioRows(shown);
  const hexForPicker = /^#[0-9a-f]{6}$/i.test(primary) ? primary : "#000000";
  const css = shown.css(selector);
  const code = `<ThemeProvider theme={{ primary: "${primary}", radius: ${radius}, density: "${density}", fontSize: ${fontSize} }}>\n  <App />\n</ThemeProvider>`;
  const lightStyle = toStyle({ ...baseLight, ...shown.common, ...shown.light });
  const darkStyle = toStyle({ ...baseDark, ...shown.common, ...shown.dark });

  return (
    <div className="tc" id="theme-creator">
      <div className="tc-controls">
        <fieldset className="tc-field">
          <legend>主の色</legend>
          <div className="tc-row" role="group" aria-label="主の色の候補">
            {PRESETS.map((p) => <Chip key={p.id} label={p.label} selected={primary.toLowerCase() === p.id.toLowerCase()} onClick={() => setPrimary(p.id)} />)}
          </div>
          <div className="tc-color">
            <input type="color" aria-label="色を選ぶ" value={hexForPicker} onChange={(e) => setPrimary(e.target.value)} />
            <TextField label="色の値" hint="#rrggbb か oklch(L C h)" value={primary} onChange={(e) => setPrimary((e.target as HTMLInputElement).value)} error={parseError ? "読めない値。#rrggbb か oklch(L C h) で書く" : undefined} />
          </div>
        </fieldset>
        <div className="tc-field">
          <label htmlFor="tc-radius">角丸(中): <span className="num">{radius}px</span></label>
          <input id="tc-radius" className="tc-range" type="range" min={0} max={12} step={1} value={radius} onChange={(e) => setRadius(+e.target.value)} />
        </div>
        <div className="tc-field">
          <label htmlFor="tc-font">本文の字: <span className="num">{fontSize}px</span></label>
          <input id="tc-font" className="tc-range" type="range" min={12} max={20} step={1} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} />
        </div>
        <fieldset className="tc-field">
          <legend>密度</legend>
          <div className="tc-row" role="group" aria-label="密度">
            <Chip label="compact(詰めた)" selected={density === "compact"} onClick={() => setDensity("compact")} />
            <Chip label="comfortable(ゆったり)" selected={density === "comfortable"} onClick={() => setDensity("comfortable")} />
          </div>
        </fieldset>
      </div>

      <h3 id="tc-contrast">コントラスト比</h3>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="コントラスト比の表">
        <table className="docs-table" data-testid="contrast">
          <thead><tr><th>モード</th><th>組</th><th className="num">比</th><th>判定</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.mode}</td><td>{r.label}</td>
                <td className="num">{r.ratio == null ? "-" : r.ratio.toFixed(2) + ":1"}</td>
                <td>{r.ratio != null && r.ratio >= 4.5 ? <span className="ok">4.5:1 以上</span> : <span className="ng">4.5:1 に届かない</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div aria-live="polite">
        {shown.warnings.filter((w) => w.id !== "primary-parse").map((w, i) => <Alert key={i} tone="warn">{w.message}</Alert>)}
      </div>

      <h3 id="tc-preview">その場の見え方</h3>
      <div className="tc-panes">
        <section className="tc-pane" style={{ ...lightStyle, colorScheme: "light" }} aria-label="ライトの見本">
          <p className="tc-pane-title">ライト</p>
          <Preview />
        </section>
        <section className="tc-pane" style={{ ...darkStyle, colorScheme: "dark" }} aria-label="ダークの見本">
          <p className="tc-pane-title">ダーク</p>
          <Preview />
        </section>
      </div>

      <h3 id="tc-code">書き出し</h3>
      <div className="tc-row tc-sel" role="group" aria-label="CSS の対象">
        <Chip label=".brand(クラス)" selected={selector === ".brand"} onClick={() => setSelector(".brand")} />
        <Chip label=":root(全体)" selected={selector === ":root"} onClick={() => setSelector(":root")} />
      </div>
      <CodeBlock code={css} language="css" label="テーマの CSS" />
      <p className="tc-gap">React なら次の形でも同じになる。</p>
      <CodeBlock code={code} language="tsx" label="ThemeProvider のコード" />

      <h3 id="tc-live">ThemeProvider でかけた実物</h3>
      <p>下は、上の値を <code>ThemeProvider</code> に渡した結果。このページの表示(ライトかダーク)に従う。</p>
      <div className="tc-live">
        <ThemeProvider theme={options} onWarn={() => {}}>
          <Preview />
        </ThemeProvider>
      </div>
    </div>
  );
}
