import { useMemo, useState, type CSSProperties } from "react";
import { Alert, Button, Card, Chip, CodeBlock, Progress, Switch, TextField, ThemeProvider } from "knowidea-ui";
import { createTheme, parseColor, contrast, gradientEnd, BASE, type ThemeOptions } from "knowidea-tokens/create-theme";

interface Props {
  /** ベースとなるライト、ダークの色(themeStyle の出力。ビルド時にサーバー側で作る) */
  baseLight: Record<string, string>;
  baseDark: Record<string, string>;
}

const PRESETS = [
  { id: "#016C6C", label: "Brand" },
  { id: "#2358B0", label: "Blue" },
  { id: "#6B3FA0", label: "Purple" },
  { id: "#B3261E", label: "Red" },
  { id: "#9A4A00", label: "Brown" },
  { id: "#E0B400", label: "Yellow (fails contrast)" },
];

function Preview() {
  return (
    <div className="tc-preview">
      <div className="tc-row">
        <Button>保存</Button>
        <Button variant="secondary">キャンセル</Button>
        <Button variant="quiet">あとで</Button>
      </div>
      <TextField label="名前" hint="英小文字とハイフン" placeholder="例: sample-name" />
      <Switch label="自動で更新する" defaultChecked />
      <div className="tc-row">
        <Chip label="選択中" selected onClick={() => {}} />
        <Chip label="未選択" onClick={() => {}} />
      </div>
      <Progress label="進捗" value={60} />
      <Alert tone="info">保存した。</Alert>
      <Card title="カードの見出し" href="#theme-creator">本文は短く。</Card>
    </div>
  );
}

const toStyle = (o: Record<string, string>) => o as unknown as CSSProperties;

function ratioRows(t: ReturnType<typeof createTheme>, look: "flat" | "gradient") {
  const rows: { mode: string; label: string; ratio: number | null }[] = [];
  for (const mode of ["light", "dark"] as const) {
    const v = t[mode];
    const p = parseColor(v["--color-primary"] ?? "");
    const h = parseColor(v["--color-primary-hover"] ?? "");
    const on = parseColor(v["--color-on-primary"] ?? "");
    const name = mode === "light" ? "Light" : "Dark";
    if (!p || !h || !on) continue;
    rows.push({ mode: name, label: "プライマリカラーと背景(リンク、文字)", ratio: contrast(p, BASE[mode].bg) });
    rows.push({ mode: name, label: "プライマリボタンの文字", ratio: contrast(on, p) });
    rows.push({ mode: name, label: "ホバー時のボタンの文字", ratio: contrast(on, h) });
    if (look === "gradient") rows.push({ mode: name, label: "グラデーションの終わりの色の上の文字", ratio: Math.min(contrast(on, gradientEnd(p)), contrast(on, gradientEnd(h))) });
  }
  return rows;
}

