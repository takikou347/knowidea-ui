// 入力の部品。demos の fn は src/demos/<slug>.tsx の export 名。
export const input = [
  {
    slug: "button", name: "Button", ja: "ボタン", imports: ["Button"],
    demos: [
      { fn: "Variants", title: "種類", text: "主は 1 画面に 1 つ。副は並べて使える。静かな(quiet)ボタンは枠も面も無い。" },
      { fn: "Sizes", title: "大きさ", text: "標準は 44px、大きいのは 52px。どちらも押せる大きさ。" },
      { fn: "WithIcon", title: "アイコン付き", text: "アイコンはラベルの前。アイコンだけのときは IconButton を使う。" },
    ],
    a11y: [
      "<button> で描く。Enter と Space で押せる。ナビゲーションは Link を使う",
      "loading の間は aria-busy が付き、押せない。読み上げ用の文は loadingLabel",
      "focus の輪は 2px で、隣の色と 3:1 以上",
      "disabled は Tab の順から外れる。理由が要るときは近くに文で書く",
    ],
  },
  {
    slug: "icon-button", name: "IconButton", ja: "アイコンボタン", imports: ["IconButton", "Icon"],
    demos: [
      { fn: "Variants", title: "種類" },
      { fn: "Large", title: "大きいボタン", text: "標準も大きいも、押せる範囲は 44px 以上。" },
    ],
    a11y: [
      "label が必須で、aria-label になる。アイコンだけでは名前が伝わらない",
      "意味が分かりにくいときは Tooltip を添える(Tooltip は補足で、名前の代わりにしない)",
    ],
  },
  {
    slug: "text-field", name: "TextField", ja: "テキストの欄", imports: ["TextField"],
    lead: "ラベル、入力、補足、誤りを 1 つにした欄。1 行でも複数行でも、同じ形で書ける。",
    demos: [
      { fn: "Basic", title: "1 行", text: "必須のしるしと補足を付ける。" },
      { fn: "Multiline", title: "複数行", text: "multiline で Textarea に切り替わる。" },
    ],
    props: [
      ["label", "ReactNode", "-", "ラベル。必須"],
      ["hint", "ReactNode", "-", "補足。入力の前に知っておくこと"],
      ["error", "ReactNode", "-", "誤り。あると失敗になり、理由が欄の下に出て、aria-invalid が付く"],
      ["multiline", "boolean", "false", "複数行(Textarea)にする"],
      ["rows", "number", "3", "multiline のときの行数"],
      ["loading", "boolean", "false", "右端に回転を出す(1 行のみ)"],
      ["numeric", "boolean", "false", "等幅の数字"],
      ["required / disabled", "boolean", "false", "必須(ラベルに「必須」が付く)、無効"],
      ["...input", "-", "-", "type、value、defaultValue、onChange、placeholder など input の属性"],
    ],
    classes: [
      [".ki-field", "欄の全体。Field と同じ"],
      [".ki-field__label、__hint、__error、__required", "ラベル、補足、誤り、必須のしるし"],
      [".ki-input、.ki-textarea", "中の入力"],
    ],
    vars: [
      ["--color-text、--color-text-muted", "ラベル、補足"],
      ["--color-error", "誤りの文と枠"],
      ["--color-surface、--color-line-strong", "入力の面と枠"],
      ["--size-hit、--radius-2", "入力の高さ(44px)、角丸"],
    ],
    html: `<div class="ki-field">
  <label class="ki-field__label" for="tf1">名前<span class="ki-field__required">必須</span></label>
  <input id="tf1" class="ki-input" placeholder="例: sample-name" aria-describedby="tf1-h" />
  <p id="tf1-h" class="ki-field__hint">英小文字とハイフンで書く</p>
</div>`,
    a11y: [
      "ラベルは <label> で入力に結ぶ。placeholder をラベルの代わりにしない",
      "補足は aria-describedby で結ぶ。誤りは入力の下に出し、色だけでなくアイコンと文で示す",
      "必須は「必須」の文字で示す(色や * だけにしない)",
    ],
  },
  {
    slug: "input", name: "Input", ja: "入力", imports: ["Input"],
    demos: [
      { fn: "Basic", title: "基本", text: "名前は Field のラベルか aria-label で必ず付ける。" },
      { fn: "Numeric", title: "数字", text: "数字は等幅で出せる(numeric)。" },
    ],
    a11y: ["名前が無い入力は作らない。Field か TextField を使うか、aria-label を付ける", "invalid は aria-invalid になる。理由は近くの文で書く"],
  },
  {
    slug: "textarea", name: "Textarea", ja: "複数行の入力", imports: ["Textarea"],
    demos: [{ fn: "Basic", title: "基本" }],
    a11y: ["名前は Field のラベルか aria-label で付ける", "縦にだけ大きさを変えられる"],
  },
  {
    slug: "select", name: "Select", ja: "選ぶ", imports: ["Select"],
    demos: [
      { fn: "Basic", title: "基本", text: "何も選んでいないときは placeholder を出す。" },
      { fn: "Selected", title: "選んでいる", text: "選べない項目(disabled)は薄く出る。" },
    ],
    a11y: ["Base UI の Select。Enter と矢印キーで開き、矢印で動かし、Enter で決め、Esc で閉じる", "名前は Field のラベルか aria-label で付ける"],
  },
  {
    slug: "checkbox", name: "Checkbox", ja: "チェック", imports: ["Checkbox"],
    demos: [
      { fn: "Basic", title: "基本" },
      { fn: "Indeterminate", title: "一部だけ選んでいる", text: "子の一部だけ選んでいるときに使う。" },
    ],
    a11y: ["ラベルを含む行全体が押せる(44px 以上)", "indeterminate は aria-checked=\"mixed\" になる"],
  },
  {
    slug: "radio", name: "RadioGroup", ja: "ラジオ", imports: ["RadioGroup"],
    demos: [{ fn: "Basic", title: "基本", text: "1 つだけ選ぶ。見出し(legend)が必須。" }],
    a11y: ["矢印キーで選びが移り、Tab は組の外へ出る", "legend が組の名前になる"],
  },
  {
    slug: "switch", name: "Switch", ja: "スイッチ", imports: ["Switch"],
    demos: [{ fn: "Basic", title: "基本", text: "押すとすぐに効く設定に使う。確かめてから効く設定はチェックを使う。" }],
    a11y: ["role=\"switch\"。Space で切り替わる", "状態は位置だけでなく、ラベルで何を切るかを書く"],
  },
  {
    slug: "field", name: "Field", ja: "欄", imports: ["Field", "Input"],
    demos: [
      { fn: "WithInput", title: "入力を包む", text: "ラベル、補足、誤りを入力に結ぶ。" },
      { fn: "Mixed", title: "いろいろな入力", text: "Select、Textarea、Checkbox も同じ形で包める。" },
    ],
    a11y: ["ラベルは入力に結ばれ、補足は aria-describedby、誤りは aria-invalid で伝わる"],
  },
];
