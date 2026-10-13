// Charts カテゴリのコンポーネント。
export const charts = [
  {
    slug: "chart", name: "Chart", imports: ["Chart", "Sparkline"],
    lead: "時系列の数値を、棒グラフか折れ線グラフで示す。通常はグレーの棒で、選択した 1 本だけをプライマリカラーにする。値は文字と表でも表示する。",
    sample: true,
    demos: [
      { fn: "Bars", title: "Bars", text: "クリックまたは矢印キーで選択すると、値と内訳が表示される。基準線には直接ラベルを付ける。値のない点は「記録なし」と表示する。", block: true },
      { fn: "Line", title: "Line", text: "値のない点があると、線が途切れる。", block: true },
      { fn: "Tiny", title: "Sparkline", text: "線と最後の点だけを描く。値は隣の数字が伝える。Stat の中でも使われる。" },
      { fn: "Toggle", title: "States", text: "ローディングと空の表示を切り替えて確認できる。", block: true },
    ],
    props: [
      ["data", "ChartPoint[]", "-", "{ key, label, detail?, value: number | null, breakdown? }。null は値のない点"],
      ["type", '"bar" | "line"', '"bar"', "棒グラフか折れ線グラフか"],
      ["ariaLabel", "string", "-", "グラフの名前(スクリーンリーダー向け)。必須"],
      ["unit", "string", "-", "単位"],
      ["height", "number", "200", "軸の高さ(px)"],
      ["reference", "{ value, label }", "-", "基準線。直接ラベルを付ける"],
      ["selectedKey / defaultSelectedKey / onSelect", "string / string / (key) => void", "-", "選択中の点(制御と非制御)"],
      ["state", '"ready" | "loading" | "empty"', '"ready"', "状態"],
      ["emptyText / loadingText / breakdownTitle", "string", '"記録なし" / "読み込み中" / "内訳"', "表示する文言"],
      ["prevLabel / nextLabel", "string", '"前の点" / "次の点"', "前後の点に移動するボタンの名前"],
    ],
    classes: [[".ki-chart", "本体。data-state: loading | empty"], [".ki-chart__readout、__plot、__svg、__col、__bar、__dot、__line、__ref、__break", "内部の要素。__col[data-selected] が選択中の点"]],
    vars: [["--color-line-strong、--color-primary、--color-primary-hover", "棒、選択中の棒、選択中かつホバー時の棒"], ["--color-line、--color-text-muted", "目盛りの線と文字"], ["--color-warn", "基準線"], ["--font-mono", "数値と目盛りのフォント"]],
    a11y: ["各点が role=\"button\"、aria-pressed、aria-label(日付と値)を持つ。矢印キー、Home、End で移動する", "選択した点の値は aria-live で読み上げ、内訳は表のように文字で表示する。色だけに頼らない", "棒 1 本の幅が 44px に満たないため、タップ領域は前後のボタン(44px)で補う"],
  },
];
