# knowidea-css

KNOW IDEA UI の見た目。素の CSS で、クラス名は `ki-` で始まる。React が無くても、クラスを付けるだけで使える。

[ドキュメント](https://takikou347.github.io/knowidea-ui/) / [GitHub](https://github.com/takikou347/knowidea-ui) / MIT

## 入れる

```sh
npm install knowidea-css knowidea-tokens
```

## 使う

```js
import "knowidea-tokens/tokens.css";
import "knowidea-css/index.css";
```

```html
<button class="ki-button" type="button">保存する</button>
```

素の HTML では、`node_modules/knowidea-css/dist/ki.css` と `node_modules/knowidea-tokens/dist/tokens.css` をページの近くに写し、`<link>` で読み込む。部品ごとの書き方はドキュメントにある。

## 4 つのパッケージ

| パッケージ | 中身 |
| --- | --- |
| [knowidea-tokens](https://www.npmjs.com/package/knowidea-tokens) | 色、余白、角丸、書体の CSS 変数と、テーマを作る `createTheme` |
| [knowidea-css](https://www.npmjs.com/package/knowidea-css) | 部品の見た目(`ki-` のクラス)。素の HTML でも使える |
| [knowidea-icons](https://www.npmjs.com/package/knowidea-icons) | アイコン 133 個(SVG のスプライトと React) |
| [knowidea-ui](https://www.npmjs.com/package/knowidea-ui) | React 19 の部品 54 個。土台は Base UI |
