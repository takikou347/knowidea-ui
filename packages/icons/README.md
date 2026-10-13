# @knowidea/icons

UI ライブラリのアイコン。ベースは Phosphor の regular。比較は `apps/docs` の Icons ページと `samples/tokens/index.html` で確認できる。

## 3 組(2026-10-13 に npm で確認)

| 組 | npm | 版 | ライセンス | 線 |
| --- | --- | --- | --- | --- |
| Phosphor | `@phosphor-icons/core` | 2.1.1 | MIT | 太さ 6 種(thin、light、regular、bold、fill、duotone)。regular は 256 の枠に 16、24px で 1.5px |
| Tabler | `@tabler/icons` | 3.49.0 | MIT | outline、filled。線 2px(24px の枠) |
| Lucide | `lucide-static` | 1.55.0 | ISC(Feather 由来の一部は MIT) | 線 2px(24px の枠)。太さは変数で変えられる |

## 結論

Phosphor の regular を使う。

| 理由 | 内容 |
| --- | --- |
| 線の太さ | 20px で 1.25px、16px で 1px。方向 B の本文(IBM Plex Sans JP 400、14px の縦線が約 1.1px)と同じ重さ。Tabler と Lucide は 20px で 1.67px、16px で 1.33px で、文字より 1 段重い |
| ウェイトを選べる | 同じ形のまま light と bold に変えられる。Tabler と Lucide は線の太さを後から変えるしかない |
| 形 | 角が小さく、方向 B の小さな角丸に合う。外へのリンクと更新は Phosphor が一番すっきりしている |
| 注意 | 16px の regular は細い。小さな所は 16px を避け、20px を既定にする。16px が要る所(表の中の印)は bold を試す |

別を推す場合: 線の太さを 2px 前後にしたい画面(ダークで細い線が潰れる、など)は Lucide。Phosphor と混ぜない。

## 使い方

| 決まり | 中身 |
| --- | --- |
| サイズ | 20px がデフォルト、表の中は 16px。24px 以上は使わない |
| 色 | `currentColor`。文字と同じ色にする |
| 囲み | 枠や円で囲まない。タップ領域が必要な場合は、ボタン側のサイズを 44px にする |
| 組 | 1 つの組だけ。混ぜない |

## 16 個の対応表

| 役 | 名前 | Phosphor(regular) | Tabler(outline) | Lucide |
| --- | --- | --- | --- | --- |
| home | ホーム | `house` | `home` | `house` |
| actor | 人 | `user` | `user` | `user` |
| idea | ひらめき | `lightbulb` | `bulb` | `lightbulb` |
| chats | 会話のまとまり | `chats` | `messages` | `messages-square` |
| pull-request | 変更の取り込み依頼 | `git-pull-request` | `git-pull-request` | `git-pull-request` |
| approve | 承認 | `check` | `check` | `check` |
| reject | 却下 | `x` | `x` | `x` |
| comment | コメント | `chat-text` | `message` | `message-square` |
| send | 送る | `paper-plane-tilt` | `send` | `send` |
| stop | 止める | `stop` | `player-stop` | `square` |
| resume | 再開 | `play` | `player-play` | `play` |
| warning | 警告 | `warning` | `alert-triangle` | `triangle-alert` |
| error | 失敗 | `x-circle` | `circle-x` | `circle-x` |
| settings | 設定 | `gear` | `settings` | `settings` |
| external | 外へのリンク | `arrow-square-out` | `external-link` | `external-link` |
| refresh | 更新 | `arrow-clockwise` | `refresh` | `refresh-cw` |

人と、人でない相手を見分ける印は、アイコンでなく名前の文字で出す。`error`(失敗)は状態を示すマークで、`reject`(却下)は操作。

## 全アイコン(1c)

`icons.json` に 133 個(Phosphor 131、自作 2)。用途ごとに分ける(方向と移動、操作、状態と通知、もの、会話、開発、データ、日付、文字、メディア)。各行は名前、Phosphor の名前、日本語の説明。アプリごとの区分は持たない。一覧は `apps/docs` の Icons ページにある(名前で絞り込める)。

| 決まり | 中身 |
| --- | --- |
| 名前 | 用途の名前(`chevron-right`、`clock-clockwise`)。Phosphor の名前とは別。同じ Phosphor を別の役で使ってよい(`approve` と `check`) |
| 足し方 | `icons.json` に 1 行足して `pnpm --filter @knowidea/icons build`。Phosphor に無いときだけ `custom/<名前>.svg` を描く |
| 使う側での差し替え | 使う側は、必要な名前のコンポーネントを選んで使う。形を変えたいときは、`icons.json` に自作を足し、同じ名前でオーバーライドする |

### 自作(2 個)

| 名前 | 役 | 自作の理由 |
| --- | --- | --- |
| `hex-lines` | 六角形に 2 本の線 | 使用量の単位などに使う。Phosphor の `coins` は金銭に読めてしまい、費用(`cost`)と区別できない |
| `chat-prompt` | 吹き出しにプロンプト | 吹き出しに `>_`。`chats` は人の会話、`terminal-window` は端末で、頼んだ 1 回の作業とは違う |

周期のくり返しは `clock-clockwise`、チップは `cpu`、ひらめきは `lightbulb`、待ちは `hand-palm` で足りるので自作しない。自作は Phosphor と同じ 256 の格子、線 16(bold は 24)、端と角は丸。16px と 20px で潰れないことを `samples/shots/icons-custom-light.png`、`icons-custom-dark.png` で確かめた(16px の bold で `hex-lines` の中の 2 本が詰まる。表の中では `regular` の 20px を使う)。他社のロゴは写していない。

## 出す形

`pnpm --filter @knowidea/icons build` が `dist/` に出す。

| ファイル | 使う所 |
| --- | --- |
| `dist/svg/<名前>.svg`、`<名前>-bold.svg` | 1 枚ずつ。`currentColor` |
| `dist/sprite.svg` | 素の HTML。`<svg width="20" height="20"><use href="/sprite.svg#play"/></svg>`。bold は `#play-bold` |
| `dist/react/` | React 19 用。`<Icon name="chevron-right" size={20} weight="regular" />` と、名前ごとのコンポーネント(`ChevronRightIcon`)。型定義つき(`IconName`) |
| `dist/icons-data.json` | docs とサンプルが読み込む |
| `dist/LICENSE-phosphor.txt`、`dist/NOTICE.txt` | ライセンス |

```tsx
import { Icon, SearchIcon } from "icons/react";
<Icon name="search" />            // 20px、regular、装飾(読み上げない)
<SearchIcon size={16} weight="bold" title="検索" />   // 16px は bold。title があれば読み上げる
```

`pnpm --filter @knowidea/icons check` が数、`currentColor`、React の描画、型を確かめる。

## ライセンス

大半のアイコンは、Phosphor Icons(MIT、Copyright (c) 2023 Phosphor Icons、`@phosphor-icons/core` 2.1.1)から取り出している。全文は `dist/LICENSE-phosphor.txt`(出どころは `node_modules/@phosphor-icons/core/LICENSE`)。自作の `hex-lines`、`chat-prompt` は KNOW IDEA のもの。

## 比較用の作り方(1b)

`pnpm --filter @knowidea/icons build` が `map.json` の 16 個を 3 組から取り出し、`dist/icons.json` と `dist/render.mjs` を作る。比較の表だけに使う。全アイコンは上の `build-set.mjs` が作る。
