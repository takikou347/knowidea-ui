# tokens

KNOW IDEA の共通のトークン。DTCG 2025.10 の JSON(`src/`)から CSS を作る。

| コマンド | 中身 |
| --- | --- |
| `pnpm --filter tokens build` | `dist/tokens.css`(CSS 変数。ライトは `:root`、ダークは `prefers-color-scheme` と `data-theme="dark"`)と `dist/theme.css`(Tailwind v4 の `@theme`)を作る |
| `pnpm --filter knowidea-tokens check` | 色の組み合わせをライトとダークで検査する。本文は 4.5:1、線とフォーカスリングは 3:1。基準を満たさなければ exit 1 で終了する |

## テーマの CSS を作るコマンド

`knowidea-theme` が、`createTheme` と同じ CSS を標準出力に出す。React を使わないページと、ビルドの前に CSS を作りたいときに使う。警告は標準エラーに出る(`--strict` で終了コード 1)。

```sh
npx knowidea-theme --primary "#2255CC" --radius 6 --selector .brand > brand.css
```

## 分け方

| ファイル | 中身 |
| --- | --- |
| `src/primitive.json` | 素の値(`ref.*`)。グレー、プライマリカラー、情報・成功・警告・エラーの色。CSS には出力しない |
| `src/semantic-light.json`、`semantic-dark.json` | 役割を表す名前(`color.bg`、`color.primary` など)。ライトとダークを別々に決め、素の値を参照する |
| `src/core.json` | タイポグラフィ(書体、サイズと行の高さの 5 段階)、余白 7 段階、角丸 3 段階(4px、8px、12px)と Chip 用の pill、モーション、タップ領域 44px。テーマでは変わらない |

色は OKLCH で定義する。Style Dictionary v5 の `color/oklch` 変換で、値を `oklch(L C H)` の形式にする。長さ、影、書体は自前の変換(`build.mjs`)で処理する。

## 決まり

- コンポーネントは `--color-*`、`--space-*`、`--radius-*` などの semantic な変数だけを参照する。素の値(`ref.*`)は CSS に出力しないため、直接は使えない
- アプリは CSS 変数をオーバーライドして、プライマリカラー、角丸、密度を変更する。コンポーネントのコードは変更しない
- オーバーライドした場合も、ライトとダークの両方で `check-contrast.mjs` と同じ基準を満たすこと(本文 4.5:1、`on-primary` と `primary` で 4.5:1)

## アプリでのオーバーライドの例

プライマリカラーを変え、角丸を大きくし、余白を詰める。ダークの値は別に書く。

```css
@import "tokens/dist/tokens.css";

:root {
  --color-primary: oklch(0.46 0.12 255);
  --color-primary-hover: oklch(0.4 0.12 255);
  --color-focus: oklch(0.46 0.12 255);
  --radius-2: 10px;
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

アプリの CSS は `tokens.css` の後に読み込む(詳細度が同じなら後のものが優先される。ダークの `:root:not([data-theme="light"])` と `:root[data-theme="dark"]` は、上の例のように同じ形で書く)。

## Tailwind v4

React 19、Tailwind v4、Vite の構成を想定している。`examples/tailwind/` が同じ構成で Vite のビルドを通している(Tailwind 4.3.3、`@tailwindcss/vite`)。

```css
@import "tailwindcss";
@import "knowidea-tokens/theme.css";    /* = dist/theme.css。@theme にライトの値と名前を渡す */
@import "knowidea-tokens/tokens.css";   /* ダークモードの値と、テーマでは変わらない値 */
@import "knowidea-css/index.css";   /* コンポーネントの見た目(ki- クラス) */
```

`theme.css` は名前(`--color-*`、`--text-1`、`--spacing-1`、`--radius-1`)を Tailwind に渡すため、`bg-surface`、`text-text-muted`、`rounded-2`、`text-5` のようなユーティリティクラスがトークンを参照する。ダークモードの値は、`tokens.css` が同じ変数を再定義する。

## 情報の色

`ref.info`(色相 250、青)。プライマリカラーの青緑(195)、成功の緑(145)とは色相が離れている。ライト `oklch(0.5 0.14 250)`(#0465af)は背景(`bg` #f5f6f8)に対して 5.55:1、`info-soft` に対して 5.20:1。ダーク `oklch(0.72 0.13 250)`(#60aaf3)は `bg` に対して 7.47:1、`info-soft` に対して 5.71:1。いずれも `check` の対象に含まれている。

## テーマを作る(`createTheme`)

アプリごとのファイルは置かない。プライマリカラー、角丸、密度、フォントサイズを渡して、CSS 変数のオーバーライドを生成する。

```js
import { createTheme } from "knowidea-tokens/create-theme";
const t = createTheme({ primary: "#016C6C", radius: 8, density: "compact", fontSize: 14 });
t.css(".brand");   // クラスの内側で効く CSS(ライトとダークの両方)。":root" や "[data-theme=x]" も渡せる
t.warnings;        // コントラスト比が 4.5:1 に届かない組み合わせ(プライマリカラーと hover の色を bg、surface、surface-2 の上に置く場合と、プライマリ面の文字色をプライマリカラーと hover の色の上に置く場合)。角丸が 12px を超えた場合も入る
```

- hover の色は、OKLCH の明るさを 0.07 ずらして作る。プライマリ面の文字色は、明るい色と暗い色のうち、コントラスト比が高い方を採用する
- ダークモードのプライマリカラーは、ライトを反転せず、同じ色相で明るさを 0.74 以上にして別に生成する(`primaryDark` で指定することもできる)
- 色域を超える色は、彩度を下げて収める
- 基準となる背景の値は `src/create-theme.mjs` の `BASE` にある。`pnpm --filter knowidea-tokens check` が、`dist/tokens.css` と同じ値であることを検査する
- React では、`knowidea-ui` の `ThemeProvider` が同じ内容を `<style>` として出力する。CSS だけで使う場合は、変数を直接書き換えてもよい。値を試せるのはドキュメントサイトの Theme ページ

## 成功の色

`ref.success.a` を採用している。`b` と `c` は比較用の候補。差し替えるときは、`semantic-*.json` の参照(`ref.success.a.*`)を変更する。
