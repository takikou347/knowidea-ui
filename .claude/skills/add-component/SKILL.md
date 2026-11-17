---
name: add-component
description: knowidea-ui にコンポーネントを足す、または今あるコンポーネントを直す手順。CSS、React、文書のページ、check-pages の確かめを一緒に入れる
---

1. `DESIGN.md` を読み、`packages/ui/src/index.ts` と `apps/docs/src/data/components/` で、似た物がもう無いかを確かめる。足す時は、使う側 (know-office など) の Issue の番号を控える
2. ブランチを切る (knowidea のスキル `land` の 1)
3. 次を一緒に作る。1 つでも欠けたら入れない
   - CSS: `packages/css/src/<kebab-case の名前>.css` に `.ki-<名前>` の BEM のクラス。値はトークンの変数だけ。`packages/css/src/index.css` に `@import` を 1 行足す
   - React: `packages/ui/src/<PascalCase の名前>.tsx` で、CSS のクラスを当てる。挙動が複雑な物 (開閉、選ぶ、focus の閉じ込め) は `@base-ui/react` を土台にする。`packages/ui/src/index.ts` から出す
   - 見本: `apps/docs/src/demos/<slug>.tsx` に、Empty、Loading、Error、Disabled、Focus の状態を見せる見本を export する
   - 文書: `apps/docs/src/data/components/<分類>.mjs` に 1 項目 (`slug`、`name`、`imports`、`demos` (`fn` は見本の export 名)、`props`、`classes`、`a11y`)。1 コンポーネント 1 ページ
   - 確かめ: 操作があるなら `apps/docs/scripts/check-pages.mjs` に、その操作 (開く、閉じる、キー、focus) の確かめを足す
4. 通す: `pnpm check`、`pnpm -r build`、`pnpm --filter @knowidea/docs build` の後に `pnpm --filter @knowidea/docs check:pages` (直した物だけを試す時は `ONLY=<名前の一部>`)、`python3 knowidea/tools/check.py knowidea-ui` (knowidea と並ぶ親のフォルダで)
5. 版を上げる: スキル `bump-version`。足したら minor、直しだけなら patch
6. レビューと入れ方は knowidea のスキル `review` と `land`。レビュー担当には `DESIGN.md` の「レビューの表」で見るよう頼む
7. npm に出たら、使う側で版を上げる
