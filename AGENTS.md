# AGENTS.md

KNOW IDEA UI(会社の共通のデザインの部品)。Codex(OpenAI)はここで、デザイン部の Claude から頼まれた案と直しを作る。決めるのはデザイン部の Claude で、作る者と見る者を別の会社のモデルにしている。

## 読むもの

- `DESIGN.md`: デザインの決まりの正本。色、字、角丸、密度、動き
- `brand/README.md`: 主の色 #016C6C(ダーク #4CBFBF)、ロゴ、書体 IBM Plex
- `packages/tokens`(トークン)、`packages/css` と `packages/ui`(部品)、`apps/docs`(文書サイト)

## すること

- 頼む文の範囲だけを作る、直す
- 決まり(主の色、書体、角丸 4/8/12、終わらない動きを使わない など)を変える案は、案として出す。勝手に置き換えない
- 案は絵(390 幅と 820 幅、ライトとダーク)と、理由を短い Markdown で出す。置き場は頼む文が決める
- 今の UI の良い所は残し、何を変えて何を残したかを書く

## 書き方

- 日本語。結論を先に。絵文字を使わない
- 直したら `pnpm check`、`pnpm --filter @knowidea/docs check:pages`、`pnpm test:consumer` を通す
- コミットと PR に AI の署名(Co-authored-by、Generated with など)を付けない
- 公開リポジトリなので、作者と committer のメールは `noreply@knowidea.invalid` にする。個人のメールアドレスを書かない
