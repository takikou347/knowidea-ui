# @knowidea/react

React 19 の UI 部品。見た目は `@knowidea/css` のクラスを当てるだけ。挙動の難しい物(Dialog、AlertDialog、Tabs、Menu、Tooltip、Select、Checkbox、Radio、Switch、Toast、Field、Input)は `@base-ui/react` 1.9.0 の上に作る。

| コマンド | 中身 |
| --- | --- |
| `pnpm --filter @knowidea/react build` | tsc で `dist/` に JS と型を出す |

アイコンは `packages/icons`(workspace の `icons`、`icons/react`)から読む。`Icon` は `ki-icon` で包んだ物で、`name` は `icons.json` の名前(`check`、`close`、`chevron-down` など)。`icon` は ReactNode で外から渡せるので、`SearchIcon` のような名前ごとの部品も渡せる。先に `pnpm --filter icons build` が要る(`pnpm -r build` は順に作る)。部品の一覧と props は `apps/docs` の各ページ。

管理アプリの部品: `StatCard`、`Sparkline`、`TrendChart`、`ClaudeCard`、`ProposalCard`、`StatusMark`、`ThreadList`、`DecisionBar`、`TalkBox`、`Thinking`、`SendTray`、`ActivityList`、`StopButton`、`AppShell`。`apps/docs` の「管理アプリの部品」の各ページに props と 5 つの状態がある。グラフは依存を足さず自前の SVG。
