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
      { fn: "Fixed", title: "Fixed columns", text: "幅が狭い場合(600px 以下)は 1 列になる。keepColumns を指定すると、列数を維持する。", block: true },
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
    lead: "大きな 1 つと小さな行で並べる。新着のように、一番新しい物、一番大事な物を大きくして、ほかを小さくする時に使う。同じ大きさで並べたい時は Grid を使う。持つのは配置だけで、題や日付や画像は子で渡す。",
    demos: [
      { fn: "Basic", title: "Basic", text: "1 つ目の子が大きな 1 つ、残りが行。720px 以上の画面では左に大きな 1 つ、右に行を縦に並べる。それより狭ければ大きな 1 つの下に行を積む。日付はサンプル。", block: true },
      { fn: "Single", title: "One item", text: "項目が 1 つの時は大きな 1 つだけを出す。空の右の列は作らない。", block: true },
    ],
    props: [
      ["children", "ReactNode", "-", "並べる中身。1 つ目が大きな 1 つ、残りが行。1 つにつき <li> を 1 つ描く。0 の時は何も描かない"],
      ["className、style、aria-*", "ul の属性", "-", "そのまま <ul> に渡る。読み込み中は aria-busy を付ける"],
    ],
    classes: [
      [".ki-featured", "本体の <ul>。--ki-rows に行の数(大きな 1 つを除く)を渡す。React は自動で入れる"],
      ["li[data-lead]", "大きな 1 つ。題だけ display-2 の大きさになる"],
      [".ki-featured__media", "画像の面。角丸 0。中に img や Jacket を置く"],
      [".ki-featured__title", "題。中に <a> を置くと、高さ 44px 以上の押せる所になる"],
      [".ki-featured__meta", "題に添える 1 行(日付、種類)。日付は <time> に入れると等幅になる"],
    ],
    vars: [
      ["--ki-rows", "行の数。2 列の時の行の数に使う"],
      ["--font-size-display-2、--font-display", "大きな 1 つの題"],
      ["--color-line", "行の上の線。区切りはこの線だけ"],
      ["--size-hit", "題のリンクの高さ(44px)"],
    ],
    html: `<ul class="ki-featured" style="--ki-rows: 2">
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
</ul>`,
    a11y: ["<ul> と <li> の並びのまま読み上げる。読み上げの順序は子の並び順。CSS で見た目の順序だけを入れ替えない", "押せる所は題のリンクで、高さ 44px 以上。飛び先の無いリンクは作らない", "区切りは線 1 本で、色だけで伝えない。動きは持たない"],
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
];
