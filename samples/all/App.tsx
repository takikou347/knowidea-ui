import { useEffect, useState, type ReactNode } from "react";
import {
  Badge, Banner, Button, Checkbox, Divider, Field, Icon, IconButton, Input, Link, RadioGroup, Select, Switch, Textarea,
} from "@knowidea/react";
import tokenData from "./gen/tokens.json";
import iconData from "./gen/icons.json";
import { WithIcon } from "../../apps/docs/src/demos/button.tsx";
import { InputField, Mixed } from "../../apps/docs/src/demos/field.tsx";
import { Row as IconButtons, Large } from "../../apps/docs/src/demos/icon-button.tsx";
import { Banners, Badges, Code, Quotes, Skeletons, Spinners, Empty, Dividers, Pages } from "../../apps/docs/src/demos/misc.tsx";
import { DialogDemo, ConfirmDemo, MenuDemo, TooltipDemo, ToastDemo } from "../../apps/docs/src/demos/overlay.tsx";
import { Demo as TableDemo } from "../../apps/docs/src/demos/table.tsx";
import { Demo as TabsDemo } from "../../apps/docs/src/demos/tabs.tsx";
import {
  Stats, StatStates, TrendToggle, Claudes, Statuses, Proposals, Threads, Decisions, Talks, Tray, Activities, Stops, Shell,
} from "../../apps/docs/src/demos/admin.tsx";
import { HomeScreen, ThreadsScreen } from "../../apps/docs/src/demos/screens.tsx";

type Scheme = "auto" | "light" | "dark";
type App = "" | "logru" | "ruleru";

function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      <span>{label}</span>
      {options.map(([v, t]) => <Button key={v} variant="secondary" aria-pressed={value === v} onClick={() => onChange(v)}>{t}</Button>)}
    </div>
  );
}
function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id}><h2>{title}</h2>{children}</section>;
}
function Comp({ title, children }: { title: string; children: ReactNode }) {
  return <div className="comp"><h3>{title}</h3><div className="demo">{children}</div></div>;
}

function Tokens() {
  const t = tokenData as any;
  return (
    <>
      <p>色は OKLCH で決め、ライトとダークを別に持つ。情報(info)は色相 250 の青で、主の青緑(195)、成功の緑(145)と分かれる。比は <code>pnpm --filter tokens check</code> と同じ計算。</p>
      <div className="table-wrap"><table className="plain">
        <thead><tr><th>名前</th><th>ライト</th><th>ダーク</th></tr></thead>
        <tbody>{t.colors.map((c: any) => (
          <tr key={c.name}><td><code>{c.name}</code></td>
            <td><span className="sw" style={{ background: c.light.css }} /><span className="num">{c.light.hex}</span></td>
            <td><span className="sw" style={{ background: c.dark.css }} /><span className="num">{c.dark.hex}</span></td></tr>
        ))}</tbody>
      </table></div>
      <h3>コントラスト比</h3>
      <p className="muted">本文は 4.5:1 以上、線と focus は 3:1 以上。</p>
      <div className="table-wrap"><table className="plain">
        <thead><tr><th>前景</th><th>背景</th><th>必要</th><th>ライト</th><th>ダーク</th></tr></thead>
        <tbody>{t.pairs.map((p: any) => (
          <tr key={p.fg + p.bg}><td><code>{p.fg}</code></td><td><code>{p.bg}</code></td><td className="num">{p.need}:1</td>
            <td className={"num " + (p.l >= p.need ? "ok" : "ng")}>{p.l.toFixed(2)}</td><td className={"num " + (p.d >= p.need ? "ok" : "ng")}>{p.d.toFixed(2)}</td></tr>
        ))}</tbody>
      </table></div>
    </>
  );
}

