# design-system

KNOW IDEA の共通のデザイン(色、タイポグラフィ、アイコン、コンポーネント、モーション、テーマ)。private。

決まりは [DESIGN.md](DESIGN.md)。計画と文書は develop-docs の `company/proposals/20261012-priorities/` と `docs/design/`。

## 配り方

npm などの公開先は未決で、オーナーが決める。決まるまでは tarball で配る。

| コマンド | 中身 |
| --- | --- |
| `pnpm release:pack` | 4 つのパッケージを build し、`release/` に `.tgz` を作る(git に入れない)。`workspace:` は実際の版に置き換わる |
| `pnpm test:consumer` | `release/` の tarball を、リポジトリの外の新しいプロジェクト(Vite + React、素の HTML、Vite + React + Tailwind v4)に入れ、文書の手順とコードのとおりに型検査、build、ブラウザでの表示まで確かめる。npm registry だけ使う |

使う側の手順は、文書サイト(`apps/docs`)の Getting started。手順とコードの正本は `apps/docs/src/data/examples.mjs`で、`pnpm test:consumer` も同じ文字列を使う。
