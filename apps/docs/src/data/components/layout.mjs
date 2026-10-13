// レイアウトの部品。
export const layout = [
  {
    slug: "stack", name: "Stack", ja: "並べる", imports: ["Stack"],
    lead: "子を 1 方向に並べ、間隔をそろえる。縦(既定)と横。間隔は余白の段(1〜7)で渡す。",
    demos: [
      { fn: "Column", title: "縦", text: "既定。間隔は gap(既定 3 = 12px)。" },
      { fn: "Row", title: "横", text: "wrap で折り返し、align で縦の位置をそろえる。", block: true },
      { fn: "Between", title: "両端", text: "justify=\"between\" で両端に寄せる。", block: true },
    ],
    props: [
      ["direction", '"column" | "row"', '"column"', "縦か横"],
      ["gap", "1 | 2 | 3 | 4 | 5 | 6 | 7", "3", "余白の段(--space-N)。4、8、12、16、24、32、48px"],
      ["align", '"start" | "center" | "end" | "stretch" | "baseline"', '"stretch"', "交差する方向の位置"],
      ["justify", '"start" | "center" | "end" | "between"', '"start"', "並ぶ方向の位置"],
      ["wrap", "boolean", "false", "入りきらなければ折り返す"],
      ["as", "ElementType", '"div"', "描く要素(ul、section など)"],
    ],
    classes: [[".ki-stack", "本体。data-direction=\"row\"、data-wrap"], ["--ki-gap、--ki-align、--ki-justify", "間隔と位置(style で渡す)"]],
    vars: [["--space-1 〜 --space-7", "gap の段"]],
    html: `<div class="ki-stack" style="--ki-gap: var(--space-3)">
  <p>1</p><p>2</p><p>3</p>
</div>`,
    a11y: ["並べるだけの部品で、読み上げの順は子の並びのまま。見た目の順だけを CSS で入れ替えない"],
  },
  {
    slug: "grid", name: "Grid", ja: "格子", imports: ["Grid"],
    lead: "子を格子に並べる。列の数を決めるか、1 つの最小の幅で自動に詰める。",
    demos: [
      { fn: "Fixed", title: "列の数を決める", text: "狭い幅(600px 以下)では 1 列になる。keepColumns で保つ。", block: true },
      { fn: "Auto", title: "最小の幅で自動", text: "minItemWidth(px)ごとに、入るだけ並ぶ。", block: true },
    ],
    props: [
      ["columns", "number", "-", "列の数を固定する。無ければ minItemWidth で自動"],
      ["minItemWidth", "number", "240", "columns が無いとき、1 つの最小の幅(px)"],
      ["keepColumns", "boolean", "false", "columns を狭い幅でも保つ"],
      ["gap", "1 | 2 | 3 | 4 | 5 | 6 | 7", "3", "余白の段"],
      ["as", "ElementType", '"div"', "描く要素"],
    ],
    classes: [[".ki-grid", "本体。data-columns、data-keep"], ["--ki-cols、--ki-min、--ki-gap", "列の数、最小の幅、間隔"]],
    vars: [["--space-1 〜 --space-7", "gap の段"]],
    html: `<div class="ki-grid" style="--ki-min: 200px">
  <div>1</div><div>2</div><div>3</div>
</div>`,
    a11y: ["並べるだけの部品。読み上げの順は子の並びのまま"],
  },
  {
    slug: "container", name: "Container", ja: "幅を絞る", imports: ["Container"],
    lead: "中身の幅を絞り、左右に余白(16px)を付けて中央に置く。",
    demos: [{ fn: "Sizes", title: "幅", text: "sm は 640px、md(既定)は 960px、lg は 1200px、fluid は絞らない。", block: true }],
    props: [
      ["size", '"sm" | "md" | "lg" | "fluid"', '"md"', "最大の幅"],
      ["as", "ElementType", '"div"', "描く要素(main など)"],
    ],
    classes: [[".ki-container", "本体。data-size: sm | lg | fluid"]],
    vars: [["--space-4", "左右の余白"]],
    html: `<div class="ki-container" data-size="sm">…</div>`,
    a11y: ["幅を絞るだけの部品。main など、意味のある要素に as で変える"],
  },
  {
    slug: "divider", name: "Divider", ja: "区切り", imports: ["Divider"],
    demos: [{ fn: "Basic", title: "横、ラベル付き、縦", text: "区切りは 1 本の線。文の切れ目に語を入れることもできる。" }],
    a11y: ["横は <hr>。ラベル付きと縦は role=\"separator\"", "線は 3:1 以上のコントラストが要る所では data-strong にする"],
  },
];
