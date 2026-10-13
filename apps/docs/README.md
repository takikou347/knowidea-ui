# @knowidea/docs

UI ライブラリ(`@knowidea/tokens`、`@knowidea/icons`、`@knowidea/css`、`@knowidea/ui`)のドキュメントサイト。Astro 7.3.8 と React アイランド(`client:load`)で作っている。外部には公開しない。デプロイの設定は置かない。

サイトの言語方針は次のとおり。説明文は日本語で書く。サイドメニュー、コンポーネント名、ページ内の見出し(Demos、States、API、CSS、Accessibility)、Props の表の列名(Name、Type、Default、Description)、上部バーの文言、コード中の名前は英語にする。デモの中の UI 文言は、実際の画面を想定した日本語にする。

| コマンド | 内容 |
| --- | --- |
| `pnpm --filter @knowidea/docs build` | `dist/` を生成する。ロゴ、sprite、画像を `public/` にコピーし、`astro build` を実行し、パスを相対パスに書き換え、検索の索引 `dist/search-index.json` を作る |
| `pnpm --filter @knowidea/docs dev` | tokens と icons をビルドしてから、開発サーバーを起動する |
| `pnpm --filter @knowidea/docs check:pages` | `dist/` を `/a/b/` の下で配信し、全ページと操作を Chromium で検査する |

tokens、icons、css、ui のビルドは、`pnpm -r build` が先に実行する。

## 公開先の設定

公開先に関わる値は `src/site.config.mjs` の 1 か所にある。環境変数で上書きできる。既定は GitHub Pages の `takikou347/knowidea-ui`。

| 値 | 環境変数 | 既定 | 使う所 |
| --- | --- | --- | --- |
| サイトの URL | `SITE_URL` | `https://takikou347.github.io/knowidea-ui/` | `og:image`、`og:url`、canonical(絶対 URL が要る所だけ)。パス部分は 404 ページの `<base>` |
| リポジトリの URL | `SITE_REPO` | `https://github.com/takikou347/knowidea-ui` | "Edit this page" と GitHub のリンク |
| ブランチ | `SITE_BRANCH` | `main` | "Edit this page" のリンク先 |

例: `SITE_URL=https://example.com/ui/ SITE_REPO=https://github.com/org/ui pnpm --filter @knowidea/docs build`

`og.png`(1200x630)、`favicon-32.png`、`apple-touch-icon.png` は `assets-src/` にある。ロゴや版を変えたら `node apps/docs/scripts/make-images.mjs` で作り直して git に入れる。ビルドは `public/` に写すだけ。

## 検索、前後の移動、404

- 検索は外のサービスを使わない。`scripts/build-search.mjs` が `dist/` の HTML から `search-index.json`(節ごとの題、見出し、本文の抜粋)を作る。`/` か `Ctrl+K`(Mac は `Cmd+K`)で開き、初めて開いたときに 1 回だけ読む。索引の中の道は `dist/` の根からの相対で、読む側が索引の場所を基準に解くので、どの場所の下でも動く。コードとデモ、見本の画面の中の文字は索引に入れない(除く対象は `build-search.mjs` の `SKIP_TAGS`、`SKIP_CLASS`)
- Previous / Next は `src/lib/nav.mjs` の `flat`(サイドメニューの順)から作る。ページを足したら `nav.mjs` に足す
- "Edit this page" のリンクは `src/lib/source.mjs` が決める。部品のページは、そのカテゴリのデータ(`src/data/components/<カテゴリ>.mjs`)を指す
- 変更の履歴は `src/data/changelog.mjs`。新しい版を上に足す
- 404 は `dist/404.html`。GitHub Pages はどの深さの URL にもこれを返すので、`<base href>` にサブパスを書いている(`relativize.mjs` はこの 1 つだけ根からの道のまま残す)

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
| `src/layouts/Base.astro` | 上部のバー(ロゴ、Docs、Components、Icons、Templates、Changelog、検索、テーマの切り替え、GitHub。トップ `home` ではサイドメニューを出さない)。ページの終わりの Previous / Next と Edit this page。OGP とファビコンの meta、左のサイドメニュー、右のページ内目次。幅 1024px 未満(スマホと iPad の縦)ではサイドメニューが開閉式のドロワーになる |
| `src/components/HomeLive.tsx`、`ComponentThumb.tsx` | トップの動く見本(主の色、角丸、密度、ダーク、ダッシュボード、部品の格子)と、Components の一覧の見本のカード(inert) |
| `src/lib/nav.mjs` | サイドメニューと上のバー(`topNav`)。Getting started、Customization、Components、Icons、Templates(Dashboard の 1 つ) |
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
- ナビゲーションのドロワー、検索(`/`、`Ctrl+K`)、Previous / Next、Edit this page と OGP の meta、404、ライトとダークの切り替え
- テーマを試すページ、アイコンの一覧、"Show code" とコピー、サンプル画面の一覧操作

Chromium は `/opt/pw-browsers` を直接指定する(`CHROMIUM_PATH` で上書きできる)。型の検査は `pnpm --filter @knowidea/docs exec tsc --noEmit -p .` で行う。
