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
- 情報の色(info)はトークンに無い。帯は `--color-surface-2` の中立で示す
- 危ないボタンの文字は `--color-bg`(ライトで明るく、ダークで暗くなり、どちらも 4.5:1 以上)
- 読み込みの仮の形は動かさない(終わらない脈動を使わない)
