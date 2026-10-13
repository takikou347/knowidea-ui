# icons

管理アプリで使う UI のアイコン。土台は Phosphor の regular。比較は `apps/docs` のアイコンのページと `samples/tokens/index.html`。

## 3 組(2026-10-13 に npm で確認)

| 組 | npm | 版 | ライセンス | 線 |
| --- | --- | --- | --- | --- |
| Phosphor | `@phosphor-icons/core` | 2.1.1 | MIT | 太さ 6 種(thin、light、regular、bold、fill、duotone)。regular は 256 の枠に 16、24px で 1.5px |
| Tabler | `@tabler/icons` | 3.49.0 | MIT | outline、filled。線 2px(24px の枠) |
| Lucide | `lucide-static` | 1.55.0 | ISC(Feather 由来の一部は MIT) | 線 2px(24px の枠)。太さは変数で変えられる |

## 結論

Phosphor の regular を使う。

| 理由 | 中身 |
| --- | --- |
| 線の太さ | 20px で 1.25px、16px で 1px。方向 B の本文(IBM Plex Sans JP 400、14px の縦線が約 1.1px)と同じ重さ。Tabler と Lucide は 20px で 1.67px、16px で 1.33px で、文字より 1 段重い |
| 太さを選べる | 同じ形のまま light(軽く)と bold(強く)に変えられる。Tabler と Lucide は線の太さを後から変えるしかない |
| 形 | 角が小さく、方向 B の小さな角丸に合う。外へのリンクと更新は Phosphor が一番すっきりしている |
| 注意 | 16px の regular は細い。小さな所は 16px を避け、20px を既定にする。16px が要る所(表の中の印)は bold を試す |

別を推す場合: 線の太さを 2px 前後にしたい画面(ダークで細い線が潰れる、など)は Lucide。Phosphor と混ぜない。

## 使い方

| 決まり | 中身 |
| --- | --- |
| 大きさ | 20px が既定、表の中は 16px。24px 以上は使わない |
| 色 | `currentColor`。文字と同じ色にする |
| 囲み | 枠や丸で囲まない。押せる所は、ボタン側の大きさを 44px にする |
| 組 | 1 つの組だけ。混ぜない |

## 16 個の対応表

| 役 | 名前 | Phosphor(regular) | Tabler(outline) | Lucide |
| --- | --- | --- | --- | --- |
| home | ホーム | `house` | `home` | `house` |
| actor | Claude と人 | `user` | `user` | `user` |
| proposal | 提案 | `lightbulb` | `bulb` | `lightbulb` |
| thread | スレッド | `chats` | `messages` | `messages-square` |
| pr | PR | `git-pull-request` | `git-pull-request` | `git-pull-request` |
| approve | 承認 | `check` | `check` | `check` |
| reject | 否認 | `x` | `x` | `x` |
| comment | コメント | `chat-text` | `message` | `message-square` |
| send | 送る | `paper-plane-tilt` | `send` | `send` |
| stop | 止める | `stop` | `player-stop` | `square` |
| resume | 再開 | `play` | `player-play` | `play` |
| warning | 警告 | `warning` | `alert-triangle` | `triangle-alert` |
| error | 失敗 | `x-circle` | `circle-x` | `circle-x` |
| settings | 設定 | `gear` | `settings` | `settings` |
| external | 外へのリンク | `arrow-square-out` | `external-link` | `external-link` |
| refresh | 更新 | `arrow-clockwise` | `refresh` | `refresh-cw` |

「Claude と人」は 1 つの `user`。Claude を人と見分ける印は、アイコンでなく名前の文字で出す。`error`(失敗)は状態の印で、`reject`(否認)は操作。

## 全アイコン(1c)

`icons.json` に 116 個(Phosphor 114、自作 2)。用途ごとに、方向と移動、操作、状態と通知、もの、管理アプリ、Logru、Ruleru のサイト、会社の自作。各行は名前、Phosphor の名前、日本語、使うアプリ。一覧は `apps/docs` のアイコンのページ(名前で絞り込める)。

| 決まり | 中身 |
| --- | --- |
| 名前 | 用途の名前(`chevron-right`、`routine`)。Phosphor の名前とは別。同じ Phosphor を別の役で使ってよい(`approve` と `check`) |
| 足し方 | `icons.json` に 1 行足して `pnpm --filter icons build`。Phosphor に無いときだけ `custom/<名前>.svg` を描く |
| 使う者の上書き | 各アプリは、自分で使う名前の部品を選ぶ。形を変えたいときは `icons.json` に自作を足し、同じ名前で上書きする |

### 自作(2 個)

| 名前 | 役 | 自作の理由 |
| --- | --- | --- |
| `token` | 使用量のトークン | 六角形に 2 本の文字の線。Phosphor の `coins` は金銭に読めてしまい、費用(`cost`)と区別できない |
| `session` | Claude のセッション | 吹き出しに `>_`。`chats` は人の会話、`terminal-window` は端末で、Claude に頼んだ 1 回の作業とは違う |

`routine` は `clock-clockwise`、`model` は `cpu`、`proposal` は `lightbulb`、オーナー待ちは `hand-palm` で足りるので自作しない。自作は Phosphor と同じ 256 の格子、線 16(bold は 24)、端と角は丸。16px と 20px で潰れないことを `samples/shots/icons-custom-light.png`、`icons-custom-dark.png` で確かめた(16px の bold で `token` の中の 2 本が詰まる。表の中では `regular` の 20px を使う)。Claude や Anthropic、他社のロゴは写していない。

## 出す形

`pnpm --filter icons build` が `dist/` に出す。

| ファイル | 使う所 |
| --- | --- |
| `dist/svg/<名前>.svg`、`<名前>-bold.svg` | 1 枚ずつ。`currentColor` |
| `dist/sprite.svg` | 素の HTML(Ruleru のサイト)。`<svg width="20" height="20"><use href="/sprite.svg#play"/></svg>`。bold は `#play-bold` |
| `dist/react/` | React 19。`<Icon name="chevron-right" size={20} weight="regular" />`、名前ごとの部品(`ChevronRightIcon`)、型つき(`IconName`) |
| `dist/icons-data.json` | docs と見本が読む |
| `dist/LICENSE-phosphor.txt`、`dist/NOTICE.txt` | ライセンス |

```tsx
import { Icon, SearchIcon } from "icons/react";
<Icon name="search" />            // 20px、regular、飾り(読み上げない)
<SearchIcon size={16} weight="bold" title="検索" />   // 16px は bold。title があれば読み上げる
```

`pnpm --filter icons check` が数、`currentColor`、React の描画、型を確かめる。

## ライセンス

大半のアイコンは Phosphor Icons(MIT、Copyright (c) 2023 Phosphor Icons、`@phosphor-icons/core` 2.1.1)から取り出した。全文は `dist/LICENSE-phosphor.txt`(出どころは `node_modules/@phosphor-icons/core/LICENSE`)。自作の `token`、`session` は KNOW IDEA のもの。

## 比較用の作り方(1b)

`pnpm --filter icons build` が `map.json` の 16 個を 3 組から取り出し、`dist/icons.json` と `dist/render.mjs` を作る。比較の表だけに使う。全アイコンは上の `build-set.mjs` が作る。
