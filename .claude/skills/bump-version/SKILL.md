---
name: bump-version
description: knowidea-ui の版を上げて changelog に 1 項目足し、main に入れて npm に出す手順
---

1. 版を決める。コンポーネントを足したら minor、直しだけなら patch。本番の前 (0.x) も同じ
2. 4 つのパッケージ (`packages/{tokens,css,icons,ui}/package.json`) と `apps/docs/package.json` の `version` を同じ値にそろえて上げる
3. `apps/docs/src/data/changelog.mjs` の `releases` の頭に 1 項目足す。`version`、`date` (日本時間)、`summary` (使う人にとっての変更を 1 文)、`rows` (パッケージごとと Docs の 1 行。変えていないパッケージは「変更なし(版をそろえた)。」)
4. `pnpm check`、`pnpm -r build`、`pnpm test:consumer` を通す
5. knowidea のスキル `land` で main に入れる。版を上げた `package.json` が main に入ると、publish の CI が npm に無い版だけを出す。CI の結果を見て、出た版を使う側に伝える
