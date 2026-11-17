# knowidea-ui

KNOW IDEA の画面のコンポーネント(公開)。組織の決まりは takikou347/knowidea の CLAUDE.md、デザインの決まりは DESIGN.md、Codex 向けは AGENTS.md。

## 直し方

- main で直さず、ブランチで直して PR にし、作った者と別のモデルのレビュー担当(.claude/agents の reviewer か reviewer-alt)が承認したら、main へ fast-forward で push して入れる。GitHub の画面や API では入れない。手順は knowidea のスキル `land` と `review`
- コンポーネントを足す、直す時はスキル `add-component`。packages/css と packages/ui、apps/docs の 1 コンポーネント 1 ページ、check-pages の確かめを一緒に入れる
- push の前に `pnpm check`、`pnpm -r build`、`pnpm --filter @knowidea/docs check:pages`、`python3 knowidea/tools/check.py knowidea-ui` を通す

## バージョンと配り方

- 版はスキル `bump-version`。4 つのパッケージと apps/docs の版をそろえて上げ、changelog に 1 項目足す。版を上げた package.json が main に入ると npm に出る。足したら minor、直しだけなら patch

## 書き方

- 公開リポジトリなので、作者も入れた者も `KNOW IDEA <noreply@knowidea.invalid>`。オーナーのメールアドレスを残さず、名前(GitHub のログイン名)は URL、LICENSE、チェックの LEGACY に挙げた 2 件のコミットにだけ残す
- コミットと PR に AI の署名や帰属の行を付けない
- 日付の付いたファイル、報告、議事録を置かない
