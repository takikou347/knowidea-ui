// 変更の履歴の正本。新しい版を上に足す。版の番号は packages/*/package.json と同じ。
// rows の各行は [パッケージか Docs, 内容]。使う人にとっての変更を短く書く。
export const releases = [
  {
    version: "0.4.0",
    date: "2026-10-14",
    summary: "ボタンの近くに出る面と、打って絞り込む欄を足した。Popover と Combobox。配布は tarball のまま。",
    rows: [
      ["@knowidea/css", "50 個にした。.ki-popover(ボタンの近くに出る小さな面。素の HTML では popover 属性で開く)と .ki-combobox(Input と同じ形の欄。右に「消す」と「開く」、どちらも 44px 四方)を足した。"],
      ["@knowidea/ui", "50 個にした。Popover(Base UI の Popover が土台。中で押せる物を置ける。Esc で閉じ、開いたボタンへ focus が戻る)と Combobox(Base UI の Combobox が土台。ひらがなとカタカナ、全角と半角を同じに見て探す。keywords に読み仮名を入れる。読み込み中と合う物が無い時の文)を足した。探す時の文字の揃え方 normalizeForSearch も出した。"],
      ["Docs", "Popover と Combobox のページ。check-pages に 2 つの操作を足した。"],
    ],
  },
  {
    version: "0.3.0",
    date: "2026-10-14",
    summary: "日付の部品を足した。Calendar と DatePicker。配布は tarball のまま。",
    rows: [
      ["@knowidea/css", "48 個にした。.ki-calendar(1 日 44px 四方の月のカレンダー。月を移ると、移った向きから少し滑って出る)と .ki-datepicker(Select と同じ欄から開く)を足した。"],
      ["@knowidea/ui", "48 個にした。Calendar(矢印キーで日、PageUp と PageDown で月。min、max、選べない日、予定の点、週の始まり)と DatePicker(Base UI の Popover が土台。開くと日へ focus が移り、選ぶと閉じる。name で YYYY-MM-DD を送る)を足した。日付だけを比べる sameDay も出した。"],
      ["Docs", "Calendar と DatePicker のページ。check-pages に 2 つの操作を足した。"],
    ],
  },
  {
    version: "0.2.0",
    date: "2026-10-14",
    summary: "スマホと iPad で使う部品を足した。Sheet、SegmentedControl、Switch の設定の一覧の形と、その動き。配布は tarball のまま。",
    rows: [
      ["@knowidea/tokens", "動きのトークン --motion-duration-enter(240ms)を足した。Sheet のような大きな面の出入りに使う。動きを減らす設定では 0ms になる。"],
      ["@knowidea/css", "46 個にした。.ki-sheet(下から出る面。素の HTML では <dialog> で、開く時に下から出る)と .ki-segmented(選んだ印が滑る切り替え。素の HTML ではラジオで作る)を足した。.ki-choice に、Switch を右端に置く data-placement=\"end\" と、補足の .ki-choice__description を足した。"],
      ["@knowidea/ui", "46 個にした。Sheet と SheetClose(Base UI の Drawer が土台。指で下へ引いて閉じる。背面の暗さも引いた分だけ薄くなる)、SegmentedControl(Base UI の RadioGroup が土台。矢印キーで選び直す)を足した。Switch に description と placement を足した。"],
      ["Docs", "Sheet、SegmentedControl のページと、Switch の Settings list の例を足した。Tokens の Motion に、指で引く動きの決まりを書いた。"],
    ],
  },
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
