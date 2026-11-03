# knowidea-ui

KNOW IDEA の画面の部品(公開)。組織の決まりは takikou347/knowidea の CLAUDE.md、デザインの決まりは DESIGN.md、Codex 向けは AGENTS.md。

## 直し方

- main を直に触らず、ブランチで直して PR にし、作った者と別のモデルの見る役が可を出してから入れる
- 部品を足す時は packages/css と packages/ui の両方、apps/docs の 1 部品 1 ページ、check-pages の確かめを一緒に足す
- push の前に `pnpm check`、`pnpm -r build`、`pnpm --filter @knowidea/docs check:pages`、`python3 knowidea/tools/check.py knowidea-ui` を通す

## 版と配り方

- 4 つのパッケージと apps/docs の版はそろえて上げ、changelog に 1 項目足す。版を上げた package.json が main に入ると npm に出る
- 部品を足したら minor、直しだけなら patch

## 書き方

- 公開リポジトリなので、作者は `KNOW IDEA (<モデル>)`、メールは `noreply@knowidea.invalid`
- コミットと PR に AI の署名や帰属の行を付けない
- 日付の付いたファイル、報告、議事録を置かない
