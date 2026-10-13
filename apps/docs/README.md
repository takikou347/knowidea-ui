# @knowidea/docs

UI ライブラリ(`@knowidea/tokens`、`@knowidea/icons`、`@knowidea/css`、`@knowidea/ui`)のドキュメントサイト。Astro 7.3.8 と React アイランド(`client:load`)で作っている。外部には公開しない。デプロイの設定は置かない。

サイトの言語方針は次のとおり。説明文は日本語で書く。サイドメニュー、コンポーネント名、ページ内の見出し(Demos、States、API、CSS、Accessibility)、Props の表の列名(Name、Type、Default、Description)、上部バーの文言、コード中の名前は英語にする。デモの中の UI 文言は、実際の画面を想定した日本語にする。

| コマンド | 内容 |
| --- | --- |
| `pnpm --filter @knowidea/docs build` | `dist/` を生成する。ロゴと sprite を `public/` にコピーし、`astro build` を実行したあと、パスを相対パスに書き換える |
| `pnpm --filter @knowidea/docs dev` | tokens と icons をビルドしてから、開発サーバーを起動する |
| `pnpm --filter @knowidea/docs check:pages` | `dist/` を `/a/b/` の下で配信し、全ページと操作を Chromium で検査する |

tokens、icons、css、ui のビルドは、`pnpm -r build` が先に実行する。

## どこに置いても動く

`dist/` は、どの場所の下に置いても壊れない(別の場所へ丸ごとアップロードできる)。

- `build.format: "file"` を指定している(`components/button.html` の形で出力される)
- ページ内のリンクは、`src/lib/paths.mjs` の `links(pathname)` が相対パスで生成する(`href("components/button")`)
- `_astro/`、`favicon.svg`、`sprite.svg`、`mark*.svg` のパスは、`astro build` のあとに `scripts/relativize.mjs` がページの深さに合わせて相対パスに書き換える
- `public/`(git 管理外)は、`scripts/copy-brand.mjs` が `brand/logo` と `packages/icons/dist` からコピーする

JS はモジュールなので、`file://` では動かない。静的サーバーで開く(どの場所の下でもよい)。

## 構成

| 場所 | 内容 |
| --- | --- |
| `src/layouts/Base.astro` | 上部のバー(ロゴ、名前とバージョン、コンポーネントの検索、テーマの切り替え)、左のサイドメニュー、右のページ内目次。幅 390px ではサイドメニューが開閉式のドロワーになる |
| `src/lib/nav.mjs` | サイドメニュー。Getting started、Customization、Components、Icons、Templates |
| `src/lib/registry.mjs`、`src/data/` | コンポーネントのページの元データ。`data/components/*.mjs`(カテゴリごと)と `data/seed.mjs`(Props、クラス、変数、素の HTML の例) |
| `src/demos/<コンポーネント>.tsx` | デモの実体。関数を 1 つ書けば、表示されるデモと "Show code" のコードが同じ元から生成される(`lib/snippet.mjs` が関数の本体を切り出す)。`states()` が States の表になる |
| `src/pages/components/[slug].astro` | コンポーネントのページの型。名前と 1 行の説明、import、Demos、States、API の表、CSS のクラスと変数、Accessibility |
| `src/pages/customization/theme.astro` | テーマを試せるページ(`ThemeCreator.tsx`)。色、角丸、密度、フォントサイズ、コントラスト比、CSS の書き出し |
| `src/pages/icons.astro` | アイコンの一覧(`IconBrowser.tsx`)。検索、ウェイトの選択、import 文と SVG のコピー |
| `src/pages/templates/` | 画面のサンプル。コンポーネントの組み合わせだけで作る(`src/templates/`)。数値はすべてサンプル |

## コンポーネントの追加

1. `src/demos/<名前>.tsx` にデモの関数と `states()` を書き、`src/demos/index.ts` に追加する
2. `src/data/components/<カテゴリ>.mjs` に 1 件追加する(`slug`、`name`、`lead`、`demos`、`props`、`classes`、`vars`、`html`、`a11y`)
3. サイドメニューと検索には自動で反映される

## 検査

`check:pages` は、全ページを 390px のライトと 1280px のダークで開き、横にはみ出さないこと、コンソールエラーと読み込めない画像が 0 件であること、390px でタップ領域が 44px 以上あることを検査する。そのうえで、次の操作をキーボードとクリックで確認する。

- ダイアログ、結果を確かめる操作、タブ、メニュー、アコーディオン、グラフ
- ナビゲーションのドロワー、コンポーネントの検索、ライトとダークの切り替え
- テーマを試すページ、アイコンの一覧、"Show code" とコピー、サンプル画面の一覧操作

Chromium は `/opt/pw-browsers` を直接指定する(`CHROMIUM_PATH` で上書きできる)。型の検査は `pnpm --filter @knowidea/docs exec tsc --noEmit -p .` で行う。
