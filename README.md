# KNOW IDEA UI

特定のアプリに依存しない UI ライブラリ(トークン、アイコン、CSS、React のコンポーネント)。ドキュメントは https://takikou347.github.io/knowidea-ui/ 。

決まりは [DESIGN.md](DESIGN.md)。計画と文書は develop-docs の `company/proposals/20261012-priorities/` と `docs/design/`。

## 配り方

npm に `knowidea-tokens`、`knowidea-css`、`knowidea-icons`、`knowidea-ui` の名前で出している(MIT。`knowidea-css` の中の見出しの書体 Murecho は SIL OFL 1.1)。4 つの版はそろえる。版を上げて main に入れると、GitHub Actions の Publish が npm に出す。各パッケージの `README.md` は npm のページに出る短い説明で、作る人向けの細かな話は同じ場所の `DEVELOP.md`。

| コマンド | 中身 |
| --- | --- |
| `pnpm release:pack` | 4 つのパッケージを build し、`release/` に `.tgz` を作る(git に入れない)。`workspace:` は実際の版に置き換わる。npm に出す前の確かめに使う |
| `pnpm test:consumer` | `release/` の tarball を(文書の npm install の名前を置き換えて)、リポジトリの外の新しいプロジェクト(Vite + React、素の HTML、Vite + React + Tailwind v4)に入れ、文書の手順とコードのとおりに型検査、build、ブラウザでの表示まで確かめる。npm registry だけ使う |

使う側の手順は、文書サイト(`apps/docs`)の Getting started。手順とコードの正本は `apps/docs/src/data/examples.mjs`で、`pnpm test:consumer` も同じ文字列を使う。
