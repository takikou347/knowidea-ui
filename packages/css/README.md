# @knowidea/css

KNOW IDEA の UI 部品の見た目。素の CSS で、クラスは `ki-` 頭。値は semantic の CSS 変数(`--color-*`、`--space-*`、`--radius-*`、`--font-*`、`--size-hit`、`--motion-*`、`--shadow-pop`)だけを読む。

| 使い方 | 中身 |
| --- | --- |
| バンドラーがある(Logru、管理アプリ) | `@import "tokens/dist/tokens.css"; @import "@knowidea/css/index.css";` |
| 素の HTML(Ruleru の公開サイト) | `pnpm --filter @knowidea/css build` で `dist/ki.css` と `dist/ki.js` を作り、tokens.css と一緒に置く。`ki.js` は写すボタンと `<dialog>` の開閉だけ |
| 部品ごと | `src/<部品>.css` を個別に読む |

状態は `:hover`、`:focus-visible`、`:disabled`、`aria-invalid`、`data-loading` などで出す。見本のために固定する `.is-hover`、`.is-focus`、`.is-active` も効く(実物では使わない)。

アプリは tokens の変数を上書きして変える。部品の CSS は書き換えない。部品ごとの書き方は `apps/docs` の各ページ。

決めたこと:

- 角丸は `--radius-1`〜`3` の 3 段。ラジオ、スイッチの丸、回転は形なので `50%` を使う
- 影はポップする物(メニュー、ダイアログ、ツールチップ、知らせ、選ぶの一覧)だけ
- 情報の色は `--color-info`(青、色相 250)。帯、札、知らせの info がこれを使う。成功の緑、主の青緑と色相が離れている
- 危ないボタンの文字は `--color-bg`(ライトで明るく、ダークで暗くなり、どちらも 4.5:1 以上)
- 読み込みの仮の形は動かさない(終わらない脈動を使わない)

## アイコン

部品の中のアイコンは `packages/icons`(workspace の `icons`)の物。React は `@knowidea/react` の `Icon` が包む。素の HTML は sprite の `<use>` で出す。

```html
<!-- ページに 1 回: sprite を置く(icons/dist/sprite.svg の中身を body の頭に入れる。外部ファイルの <use href="/sprite.svg#name"> でも同じ) -->
<svg class="ki-icon" aria-hidden="true"><use href="#check"/></svg>          <!-- 文字と同じ色、1.25em -->
<svg class="ki-icon" aria-hidden="true"><use href="/sprite.svg#check"/></svg> <!-- 外部ファイル -->
<svg class="ki-icon" role="img" aria-label="検索"><use href="#search"/></svg>  <!-- 意味を持つとき -->
```

`ki-icon` は `fill: currentColor`、幅と高さは 1.25em。bold は `#check-bold`。名前の一覧は `apps/docs` のアイコンのページ。
