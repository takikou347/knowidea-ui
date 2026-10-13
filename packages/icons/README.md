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

## 作り方

`pnpm --filter icons build` が `map.json` の 16 個を 3 組から取り出し、`dist/icons.json` と `dist/render.mjs` を作る。ここに無いアイコンは 1c で足す(`map.json` に 1 行足す)。
