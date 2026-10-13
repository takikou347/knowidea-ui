// Inputs カテゴリのコンポーネント。demos の fn は src/demos/<slug>.tsx の export 名。
export const input = [
  {
    slug: "button", name: "Button", imports: ["Button"],
    demos: [
      { fn: "Variants", title: "Variants", text: "プライマリは 1 画面に 1 つまでとする。セカンダリは複数並べてもよい。quiet は枠線も背景もないボタン。" },
      { fn: "Sizes", title: "Sizes", text: "標準(md)の高さは 44px、大きいサイズ(lg)は 52px。どちらもタップ領域の基準を満たす。" },
      { fn: "WithIcon", title: "With icon", text: "アイコンはラベルの前に置く。アイコンだけのボタンには IconButton を使う。" },
    ],
    a11y: [
      "<button> 要素として描画する。Enter と Space で操作できる。ページ遷移には Link を使う",
      "loading の間は aria-busy が付き、操作できない。スクリーンリーダー向けの文言は loadingLabel で指定する",
      "フォーカスリングは 2px で、隣り合う色とのコントラスト比は 3:1 以上",
      "disabled のボタンは Tab 順から外れる。理由を伝える必要があるときは、近くにテキストで書く",
    ],
  },
  {
    slug: "icon-button", name: "IconButton", imports: ["IconButton", "Icon"],
    demos: [
      { fn: "Variants", title: "Variants" },
      { fn: "Large", title: "Large", text: "標準サイズでも大きいサイズでも、タップ領域は 44px 以上になる。" },
    ],
    a11y: [
      "label は必須で、aria-label として使われる。アイコンだけでは名前が伝わらない",
      "意味が分かりにくい場合は Tooltip を添える(Tooltip は補足であり、名前の代わりにはならない)",
    ],
  },
  {
    slug: "text-field", name: "TextField", imports: ["TextField"],
    lead: "ラベル、入力欄、ヒント、エラーメッセージを 1 つにまとめたコンポーネント。1 行入力も複数行入力も同じ書き方で使える。",
    demos: [
      { fn: "Basic", title: "Single line", text: "必須マークとヒントを付けた例。" },
      { fn: "Multiline", title: "Multiline", text: "multiline を指定すると Textarea に切り替わる。" },
    ],
    props: [
      ["label", "ReactNode", "-", "ラベル。必須"],
      ["hint", "ReactNode", "-", "ヒント。入力の前に知っておくべきことを書く"],
      ["error", "ReactNode", "-", "エラーメッセージ。指定するとエラー状態になり、入力欄の下に理由が表示され、aria-invalid が付く"],
      ["multiline", "boolean", "false", "複数行入力(Textarea)にする"],
      ["rows", "number", "3", "multiline のときの行数"],
      ["loading", "boolean", "false", "右端にスピナーを表示する(1 行入力のみ)"],
      ["numeric", "boolean", "false", "数字を等幅で表示する"],
      ["required / disabled", "boolean", "false", "必須(ラベルに「必須」と表示する)、無効"],
      ["...input", "-", "-", "type、value、defaultValue、onChange、placeholder など、input 要素の属性"],
    ],
    classes: [
      [".ki-field", "全体を包む要素。Field と共通"],
      [".ki-field__label、__hint、__error、__required", "ラベル、ヒント、エラーメッセージ、必須マーク"],
      [".ki-input、.ki-textarea", "内側の入力要素"],
    ],
    vars: [
      ["--color-text、--color-text-muted", "ラベルとヒントの文字色"],
      ["--color-error", "エラーメッセージと枠線"],
      ["--color-surface、--color-line-strong", "入力欄の背景と枠線"],
      ["--size-hit、--radius-2", "入力欄の高さ(44px)と角丸"],
    ],
    html: `<div class="ki-field">
  <label class="ki-field__label" for="tf1">名前<span class="ki-field__required">必須</span></label>
  <input id="tf1" class="ki-input" placeholder="例: sample-name" aria-describedby="tf1-h" />
  <p id="tf1-h" class="ki-field__hint">英小文字とハイフンで入力する</p>
</div>`,
    a11y: [
      "ラベルは <label> で入力欄に関連付ける。placeholder をラベルの代わりにしない",
      "ヒントは aria-describedby で関連付ける。エラーは入力欄の下に表示し、色だけでなくアイコンと文章でも伝える",
      "必須は「必須」の文字で示す(色や * だけに頼らない)",
    ],
  },
  {
    slug: "input", name: "Input", imports: ["Input"],
    demos: [
      { fn: "Basic", title: "Basic", text: "名前は Field のラベルか aria-label で必ず付ける。" },
      { fn: "Numeric", title: "Numeric", text: "numeric を指定すると、数字が等幅で表示される。" },
    ],
    a11y: ["名前のない入力欄は作らない。Field か TextField を使うか、aria-label を付ける", "invalid を指定すると aria-invalid が付く。理由は近くのテキストで伝える"],
  },
  {
    slug: "textarea", name: "Textarea", imports: ["Textarea"],
    demos: [{ fn: "Basic", title: "Basic" }],
    a11y: ["名前は Field のラベルか aria-label で付ける", "サイズ変更は縦方向のみ可能"],
  },
  {
    slug: "select", name: "Select", imports: ["Select"],
    demos: [
      { fn: "Basic", title: "Basic", text: "未選択のときは placeholder を表示する。" },
      { fn: "Selected", title: "Selected", text: "disabled の選択肢は薄く表示され、選択できない。" },
    ],
    a11y: ["Base UI の Select を使う。Enter と矢印キーで開き、矢印で移動し、Enter で決定し、Esc で閉じる", "名前は Field のラベルか aria-label で付ける"],
  },
  {
    slug: "checkbox", name: "Checkbox", imports: ["Checkbox"],
    demos: [
      { fn: "Basic", title: "Basic" },
      { fn: "Indeterminate", title: "Indeterminate", text: "子の一部だけが選択されているときに使う。" },
    ],
    a11y: ["ラベルを含む行全体がタップ領域になる(44px 以上)", "indeterminate は aria-checked=\"mixed\" になる"],
  },
  {
    slug: "radio", name: "RadioGroup", imports: ["RadioGroup"],
    demos: [{ fn: "Basic", title: "Basic", text: "選択できるのは 1 つだけ。見出し(legend)は必須。" }],
    a11y: ["矢印キーで選択が移動し、Tab はグループの外へ移る", "legend がグループの名前になる"],
  },
  {
    slug: "segmented-control", name: "SegmentedControl", imports: ["SegmentedControl"],
    lead: "2〜5 個の表示を切り替える。選ぶとすぐに切り替わり、選んだ印が選んだ所へ滑る。保存してから反映される選択には RadioGroup を、6 個以上なら Select を使う。項目の幅はそろう。",
    demos: [
      { fn: "Basic", title: "Basic", text: "期間や表示の形のように、同じ中身の見せ方を切り替える。" },
      { fn: "WithIcons", title: "With icons and full width", text: "アイコンは字の前に置く。fullWidth で親の幅いっぱいに広げる。字は省かない。" },
    ],
    props: [
      ["label", "string", "-", "何を切り替えるか。必須(スクリーンリーダー向けの名前)"],
      ["options", "{ value, label, icon?, disabled? }[]", "-", "選択肢。2〜5 個"],
      ["value / defaultValue / onValueChange", "string", "先頭", "制御と非制御。どちらも無いときは先頭を選ぶ"],
      ["fullWidth", "boolean", "false", "親の幅いっぱいに広げる"],
      ["disabled", "boolean", "false", "全部を無効にする"],
    ],
    classes: [
      [".ki-segmented", "本体。role=\"radiogroup\"。style に --ki-seg-count(項目の数)を入れる。data-full-width"],
      [".ki-segmented__item", "項目。素の HTML では <label> の中に <input type=\"radio\">"],
      [".ki-segmented__thumb", "選んだ印。位置は :has で決まる(6 個まで)"],
      ["[data-checked]、:has(:checked)", "選んだ項目"],
    ],
    vars: [
      ["--color-surface-2、--color-line", "台の背景と枠線"],
      ["--color-surface、--color-line-strong", "選んだ印の背景と枠線"],
      ["--radius-2、--size-hit", "角丸と高さ(44px)"],
      ["--motion-duration-state", "印の滑る動き。prefers-reduced-motion で止まる"],
    ],
    html: `<div class="ki-segmented" role="radiogroup" aria-label="表示する期間" style="--ki-seg-count: 3">
  <span class="ki-segmented__thumb" aria-hidden="true"></span>
  <label class="ki-segmented__item"><input type="radio" name="range" value="day" />日</label>
  <label class="ki-segmented__item"><input type="radio" name="range" value="week" checked />週</label>
  <label class="ki-segmented__item"><input type="radio" name="range" value="month" />月</label>
</div>`,
    a11y: ["ラジオのグループ。矢印キーで選び直し、Tab はグループの外へ移る", "label がグループの名前になる。必須", "選んだことは、印の位置だけでなく、字の太さと色でも示す"],
  },
  {
    slug: "switch", name: "Switch", imports: ["Switch"],
    demos: [
      { fn: "Basic", title: "Basic", text: "操作するとすぐに反映される設定に使う。保存してから反映される設定には Checkbox を使う。" },
      { fn: "Settings", title: "Settings list", text: "placement=\"end\" で、ラベルを左、Switch を右端に置く。行の全体が押せる。description は補足で、Switch の説明として読み上げられる。" },
    ],
    a11y: ["role=\"switch\" を持つ。Space で切り替える", "状態は位置だけで示さず、ラベルで何を切り替えるのかを書く"],
  },
  {
    slug: "field", name: "Field", imports: ["Field", "Input"],
    demos: [
      { fn: "WithInput", title: "With input", text: "ラベル、ヒント、エラーメッセージを入力に関連付ける。" },
      { fn: "Mixed", title: "Mixed inputs", text: "Select、Textarea、Checkbox も同じ形で包める。" },
    ],
    a11y: ["ラベルは入力に関連付けられ、ヒントは aria-describedby、エラーは aria-invalid で伝わる"],
  },
];
