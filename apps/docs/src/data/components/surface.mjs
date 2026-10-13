// 面の部品。
export const surface = [
  {
    slug: "card", name: "Card", ja: "カード", imports: ["Card"],
    lead: "見出し、メタ、本文、操作を 1 つの枠にまとめる。入れ子にしない。押せるカードは、見出しのリンクが枠全体に広がる。",
    sample: true,
    demos: [
      { fn: "Basic", title: "押せるカードと、操作を持つカード", text: "メタは名前と値の組で、2 列に並ぶ。値は等幅。", block: true },
      { fn: "WithBadge", title: "見出しの段", text: "見出しの h の段は headingLevel で合わせる。" },
    ],
    props: [
      ["title", "ReactNode", "-", "見出し。必須"],
      ["subtitle", "ReactNode", "-", "見出しの下の小さな文(等幅)。識別子や日時"],
      ["badge", "ReactNode", "-", "見出しの右に置く物。Status や Badge"],
      ["children", "ReactNode", "-", "本文"],
      ["meta", "{ label, value }[]", "-", "名前と値の組。2 列。値は等幅"],
      ["actions", "ReactNode", "-", "下の操作。Button など。カード全体のリンクの上に出る"],
      ["href / onOpen", "string / () => void", "-", "あると見出しがリンク(ボタン)になり、押せる範囲がカード全体に広がる"],
      ["headingLevel", "2 | 3 | 4 | 5 | 6", "3", "見出しの h の段"],
      ["state / error", '"ready" | "loading" | "error" / string', '"ready"', "読み込み(破線の枠)、失敗(失敗の枠と理由)"],
      ["disabled", "boolean", "false", "押せない。背景が沈む"],
      ["as", "ElementType", '"article"', "描く要素"],
    ],
    classes: [
      [".ki-card", "本体。data-interactive、data-state、data-disabled"],
      [".ki-card__header、__heading、__title、__subtitle、__link", "見出しの部分。__link の ::after が枠全体に広がる"],
      [".ki-card__body、__meta、__actions、__error", "本文、メタ、操作、失敗の理由"],
    ],
    vars: [["--color-surface、--color-line、--color-line-strong", "面、枠、hover の枠"], ["--color-error、--color-surface-2", "失敗の枠、無効の面"], ["--radius-3、--space-3、--space-4", "角丸、間隔、余白"], ["--color-focus", "focus の輪"]],
    html: `<article class="ki-card" data-interactive>
  <header class="ki-card__header">
    <div class="ki-card__heading"><h3 class="ki-card__title"><a class="ki-card__link" href="#">書き出しの設定</a></h3></div>
  </header>
  <div class="ki-card__body"><p>見出しがリンクで、押せる範囲はカード全体に広がる。</p></div>
</article>`,
    a11y: ["<article> と見出し。リンクは見出しの中の 1 つだけにして、読み上げの重複を避ける", "操作は ::after の上(z-index)に出し、リンクとは別に押せる", "focus はカード全体に 2px の輪で出る(:has(:focus-visible))"],
  },
  {
    slug: "accordion", name: "Accordion", ja: "アコーディオン", imports: ["Accordion"],
    lead: "見出しの行を押して、中身を開閉する。長い説明を、読みたい人だけが開く形にする。",
    demos: [
      { fn: "Basic", title: "1 つだけ開く", text: "既定では 1 つを開くと、ほかが閉じる。", block: true },
      { fn: "Multiple", title: "複数を開く", text: "multiple で同時に開ける。", block: true },
    ],
    props: [
      ["items", "{ value, title, content, disabled? }[]", "-", "項目"],
      ["defaultValue / value", "string[]", "-", "最初に開く項目、制御"],
      ["onValueChange", "(value: string[]) => void", "-", "開閉の変化"],
      ["multiple", "boolean", "false", "複数を同時に開く"],
      ["headingLevel", "2 | 3 | 4 | 5 | 6", "3", "見出しの h の段"],
    ],
    classes: [[".ki-accordion", "全体の枠"], [".ki-accordion__item、__header、__trigger、__panel", "項目、見出し、開閉のボタン(44px)、中身"]],
    vars: [["--color-surface、--color-line、--color-surface-2", "面、区切り、hover"], ["--color-text-muted", "矢印"], ["--motion-duration-state", "矢印の向きが変わる動き(reduced-motion で止まる)"]],
    a11y: ["見出し(role=\"heading\")の中のボタンが開閉。aria-expanded が付く", "矢印キーで見出しの間を移り、Home と End で先頭と末尾へ"],
  },
  {
    slug: "selection-bar", name: "SelectionBar", ja: "一括の操作の帯", imports: ["SelectionBar", "Button"],
    lead: "選んだ物への一括の操作をまとめる帯。件数、操作、選びの解除を持つ。画面の下に貼り付けることもできる。",
    demos: [{ fn: "Basic", title: "基本", text: "0 件のとき操作を押せなくするのは、呼び出し側の役目。", block: true }],
    props: [
      ["count", "number", "-", "選んだ数。必須"],
      ["countLabel", "string", '"{count} 件を選んでいる"', "件数の文。{count} が数になる"],
      ["note", "ReactNode", "-", "件数の下の 1 行(注意、進み方)。state が error なら失敗の理由"],
      ["actions", "ReactNode", "-", "一括の操作。Button を並べる"],
      ["onClear / clearLabel", "() => void / string", '- / "選びを解く"', "渡すと選びを解くボタンが出る"],
      ["sticky", "boolean", "false", "画面の下に貼り付く(影が付く)"],
      ["whenEmpty / emptyHint", '"hint" | "hide" / string', '"hint"', "0 件のとき案内を出すか、何も描かないか"],
      ["state", '"ready" | "loading" | "error"', '"ready"', "処理中、失敗"],
      ["label", "string", '"選んだ物への操作"', "領域の名前(読み上げ)"],
    ],
    classes: [[".ki-selbar", "本体。data-sticky、data-state"], [".ki-selbar__head、__summary、__count、__note、__actions", "中の部品"]],
    vars: [["--color-surface、--color-line-strong", "面、枠"], ["--shadow-pop", "貼り付いたときの影"], ["--color-error", "失敗の枠と文"]],
    a11y: ["section に aria-label。件数や進み方は role=\"status\" で読み上げる", "操作は 0 件のとき disabled にして、理由を案内の文で書く"],
  },
];
