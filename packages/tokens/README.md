# knowidea-tokens

KNOW IDEA UI のデザイントークン。色、余白、角丸、書体、動きを CSS 変数で持つ。ライトとダークの両方の値があり、色は OKLCH で決めている。

[ドキュメント](https://takikou347.github.io/knowidea-ui/) / [GitHub](https://github.com/takikou347/knowidea-ui) / MIT

## 入れる

```sh
npm install knowidea-tokens
```

## 使う

```js
import "knowidea-tokens/tokens.css";
```

主の色を変えたテーマを作る。ダークの値と、文字が読みにくい組み合わせの警告も一緒に出る。

```js
import { createTheme } from "knowidea-tokens/create-theme";

const t = createTheme({ primary: "#2255CC", radius: 6 });
t.css(".brand"); // CSS の文字列
t.warnings;      // コントラストが 4.5:1 に届かない組み合わせ
```

同じことをコマンドでもできる。

```sh
npx knowidea-theme --primary "#2255CC" --radius 6 --selector .brand > brand.css
```

Tailwind v4 では `knowidea-tokens/theme.css` を読み込むと、`bg-surface` のようなクラスが同じ変数を使う。

## 4 つのパッケージ

| パッケージ | 中身 |
| --- | --- |
| [knowidea-tokens](https://www.npmjs.com/package/knowidea-tokens) | 色、余白、角丸、書体の CSS 変数と、テーマを作る `createTheme` |
| [knowidea-css](https://www.npmjs.com/package/knowidea-css) | 部品の見た目(`ki-` のクラス)。素の HTML でも使える |
| [knowidea-icons](https://www.npmjs.com/package/knowidea-icons) | アイコン 133 個(SVG のスプライトと React) |
| [knowidea-ui](https://www.npmjs.com/package/knowidea-ui) | React 19 の部品 56 個。土台は Base UI |
