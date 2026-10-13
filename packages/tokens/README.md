# tokens

KNOW IDEA の共通のトークン。DTCG 2025.10 の JSON(`src/`)から CSS を作る。

| コマンド | 中身 |
| --- | --- |
| `pnpm --filter tokens build` | `dist/tokens.css`(CSS 変数。ライトは `:root`、ダークは `prefers-color-scheme` と `data-theme="dark"`)と `dist/theme.css`(Tailwind v4 の `@theme`)を作る |
| `pnpm --filter @knowidea/tokens check` | 色の組をライトとダークで検査する。本文 4.5:1、線と focus 3:1。落ちたら exit 1 |

## 分け方

| ファイル | 中身 |
| --- | --- |
| `src/primitive.json` | 素の値(`ref.*`)。灰色、主の色、情報と成功と警告と失敗の色。CSS には出さない |
| `src/semantic-light.json`、`semantic-dark.json` | 役割の名前(`color.bg`、`color.primary` など)。ライトとダークを別に決める。素の値を参照する |
| `src/core.json` | 字(書体、大きさと行の高さ 5 段)、余白 7 段、角丸 3 段、動き、押せる所 44px。テーマで変わらない |

色は OKLCH。値は Style Dictionary v5 が `color/oklch` の変換で `oklch(L C H)` にする。長さと影と書体は自前の変換(`build.mjs`)。

## 決まり

- 部品は `--color-*`、`--space-*`、`--radius-*` などの semantic の変数だけを参照する。素の値(`ref.*`)は CSS に出さないので、直接は使えない
- アプリは CSS 変数を上書きして、主の色、角丸、密度を変える。部品のコードは変えない
- 上書きしたらライトとダークの両方で `check-contrast.mjs` と同じ比を満たすこと(本文 4.5:1、`on-primary` と `primary` 4.5:1)

## アプリでの上書きの例

主の色を変え、角丸を大きくし、余白を詰める。ダークも別に書く。

```css
@import "tokens/dist/tokens.css";

:root {
  --color-primary: oklch(0.46 0.12 255);
  --color-primary-hover: oklch(0.4 0.12 255);
  --color-focus: oklch(0.46 0.12 255);
  --radius-2: 8px;
  --space-3: 8px;
  --space-4: 12px;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-primary: oklch(0.74 0.1 255);
    --color-primary-hover: oklch(0.8 0.09 255);
    --color-focus: oklch(0.74 0.1 255);
  }
}
:root[data-theme="dark"] {
  --color-primary: oklch(0.74 0.1 255);
  --color-primary-hover: oklch(0.8 0.09 255);
  --color-focus: oklch(0.74 0.1 255);
}
```

アプリの CSS は `tokens.css` の後に読む(同じ詳しさなら後が勝つ。ダークの `:root:not([data-theme="light"])` と `:root[data-theme="dark"]` は上のように同じ形で書く)。

## Tailwind v4

React 19、Tailwind v4、Vite の形。`examples/tailwind/` が同じ形で Vite の build を通す(Tailwind 4.3.3、`@tailwindcss/vite`)。

```css
@import "tailwindcss";
@import "@knowidea/tokens/theme.css";    /* = dist/theme.css。@theme にライトの値と名前を渡す */
@import "@knowidea/tokens/tokens.css";   /* ダークと、テーマで変わらない値 */
@import "@knowidea/css/index.css";   /* 部品の見た目(ki- クラス) */
```

`theme.css` は名前(`--color-*`、`--text-1`、`--spacing-1`、`--radius-1`)を Tailwind に渡すので、`bg-surface`、`text-text-muted`、`rounded-2`、`text-5` のような道具クラスがトークンを読む。ダークは `tokens.css` が同じ変数を上書きする。

## 情報の色

`ref.info`(色相 250、青)。主の青緑(195)、成功の緑(145)と分かれる。ライト `oklch(0.5 0.14 250)`(#0465af)は面(`bg` #f5f6f8)に 5.55:1、`info-soft` に 5.20:1。ダーク `oklch(0.72 0.13 250)`(#60aaf3)は `bg` に 7.47:1、`info-soft` に 5.71:1。`check` に入っている。

## テーマを作る(`createTheme`)

アプリごとのファイルは置かない。主の色、角丸、密度、字の大きさを渡して、CSS 変数の上書きを作る。

```js
import { createTheme } from "@knowidea/tokens/create-theme";
const t = createTheme({ primary: "#016C6C", radius: 4, density: "compact", fontSize: 14 });
t.css(".brand");   // クラスの下に効く CSS(ライトとダークの両方)。":root" や "[data-theme=x]" も渡せる
t.warnings;        // コントラストが 4.5:1 に届かない組
```

- hover の色は OKLCH の明るさを 0.07 ずらして作る。主の面の文字は、明るい文字と暗い文字から比が高い方を選ぶ
- ダークは反転せず、同じ色相で明るさ 0.74 以上にして別に作る(`primaryDark` で指定もできる)
- 色域を出る色は彩度を下げて収める
- 基準の面の値は `src/create-theme.mjs` の `BASE` にあり、`pnpm --filter @knowidea/tokens check` が `dist/tokens.css` と同じ値かを確かめる
- React では `@knowidea/ui` の `ThemeProvider` が同じ物を `<style>` で出す。CSS だけなら、変数を直に書き換えてもよい。試す所は見本のサイトの「テーマ」

## 成功の色

`ref.success.a` が採用、`b` と `c` は比べるための候補。差し替えは `semantic-*.json` の参照(`ref.success.a.*`)を変える。
