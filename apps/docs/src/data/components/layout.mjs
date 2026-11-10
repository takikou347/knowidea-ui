// Layout カテゴリのコンポーネント。
export const layout = [
  {
    slug: "stack", name: "Stack", imports: ["Stack"],
    lead: "子要素を 1 方向に並べ、間隔をそろえる。縦(デフォルト)と横を選べる。間隔は余白のステップ(1〜7)で渡す。",
    demos: [
      { fn: "Column", title: "Column", text: "デフォルトの向き。間隔は gap で指定する(デフォルトは 3 = 12px)。" },
      { fn: "Row", title: "Row", text: "wrap で折り返し、align で交差方向の位置をそろえる。", block: true },
      { fn: "Between", title: "Space between", text: "justify=\"between\" を指定すると、両端に寄せて配置する。", block: true },
    ],
    props: [
      ["direction", '"column" | "row"', '"column"', "縦か横か"],
      ["gap", "1 | 2 | 3 | 4 | 5 | 6 | 7", "3", "余白のステップ(--space-N)。4、8、12、16、24、32、48px"],
      ["align", '"start" | "center" | "end" | "stretch" | "baseline"', '"stretch"', "交差方向の位置"],
      ["justify", '"start" | "center" | "end" | "between"', '"start"', "並ぶ方向の位置"],
      ["wrap", "boolean", "false", "収まらないときに折り返す"],
      ["as", "ElementType", '"div"', "描画する要素(ul、section など)"],
    ],
    classes: [[".ki-stack", "本体。data-direction=\"row\"、data-wrap"], ["--ki-gap、--ki-align、--ki-justify", "間隔と位置(style で渡す)"]],
    vars: [["--space-1 〜 --space-7", "gap のステップ"]],
    html: `<div class="ki-stack" style="--ki-gap: var(--space-3)">
  <p>1</p><p>2</p><p>3</p>
</div>`,
    a11y: ["並べるだけのコンポーネントで、読み上げの順序は子要素の並び順のまま。CSS で見た目の順序だけを入れ替えない"],
  },
  {
    slug: "grid", name: "Grid", imports: ["Grid"],
    lead: "子要素をグリッドに並べる。列数を指定するか、1 つあたりの最小幅を指定して自動的に詰める。",
    demos: [
      { fn: "Fixed", title: "Fixed columns", text: "スマホの幅(600px 未満)では 1 列になる。keepColumns を指定すると、列数を維持する。", block: true },
      { fn: "Auto", title: "Auto-fit", text: "minItemWidth(px)ごとに、収まるだけ並べる。", block: true },
    ],
    props: [
      ["columns", "number", "-", "列数を固定する。指定しなければ minItemWidth から自動的に決まる"],
      ["minItemWidth", "number", "240", "columns がないときの、1 つあたりの最小幅(px)"],
      ["keepColumns", "boolean", "false", "狭い幅でも columns の列数を維持する"],
      ["gap", "1 | 2 | 3 | 4 | 5 | 6 | 7", "3", "余白のステップ"],
      ["as", "ElementType", '"div"', "描画する要素"],
    ],
    classes: [[".ki-grid", "本体。data-columns、data-keep"], ["--ki-cols、--ki-min、--ki-gap", "列数、最小幅、間隔"]],
    vars: [["--space-1 〜 --space-7", "gap のステップ"]],
    html: `<div class="ki-grid" style="--ki-min: 200px">
  <div>1</div><div>2</div><div>3</div>
</div>`,
    a11y: ["並べるだけのコンポーネント。読み上げの順序は子要素の並び順のまま"],
  },
  {
    slug: "featured-list", name: "FeaturedList", imports: ["FeaturedList", "Jacket"],
    lead: "大きな 1 つと小さな行で並べる。新着のように、一番新しい物、一番大事な物を大きくして、ほかを小さくする時に使う。同じ大きさで並べたい時は Grid を使う。持つのは配置だけで、題や日付や画像は子で渡す。Jacket を置く時、Jacket の題字と大きな題に同じ言葉を入れない。Jacket は番組や連載の名、大きな題は回の題。",
    demos: [
      { fn: "Basic", title: "Basic", text: "1 つ目の子が大きな 1 つ、残りが行。入れ物の幅が 720px 以上なら左に大きな 1 つ、右に行を縦に並べる。それより狭ければ大きな 1 つの下に行を積む。Jacket の題字は番組や連載の名で、大きな題は回の題。日付はサンプル。", block: true },
      { fn: "Narrow", title: "Narrow container", text: "style で幅を 400px に絞ると、画面が広くても縦に積む。切り替えは画面でなく、外側の入れ物(.ki-featured)の幅で決まる。", block: true },
      { fn: "Single", title: "One item", text: "項目が 1 つの時は大きな 1 つだけを出す。空の右の列は作らない。", block: true },
    ],
    props: [
      ["children", "ReactNode", "-", "並べる中身。1 つ目が大きな 1 つ、残りが行。1 つにつき <li> を 1 つ描く。0 の時は何も描かない"],
      ["className、style", "div の属性", "-", "外側の入れ物(.ki-featured)に渡る。幅を絞るのにも使える"],
      ["aria-*、id ほか", "ul の属性", "-", "内側の <ul> に渡る。読み込み中は aria-busy を付ける"],
    ],
    classes: [
      [".ki-featured", "外側の入れ物(<div>)。container-type: inline-size で、この幅が 720px 以上なら 2 列。React は自動で包む"],
      [".ki-featured__list", "本体の <ul>。--ki-rows に行の数(大きな 1 つを除く)を渡す。React は自動で入れる"],
      ["li[data-lead]", "大きな 1 つ。題だけ display-2 の大きさになる"],
      [".ki-featured__media", "画像の面。角丸 0。中に img や Jacket を置く"],
      [".ki-featured__title", "題。中に <a> を置くと、行全体(44px 以上)が押せる所になる(::after)"],
      [".ki-featured__meta", "題に添える 1 行(日付、種類)。日付は <time> に入れると等幅になる。中の a と button は行全体のリンクの上に出て、押せる"],
    ],
    vars: [
      ["--ki-rows", "行の数。2 列の時の行の数に使う"],
      ["--font-size-display-2、--font-display", "大きな 1 つの題"],
      ["--color-line", "行の上の線。区切りはこの線だけ"],
      ["--size-hit", "行の高さの下限(44px)"],
    ],
    html: `<div class="ki-featured">
<ul class="ki-featured__list" style="--ki-rows: 2">
  <li data-lead>
    <div class="ki-featured__title"><a href="article-a.html">大きな 1 つの題</a></div>
    <p class="ki-featured__meta"><time datetime="2026-10-20">2026-10-20</time><span>記事</span></p>
  </li>
  <li>
    <div class="ki-featured__title"><a href="article-b.html">行の題</a></div>
    <p class="ki-featured__meta"><time datetime="2026-10-17">2026-10-17</time></p>
  </li>
  <li>
    <div class="ki-featured__title"><a href="article-c.html">行の題</a></div>
  </li>
</ul>
</div>`,
    a11y: ["<ul> と <li> の並びのまま読み上げる。読み上げの順序は子の並び順。CSS で見た目の順序だけを入れ替えない", "押せる所は題のリンクで、行全体(44px 以上)。飛び先の無いリンクは作らない", "区切りは線 1 本で、色だけで伝えない。動きは持たない", "題に添える行の中にリンクやボタンを置いても、行全体のリンクの上に出るので別に押せる。その押せる所も 44px 以上にする", "meta にリンクやボタンを置くと、その 1 行が 44px の高さになり、行が少し高くなる(押せる所は meta の中に収まり、題と次の行にかぶらない)"],
  },
  {
    slug: "container", name: "Container", imports: ["Container"],
    lead: "コンテンツの幅を制限し、左右に余白(16px)を付けて中央に配置する。",
    demos: [{ fn: "Sizes", title: "Sizes", text: "sm は 640px、md(デフォルト)は 960px、lg は 1200px。fluid は幅を制限しない。", block: true }],
    props: [
      ["size", '"sm" | "md" | "lg" | "fluid"', '"md"', "最大幅"],
      ["as", "ElementType", '"div"', "描画する要素(main など)"],
    ],
    classes: [[".ki-container", "本体。data-size: sm | lg | fluid"]],
    vars: [["--space-4", "左右の余白"]],
    html: `<div class="ki-container" data-size="sm">…</div>`,
    a11y: ["幅を制限するだけのコンポーネント。main など意味のある要素にしたいときは、as で変更する"],
  },
  {
    slug: "divider", name: "Divider", imports: ["Divider"],
    demos: [{ fn: "Basic", title: "Horizontal, labeled, vertical", text: "区切りは 1 本の線で表す。文章の切れ目に語を入れることもできる。" }],
    a11y: ["横方向は <hr> で描画する。ラベル付きと縦方向は role=\"separator\" を使う", "線のコントラスト比が 3:1 以上必要な場面では、data-strong を指定する"],
  },
  {
    slug: "app-shell", name: "AppShell", imports: ["AppShell", "AppBar"],
    lead: "画面の枠。画面の切り替えを、スマホと iPad(1024px 未満)では下に、PC(1024px 以上)では左に出す。中身は <main> に入る。切り替えの項目は 3〜5 個にする。",
    demos: [
      { fn: "Basic", title: "Basic", text: "幅を変えると、切り替えが下と左で入れ替わる。見本の中に置くので minHeight で高さを絞っている。使う時は既定の 100dvh のままにする。", block: true },
    ],
    props: [
      ["items", "NavItem[]", "-", "画面の切り替え。{ id, label, icon?, href, count?, disabled? }"],
      ["current", "string", "-", "今いる所の id。aria-current が付く"],
      ["brand", "{ name, sub? }", "-", "左の切り替えの上に出す名前(PC の幅だけ)"],
      ["header", "ReactNode", "-", "中身の上に置く物。AppBar など"],
      ["sideFooter", "ReactNode", "-", "左の切り替えの下に置く物(PC の幅だけ)"],
      ["label", "string", '"画面の切り替え"', "切り替えの nav の名前"],
      ["minHeight", "string", '"100dvh"', "枠の最小の高さ"],
    ],
    classes: [[".ki-shell", "枠"], [".ki-shell__side、__bottom", "左と下の切り替え。幅で片方だけが出る"], [".ki-shell__body、__main", "中身の側と <main>"], ["--ki-shell-height", "枠の最小の高さ"]],
    vars: [["--color-bg、--color-text", "枠の色"], ["--space-7", "左の切り替えの幅(5 倍)"]],
    a11y: ["切り替えは左と下の 2 つを描き、幅で片方だけを見せる。見えない方は display: none なので、読み上げにも Tab にも出ない", "中身は <main> に入る。1 ページに AppShell は 1 つだけ置く", "今いる所の項目に aria-current=\"page\" が付く"],
  },
  {
    slug: "list-detail", name: "ListDetail", imports: ["ListDetail", "List"],
    lead: "一覧と詳細を並べる。PC(1024px 以上)と iPad の横では 2 列、スマホ(横向きも)と iPad の縦では 1 列になり、一覧か詳細の片方を出す。切り替えは CSS だけで決まるので、幅が変わっても選んだ物は残る。",
    demos: [
      { fn: "Basic", title: "Basic", text: "一覧の行を押すと詳細が替わる。1 列の時は詳細に移り、一覧へ戻るボタンが出る。", block: true },
      { fn: "Unselected", title: "Nothing selected", text: "何も選んでいない時、2 列では詳細の側に empty を出す。", block: true },
    ],
    props: [
      ["list", "ReactNode", "-", "一覧。List や Table など"],
      ["detail", "ReactNode", "-", "選んだ物の詳細。無ければ empty を出す"],
      ["showDetail", "boolean", "false", "1 列の時に、一覧でなく詳細を出す"],
      ["onBack", "() => void", "-", "1 列で詳細を出している時の、一覧へ戻るボタン。渡した時だけ出る"],
      ["backLabel", "string", '"一覧へ戻る"', "戻るボタンの文字"],
      ["empty", "ReactNode", "-", "2 列で何も選んでいない時に、詳細の側に出す物"],
      ["listLabel / detailLabel", "string", '"一覧" / "詳細"', "読み上げの名前"],
    ],
    classes: [[".ki-listdetail", "本体。data-show: list | detail"], [".ki-listdetail__list、__detail", "一覧と詳細の <section>"], [".ki-listdetail__back、__empty", "戻るボタンの行、何も選んでいない時の面"]],
    vars: [["--space-4、--space-5", "列の間"]],
    a11y: ["一覧と詳細は、名前の付いた <section> になる", "1 列で片方を隠す時は display: none なので、隠れた側は読み上げにも Tab にも出ない", "1 列で詳細に移った時の focus の移し方は、使う側が決める(詳細の見出しに移すと、読み上げが続きから始まる)"],
  },
];
