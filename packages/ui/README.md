# @knowidea/ui

KNOW IDEA の UI ライブラリの React 19 コンポーネント。特定のアプリに依存しない。見た目は `@knowidea/css` のクラスを当てるだけで、挙動が複雑なコンポーネント(Dialog、ConfirmDialog、Tabs、Menu、Tooltip、Select、Checkbox、Radio、Switch、Toast、Field、Input、Accordion、Progress、Avatar、Drawer、Sheet、SegmentedControl、DatePicker、Popover、Combobox)は `@base-ui/react` 1.9.0 をベースに実装している。

| コマンド | 中身 |
| --- | --- |
| `pnpm --filter @knowidea/ui build` | tsc で `dist/` に JS と型定義を出力する |

事前に `@knowidea/tokens` と `@knowidea/icons` のビルドが必要。`pnpm -r build` は依存順にビルドする。

## 入れ方

npm などには出していない(公開先はまだ決まっていない)。リポジトリの `pnpm release:pack` で `release/` に tarball を作り、使う側で 4 つ全部を入れる。`@knowidea/css`、`@knowidea/icons`、`@knowidea/tokens` は `peerDependencies` なので、同じコマンドで入れないと解決できない。手順は `apps/docs` の Installation。`pnpm test:consumer` が、新しいプロジェクトで手順どおりに動くことを確かめる。

## Components

| Category | Components |
| --- | --- |
| Inputs | Button、IconButton、TextField、Input、Textarea、Select、Combobox、DatePicker、Calendar、Checkbox、Radio、SegmentedControl、Switch、Field |
| Data display | Avatar、Badge、Chip、Status、Stat(Sparkline)、Table、List(ListItem)、Timeline、Tooltip、Popover、CodeBlock、Quote |
| Feedback | Alert、Toast、Dialog、ConfirmDialog、Sheet、Progress、Skeleton、Spinner、EmptyState |
| Surfaces | Card、Accordion、SelectionBar |
| Navigation | Link、Tabs、Menu、Breadcrumbs、Pagination、AppBar、Drawer、BottomNavigation |
| Layout | Stack、Grid、Container、Divider |
| Charts | Chart(棒グラフと折れ線グラフ。追加の依存なしで、自前の SVG で描画する) |
| Theme | ThemeProvider、createTheme |

すべてのコンポーネントが、Empty、Loading、Error、Disabled、Focus の 5 つの状態を備える。Props、CSS のクラスと変数、アクセシビリティは、`apps/docs`(ドキュメントサイト)の各ページに記載している。

アイコンは `@knowidea/icons` を使う。`Icon` は `ki-icon` クラスを付けたラッパーで、`name` には `icons.json` の名前を渡す。`icon` プロパティは ReactNode を受け取るため、`SearchIcon` のような名前ごとのコンポーネントも渡せる。

## Theme

```tsx
<ThemeProvider theme={{ primary: "#016C6C", radius: 8, density: "compact", fontSize: 14 }}>
  <App />
</ThemeProvider>
```

囲んだ範囲にだけ CSS 変数をオーバーライドする(ライトとダークの両方)。コントラスト比が 4.5:1 に届かない組み合わせは `console.warn` に出力される(`onWarn` で受け取れる)。仕組みは `packages/tokens/README.md` を参照。
