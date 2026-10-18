# knowidea-icons

KNOW IDEA UI のアイコン。133 個。形は Phosphor の regular。

[ドキュメント](https://takikou347.github.io/knowidea-ui/) / [GitHub](https://github.com/takikou347/knowidea-ui) / MIT

## 入れる

```sh
npm install knowidea-icons
```

## 使う

React では、名前ごとの部品として使う。

```tsx
import { SearchIcon } from "knowidea-icons/react";

<SearchIcon />
```

素の HTML では、`node_modules/knowidea-icons/dist/sprite.svg` をページの近くに写し、`<use>` で指す。

```html
<svg class="ki-icon" aria-hidden="true"><use href="sprite.svg#search"></use></svg>
```

名前の一覧はドキュメントの Icons にある。

## 4 つのパッケージ

| パッケージ | 中身 |
| --- | --- |
| [knowidea-tokens](https://www.npmjs.com/package/knowidea-tokens) | 色、余白、角丸、書体の CSS 変数と、テーマを作る `createTheme` |
| [knowidea-css](https://www.npmjs.com/package/knowidea-css) | 部品の見た目(`ki-` のクラス)。素の HTML でも使える |
| [knowidea-icons](https://www.npmjs.com/package/knowidea-icons) | アイコン 133 個(SVG のスプライトと React) |
| [knowidea-ui](https://www.npmjs.com/package/knowidea-ui) | React 19 の部品 56 個。土台は Base UI |

Phosphor Icons(MIT)を元にしている。ライセンスは `dist/LICENSE-phosphor.txt`。
