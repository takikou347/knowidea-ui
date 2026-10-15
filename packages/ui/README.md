# knowidea-ui

KNOW IDEA UI の React の部品。54 個。ボタン、入力、表、ダイアログ、トーストなど。ライトとダークの両方に対応し、押せる所はすべて 44px 以上。

[ドキュメント](https://takikou347.github.io/knowidea-ui/) / [GitHub](https://github.com/takikou347/knowidea-ui) / MIT

## 入れる

```sh
npm install knowidea-ui knowidea-css knowidea-tokens knowidea-icons
```

## 使う

```tsx
import "knowidea-tokens/tokens.css";
import "knowidea-css/index.css";
import { Button, ThemeProvider } from "knowidea-ui";

export function App() {
  return (
    <ThemeProvider theme={{ primary: "#016C6C" }}>
      <Button>保存する</Button>
    </ThemeProvider>
  );
}
```

主の色、角丸、密度、字の大きさ、グラデーションの見た目(`look: "gradient"`)を `ThemeProvider` で変えられる。部品ごとの使い方はドキュメントにある。

## 4 つのパッケージ

| パッケージ | 中身 |
| --- | --- |
| [knowidea-tokens](https://www.npmjs.com/package/knowidea-tokens) | 色、余白、角丸、書体の CSS 変数と、テーマを作る `createTheme` |
| [knowidea-css](https://www.npmjs.com/package/knowidea-css) | 部品の見た目(`ki-` のクラス)。素の HTML でも使える |
| [knowidea-icons](https://www.npmjs.com/package/knowidea-icons) | アイコン 133 個(SVG のスプライトと React) |
| [knowidea-ui](https://www.npmjs.com/package/knowidea-ui) | React 19 の部品 54 個。土台は Base UI |
