# @knowidea/react

React 19 の UI 部品。見た目は `@knowidea/css` のクラスを当てるだけ。挙動の難しい物(Dialog、AlertDialog、Tabs、Menu、Tooltip、Select、Checkbox、Radio、Switch、Toast、Field、Input)は `@base-ui/react` 1.9.0 の上に作る。

| コマンド | 中身 |
| --- | --- |
| `pnpm --filter @knowidea/react build` | tsc で `dist/` に JS と型を出す |
| `pnpm --filter @knowidea/react gen:icons` | 部品の中の小さなアイコン(Phosphor regular の path)を `src/icon-data.ts` に写す |

アイコンは当面 inline の SVG(`Icon`)。`icon` は ReactNode で外から渡せるので、`packages/icons` の部品に差し替えられる。部品の一覧と props は `apps/docs` の各ページ。
