# アプリのアイコン(案)

案。オーナーが決めるまで、アプリには入れない。見本は `samples/shots/icons-apps.png`。

## 決まりの範囲

| 項目 | 中身 |
| --- | --- |
| 色 | 面 `#016C6C`、マークと字は白。favicon は `#016C6C`(ダークで `#4CBFBF`)。これ以外を使わない |
| 見分け | 色ではなく、マークの下の名前(ADMIN、LOGRU、RULERU)で見分ける。字は IBM Plex Sans 700 を path にした(書体の無い環境でも同じ) |
| favicon | 16px に名前は入らないので 3 つとも同じ `favicon.svg`(`brand/logo/favicon.svg` の写し)。タブの題で見分ける |

## ファイル

| アプリ | フォルダ | 中身 |
| --- | --- | --- |
| 管理アプリ | `admin/` | `app-icon.svg`(角丸 22)、`apple-touch-icon.svg` と `.png`(180px、角丸なし。iPhone が丸める)、`favicon.svg`、`favicon-32.png` |
| Logru | `logru/` | 同じ |
| Ruleru のサイト | `ruleru/` | 同じ |

作り直しは `brand/` で `node apps/build.mjs`。

## 使い方(素の HTML)

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

## 決めてほしいこと

| 問い | 案 |
| --- | --- |
| 名前を入れるか | 入れる(3 つが同じ面の色なので、見分けは名前だけ)。入れないなら 3 つは同じ絵になる |
| Logru をダークの面にするか | しない(色で見分けないため)。するなら `app-icon-dark.svg` の形を使う |
