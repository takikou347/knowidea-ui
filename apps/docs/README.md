# @knowidea/docs

UI ライブラリ(`@knowidea/tokens`、`@knowidea/icons`、`@knowidea/css`、`@knowidea/ui`)の見本のサイト。Astro 7.3.8 と React の島(`client:load`)。外に公開しない。デプロイの設定は置かない。

| コマンド | 中身 |
| --- | --- |
| `pnpm --filter @knowidea/docs build` | `dist/` を作る。ロゴと sprite を `public/` に写し、`astro build` し、道を相対に直す |
| `pnpm --filter @knowidea/docs dev` | 前に tokens と icons を作ってから開発サーバー |
| `pnpm --filter @knowidea/docs check:pages` | `dist/` を `/a/b/` の下で配り、全ページと操作を Chromium で確かめる |

tokens、icons、css、ui の build は `pnpm -r build` が先に回す。

## どこに置いても動く

`dist/` は、どの場所の下に置いても壊れない(別の場所へ丸ごと上げる)。

- `build.format: "file"`(`components/button.html` の形)
- ページ内のリンクは `src/lib/paths.mjs` の `links(pathname)` が相対で作る(`href("components/button")`)
- `_astro/`、`favicon.svg`、`sprite.svg`、`mark*.svg` の道は、`scripts/relativize.mjs` が `astro build` の後にページの深さに合わせて相対に直す
- `public/`(git 管理外)は `scripts/copy-brand.mjs` が `brand/logo` と `packages/icons/dist` から写す

JS はモジュールなので、`file://` では動かない。静的サーバー(どの場所の下でもよい)で開く。

## 構成

| 場所 | 中身 |
| --- | --- |
| `src/layouts/Base.astro` | 上のバー(ロゴ、名前と版、部品の検索、ライトとダーク)、左の目次、右のページ内の目次。390px では目次が開閉の引き出し |
| `src/lib/nav.mjs` | 目次。はじめに、カスタマイズ、部品、アイコン、見本の画面 |
| `src/lib/registry.mjs`、`src/data/` | 部品のページの元。`data/components/*.mjs`(分類ごと)と `data/seed.json`(props、クラス、変数) |
| `src/demos/<部品>.tsx` | デモの本物。関数を 1 つ書けば、見える物と「コードを見る」の文字が同じ元から出る(`lib/snippet.mjs` が関数の本文を切り出す)。`states()` が 5 つの状態の表になる |
| `src/pages/components/[slug].astro` | 部品のページの型。名前と 1 行の説明、import、デモ、5 つの状態、API の表、CSS のクラスと変数、アクセシビリティ |
| `src/pages/customization/theme.astro` | テーマを試す所(`ThemeCreator.tsx`)。色、角丸、密度、字の大きさ、コントラスト比、書き出し |
| `src/pages/icons.astro` | アイコンの一覧(`IconBrowser.tsx`)。探す、太さ、import の行と SVG を写す |
| `src/pages/templates/` | 見本の画面。部品の組み合わせだけで作る(`src/templates/`)。数は全部「見本の数」 |

## 部品の足し方

1. `src/demos/<名前>.tsx` にデモの関数と `states()` を書き、`src/demos/index.ts` に足す
2. `src/data/components/<分類>.mjs` に 1 件足す(`slug`、`name`、`ja`、`lead`、`demos`、`props`、`classes`、`vars`、`html`、`a11y`)
3. 目次と検索は自動で増える

## 検査

`check:pages` は、全ページを 390px ライトと 1280px ダークで開き、横にはみ出さないこと、コンソールの誤りと読めない画像が 0 なこと、390px で押せる所が 44px 以上なことを確かめる。そのうえで、ダイアログ、確かめる操作、タブ、メニュー、アコーディオン、グラフ、目次の引き出し、検索、ライトとダークの切り替え、テーマを試す所、アイコンの一覧、「コードを見る」、見本の一覧の操作をキーボードとクリックで確かめる。Chromium は `/opt/pw-browsers` を直に指す(`CHROMIUM_PATH` で上書きできる)。型は `pnpm --filter @knowidea/docs exec tsc --noEmit -p .`。
