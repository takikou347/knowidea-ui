// 変更の履歴の正本。新しい版を上に足す。版の番号は packages/*/package.json と同じ。
// rows の各行は [段または区分, 内容]。内容は短く、できたことだけを書く。
export const releases = [
  {
    version: "0.1.0",
    date: "2026-10-13",
    summary: "最初の版。4 つのパッケージ(tokens、icons、css、ui)と、このドキュメントサイト。配布は tarball で、npm など外部の公開先は未決。",
    rows: [
      ["1a Direction", "方向の見本を 3 つ作り、B(詰めた密度、小さな角丸、ゴシックと等幅)に決めた。"],
      ["1b Foundation", "主の色 #016C6C(ダークは #4CBFBF)とロゴ。DTCG 形式で OKLCH のトークン。UI のアイコンの比較。ドキュメントサイトの骨組み(Astro)。"],
      ["1c Components", "44 個のコンポーネントを、素の CSS(@knowidea/css)と React(@knowidea/ui、土台は Base UI 1.9.0)で作った。1 コンポーネント 1 ページで確かめる。"],
      ["1d Extensions", "情報の色(青)をトークンに足した。アイコンを 133 個にした。Tailwind v4 の検査と、素の HTML の例を足した。"],
      ["1e Library", "アプリごとに分けず、どのアプリにも属さない 1 つのライブラリに組み直した。createTheme と ThemeProvider(主の色、角丸、密度、字の大きさ)でアプリごとの違いを渡す。汎用のコンポーネント(Stat、Chart、Status、Card、List、AppBar、Drawer ほか)を足した。ドキュメントサイトを Getting started、Customization、Components、Icons、Templates の構成に作り直した。"],
      ["Usage fixes", "tarball で配れるようにした(pnpm release:pack、peerDependencies、テーマの CSS を作る knowidea-theme)。Installation と Usage の手順を tarball で入れる形に書き直し、新しいプロジェクトで手順を流して確かめる pnpm test:consumer を足した。"],
      ["Docs site", "トップページ、検索(ビルド時に索引を作る静的なもの)、Previous / Next、404、Changelog、Edit this page、OGP とファビコンを足した。"],
    ],
  },
];
