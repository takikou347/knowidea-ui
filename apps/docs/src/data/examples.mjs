// Getting started と Customization のコード例の正本。
// 文書のページはここから表示し、scripts/consumer-test.mjs は同じ文字列で新しいプロジェクトを作って動かす。
// ここを直すと、表示と確認の両方が変わる(写して動くことを、毎回確かめるため)。

/* ---------- Installation ---------- */

export const install = {
  // 4 つを同じコマンドで入れる(knowidea-ui はほかの 3 つを peerDependencies に持つ)
  pnpm: `pnpm add knowidea-ui knowidea-css knowidea-tokens knowidea-icons`,
  npm: `npm install knowidea-ui knowidea-css knowidea-tokens knowidea-icons`,
  css: `/* src/main.tsx など、アプリの入口で読み込む */
import "knowidea-tokens/tokens.css";   /* 色、フォント、余白、角丸の CSS 変数(ライトとダーク) */
import "knowidea-css/index.css";       /* 部品の見た目(ki- のクラス)と、body の既定 */`,
  fonts: `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans+JP:wght@400;600&display=swap" rel="stylesheet" />`,
};

/* ---------- React ---------- */

export const react = {
  create: {
    pnpm: `pnpm create vite@latest my-app --template react-ts
cd my-app
pnpm install`,
    npm: `npm create vite@latest my-app -- --template react-ts
cd my-app
npm install`,
  },
  // Vite の雛形の CSS は body を横並びの中央寄せにするため、消す
  clean: `rm src/index.css src/App.css`,
  main: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "knowidea-tokens/tokens.css";
import "knowidea-css/index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,
  basic: `import { Button, Alert, Stack } from "knowidea-ui";

export default function App() {
  return (
    <Stack gap={3}>
      <Alert tone="info">保存した。</Alert>
      <Button>完了にする</Button>
    </Stack>
  );
}`,
  theme: `import { ThemeProvider, Button } from "knowidea-ui";

export default function App() {
  return (
    <ThemeProvider theme={{ primary: "#016C6C", radius: 8, density: "compact", fontSize: 14 }}>
      <Button>完了にする</Button>
    </ThemeProvider>
  );
}`,
  toast: `import { ToastProvider, useToast, Button } from "knowidea-ui";

function SaveButton() {
  const toast = useToast();
  return <Button onClick={() => toast.show({ tone: "success", title: "保存した", description: "設定を更新した。" })}>保存する</Button>;
}

// ToastProvider はアプリの根に 1 つ。useToast はその内側で呼ぶ
export default function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}`,
  icons: `import { Icon } from "knowidea-ui";
import { CalendarIcon } from "knowidea-icons/react";

export function Icons() {
  return (
    <>
      <Icon name="calendar" />                  {/* 1.25em、文字と同じ色。名前は型で補完される */}
      <CalendarIcon size={20} weight="bold" />  {/* 名前ごとのコンポーネント。サイズは px */}
      <Icon name="search" label="検索" />        {/* 意味を持つときだけ label を付ける */}
    </>
  );
}`,
  colorMode: `import { useEffect, useState } from "react";
import { Button } from "knowidea-ui";

type Mode = "auto" | "light" | "dark";

function useColorMode() {
  const [mode, setMode] = useState<Mode>(() => {
    try { return (localStorage.getItem("theme") as Mode | null) ?? "auto"; } catch { return "auto"; }
  });
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "auto") root.removeAttribute("data-theme");
    else root.dataset.theme = mode;
    try { localStorage.setItem("theme", mode); } catch { /* 保存できなくても動く */ }
  }, [mode]);
  return [mode, setMode] as const;
}

export function ColorModeButton() {
  const [mode, setMode] = useColorMode();
  const next: Mode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
  return <Button variant="secondary" onClick={() => setMode(next)}>表示: {mode}</Button>;
}`,
  ssr: `"use client";   // Next.js の App Router では、使う側のファイルの先頭に書く`,
};

/* ---------- 素の HTML ---------- */

export const html = {
  // npm で入れて、使うファイルだけを assets/ に写す
  extract: `npm install knowidea-tokens knowidea-css knowidea-icons
mkdir -p assets
cp node_modules/knowidea-tokens/dist/tokens.css assets/
cp node_modules/knowidea-css/dist/ki.css node_modules/knowidea-css/dist/ki.js assets/
cp node_modules/knowidea-icons/dist/sprite.svg assets/`,
  head: `<link rel="stylesheet" href="assets/tokens.css" />
<link rel="stylesheet" href="assets/ki.css" />
<script src="assets/ki.js" defer></script>`,
  body: `<div class="ki-alert" data-tone="info">
  <span class="ki-alert__icon"><svg class="ki-icon" aria-hidden="true"><use href="assets/sprite.svg#info"/></svg></span>
  <div class="ki-alert__body"><p class="ki-alert__text">保存した。</p></div>
</div>
<button type="button" class="ki-button" data-variant="primary">完了にする</button>`,
  dialog: `<button type="button" class="ki-button" data-ki-dialog-open="confirm">削除する</button>
<dialog id="confirm" class="ki-dialog" aria-labelledby="confirm-title">
  <h2 id="confirm-title" class="ki-dialog__title">削除する</h2>
  <p class="ki-dialog__description">元に戻せない。</p>
  <div class="ki-dialog__actions">
    <button type="button" class="ki-button" data-variant="secondary" data-ki-dialog-close>キャンセル</button>
    <button type="button" class="ki-button" data-variant="danger" data-ki-dialog-close>削除する</button>
  </div>
</dialog>`,
  // 先頭の script と切り替えのボタン(Dark mode のページと同じ)
  colorMode: `<script>
  // ちらつきを防ぐため、<head> の先頭で、保存した値を先に適用する
  try { var m = localStorage.getItem("theme"); if (m === "light" || m === "dark") document.documentElement.dataset.theme = m; } catch (e) {}
</script>`,
};

