// 知らせの部品。
export const feedback = [
  {
    slug: "alert", name: "Alert", ja: "知らせの帯", imports: ["Alert"],
    lead: "画面の中に残る知らせ。情報、成功、警告、失敗。色だけに頼らず、アイコンと文で伝える。",
    demos: [
      { fn: "Tones", title: "種類", text: "文は平叙で短く。操作は右に 1 つまで。", block: true },
      { fn: "Closable", title: "閉じられる", text: "onClose を渡すと閉じるボタンが出る。", block: true },
    ],
    props: [
      ["tone", '"info" | "success" | "warn" | "error"', '"info"', "種類。info は青(--color-info)"],
      ["title", "ReactNode", "-", "表題(任意)。短く"],
      ["children", "ReactNode", "-", "本文。平叙で短く"],
      ["action", "ReactNode", "-", "右に置く操作。1 つ"],
      ["onClose / closeLabel", "() => void / string", '- / "閉じる"', "渡すと閉じるボタンが出る"],
      ["live", "boolean", "false", "true で role を付ける(error は alert、ほかは status)。後から出る、変わる知らせだけ"],
    ],
    classes: [
      [".ki-alert[data-tone]", "本体。info、success、warn、error"],
      [".ki-alert__icon、__body、__title、__text、__action、__close", "中の部品"],
    ],
    a11y: ["出た後に変わる知らせだけ live にする。ページを開いた時からある知らせは role を付けない", "error は role=\"alert\"(すぐ読み上げる)、ほかは role=\"status\""],
  },
  {
    slug: "toast", name: "Toast", ja: "通知", imports: ["ToastProvider", "useToast"],
    lead: "操作の結果を、短く出して自動で消す知らせ。画面に残したい知らせは Alert を使う。",
    demos: [{ fn: "Tones", title: "種類", text: "アプリの根に ToastProvider を 1 つ置き、中から useToast().show() で出す。" }],
    a11y: ["領域は role=\"region\" で、出た知らせは読み上げられる", "自動で消えるので、大事な内容は Toast だけに出さない。閉じるボタンで消せる"],
  },
  {
    slug: "dialog", name: "Dialog", ja: "ダイアログ", imports: ["Dialog", "DialogClose", "ConfirmDialog"],
    lead: "今の作業を止めて、1 つのことを頼む。focus は中に閉じ込め、Esc で閉じ、閉じたら開いたボタンへ戻る。",
    demos: [
      { fn: "Basic", title: "基本", text: "入力を頼む。外を押すと閉じる。" },
      { fn: "Confirm", title: "確かめる形(ConfirmDialog)", text: "取り返しのつかない操作に使う。外を押しても閉じず、初めの focus は取り消し側。" },
      { fn: "Verify", title: "確かめる操作", text: "確かめる画面で依頼を出し、依頼中を示し、結果を印で示す。反映まで時間がかかる操作に使う。" },
    ],
    a11y: ["Base UI の Dialog。focus を閉じ込め、Esc で閉じ、閉じたら開いたボタンに focus が戻る", "表題(title)が読み上げの名前。必須", "確かめる形は alertdialog。初めの focus は取り消し側にあり、Enter で間違えて実行しない"],
  },
  {
    slug: "progress", name: "Progress", ja: "進み具合", imports: ["Progress"],
    lead: "処理の進み具合を、線と字で示す。値が分からないときは動かさずに「不明」と出す。",
    demos: [
      { fn: "Basic", title: "基本", text: "色は主、成功、警告、失敗。値は字でも出す。" },
      { fn: "Running", title: "進む", text: "値を 0 から 100 に更新していく。" },
    ],
    props: [
      ["value", "number | null", "-", "0 から max。null は不明"],
      ["max", "number", "100", "最大"],
      ["label", "ReactNode", "-", "何の進み具合か。必須(読み上げの名前)"],
      ["showValue", "boolean", "true", "値を字でも出す"],
      ["tone", '"primary" | "success" | "warn" | "error"', '"primary"', "線の色"],
      ["size", '"md" | "lg"', '"md"', "線の太さ(8px、12px)"],
      ["disabled", "boolean", "false", "待機中。線を灰色にする"],
    ],
    classes: [[".ki-progress", "本体。data-tone、data-size、data-indeterminate、data-disabled"], [".ki-progress__head、__label、__value、__track、__bar", "中の部品"]],
    vars: [["--color-primary、--color-success、--color-warn、--color-error", "線の色"], ["--color-line、--color-line-strong", "線の道と、不明のときの枠"], ["--radius-1、--space-2、--space-3", "角丸、太さ"]],
    html: `<div class="ki-progress">
  <div class="ki-progress__head"><span class="ki-progress__label" id="pg1">読み込み</span><span class="ki-progress__value">40%</span></div>
  <div class="ki-progress__track" role="progressbar" aria-labelledby="pg1" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40"><span class="ki-progress__bar" style="width:40%"></span></div>
</div>`,
    a11y: ["role=\"progressbar\" と aria-valuenow。不明のときは aria-valuenow を付けない", "値は字でも出し、色だけで示さない。終わらない動きは使わない"],
  },
  {
    slug: "skeleton", name: "Skeleton", ja: "読み込みの仮の形", imports: ["Skeleton", "SkeletonText"],
    demos: [
      { fn: "Text", title: "文", text: "SkeletonText は読み上げる文も持つ。" },
      { fn: "Shapes", title: "形", text: "短い、中くらい、面。" },
    ],
    a11y: ["仮の形は読み上げない(aria-hidden)。包む側に aria-busy=\"true\" を付け、読み上げる文は SkeletonText が持つ"],
  },
  {
    slug: "spinner", name: "Spinner", ja: "回転", imports: ["Spinner"],
    demos: [{ fn: "Basic", title: "基本", text: "ボタンや入力の中でも使われる。" }],
    a11y: ["label を渡すと role=\"status\" で読み上げる。渡さなければ飾りとして隠す", "prefers-reduced-motion では回転を止め、形だけを残す"],
  },
  {
    slug: "empty-state", name: "EmptyState", ja: "空の状態", imports: ["EmptyState"],
    demos: [
      { fn: "Basic", title: "行動が 1 つ", text: "理由と次にすることを 1〜2 文で。行動は 1 つ。" },
      { fn: "NoAction", title: "行動が無い", text: "条件を変えると見つかる、など。" },
    ],
    a11y: ["見出しは文として読める長さにする。アイコンは飾りとして隠す"],
  },
];
