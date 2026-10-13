// グラフの部品。
export const charts = [
  {
    slug: "chart", name: "Chart", ja: "グラフ", imports: ["Chart", "Sparkline"],
    lead: "時間に沿った数を、棒か折れ線で示す。灰色の棒と、選んだ 1 本だけ主の色。値は字と表にも出す。",
    sample: true,
    demos: [
      { fn: "Bars", title: "棒", text: "押すか矢印キーで選ぶと、値と内訳が出る。基準の線には直接ラベルを付ける。数の無い点は「記録なし」と出す。", block: true },
      { fn: "Line", title: "折れ線", text: "数の無い点があれば線が切れる。", block: true },
      { fn: "Tiny", title: "Sparkline", text: "線と最後の点だけ。値は隣の数が伝える。Stat の中でも使われる。" },
      { fn: "Toggle", title: "状態", text: "読み込みと空の見え方。", block: true },
    ],
    props: [
      ["data", "ChartPoint[]", "-", "{ key, label, detail?, value: number | null, breakdown? }。null は数の無い点"],
      ["type", '"bar" | "line"', '"bar"', "棒か折れ線"],
      ["ariaLabel", "string", "-", "グラフの名前(読み上げ)。必須"],
      ["unit", "string", "-", "単位"],
      ["height", "number", "200", "軸の高さ(px)"],
      ["reference", "{ value, label }", "-", "基準の線。直接ラベルを付ける"],
      ["selectedKey / defaultSelectedKey / onSelect", "string / string / (key) => void", "-", "選んだ点(制御と非制御)"],
      ["state", '"ready" | "loading" | "empty"', '"ready"', "状態"],
      ["emptyText / loadingText / breakdownTitle", "string", '"記録なし" / "読み込み中" / "内訳"', "文"],
      ["prevLabel / nextLabel", "string", '"前の点" / "次の点"', "前後の点へ移るボタンの名前"],
    ],
    classes: [[".ki-chart", "本体。data-state: loading | empty"], [".ki-chart__readout、__plot、__svg、__col、__bar、__dot、__line、__ref、__break", "中の部品。__col[data-selected] が選んだ点"]],
    vars: [["--color-line-strong、--color-primary、--color-primary-hover", "棒、選んだ棒、選んで hover"], ["--color-line、--color-text-muted", "目盛りの線と字"], ["--color-warn", "基準の線"], ["--font-mono", "数値と目盛り"]],
    a11y: ["各点が role=\"button\" と aria-pressed、aria-label(日付と値)を持つ。矢印キー、Home、End で動く", "選んだ点の値は aria-live で読み上げ、内訳は表のように字で出す。色だけに頼らない", "押せる範囲は前後のボタンが 44px で代わる(30 本の棒は 44px に収まらない)"],
  },
];