/* ---------- Tailwind v4 ---------- */

export const tailwind = {
  create: {
    pnpm: `pnpm create vite@latest my-app --template react-ts
cd my-app
pnpm install
pnpm add tailwindcss @tailwindcss/vite`,
    npm: `npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install tailwindcss @tailwindcss/vite`,
  },
  vite: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`,
  css: `@import "tailwindcss";
@import "knowidea-tokens/theme.css";    /* @theme に色、フォント、余白、角丸を渡す */
@import "knowidea-tokens/tokens.css";   /* ダークモードの値と、実際の変数 */
/* layer(components) を付ける。付けないと ki- の CSS がユーティリティ(px-8、rounded-none など)に勝つ */
@import "knowidea-css/index.css" layer(components);`,
  main: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,
  use: `import { Button } from "knowidea-ui";

export default function App() {
  return (
    <div className="rounded-2 bg-surface border border-line p-4 text-text">
      <Button>完了にする</Button>
      <Button className="px-8" variant="secondary">余白を足す</Button>
    </div>
  );
}`,
};

/* ---------- Customization ---------- */

export const theme = {
  provider: `import { ThemeProvider } from "knowidea-ui";

export default function App() {
  return (
    <ThemeProvider theme={{ primary: "#016C6C", radius: 8, density: "compact", fontSize: 14 }}>
      {/* ここから下だけが変わる */}
    </ThemeProvider>
  );
}`,
  // 作った CSS をファイルにして読み込む。React を使わない場合もこれ
  cli: `npx knowidea-theme --primary "#2255CC" --radius 6 --selector .brand > src/brand.css`,
  // 素の HTML では、作った CSS を assets/ に置く
  cliHtml: `npx knowidea-theme --primary "#2255CC" --radius 6 --selector .brand > assets/brand.css`,
  script: `import { createTheme } from "knowidea-tokens/create-theme";

const t = createTheme({ primary: "#2255CC", radius: 6 });
t.css(".brand");   // CSS 変数をオーバーライドする文字列(ライトとダーク)
t.warnings;       // コントラスト比が 4.5:1 に届かない組み合わせ(なければ空)`,
  makeUse: `import "./brand.css";

// 変えたい範囲に brand クラスを付ける(全体なら <html className="brand"> でもよい)
<div className="brand">…</div>`,
  plain: `.brand {
  --color-primary: oklch(0.4811 0.0819 194.7749);
  --color-primary-hover: oklch(0.4111 0.0707 194.7749);
  --color-on-primary: oklch(0.9946 0.0026 286.4);
  --radius-2: 6px;
}`,
};

export const dark = {
  auto: `/* tokens.css の内容(抜粋)。OS の設定に従い、data-theme で切り替えられる */
:root { --color-bg: oklch(0.9729 0.0029 264.5); /* ... */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --color-bg: oklch(0.191 0.0043 264.5); /* ... */ }
}
:root[data-theme="dark"] { --color-bg: oklch(0.191 0.0043 264.5); /* ... */ }`,
  toggle: `// 3 つの状態: auto(属性なし)、light、dark
const root = document.documentElement;
function setTheme(mode) {            // "light" | "dark" | "auto"
  if (mode === "auto") root.removeAttribute("data-theme");
  else root.dataset.theme = mode;
  try { localStorage.setItem("theme", mode); } catch {}
}`,
  scoped: `<section data-theme="dark">
  <!-- この中だけダークモード -->
</section>`,
};

export const overriding = {
  vars: `/* 1. 変数を書き換える。最も安全 */
.my-app { --color-primary: oklch(0.48 0.15 260); --radius-2: 6px; }`,
  cls: `/* 2. コンポーネントの変数で、1 つだけ変える(レイアウト系のコンポーネントが持つ) */
.my-list { --ki-gap: var(--space-5); }`,
  own: `/* 3. クラスを足してオーバーライドする。詳細度をそろえ、@layer か後ろの記述順で勝たせる */
.save-button.ki-button { min-width: 8rem; }`,
  react: `import { Button } from "knowidea-ui";

export function Buttons() {
  return (
    <>
      <Button className="save-button" variant="primary">保存</Button>
      <Button style={{ minWidth: "8rem" }}>保存</Button>
    </>
  );
}`,
  tw: `<Button className="px-8">保存</Button>`,
};

/* ---------- Icons ---------- */

export const icons = {
  react: `import { CalendarIcon, Icon } from "knowidea-icons/react";

export function IconsPageExample() {
  return (
    <>
      <CalendarIcon />                        {/* 名前ごとのコンポーネント */}
      <Icon name="calendar" weight="bold" />  {/* 名前で指定する。16px の場所では bold */}
      <CalendarIcon title="予定" />           {/* title を渡すと読み上げる。なければ装飾 */}
    </>
  );
}`,
  // sprite.svg は Plain HTML のページの手順で assets/ に取り出す
  html: `<svg class="ki-icon" aria-hidden="true"><use href="assets/sprite.svg#calendar"/></svg>`,
};
