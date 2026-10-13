# DESIGN.md

KNOW IDEA の共通のデザインの決まり。見本を作る時と、PR を見る時に読む。
計画の正本は develop-docs の `company/proposals/20261012-priorities/proposal.md`(#116)。

## 今の段

| 段 | 中身 | 状態 |
| --- | --- | --- |
| 1a 方向の見本 | 軸を分けた 3 つの方向。`samples/direction-a`、`b`、`c` | B に決定(オーナー 2026-10-13 08:36 日本時間)。A と C は比べた記録として残す |
| 1b 土台 | 会社の主の色と会社のアイコン、トークン、UI のアイコン、見本のサイトの骨組み | 主の色 #016C6C(ダーク #4CBFBF)とロゴ「ループ」に決定(オーナー 2026-10-13 09:28 日本時間)。決まりは `brand/README.md`。書体は今の IBM Plex Sans / Sans JP / Mono のまま(オーナー 2026-10-13 09:45 日本時間、候補は `samples/fonts/`)。トークン、UI のアイコン、見本のサイトは次 |
| 1c 部品 | 管理アプリと Logru で要る分から | 1b の後 |

| 方向 | 密度、色の温度 | 形、書体 |
| --- | --- | --- |
| A | ゆったり、冷たい | 直角に近い、明朝の見出し |
| B | 詰めた、中間 | 小さな角丸、ゴシックと等幅 |
| C | 中くらい、暖かい | 役ごとに変える、丸みのあるゴシック |

## 使わない表現

| 区分 | 使わない | 代わりに |
| --- | --- | --- |
| 色 | グラデーション、グラデーションの文字、紫と藍の既定、クリームとテラコッタの定番 | 役割つきのトークン。主の色は主のボタンと今いる所だけ |
| 色 | 薄い灰色の本文、ダークを反転で作る | 本文は 4.5:1 以上。ダークは別に決める |
| 字 | Inter や Roboto だけ、どの役も同じ書体 | 見出し、本文、数字、コードで書体を決める。日本語の書体も決める。本文は 400 |
| 形 | 全部に同じ大きな角丸、影と枠と色の面を重ねる、カードの入れ子 | 角丸と影は役ごとに数個。区切りは 1 つの手段 |
| アイコン | 組の混在、丸や角丸の枠で囲む、UI の絵文字、ボタンの矢印 | 1 つの組で線の太さをそろえる |
| 配置 | 中央の大見出しと 3 枚のカード、見出しの上の小さなラベル、全部大文字のラベル、完了画面の丸いチェックと大見出し | 内容の順で組む |
| 文言 | 「〜しましょう」、煽る言葉、見出しの句点、架空の数字、人名、社名 | 平叙で短く。本物のデータを使う |
| 動き | 全部の節に同じ fade-up、終わらない脈動、数字のカウントアップ | 状態が変わる時だけ。`prefers-reduced-motion` で止める |

## レビューの表

画面と部品ごとに、PR で次を問う。

| 問い | 合格の形 |
| --- | --- |
| この会社のために選んだか、どの製品にも使える既定か | 選んだ理由を言える |
| 上の「使わない表現」が無いか | 1 つも無い |
| 本文と背景のコントラスト | 4.5:1 以上(大きな文字は 3:1 以上) |
| 線、アイコン、focus の輪のコントラスト | 隣の色と 3:1 以上 |
| 押せる所の大きさ | 44px 以上(WCAG の AA は 24px。会社は 44px にする) |
| focus | 見える。2px 以上の輪で、前と 3:1 以上(WCAG 2.4.13 の AAA に合わせる) |
| 5 つの状態 | 空、読み込み、失敗、無効、focus がある |
| 幅 390px | 横スクロールが出ない。左右の余白 16px |
| ページの間のずれ | 字、色、角丸、余白の段がそろう |
| 外の物差し | オーナーの目。数字の物差しは無い |

## 出どころ

2026-10-13 に確かめ直した。この環境から w3.org と多くのブログは開けず、検索の要約で読んだ。1b の最初に開ける端末で本文を確かめる。

| 中身 | 出どころ |
| --- | --- |
| コントラスト 4.5:1 と 3:1、非テキスト 3:1、押せる所の最小 24px(2.5.8、AA)、Focus Appearance は 2.4.13 で AAA、2.4.11 は Focus Not Obscured(AA) | [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)、[Yatil の解説](https://www.yatil.net/blog/new-wcag-22-features-rated) |
| AI の画面が似る理由は学習の平均。Tailwind の藍の既定と Inter が広がった | [Superdesign](https://www.superdesign.dev/blog/why-ai-design-looks-generic)、[GeekyAnts](https://geekyants.com/blog/why-everything-your-ai-builds-looks-the-same) |
| 全部に同じ大きな角丸、既定の書体(Inter、Roboto など)は使い過ぎ | [Impeccable の anti-patterns](https://www.mintlify.com/pbakaus/impeccable/concepts/anti-patterns)、[Noqta](https://noqta.tn/en/blog/ai-design-slop-overused-ui-patterns-fix-2026) |
| 形容詞でなく具体の参照と仕様の文書で作る | 同上 |
| 10 項目のもと | develop-docs `company/proposals/20261012-priorities/research-2.md` |

デザイナーの記事(Smashing Magazine、Nielsen Norman Group)は検索で見つからなかった。見つかったのは製品の会社のブログが多く、宣伝を含む。