function Icons() {
  const [q, setQ] = useState("");
  const all = iconData as any;
  const draw = (name: string) => {
    const v = all.data[name].regular;
    const a = Object.entries(v.attrs).map(([k, x]) => `${k}="${x}"`).join(" ");
    return `<svg width="20" height="20" viewBox="${v.viewBox}" ${a} aria-hidden="true" focusable="false">${v.inner}</svg>`;
  };
  const groups: { id: string; label: string; items: any[] }[] = [];
  for (const i of all.icons) {
    if (q && !`${i.name} ${i.ja} ${i.apps.join(" ")}`.toLowerCase().includes(q.toLowerCase())) continue;
    let g = groups.find((x) => x.id === i.group);
    if (!g) groups.push((g = { id: i.group, label: i.groupLabel, items: [] }));
    g.items.push(i);
  }
  const n = groups.reduce((a, g) => a + g.items.length, 0);
  return (
    <>
      <p>全 {all.icons.length} 個(Phosphor regular の 131 個と自作 2 個)。用途ごと。管理アプリ、Logru、Ruleru のどこで使うかを名前の下に書いた。</p>
      <div className="icons-filter">
        <label htmlFor="iq">絞り込み</label>
        <div style={{ flex: "1 1 220px", maxWidth: 360 }}><Input id="iq" type="search" placeholder="名前、日本語、admin、logru、ruleru" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <span className="muted" aria-live="polite">{n} 個</span>
      </div>
      {groups.map((g) => (
        <div key={g.id}>
          <h3>{g.label}<span className="muted"> {g.items.length}</span></h3>
          <ul className="igrid">{g.items.map((i) => (
            <li key={i.name} className="icell">
              <span dangerouslySetInnerHTML={{ __html: draw(i.name) }} />
              <span className="nm">{i.name}{i.custom ? <span className="tag">自作</span> : null}</span>
              <span className="ja">{i.ja}</span>
              <span className="ja">{i.apps.join("、")}</span>
            </li>
          ))}</ul>
        </div>
      ))}
    </>
  );
}

