// 変更の履歴の正本。新しい版を上に足す。版の番号は packages/*/package.json と同じ。
// rows の各行は [パッケージか Docs, 内容]。使う人にとっての変更を短く書く。
export const releases = [
  {
    version: "0.8.1",
    date: "2026-10-15",
    summary: "npm に出した。npm のページの説明を短くし、文書の入れ方を npm にした。部品は変えていない。",
    rows: [
      ["配布", "4 つを npm に出した(0.8.0 から)。各パッケージの README を、入れ方と短い使い方だけにした。作る人向けの話は DEVELOP.md に移した。"],
      ["Docs", "Installation、Usage with React、Tailwind v4、Plain HTML、Theme の入れ方を、tarball から npm install に変えた。"],
    ],
  },
  {
    version: "0.8.0",
    date: "2026-10-15",
    summary: "グラデーションの見た目を選べるようにした。パッケージの名前を knowidea-* に変え、MIT ライセンスで npm に出す準備をした。部品の数は 54 のまま。",
    rows: [
      ["名前", "パッケージの名前を変えた。@knowidea/tokens は knowidea-tokens、@knowidea/css は knowidea-css、@knowidea/icons は knowidea-icons、@knowidea/ui は knowidea-ui。import の文字を置き換える。"],
      ["knowidea-tokens", "createTheme に look(\"flat\" | \"gradient\")を足した。gradient の時、グラデーションの終わりの色の上でも主のボタンの文字が 4.5:1 以上かを確かめ、足りなければ gradient-on の警告を出す。終わりの色を作る gradientEnd も出した。"],
      ["knowidea-css", "look.css を足した。data-ki-look=\"gradient\" の下で、プライマリの Button、Switch と Checkbox の選んだ印、カレンダーの選んだ日、Pagination の今の頁、Progress と Slider の線にグラデーションを掛け、Card にごく薄い差し色を入れる。終わりの色は主の色から色相を 40 度回す(--ki-gradient-shift で変えられる)。既定は flat で、今までと同じ見た目。"],
      ["knowidea-ui", "ThemeProvider の theme.look で見た目を選べる。ポータルに出る物(Dialog、Menu、Toast など)にも data-ki-look が届く。中の ThemeProvider で look: \"flat\" と書くと、その下は平らに戻る。"],
      ["配布", "MIT ライセンスにした。npm に出す GitHub Actions(Publish、手で動かす)を足した。最初の版を出すまでは tarball で配る。"],
      ["Docs", "Button に Gradient look の見本。Theme の Look で flat と gradient を切り替え、グラデーションの終わりの色の上の文字のコントラストも表に出す。"],
    ],
  },
  {
    version: "0.7.0",
    date: "2026-10-14",
    summary: "issue #3 の動きを足した。部品の数は 54 のまま。配布は tarball のまま。",
    rows: [
      ["@knowidea/css", "Drawer の引き出しを、指に付いて動き、左へ払うと閉じる形にした(.ki-drawer__viewport、.ki-drawer__backdrop を足した)。Toast を重ねて積む形にした(前の 1 枚だけ中身を見せ、乗せると並び、右か下へ払うと消える)。Chip は押すと小さく沈み、選ぶとチェックが小さく開いて出る。どれも動きを減らす設定で止まる。"],
      ["@knowidea/ui", "Drawer の temporary を Base UI の Drawer に移した(左へ払って閉じる)。Toast に重ねる形と払って消す動きを足した。List は、行を足すと上から少し滑って出し、消した時と並べ替えた時は残った行が新しい位置へ滑る。初めて出た時は動かさない。"],
      ["Docs", "ページを移る時に、見出しを前のページの見出しからつなぎ、本文を少し滑らせて出す(View Transitions。使えないブラウザではふつうに移る)。List に Motion の見本。check-pages に 3 つの操作を足した。Skeleton の光は、終わらない動きを使わない決まりに合わせて足さなかった。"],
    ],
  },
  {
    version: "0.6.0",
    date: "2026-10-14",
    summary: "添付とショートカットの部品を足した。FileUpload と Kbd。配布は tarball のまま。",
    rows: [
      ["@knowidea/css", "54 個にした。.ki-file-upload(置き場は点線の枠。ファイルを持って来ると主の色の実線になる。選んだ行は滑って出る)と .ki-kbd(キーの形。同時に押すキーは + でつなぐ)を足した。"],
      ["@knowidea/ui", "54 個にした。FileUpload(押して選ぶか置く。選んだ物は一覧で 1 つずつ外せる。maxSize を超えた物は加えず知らせる。name でフォームで送れる)と Kbd(⌘ や ↵ は読み上げで名前にする)を足した。バイトを「1.2 MB」にする formatBytes も出した。"],
      ["Docs", "FileUpload と Kbd のページ。check-pages に 2 つの操作を足した。"],
    ],
  },
  {
    version: "0.5.0",
    date: "2026-10-14",
    summary: "量と段の入力を足した。Slider と Stepper。配布は tarball のまま。",
    rows: [
      ["@knowidea/css", "52 個にした。.ki-slider(つまみは見た目 20px、押せる所 44px 四方。キーで動いた時だけ滑り、掴んでいる間は指に付いて動く)と .ki-range(素の HTML の range)、.ki-stepper(− と + は 44px 四方で、押すと小さく沈む)を足した。"],
      ["@knowidea/ui", "52 個にした。Slider(Base UI の Slider が土台。value を配列にすると範囲。formatValue で見せ方と読み上げをそろえる)と Stepper(Base UI の NumberField が土台。format で単位を付ける。端ではその向きのボタンが押せなくなる)を足した。"],
      ["Docs", "Slider と Stepper のページ。check-pages に 2 つの操作を足した。"],
    ],
  },
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
