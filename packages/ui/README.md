# @knowidea/ui

KNOW IDEA の UI ライブラリの React 19 の部品。どのアプリにも属さない。見た目は `@knowidea/css` のクラスを当てるだけ。挙動の難しい物(Dialog、ConfirmDialog、Tabs、Menu、Tooltip、Select、Checkbox、Radio、Switch、Toast、Field、Input、Accordion、Progress、Avatar、Drawer)は `@base-ui/react` 1.9.0 の上に作る。

| コマンド | 中身 |
| --- | --- |
| `pnpm --filter @knowidea/ui build` | tsc で `dist/` に JS と型を出す |

先に `@knowidea/tokens` と `@knowidea/icons` の build が要る(`pnpm -r build` は順に作る)。

## 部品

| 分類 | 部品 |
| --- | --- |
| 入力 | Button、IconButton、TextField、Input、Textarea、Select、Checkbox、Radio、Switch、Field |
| データの表示 | Avatar、Badge、Chip、Status、Stat(Sparkline)、Table、List(ListItem)、Timeline、Tooltip、CodeBlock、Quote |
| 知らせ | Alert、Toast、Dialog、ConfirmDialog、Progress、Skeleton、Spinner、EmptyState |
| 面 | Card、Accordion、SelectionBar |
| 移動 | Link、Tabs、Menu、Breadcrumbs、Pagination、AppBar、Drawer、BottomNavigation |
| レイアウト | Stack、Grid、Container、Divider |
| グラフ | Chart(棒と線。依存を足さず自前の SVG) |
| テーマ | ThemeProvider、createTheme |

全部の部品に、空、読み込み、失敗、無効、focus の 5 つの状態がある。props、CSS のクラスと変数、アクセシビリティは `apps/docs`(見本のサイト)の各ページ。

アイコンは `@knowidea/icons`。`Icon` は `ki-icon` で包んだ物で、`name` は `icons.json` の名前。`icon` は ReactNode で外から渡せるので、`SearchIcon` のような名前ごとの部品も渡せる。

## テーマ

```tsx
<ThemeProvider theme={{ primary: "#016C6C", radius: 4, density: "compact", fontSize: 14 }}>
  <App />
</ThemeProvider>
```

囲んだ中だけ CSS 変数を上書きする(ライトとダークの両方)。4.5:1 に届かない組は `console.warn`(`onWarn` で受けられる)。仕組みは `packages/tokens/README.md`。
