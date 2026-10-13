# docs

トークン、アイコン、部品の見本のサイト。Astro 7.3.8(2026-10-13 の npm の最新)。外に公開しない。デプロイの設定は置かない。

`pnpm --filter docs build` で `dist/` を作る(前に tokens と icons を作る)。`pnpm --filter docs dev` で見る。

## Astro を採るかの判断材料

| 見る所 | 中身 |
| --- | --- |
| ビルドの時間 | 4 ページで約 1 秒(`astro build` のみ)。tokens と icons の build を含めて約 3 秒 |
| 依存の数 | docs の依存は全部で 263 件(workspace の tokens と icons を含む)。ワークスペース全体の install で 298 件、約 5 秒 |
| 1 部品の手間 | 部品 41 行(`Button.astro`)とページ 102 行(デモ、5 つの状態、API の表、テーマ)。ページを足すのは `src/pages/components/<名前>.astro` と `src/nav.mjs` の 1 行 |

## ページの足し方

1 部品に 1 ページ。サイドの目次は `src/nav.mjs`。部品は `src/components/`、ページは `src/pages/components/`。部品は semantic の CSS 変数だけを参照する。
