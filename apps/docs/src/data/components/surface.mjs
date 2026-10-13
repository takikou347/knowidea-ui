// Surfaces カテゴリのコンポーネント。
export const surface = [
  {
    slug: "card", name: "Card", imports: ["Card"],
    lead: "見出し、メタ情報、本文、操作を 1 つの枠にまとめる。入れ子にはしない。リンクのあるカードでは、見出しのリンクのクリック領域が枠全体に広がる。",
    sample: true,
    demos: [
      { fn: "Basic", title: "Clickable and with actions", text: "メタ情報は名前と値のペアで、2 列に並ぶ。値は等幅で表示する。", block: true },
      { fn: "WithBadge", title: "Heading level", text: "見出しのレベルは headingLevel で合わせる。" },
    ],
    props: [
      ["title", "ReactNode", "-", "見出し。必須"],
      ["subtitle", "ReactNode", "-", "見出しの下に表示する小さな文(等幅)。識別子や日時など"],
      ["badge", "ReactNode", "-", "見出しの右に置く要素。Status や Badge"],
      ["children", "ReactNode", "-", "本文"],
      ["meta", "{ label, value }[]", "-", "名前と値のペア。2 列で並び、値は等幅"],
      ["actions", "ReactNode", "-", "下部の操作。Button など。カード全体のリンクより前面に表示される"],
      ["href / onOpen", "string / () => void", "-", "指定すると見出しがリンク(ボタン)になり、カード全体がクリック領域になる"],
      ["headingLevel", "2 | 3 | 4 | 5 | 6", "3", "見出し要素(h)のレベル"],
      ["state / error", '"ready" | "loading" | "error" / string', '"ready"', "ローディング(破線の枠)、エラー(エラーの枠と理由)"],
      ["disabled", "boolean", "false", "操作できない。背景が暗くなる"],
      ["as", "ElementType", '"article"', "描画する要素"],
    ],
    classes: [
      [".ki-card", "本体。data-interactive、data-state、data-disabled"],
      [".ki-card__header、__heading、__title、__subtitle、__link", "見出し部分。__link の ::after が枠全体に広がる"],
      [".ki-card__body、__meta、__actions、__error", "本文、メタ情報、操作、エラーの理由"],
    ],
    vars: [["--color-surface、--color-line、--color-line-strong", "背景、枠線、ホバー時の枠線"], ["--color-error、--color-surface-2", "エラー時の枠線、無効時の背景"], ["--radius-3、--space-3、--space-4", "角丸、間隔、余白"], ["--color-focus", "フォーカスリング"]],
    html: `<article class="ki-card" data-interactive>
  <header class="ki-card__header">
    <div class="ki-card__heading"><h3 class="ki-card__title"><a class="ki-card__link" href="#">エクスポート設定</a></h3></div>
  </header>
  <div class="ki-card__body"><p>見出しがリンクで、クリック領域はカード全体に広がる。</p></div>
</article>`,
    a11y: ["<article> と見出しを使う。リンクは見出しの中に 1 つだけ置き、読み上げの重複を避ける", "操作は ::after より前面(z-index)に置き、リンクとは別に操作できる", "フォーカスはカード全体に 2px のリングで表示される(:has(:focus-visible))"],
  },
  {
    slug: "accordion", name: "Accordion", imports: ["Accordion"],
    lead: "見出しの行を押して、内容を開閉する。長い説明を、読みたい人だけが開ける形にする。",
    demos: [
      { fn: "Basic", title: "Single", text: "デフォルトでは、1 つを開くとほかは閉じる。", block: true },
      { fn: "Multiple", title: "Multiple", text: "multiple を指定すると、同時に複数を開ける。", block: true },
    ],
    props: [
      ["items", "{ value, title, content, disabled? }[]", "-", "項目"],
      ["defaultValue / value", "string[]", "-", "最初に開く項目(非制御)、開く項目(制御)"],
      ["onValueChange", "(value: string[]) => void", "-", "開閉が変わったときに呼ばれる"],
      ["multiple", "boolean", "false", "複数の項目を同時に開く"],
      ["headingLevel", "2 | 3 | 4 | 5 | 6", "3", "見出し要素(h)のレベル"],
    ],
    classes: [[".ki-accordion", "全体の枠"], [".ki-accordion__item、__header、__trigger、__panel", "項目、見出し、開閉ボタン(44px)、内容のパネル"]],
    vars: [["--color-surface、--color-line、--color-surface-2", "背景、区切り線、ホバー時の背景"], ["--color-text-muted", "矢印"], ["--motion-duration-state", "矢印の回転アニメーション(prefers-reduced-motion で止まる)"]],
    a11y: ["見出し(role=\"heading\")の中のボタンで開閉する。aria-expanded が付く", "矢印キーで見出しの間を移動し、Home と End で先頭と末尾に移動する"],
  },
  {
    slug: "selection-bar", name: "SelectionBar", imports: ["SelectionBar", "Button"],
    lead: "選択した項目に対する一括操作をまとめたバー。選択件数、操作、選択の解除ボタンを持つ。画面の下部に固定することもできる。",
    demos: [{ fn: "Basic", title: "Basic", text: "0 件のときに操作を無効にするのは、呼び出し側の役割。", block: true }],
    props: [
      ["count", "number", "-", "選択数。必須"],
      ["countLabel", "string", '"{count} 件を選択中"', "件数の文言。{count} が数に置き換わる"],
      ["note", "ReactNode", "-", "件数の下に表示する 1 行(注意や進捗)。state が error のときはエラーの理由"],
      ["actions", "ReactNode", "-", "一括操作。Button を並べる"],
      ["onClear / clearLabel", "() => void / string", '- / "選択を解除"', "渡すと選択解除ボタンが表示される"],
      ["sticky", "boolean", "false", "画面の下部に固定する(影が付く)"],
      ["whenEmpty / emptyHint", '"hint" | "hide" / string', '"hint"', "0 件のときに案内を表示するか、何も描画しないか"],
      ["state", '"ready" | "loading" | "error"', '"ready"', "処理中、エラー"],
      ["label", "string", '"選択した項目への操作"', "領域の名前(スクリーンリーダー向け)"],
    ],
    classes: [[".ki-selbar", "本体。data-sticky、data-state"], [".ki-selbar__head、__summary、__count、__note、__actions", "内部の要素"]],
    vars: [["--color-surface、--color-line-strong", "背景、枠線"], ["--shadow-pop", "固定表示時の影"], ["--color-error", "エラー時の枠線と文字色"]],
    a11y: ["section に aria-label を付ける。件数や進捗は role=\"status\" で読み上げる", "0 件のときは操作を disabled にして、理由を案内の文章で伝える"],
  },
];
