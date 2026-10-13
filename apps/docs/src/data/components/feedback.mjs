// Feedback カテゴリのコンポーネント。
export const feedback = [
  {
    slug: "alert", name: "Alert", imports: ["Alert"],
    lead: "画面内に表示し続けるメッセージ。情報、成功、警告、エラーの 4 種類がある。色だけに頼らず、アイコンと文章で伝える。表示後に内容が変わる場合にだけ live を指定する。",
    demos: [
      { fn: "Tones", title: "Tones", text: "文章は短く、言い切りで書く。操作は右側に 1 つまで置ける。", block: true },
      { fn: "Closable", title: "Closable", text: "onClose を渡すと、閉じるボタンが表示される。", block: true },
    ],
    props: [
      ["tone", '"info" | "success" | "warn" | "error"', '"info"', "種類。info は青(--color-info)"],
      ["title", "ReactNode", "-", "タイトル(任意)。短くする"],
      ["children", "ReactNode", "-", "本文。短く言い切る"],
      ["action", "ReactNode", "-", "右側に置く操作。1 つまで"],
      ["onClose / closeLabel", "() => void / string", '- / "閉じる"', "渡すと閉じるボタンが表示される"],
      ["live", "boolean", "false", "true で role を付ける(error は alert、それ以外は status)。表示後に現れる、または内容が変わるメッセージにだけ使う"],
    ],
    classes: [
      [".ki-alert[data-tone]", "本体。info、success、warn、error"],
      [".ki-alert__icon、__body、__title、__text、__action、__close", "内部の要素"],
    ],
    a11y: ["表示後に内容が変わるアラートにだけ live を指定する。ページを開いた時点で表示されているアラートには role を付けない", "error は role=\"alert\"(すぐに読み上げる)、それ以外は role=\"status\""],
  },
  {
    slug: "toast", name: "Toast", imports: ["ToastProvider", "useToast"],
    lead: "操作の結果を、作業を止めずに伝える。数秒で自動的に消え、閉じるボタンもある。スクリーンリーダーにも読み上げられる。消えると困る内容(エラーの理由や次にすべきこと)は Alert に書く。",
    demos: [{ fn: "Tones", title: "Tones", text: "アプリのルートに ToastProvider を 1 つ置き、内側から useToast().show() で表示する。" }],
    a11y: ["表示領域は role=\"region\" で、表示されたトーストは読み上げられる", "自動で消えるため、重要な内容を Toast だけに表示しない。閉じるボタンで消すこともできる"],
  },
  {
    slug: "dialog", name: "Dialog", imports: ["Dialog", "DialogClose", "ConfirmDialog"],
    lead: "現在の作業を中断して、ユーザーに 1 つのことを求める。フォーカスは中に閉じ込められ、Esc で閉じ、閉じると開いたボタンに戻る。取り消せない操作には確認用の ConfirmDialog を使い、外側をクリックしても閉じないようにする。",
    demos: [
      { fn: "Basic", title: "Basic", text: "入力を求める例。外側をクリックすると閉じる。" },
      { fn: "Confirm", title: "Confirm (ConfirmDialog)", text: "取り消せない操作に使う。外側をクリックしても閉じず、最初のフォーカスはキャンセル側に置かれる。" },
      { fn: "Verify", title: "Verify the result", text: "確認ダイアログでリクエストを送り、リクエスト中の表示を経て、結果をマークで示す。反映まで時間がかかる操作に使う。" },
    ],
    a11y: ["Base UI の Dialog を使う。フォーカスを閉じ込め、Esc で閉じ、閉じると開いたボタンにフォーカスが戻る", "title がスクリーンリーダー向けの名前になる。必須", "確認ダイアログは alertdialog になる。最初のフォーカスはキャンセル側に置かれ、Enter で誤って実行することがない"],
  },
  {
    slug: "sheet", name: "Sheet", imports: ["Sheet", "SheetClose"],
    lead: "画面の下から出る面。スマホと iPad で、指の届く所に操作を置く。下へ指で引くか、Esc か、外を押すと閉じる。Dialog と同じく、フォーカスは中に閉じ込められ、閉じると開いたボタンに戻る。取り消せない操作の確認には、Sheet ではなく ConfirmDialog を使う。",
    demos: [
      { fn: "Basic", title: "Basic", text: "設定のような、今の画面に付いた短い操作に使う。上の印(ハンドル)を下へ引くと閉じる。" },
      { fn: "WithForm", title: "With form", text: "入力を求める例。open と onOpenChange で開け閉めを持つ。" },
    ],
    props: [
      ["trigger", "ReactElement", "-", "シートを開くボタン。要素 1 つ"],
      ["title", "ReactNode", "-", "タイトル。必須。スクリーンリーダー向けの名前になる"],
      ["description", "ReactNode", "-", "説明。1〜2 文"],
      ["children", "ReactNode", "-", "本文。長いときはシートの中がスクロールする(高さは画面の 85% まで)"],
      ["actions", "ReactNode", "-", "下部の操作。SheetClose を使うと閉じる"],
      ["loading", "boolean", "false", "本文の代わりに、本文の形をまねた Skeleton を出す"],
      ["closeLabel", "string", "\"閉じる\"", "右上の閉じるボタンの名前"],
      ["open / defaultOpen / onOpenChange", "boolean", "-", "制御と非制御"],
    ],
    classes: [
      [".ki-sheet", "面。素の HTML では <dialog> に付けて showModal() で開く(指で引いて閉じる動きは無い)"],
      [".ki-sheet__handle、__head、__title、__description、__body、__actions", "引く所の印、見出しの行、タイトル、説明、本文、操作"],
      [".ki-sheet__viewport、__backdrop", "Base UI の Viewport と Backdrop に当てる"],
      ["[data-swiping]", "指で引いている間。指に付いて動き、動きの時間は 0 になる"],
    ],
    vars: [
      ["--color-surface、--color-line、--shadow-pop", "背景、枠線、影"],
      ["--radius-3", "上の 2 つの角だけを丸める"],
      ["--motion-duration-enter", "出入りの動き(240ms)。prefers-reduced-motion で 0 になる。指に付いて動くのは操作なので残る"],
      ["--drawer-swipe-movement-y、--drawer-swipe-progress", "Base UI が指の動きに合わせて書く。背面の暗さも引いた分だけ薄くなる"],
    ],
    html: `<button type="button" class="ki-button" data-variant="secondary" data-ki-dialog-open="s1">シートを開く</button>
<dialog id="s1" class="ki-sheet" aria-labelledby="s1-t">
  <span class="ki-sheet__handle" aria-hidden="true"></span>
  <div class="ki-sheet__head">
    <h2 id="s1-t" class="ki-sheet__title">表示の設定</h2>
  </div>
  <p class="ki-sheet__description">この画面の表示だけが変わる。</p>
  <div class="ki-sheet__actions">
    <button type="button" class="ki-button" data-variant="secondary" data-ki-dialog-close>閉じる</button>
  </div>
</dialog>`,
    a11y: ["Base UI の Drawer を使う。中身は dialog になり、フォーカスを閉じ込め、Esc で閉じ、閉じると開いたボタンにフォーカスが戻る", "指で引けない人のために、右上に閉じるボタンを必ず置く", "title がスクリーンリーダー向けの名前になる。必須"],
  },
  {
    slug: "progress", name: "Progress", imports: ["Progress"],
    lead: "処理の進捗を、バーと文字で示す。値が分からないときは、動かさずに「不明」と表示する。",
    demos: [
      { fn: "Basic", title: "Basic", text: "色は、プライマリ、成功、警告、エラーから選択する。値は文字でも表示する。" },
      { fn: "Running", title: "Running", text: "値を 0 から 100 まで更新していく。" },
    ],
    props: [
      ["value", "number | null", "-", "0 から max まで。null は不明"],
      ["max", "number", "100", "最大値"],
      ["label", "ReactNode", "-", "何の進捗か。必須(スクリーンリーダー向けの名前)"],
      ["showValue", "boolean", "true", "値を文字でも表示する"],
      ["tone", '"primary" | "success" | "warn" | "error"', '"primary"', "バーの色"],
      ["size", '"md" | "lg"', '"md"', "バーの太さ(8px、12px)"],
      ["disabled", "boolean", "false", "待機中。バーをグレーにする"],
    ],
    classes: [[".ki-progress", "本体。data-tone、data-size、data-indeterminate、data-disabled"], [".ki-progress__head、__label、__value、__track、__bar", "内部の要素"]],
    vars: [["--color-primary、--color-success、--color-warn、--color-error", "バーの色"], ["--color-line、--color-line-strong", "トラック(背景)の色と、不明のときの枠線"], ["--radius-1、--space-2、--space-3", "角丸、太さ"]],
    html: `<div class="ki-progress">
  <div class="ki-progress__head"><span class="ki-progress__label" id="pg1">読み込み中</span><span class="ki-progress__value">40%</span></div>
  <div class="ki-progress__track" role="progressbar" aria-labelledby="pg1" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40"><span class="ki-progress__bar" style="width:40%"></span></div>
</div>`,
    a11y: ["role=\"progressbar\" と aria-valuenow を持つ。不明のときは aria-valuenow を付けない", "値は文字でも表示し、色だけで示さない。終わらないアニメーションは使わない"],
  },
  {
    slug: "skeleton", name: "Skeleton", imports: ["Skeleton", "SkeletonText"],
    demos: [
      { fn: "Text", title: "Text", text: "SkeletonText は、スクリーンリーダー向けの文言も持つ。" },
      { fn: "Shapes", title: "Shapes", text: "短い行、中くらいの行、ブロックの 3 種類。" },
    ],
    a11y: ["プレースホルダー自体は読み上げない(aria-hidden)。ラッパーに aria-busy=\"true\" を付け、読み上げる文言は SkeletonText が持つ"],
  },
  {
    slug: "spinner", name: "Spinner", imports: ["Spinner"],
    demos: [{ fn: "Basic", title: "Basic", text: "ボタンや入力欄の内側でも使われる。" }],
    a11y: ["label を渡すと role=\"status\" として読み上げる。渡さなければ装飾として隠す", "prefers-reduced-motion では回転を止め、形だけを残す"],
  },
  {
    slug: "empty-state", name: "EmptyState", imports: ["EmptyState"],
    demos: [
      { fn: "Basic", title: "With action", text: "理由と次にやることを 1〜2 文で書く。操作は 1 つまで。" },
      { fn: "NoAction", title: "Without action", text: "条件を変えれば見つかる場合などに使う。" },
    ],
    a11y: ["見出しは、文として読める長さにする。アイコンは装飾として隠す"],
  },
];