export default function ThemeCreator({ baseLight, baseDark }: Props) {
  const [primary, setPrimary] = useState("#016C6C");
  const [radius, setRadius] = useState(4);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [fontSize, setFontSize] = useState(14);
  const [look, setLook] = useState<"flat" | "gradient">("flat");
  const [selector, setSelector] = useState<":root" | ".brand">(".brand");

  const options: ThemeOptions = { primary, radius, density, fontSize, look };
  const theme = useMemo(() => createTheme(options), [primary, radius, density, fontSize, look]); // eslint-disable-line react-hooks/exhaustive-deps
  const parseError = theme.warnings.find((w) => w.id === "primary-parse");
  // 読み取れない値の間は、直前の有効な値で表示する
  const [lastGood, setLastGood] = useState(theme);
  const shown = parseError ? lastGood : theme;
  if (!parseError && shown !== lastGood) setLastGood(theme);

  const rows = ratioRows(shown, look);
  const hexForPicker = /^#[0-9a-f]{6}$/i.test(primary) ? primary : "#000000";
  const css = shown.css(selector);
  const code = `<ThemeProvider theme={{ primary: "${primary}", radius: ${radius}, density: "${density}", fontSize: ${fontSize}${look === "gradient" ? `, look: "gradient"` : ""} }}>\n  <App />\n</ThemeProvider>`;
  const lightStyle = toStyle({ ...baseLight, ...shown.common, ...shown.light });
  const darkStyle = toStyle({ ...baseDark, ...shown.common, ...shown.dark });

  return (
    <div className="tc" id="theme-creator">
      <div className="tc-controls">
        <fieldset className="tc-field">
          <legend>Primary color</legend>
          <div className="tc-row" role="group" aria-label="Primary color presets">
            {PRESETS.map((p) => <Chip key={p.id} label={p.label} selected={primary.toLowerCase() === p.id.toLowerCase()} onClick={() => setPrimary(p.id)} />)}
          </div>
          <div className="tc-color">
            <input type="color" aria-label="Pick a color" value={hexForPicker} onChange={(e) => setPrimary(e.target.value)} />
            <TextField label="Color value" hint="#rrggbb か oklch(L C h)" value={primary} onChange={(e) => setPrimary((e.target as HTMLInputElement).value)} error={parseError ? "読み取れない値。#rrggbb か oklch(L C h) で指定する" : undefined} />
          </div>
        </fieldset>
        <div className="tc-field">
          <label htmlFor="tc-radius">Radius (md): <span className="num">{radius}px</span></label>
          <input id="tc-radius" className="tc-range" type="range" min={0} max={12} step={1} value={radius} onChange={(e) => setRadius(+e.target.value)} />
        </div>
        <div className="tc-field">
          <label htmlFor="tc-font">Body font size: <span className="num">{fontSize}px</span></label>
          <input id="tc-font" className="tc-range" type="range" min={12} max={20} step={1} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} />
        </div>
        <fieldset className="tc-field">
          <legend>Density</legend>
          <div className="tc-row" role="group" aria-label="Density">
            <Chip label="compact" selected={density === "compact"} onClick={() => setDensity("compact")} />
            <Chip label="comfortable" selected={density === "comfortable"} onClick={() => setDensity("comfortable")} />
          </div>
        </fieldset>
        <fieldset className="tc-field">
          <legend>Look</legend>
          <div className="tc-row" role="group" aria-label="Look">
            <Chip label="flat" selected={look === "flat"} onClick={() => setLook("flat")} />
            <Chip label="gradient" selected={look === "gradient"} onClick={() => setLook("gradient")} />
          </div>
        </fieldset>
      </div>

      <h3 id="tc-contrast">Contrast ratios</h3>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Contrast ratios table">
        <table className="docs-table" data-testid="contrast" data-keep="">
          <thead><tr><th>Mode</th><th>Pair</th><th className="num">Ratio</th><th>Result</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.mode}</td><td>{r.label}</td>
                <td className="num">{r.ratio == null ? "-" : r.ratio.toFixed(2) + ":1"}</td>
                <td>{r.ratio != null && r.ratio >= 4.5 ? <span className="ok">4.5:1 以上</span> : <span className="ng">4.5:1 未満</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div aria-live="polite">
        {shown.warnings.filter((w) => w.id !== "primary-parse").map((w, i) => <Alert key={i} tone="warn">{w.message}</Alert>)}
      </div>

      <h3 id="tc-preview">Preview</h3>
      <div className="tc-panes">
        <section className="tc-pane" data-ki-look={look} style={{ ...lightStyle, colorScheme: "light" }} aria-label="Light preview">
          <p className="tc-pane-title">Light</p>
          <Preview />
        </section>
        <section className="tc-pane" data-ki-look={look} style={{ ...darkStyle, colorScheme: "dark" }} aria-label="Dark preview">
          <p className="tc-pane-title">Dark</p>
          <Preview />
        </section>
      </div>

      <h3 id="tc-code">Export</h3>
      <div className="tc-row tc-sel" role="group" aria-label="CSS selector">
        <Chip label=".brand (class)" selected={selector === ".brand"} onClick={() => setSelector(".brand")} />
        <Chip label=":root (global)" selected={selector === ":root"} onClick={() => setSelector(":root")} />
      </div>
      <CodeBlock code={css} language="css" label="Theme CSS" />
      <p className="tc-gap">React では、次のコードでも同じ結果になる。</p>
      <CodeBlock code={code} language="tsx" label="ThemeProvider code" />

      <h3 id="tc-live">Live ThemeProvider</h3>
      <p>下は、上の値を <code>ThemeProvider</code> に渡した実際の結果。このページの表示(ライトかダーク)に従う。</p>
      <div className="tc-live">
        <ThemeProvider theme={options} onWarn={() => {}}>
          <Preview />
        </ThemeProvider>
      </div>
    </div>
  );
}
