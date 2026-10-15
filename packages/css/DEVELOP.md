# knowidea-css

KNOW IDEA の UI コンポーネントの見た目。素の CSS で、クラス名は `ki-` で始まる。値は semantic な CSS 変数(`--color-*`、`--space-*`、`--radius-*`、`--font-*`、`--size-hit`、`--motion-*`、`--shadow-pop`)だけを参照する。

| 使い方 | 中身 |
| --- | --- |
| バンドラーを使う場合 | `import "knowidea-tokens/tokens.css"; import "knowidea-css/index.css";`(入れ方は `apps/docs` の Installation) |
| 素の HTML | npm で入れた `node_modules/knowidea-css/dist/` から `ki.css` と `ki.js` を写し、tokens.css と一緒に置く(手順は Plain HTML のページ)。`ki.js` はコピーボタンと `<dialog>` の開閉だけ |
| コンポーネントごと | `src/<コンポーネント>.css` を個別に読み込む(`knowidea-css/button.css`) |

`base.css` は `body` の背景、文字色、書体、余白 0 の既定も与える。詳細度 0(`:where`)なので、アプリ側の指定が勝つ。これが無いと、ダークに切り替えても背景が変わらない。

状態は `:hover`、`:focus-visible`、`:disabled`、`aria-invalid`、`data-loading` などで表現する。ドキュメントで状態を固定して見せるための `.is-hover`、`.is-focus`、`.is-active` も効く(実際のアプリでは使わない)。

汎用コンポーネントの CSS: `status.css`、`stat.css`、`chart.css`、`card.css`、`list.css`、`timeline.css`、`selection-bar.css`、`appbar.css`、`drawer.css`、`bottom-navigation.css`、`layout.css`(Stack、Grid、Container)ほか、全部で 38 ファイル(`src/index.css` が束ねている)。

レイアウト系のコンポーネントは、画面の幅ではなく、置かれた場所の幅(container query)でレイアウトを切り替える。Drawer には permanent と temporary があり、`<dialog>` でも Base UI の Dialog でも同じ見た目になる。

カスタマイズは tokens の変数をオーバーライドして行う(`createTheme` を使うか、CSS 変数を直接書く)。コンポーネントの CSS は書き換えない。コンポーネントごとの書き方は、`apps/docs` の各ページに記載している。

設計上の決まり:

- 角丸は `--radius-1`〜`3` の 3 段階(4px、8px、12px)と、Chip の `--radius-pill`。小さな部品は 1、ボタンと入力は 2、カード、ダイアログ、メニューなどの面は 3。ラジオ、Switch のつまみ、Spinner は円形なので `50%` を使う
- 影は、浮かび上がる要素(メニュー、ダイアログ、Tooltip、Toast、Select の選択肢リスト)にだけ使う
- 情報の色は `--color-info`(青、色相 250)。Alert と Badge の info がこれを使う。成功の緑、プライマリカラーの青緑とは色相が離れている
- danger ボタンの文字色は `--color-bg`(ライトでは明るく、ダークでは暗くなり、どちらもコントラスト比 4.5:1 以上)
- Skeleton は動かさない(終わらない脈動は使わない)

## アイコン

コンポーネント内のアイコンは、`packages/icons`(`knowidea-icons`)のものを使う。React では `knowidea-ui` の `Icon` がラップする。素の HTML では sprite の `<use>` で表示する。

```html
<!-- ページに 1 回: sprite を置く(icons/dist/sprite.svg の中身を body の先頭に入れる。外部ファイルの <use href="/sprite.svg#name"> でも同じ) -->
<svg class="ki-icon" aria-hidden="true"><use href="#check"/></svg>          <!-- 文字と同じ色、1.25em -->
<svg class="ki-icon" aria-hidden="true"><use href="/sprite.svg#check"/></svg> <!-- 外部ファイル -->
<svg class="ki-icon" role="img" aria-label="検索"><use href="#search"/></svg>  <!-- 意味を持つアイコンのとき -->
```

`ki-icon` は `fill: currentColor`、幅と高さは 1.25em。bold は `#check-bold`。名前の一覧は、`apps/docs` の Icons ページにある。
