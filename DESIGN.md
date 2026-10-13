# DESIGN.md

KNOW IDEA の共通のデザインの決まり。見本を作る時と、PR を見る時に読む。
計画の正本は develop-docs の `company/proposals/20261012-priorities/proposal.md`(#116)。

## 今の段

| 段 | 中身 | 状態 |
| --- | --- | --- |
| 1a 方向の見本 | 軸を分けた 3 つの方向。`samples/direction-a`、`b`、`c` | B に決定(オーナー 2026-10-13 08:36 日本時間)。A と C は比べた記録として残す |
| 1b 土台 | 会社の主の色と会社のアイコン、トークン、UI のアイコン、ドキュメントサイトの骨組み | 主の色 #016C6C(ダーク #4CBFBF)とロゴ「ループ」に決定(オーナー 2026-10-13 09:28 日本時間)。決まりは `brand/README.md`。書体は今の IBM Plex Sans / Sans JP / Mono のまま(オーナー 2026-10-13 09:45 日本時間、候補は `samples/fonts/`)。トークン(`packages/tokens`、DTCG、OKLCH)、UI のアイコンの比較(`packages/icons`)、ドキュメントサイトの骨組み(`apps/docs`、Astro)を置いた。見本は `samples/tokens/`。オーナーの選択待ち: 成功の色(おすすめは候補 a、色相 145)、アイコンの組(おすすめは Phosphor regular)、ドキュメントサイトに Astro を採用するか。1c 以降はおすすめの案(成功の色 a、Phosphor regular、Astro)で組んだ。オーナーが別の案を選んだら差し替える |
| 1c コンポーネント | 44 のコンポーネントを `packages/css`(素の CSS)と `packages/ui`(Base UI 1.9.0 をベースにした React)に置き、`apps/docs` の 1 コンポーネント 1 ページで確かめる。サンプルは `apps/docs`、検査は `pnpm --filter @knowidea/docs check:pages` | 作った。オーナーの目で確かめる |
| 1d 管理アプリと各アプリの上書き | 情報の色(青、色相 250)をトークンに足した。アイコンを 133 個にし、コンポーネントの中のアイコンを `packages/icons` に差し替えた。Tailwind v4 の検査 `examples/tailwind/`、素の HTML の例 `examples/static/`。アプリ別のコンポーネント、アプリ別の上書き(`themes/`)、全部の見本(`samples/all`)は、1e で作り直して消した | 1e に置き換えた |
| 1e UI ライブラリ | UI ライブラリとして組み直した(オーナー 2026-10-13 14:21 日本時間)。アプリごとに分けず、どのアプリにも属さない 1 つのライブラリにする。パッケージは `@knowidea/tokens`、`@knowidea/icons`、`@knowidea/css`、`@knowidea/ui`(旧 `react`)。コンポーネントから Logru、Ruleru、Claude、提案、スレッド、PR の名前を外し、Stat、Chart、Status、Card、List、SelectionBar、Timeline、AppBar、Drawer、BottomNavigation などの汎用のコンポーネントにした。アプリごとの色は `themes/` をやめ、`createTheme` と `ThemeProvider`(主の色、角丸、密度、字の大きさ)で渡す。ドキュメントサイト `apps/docs` は MUI のような構成(Getting started、Customization、Components、Icons、Templates)に作り直した。サイドメニュー、コンポーネント名、ページの見出しは英語、説明文は日本語にした。`brand/apps` と `samples/all` は消した | 作った。オーナーの目で確かめる |

| 方向 | 密度、色の温度 | 形、書体 |
| --- | --- | --- |
| A | ゆったり、冷たい | 直角に近い、明朝の見出し |
| B | 詰めた、中間 | 小さな角丸(オーナーの 2026-10-13 20:46 日本時間の指示で、丸みを増やした。小さな部品 4px、ボタンと入力 8px、面 12px)、ゴシックと等幅 |
| C | 中くらい、暖かい | 役ごとに変える、丸みのあるゴシック |

## 角丸

オーナーの 2026-10-13 20:46 日本時間の指示で、丸みを増やした。大きさで 3 段に分け、全部に同じ値は使わない。

| 段 | 値 | 使う所 |
| --- | --- | --- |
| `--radius-1` | 4px | Checkbox、Badge、Status、Skeleton、インラインのコードなど小さな部品 |
| `--radius-2` | 8px | Button、入力欄、Select、Alert、メニューの項目、Tooltip |
| `--radius-3` | 12px | Card、Dialog、Menu、Table の枠、Accordion など面 |
| `--radius-pill` | 999px | Chip だけ。角丸 0 のテーマでは 0 |

- Chip は全体を丸める。選んだり消したりする操作で、Button(8px)と形で見分けがつく。Badge は状態を示す札で操作ではないので、4px のまま
- focus の輪と Table の行は角丸を持たない。輪は要素の形に沿う
- 3 つの比は `createTheme` で保たれる(小は半分、面は 1.5 倍)。12px を超えると警告が出る

## 使わない表現

| 区分 | 使わない | 代わりに |
| --- | --- | --- |
| 色 | グラデーション、グラデーションの文字、紫と藍の既定、クリームとテラコッタの定番(既定では使わない。後の版の候補を参照) | 役割つきのトークン。主の色は主のボタンと今いる所だけ |
| 色 | 薄い灰色の本文、ダークを反転で作る | 本文は 4.5:1 以上。ダークは別に決める |
| 字 | Inter や Roboto だけ、どの役も同じ書体 | 見出し、本文、数字、コードで書体を決める。日本語の書体も決める。本文は 400 |
| 形 | 全部に同じ大きな角丸、影と枠と色の面を重ねる、カードの入れ子 | 角丸と影は役ごとに数個。区切りは 1 つの手段 |
| アイコン | 組の混在、丸や角丸の枠で囲む、UI の絵文字、ボタンの矢印 | 1 つの組で線の太さをそろえる |
| 配置 | 中央の大見出しと 3 枚のカード、見出しの上の小さなラベル、全部大文字のラベル、完了画面の丸いチェックと大見出し | 内容の順で組む |
| 文言 | 「〜しましょう」、煽る言葉、見出しの句点、架空の数字、人名、社名 | 平叙で短く。本物のデータを使う。例外: コンポーネントと画面のサンプルに限り、画面に「サンプルの数値」と明記すれば、作った数値を使ってよい |
| 動き | 全部の節に同じ fade-up、終わらない脈動、数字のカウントアップ | 状態が変わる時だけ。`prefers-reduced-motion` で止める |

## レビューの表

画面とコンポーネントごとに、PR で次を問う。

| 問い | 合格の形 |
| --- | --- |
| この会社のために選んだか、どの製品にも使える既定か | 選んだ理由を言える |
| 上の「使わない表現」が無いか | 1 つも無い |
| 本文と背景のコントラスト | 4.5:1 以上(大きな文字は 3:1 以上) |
| 線、アイコン、focus の輪のコントラスト | 隣の色と 3:1 以上 |
| タップ領域の大きさ | 44px 以上(WCAG の AA は 24px。会社は 44px にする) |
| focus | 見える。2px 以上の輪で、前と 3:1 以上(WCAG 2.4.13 の AAA に合わせる) |
| 5 つの状態 | Empty、Loading、Error、Disabled、Focus がある |
| 幅 390px | 横スクロールが出ない。左右の余白 16px |
| ページの間のずれ | 字、色、角丸、余白の段がそろう |
| 外の物差し | オーナーの目。数字の物差しは無い |

## 後の版の候補

今回は作らない。

- 選んで使う見た目の版(例: グラデーションの Button や Card)。既定は今の見た目のまま、使う側が選んだ時だけ当たる。オーナーの案 2026-10-13

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
