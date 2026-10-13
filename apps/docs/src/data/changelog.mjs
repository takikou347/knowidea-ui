// 変更の履歴の正本。新しい版を上に足す。版の番号は packages/*/package.json と同じ。
// rows の各行は [パッケージか Docs, 内容]。使う人にとっての変更を短く書く。
export const releases = [
  {
    version: "0.1.0",
    date: "2026-10-13",
    summary: "最初の版。配布は tarball で、npm など外部の公開先は未決。",
    rows: [
      ["@knowidea/tokens", "色、フォント、余白、角丸(4px、8px、12px の 3 段階と Chip 用の pill)、影、動きのトークン(DTCG 形式、OKLCH)。ライトとダーク。createTheme でプライマリカラー、角丸、密度、フォントサイズを変えたテーマの CSS を作れる。同じことをする knowidea-theme コマンド。動きを減らす設定では、状態の動きを止める。"],
      ["@knowidea/icons", "133 個のアイコン(Phosphor の regular と bold を元にしたもの)。SVG、sprite、React のコンポーネントで使える。"],
      ["@knowidea/css", "44 個のコンポーネントの ki- のクラス。React を使わない HTML でも使える。body の既定(背景、文字の色、書体)を詳細度 0 で持つ。Tailwind v4 では layer(components) で読み込める。"],
      ["@knowidea/ui", "44 個の React コンポーネント(土台は Base UI 1.9.0)。ThemeProvider の内側ではテーマが変わり、Dialog、Menu、Toast のように画面の最上位に描かれる部品にも届く。css、icons、tokens は peerDependencies。"],
      ["Docs", "Getting started、Customization、Components、Icons、Templates、Changelog。検索、Previous / Next、Edit this page。手順のコードは、新しいプロジェクトで流して確かめている(pnpm test:consumer)。"],
    ],
  },
];