export default function Sample() {
  const [scheme, setScheme] = useState<Scheme>("auto");
  const [app, setApp] = useState<App>("");
  useEffect(() => {
    const r = document.documentElement;
    if (scheme === "auto") delete r.dataset.theme; else r.dataset.theme = scheme;
  }, [scheme]);
  useEffect(() => {
    const r = document.documentElement;
    if (app) r.dataset.app = app; else delete r.dataset.app;
  }, [app]);
  const [radio, setRadio] = useState("a");
  return (
    <div className="wrap">
      <h1>KNOW IDEA の基本のデザイン: 全部の見本</h1>
      <h2 style={{ marginTop: 0 }}>結論</h2>
      <p>トークン、アイコン 133 個、共通の部品 25 種、管理アプリの部品 11 種、管理アプリの画面 2 枚が、1 つの土台でそろった。管理アプリ、Logru、Ruleru はこの土台の CSS 変数を上書きして使う。上のバーで、既定、Logru、Ruleru とライト、ダークを切り替えて、全部を確かめられる。</p>
      <p>オーナーに見てほしい所は 3 つ。</p>
      <ol className="pick">
        <li>管理アプリのホームの密度と色づかい(「管理アプリの画面」)。推移のグラフは灰色の棒で、選んだ 1 本だけが主の色。状態は色に形と字を足して出した。</li>
        <li>情報の色(青、色相 250)。主の青緑、成功の緑と並べて、見分けがつくか(「トークン」の info)。</li>
        <li>Logru と Ruleru の違い(角丸、本文の大きさ、余白)。主の色はどちらも未決のまま、既定の青緑を使っている。</li>
      </ol>
      <div className="bar" role="region" aria-label="見本の切り替え">
        <Seg<App> label="アプリ" value={app} onChange={setApp} options={[["", "既定"], ["logru", "Logru"], ["ruleru", "Ruleru"]]} />
        <Seg<Scheme> label="色" value={scheme} onChange={setScheme} options={[["auto", "自動"], ["light", "ライト"], ["dark", "ダーク"]]} />
      </div>
      <ul className="toc">
        {[["tokens", "トークン"], ["icons", "アイコン"], ["common", "共通の部品"], ["admin", "管理アプリの部品"], ["screens", "管理アプリの画面"], ["themes", "テーマ"]].map(([id, t]) => <li key={id}><a href={"#" + id}>{t}</a></li>)}
      </ul>

      <Block id="tokens" title="トークン"><Tokens /></Block>
      <Block id="icons" title="アイコン"><Icons /></Block>

      <Block id="common" title="共通の部品 25 種">
        <div className="comps two">
          <Comp title="ボタン">
            <Button>主</Button><Button variant="secondary">副</Button><Button variant="quiet">静か</Button><Button variant="danger">危ない</Button><Button loading>送る</Button><Button disabled>無効</Button><WithIcon />
          </Comp>
          <Comp title="アイコンボタン"><IconButtons /><Large /></Comp>
          <Comp title="リンク"><p style={{ margin: 0 }}>文の中の <Link href="#common">リンク</Link> と、<Link href="#common" external>外へのリンク</Link>。</p></Comp>
          <Comp title="入力と欄(Field)"><InputField /><InputField kind="error" /></Comp>
          <Comp title="複数行の入力、選ぶ、チェック"><Mixed /></Comp>
          <Comp title="ラジオとスイッチ">
            <RadioGroup legend="間隔" value={radio} onValueChange={setRadio} options={[{ value: "a", label: "毎日" }, { value: "b", label: "毎週" }, { value: "c", label: "停止中", disabled: true }]} />
            <div style={{ display: "grid" }}><Switch label="完了したら知らせる" defaultChecked /><Switch label="無効" disabled /><Checkbox label="チェック" defaultChecked /></div>
          </Comp>
          <Comp title="表"><TableDemo /></Comp>
          <Comp title="タブ"><TabsDemo /></Comp>
          <Comp title="ダイアログ、メニュー、ツールチップ、知らせ"><DialogDemo /><ConfirmDemo /><MenuDemo /><TooltipDemo /><ToastDemo /></Comp>
          <Comp title="帯(Banner)"><Banners /></Comp>
          <Comp title="札(Badge)"><Badges /></Comp>
          <Comp title="コードブロックと引用"><Code /><Quotes /></Comp>
          <Comp title="読み込み(Skeleton と Spinner)"><Skeletons /><Spinners /></Comp>
          <Comp title="空の状態"><Empty /></Comp>
          <Comp title="区切りとページ送り"><Dividers /><Pages /></Comp>
        </div>
      </Block>

      <Block id="admin" title="管理アプリの部品">
        <div className="comps">
          <Comp title="数のカード"><Stats /><StatStates kind="loading" /><StatStates kind="error" /></Comp>
          <Comp title="推移のグラフ(棒と折れ線、押すと値と部署の内訳)"><TrendToggle /></Comp>
          <Comp title="Claude のカード(状態 5 つ)"><Claudes /></Comp>
          <Comp title="状態の印"><Statuses /><Statuses kind="proposal" /></Comp>
          <Comp title="提案とプロジェクトのカード"><Proposals /></Comp>
          <Comp title="スレッドと PR の行"><Threads picked={["t2"]} /></Comp>
          <Comp title="承認、否認、コメントと話しかける欄"><Decisions /><Talks /></Comp>
          <Comp title="まとめて送るトレイ"><Tray /></Comp>
          <Comp title="最近の動き"><Activities /></Comp>
          <Comp title="止めるボタン"><Stops /></Comp>
          <Comp title="アプリの枠(幅で上のバー+タブバーとサイドの目次が変わる)">
            <div className="frames" style={{ width: "100%" }}><Shell width={390} tab frame={300} /><Shell width={1024} frame={300} /></div>
          </Comp>
        </div>
      </Block>

      <Block id="screens" title="管理アプリの画面">
        <p>数は見本で、実際の数ではない。同じ部品で、幅 390px(iPhone)と 1024px(iPad)が崩れない。</p>
        <h3>ホーム 幅 390px</h3><HomeScreen width={390} height={720} />
        <h3>ホーム 幅 1024px</h3><HomeScreen width={1024} height={720} />
        <h3>スレッドと PR 幅 390px</h3><ThreadsScreen width={390} height={720} />
        <h3>スレッドと PR 幅 1024px</h3><ThreadsScreen width={1024} height={720} />
      </Block>

      <Block id="themes" title="テーマ(各アプリの上書き)">
        <p>上のバーの「アプリ」で切り替える。上書きは <code>packages/tokens/themes/</code> の CSS 変数だけで、部品のコードは変えない。</p>
        <div className="table-wrap"><table className="plain">
          <thead><tr><th>アプリ</th><th>主の色</th><th>角丸</th><th>本文</th><th>余白</th></tr></thead>
          <tbody>
            <tr><td>既定(管理)</td><td>#016C6C(ダーク #4CBFBF)</td><td>2 / 4 / 6px</td><td>14px、行 1.6</td><td>詰めた</td></tr>
            <tr><td>Logru</td><td>未決。#016C6C のまま(案は themes/logru.css)</td><td>4 / 8 / 12px</td><td>15px、行 1.6</td><td>12 → 14px、16 → 18px</td></tr>
            <tr><td>Ruleru</td><td>未決。#016C6C のまま(案は themes/ruleru.css)</td><td>0 / 2 / 4px</td><td>16px、行 1.8</td><td>広い(12 → 16px、16 → 20px、24 → 32px)</td></tr>
          </tbody>
        </table></div>
        <div className="demo" style={{ marginTop: "var(--space-4)" }}>
          <Banner tone="info" title="今の切り替え">{`アプリ: ${app || "既定"}、色: ${scheme === "auto" ? "自動" : scheme === "light" ? "ライト" : "ダーク"}`}</Banner>
          <Button>主のボタン</Button><Button variant="secondary">副のボタン</Button><Badge tone="info">情報</Badge><Badge tone="success">成功</Badge><Badge tone="warn">警告</Badge><Badge tone="error">失敗</Badge>
        </div>
      </Block>
    </div>
  );
}
