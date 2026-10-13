// コンポーネントのページの元データのうち、props、クラス、変数、素の HTML の例を持つもの。
// data/components/*.mjs に同じ項目があれば、そちらが優先される。
// html の中の ${icon("名前")} は、ページを作るときにアイコンの <svg> に置き換わる。
export default {
  badge: {
    lead: "状態を短い語で示す。色は状態を表す色だけを使い、必ず文字も入れる(色だけで伝えない)。操作はできない。操作できるものには Chip や Button を使う。",
    props: [
      ["tone", '"neutral" | "success" | "warn" | "error"', '"neutral"', "状態を表す色"],
      ["icon", "ReactNode", "-", "先頭に表示する小さなアイコン(任意)"],
      ["numeric", "boolean", "false", "数字を等幅で表示する"],
    ],
    classes: [
      [".ki-badge", "バッジ本体"],
      ["data-tone=\"success | warn | error\"", "状態を表す色"],
      ["data-numeric", "数字を等幅で表示する"],
    ],
    vars: [
      ["--color-surface-2、--color-text", "neutral の背景と文字色"],
      ["--color-success(-soft)、--color-warn(-soft)、--color-error(-soft)", "状態ごとの文字色と背景(コントラスト比 4.5:1 以上)"],
      ["--radius-1、--font-size-1", "角丸、フォントサイズ"],
    ],
    html: `<span class="ki-badge">下書き</span>
<span class="ki-badge" data-tone="success">稼働中</span>
<span class="ki-badge" data-tone="warn">停止中</span>
<span class="ki-badge" data-tone="error">失敗</span>`,
    htmlNote: null,
  },
  button: {
    lead: "操作を実行するボタン。ページ遷移には使わず、Link を使う。プライマリは 1 画面に 1 つまでとする。削除などの危険な操作には danger を指定し、確認ダイアログと組み合わせる。",
    props: [
      ["variant", '"primary" | "secondary" | "quiet" | "danger"', '"primary"', "プライマリは 1 画面に 1 つまで。quiet は枠線も背景もない"],
      ["size", '"md" | "lg"', '"md"', "md は 44px、lg は 52px。どちらもタップ領域の基準を満たす"],
      ["loading", "boolean", "false", "操作できなくなり、aria-busy が付く。ラベルはそのままで、先頭にスピナーが表示される"],
      ["loadingLabel", "string", '"処理中"', "ローディング中にスクリーンリーダーが読み上げる文言"],
      ["icon", "ReactNode", "-", "ラベルの前に表示するアイコン。packages/icons のコンポーネントも渡せる"],
      ["disabled", "boolean", "false", "操作できない。フォーカスも受けない"],
      ["type", '"button" | "submit" | "reset"', '"button"', "form の中では submit を明示する"],
    ],
    classes: [
      [".ki-button", "ボタン本体。<button> か <a> に付ける"],
      ["data-variant=\"secondary | quiet | danger\"", "指定がなければ primary"],
      ["data-size=\"lg\"", "大きいサイズ"],
      ["data-loading", "ローディング中。pointer-events を無効にする。aria-busy も付ける"],
      [".is-hover、.is-focus、.is-active", "このドキュメントで状態を固定して見せるためのクラス。実際のアプリでは使わない"],
    ],
    vars: [
      ["--color-primary、--color-primary-hover、--color-on-primary", "primary の背景、ホバー時の背景、文字色"],
      ["--color-surface、--color-surface-2、--color-line、--color-line-strong", "secondary と quiet の背景、ホバー時の背景、枠線"],
      ["--color-error、--color-bg、--color-text", "danger の背景、文字色、ホバー時に混ぜる色"],
      ["--color-focus", "フォーカスリング(2px)"],
      ["--radius-2、--space-2、--space-4、--space-5", "角丸、内部の間隔、左右のパディング"],
      ["--size-hit", "最小の高さ(44px)"],
      ["--font-size-3、--font-weight-strong", "フォントサイズ、太さ"],
    ],
    html: `<button type="button" class="ki-button">承認する</button>
<button type="button" class="ki-button" data-variant="secondary">却下する</button>
<button type="button" class="ki-button" data-variant="quiet">あとで</button>
<button type="button" class="ki-button" data-variant="danger">削除する</button>
<button type="button" class="ki-button" data-variant="secondary" data-size="lg">大きいボタン</button>
<button type="button" class="ki-button" data-loading aria-busy="true"><span class="ki-spinner" aria-hidden="true"></span><span>送信する</span></button>`,
    htmlNote: "ローディング中のスピナーには ki-spinner を使う。",
  },
  checkbox: {
    lead: "1 つの項目のオンとオフを切り替える。ラベルを含めた領域が 44px 以上のタップ領域になる。複数の項目から選択するときは並べて使い、1 つだけ選択するときは RadioGroup を使う。",
    props: [
      ["label", "ReactNode", "-", "ラベル。ない場合は aria-label を付ける"],
      ["checked / defaultChecked / onCheckedChange", "boolean", "-", "制御と非制御"],
      ["indeterminate", "boolean", "false", "一部だけが選択されている状態(全選択の見出しなど)"],
      ["invalid", "boolean", "false", "エラー状態の枠線"],
      ["loading", "boolean", "false", "操作できなくなり、スピナーを表示する"],
      ["disabled", "boolean", "false", "操作できない"],
    ],
    classes: [
      [".ki-choice > .ki-check", "素の HTML では <input type=\"checkbox\"> を使う。React では Base UI が同じクラスで描画する"],
      ["[data-checked]、:checked、:indeterminate", "選択済み"],
      ["[data-indeterminate]", "一部だけ選択"],
    ],
    vars: [
      ["--color-primary、--color-on-primary", "選択時の背景とチェックマーク"],
      ["--color-line-strong、--color-surface", "未選択時の枠線と背景"],
      ["--color-error", "エラー状態"],
      ["--size-hit", "ラベルを含むタップ領域の高さ"],
      ["--radius-1", "角丸"],
    ],
    html: `<label class="ki-choice"><input type="checkbox" class="ki-check" checked /><span>完了したら通知する</span></label>
<label class="ki-choice"><input type="checkbox" class="ki-check" /><span>失敗したら通知する</span></label>`,
    htmlNote: null,
  },
  "code-block": {
    lead: "コードを等幅で表示する。コピーボタンがあり、行番号は任意。長い行は枠の中だけが横にスクロールする(キーボードでも操作できる)。文中の短いコードには .ki-inline-code を使う。",
    props: [
      ["code", "string", "-", "コード。必須"],
      ["language", "string", "-", "右上に表示する言語名"],
      ["lineNumbers", "boolean", "false", "行番号を表示する。コピーする文字には含まれない"],
      ["copy", "boolean", "true", "コピーボタンを表示する。結果はテキストで伝える"],
      ["label", "string", '"コード"', "横スクロール領域の名前"],
    ],
    classes: [
      [".ki-code、[data-lines]", "枠。data-lines で行番号を表示する"],
      [".ki-code__head、__lang、__pre、__line", "ヘッダー、言語名、本文、1 行"],
      ["data-ki-copy=\"#id\"", "enhance.js がコピーを実行する"],
      [".ki-inline-code", "文中の短いコード"],
    ],
    vars: [
      ["--color-surface-2、--color-line、--color-text", "背景、枠線、文字色"],
      ["--font-mono、--font-size-2", "等幅フォントとそのサイズ"],
      ["--color-text-muted", "言語名と行番号"],
      ["--radius-2、--space-3", "角丸、余白"],
    ],
    html: `<figure class="ki-code" data-lines>
  <div class="ki-code__head">
    <span class="ki-code__lang">yaml</span>
    <button type="button" class="ki-button ki-icon-button" data-variant="quiet" aria-label="コードをコピー" data-ki-copy="#c1">
      <span data-ki-copy-label class="ki-sr-only">コピー</span>
      <svg class="ki-icon" aria-hidden="true"><use href="#copy"/></svg>
    </button>
  </div>
  <pre class="ki-code__pre" tabindex="0" aria-label="コード"><code id="c1"><span class="ki-code__line">name: sample</span><span class="ki-code__line">model: opus</span></code></pre>
</figure>`,
    htmlNote: "コピーボタンの動作は enhance.js が提供する。行番号は CSS の counter で表示するため、選択やコピーには含まれない。",
  },
  dialog: {
    props: [
      ["trigger", "ReactElement", "-", "ダイアログを開くボタン。要素 1 つ"],
      ["title", "ReactNode", "-", "タイトル。必須。スクリーンリーダー向けの名前になる"],
      ["description", "ReactNode", "-", "説明。1〜2 文"],
      ["actions", "ReactNode", "-", "下部の操作。DialogClose を使うと閉じる"],
      ["loading", "boolean", "false", "本文の代わりにスピナーと文言を表示する"],
      ["open / defaultOpen / onOpenChange", "boolean", "-", "制御と非制御"],
      ["ConfirmDialog: confirmLabel", "string", "-", "実行ボタンの文言。「削除する」のように、何をするのかを書く。「OK」は使わない"],
      ["ConfirmDialog: tone", "\"danger\" | \"primary\"", "\"danger\"", "取り消せない操作は danger にする"],
      ["ConfirmDialog: onConfirm", "() => void", "-", "実行時に呼ばれる"],
    ],
    classes: [
      [".ki-dialog", "素の HTML では <dialog> に付けて showModal() で開く(フォーカスの閉じ込めと Esc はブラウザが担う)"],
      [".ki-dialog__title、__description、__actions", "タイトル、説明、操作"],
      [".ki-dialog__popup、__backdrop", "Base UI の Popup と Backdrop に当てる"],
      ["data-ki-dialog-open、data-ki-dialog-close", "enhance.js が開閉を実行する"],
    ],
    vars: [
      ["--color-surface、--color-line", "背景、枠線"],
      ["--shadow-pop", "影(浮かび上がる要素用)"],
      ["--color-bg", "背面を覆うオーバーレイ(70%)"],
      ["--radius-3、--space-4、--space-5", "角丸、画面端との余白(16px)、内側の余白"],
      ["--motion-duration-state", "表示と非表示のアニメーション。prefers-reduced-motion で止まる"],
    ],
    html: `<button type="button" class="ki-button" data-variant="secondary" data-ki-dialog-open="d1">ダイアログを開く</button>
<dialog id="d1" class="ki-dialog" aria-labelledby="d1-t">
  <h2 id="d1-t" class="ki-dialog__title">名前を変更する</h2>
  <p class="ki-dialog__description">一覧と履歴の表示が変わる。</p>
  <div class="ki-dialog__actions">
    <button type="button" class="ki-button" data-variant="secondary" data-ki-dialog-close>キャンセル</button>
    <button type="button" class="ki-button" data-ki-dialog-close>保存</button>
  </div>
</dialog>`,
    htmlNote: "enhance.js を読み込むと、data 属性で開閉できる。",
  },
  divider: {
    lead: "内容の区切りに引く 1 本の線。区切りは線だけで十分であり、影や背景を重ねない。ラベル付きの区切りは、文章の切れ目に使う。",
    props: [
      ["orientation", "\"horizontal\" | \"vertical\"", "\"horizontal\"", "横方向か縦方向か"],
      ["strong", "boolean", "false", "濃い線にする(--color-line-strong)"],
      ["label", "string", "-", "切れ目に入れる語(横方向のみ)"],
    ],
    classes: [
      [".ki-divider", "hr に付ける"],
      ["data-orientation=\"vertical\"", "縦方向。span に付ける"],
      ["data-strong", "濃い線"],
      [".ki-divider-label", "ラベル付きの区切り"],
    ],
    vars: [
      ["--color-line、--color-line-strong", "線の色"],
      ["--space-3、--space-4", "前後の余白"],
    ],
    html: `<p>上の文章</p>
<hr class="ki-divider" />
<p>下の文章</p>
<div class="ki-divider-label"><span>または</span></div>
<span>一覧<span class="ki-divider" data-orientation="vertical" role="separator" aria-orientation="vertical"></span>履歴</span>`,
    htmlNote: null,
  },
  "empty-state": {
    lead: "一覧や表が空のとき、理由と次の操作を短い文で伝える。操作は 1 つまで。大きなイラストは使わない(小さなアイコンは任意)。",
    props: [
      ["title", "ReactNode", "-", "何がないのか。短くする"],
      ["children", "ReactNode", "-", "理由と次にやること。1〜2 文"],
      ["action", "ReactNode", "-", "操作 1 つ(ボタンかリンク)"],
      ["icon", "ReactNode", "-", "小さなアイコン(任意)"],
    ],
    classes: [
      [".ki-empty", "外枠"],
      [".ki-empty__icon、__title、__text、__action", "内部の要素"],
    ],
    vars: [
      ["--color-text、--color-text-muted", "タイトル、説明"],
      ["--space-2、--space-4、--space-6", "間隔、余白"],
    ],
    html: `<div class="ki-empty">
  <p class="ki-empty__title">項目がない</p>
  <p class="ki-empty__text">項目を作成すると、ここに表示される。</p>
  <div class="ki-empty__action"><button type="button" class="ki-button" data-variant="secondary">項目を作成</button></div>
</div>`,
    htmlNote: null,
  },
  field: {
    lead: "ラベル、ヒント、エラーメッセージを入力コンポーネントにまとめる。ラベルと入力の関連付け、aria-describedby、aria-invalid は Base UI の Field が付ける。エラーは「何が問題か」を 1 文で書く。",
    props: [
      ["label", "ReactNode", "-", "ラベル。必須"],
      ["hint", "ReactNode", "-", "ヒント。入力の前に知っておくべきこと"],
      ["error", "ReactNode", "-", "エラーメッセージ。指定するとフィールド全体がエラー状態になり、入力欄の枠線も変わる"],
      ["required", "boolean", "false", "ラベルに「必須」を追加する。* の記号は使わない"],
      ["disabled", "boolean", "false", "フィールド全体を無効にする"],
      ["children", "ReactNode", "-", "Input、Textarea、Select、Checkbox など 1 つ"],
    ],
    classes: [
      [".ki-field", "フィールドの外枠(間隔 4px)"],
      [".ki-field__label、__required、__hint、__error", "ラベル、必須マーク、ヒント、エラーメッセージ"],
      ["[data-invalid]", "エラーのあるフィールド"],
      [".ki-fieldset", "ラジオなどをまとめる。legend がラベルになる"],
    ],
    vars: [
      ["--color-text、--color-text-muted、--color-error", "ラベル、ヒント、エラーの色"],
      ["--space-1", "ラベルと入力欄の間隔"],
      ["--font-size-2、--font-size-3", "ヒントとエラー、ラベルのフォントサイズ"],
    ],
    html: `<div class="ki-field">
  <label class="ki-field__label" for="f1">名前<span class="ki-field__required">必須</span></label>
  <input id="f1" class="ki-input" aria-describedby="f1-hint" />
  <p id="f1-hint" class="ki-field__hint">英小文字とハイフンで入力する</p>
</div>
<div class="ki-field" data-invalid>
  <label class="ki-field__label" for="f2">名前<span class="ki-field__required">必須</span></label>
  <input id="f2" class="ki-input" aria-invalid="true" aria-describedby="f2-err" value="Review Daily" />
  <p id="f2-err" class="ki-field__error">英小文字とハイフンだけ使える</p>
</div>`,
    htmlNote: null,
  },
  "icon-button": {
    lead: "アイコンだけのボタン。名前(label)が必須で、スクリーンリーダーが読み上げる。意味が伝わりにくいときは Tooltip を添える。",
    props: [
      ["label", "string", "-", "スクリーンリーダーが読み上げる名前。必須"],
      ["icon", "ReactNode", "-", "アイコン。必須"],
      ["variant", '"primary" | "secondary" | "quiet" | "danger"', '"quiet"', "Button と同じ"],
      ["size", '"md" | "lg"', '"md"', "44px と 52px の正方形"],
      ["loading", "boolean", "false", "スピナーに変わり、操作できなくなる"],
      ["disabled", "boolean", "false", "操作できない"],
    ],
    classes: [
      [".ki-button.ki-icon-button", "2 つのクラスを重ねる。aria-label を付ける"],
      ["data-variant、data-size、data-loading", "Button と同じ"],
    ],
    vars: [
      ["--size-hit", "幅と高さ(44px)"],
      ["--color-*、--radius-2", "Button と同じ"],
    ],
    html: `<button type="button" class="ki-button ki-icon-button" data-variant="quiet" aria-label="閉じる">
  <svg class="ki-icon" aria-hidden="true"><use href="#close"/></svg>
</button>`,
    htmlNote: null,
  },
  input: {
    lead: "1 行のテキストを入力する。名前は Field のラベルか aria-label で必ず付ける。数字は等幅で表示できる。",
    props: [
      ["invalid", "boolean", "false", "エラー状態。枠線がエラー色になり、aria-invalid が付く。理由は Field のエラーメッセージで伝える"],
      ["loading", "boolean", "false", "右端にスピナーを表示する"],
      ["numeric", "boolean", "false", "数字を等幅で表示する"],
      ["disabled / readOnly", "boolean", "false", "無効、読み取り専用"],
      ["...input", "-", "-", "type、value、onChange など、input 要素の属性"],
    ],
    classes: [
      [".ki-input", "<input> に付ける"],
      ["aria-invalid=\"true\"", "エラー状態"],
      [".ki-input-group[data-loading] > .ki-input__adornment", "ローディング中のスピナーを右端に置く"],
      ["data-numeric", "数字を等幅で表示する"],
    ],
    vars: [
      ["--color-surface、--color-line、--color-line-strong、--color-text-muted", "背景、枠線、ホバー時の枠線、プレースホルダー"],
      ["--color-error", "エラー時の枠線"],
      ["--color-focus", "フォーカスリング"],
      ["--size-hit、--radius-2、--space-3", "高さ、角丸、左右のパディング"],
    ],
    html: `<label for="in1">名前</label>
<input id="in1" class="ki-input" placeholder="例: review" />
<input class="ki-input" aria-invalid="true" value="a b" aria-label="エラーの例" />`,
    htmlNote: null,
  },
  link: {
    lead: "別の場所へ移動する。色ではなく下線で見分けられるようにする(プライマリカラーはプライマリボタンと現在地にだけ使う)。操作を実行するときは Button を使う。",
    props: [
      ["tone", "\"default\" | \"muted\"", "\"default\"", "muted は補助的な文に使う"],
      ["standalone", "boolean", "false", "文の外に単独で置くとき。高さが 44px になる"],
      ["external", "boolean", "false", "別のタブで開く。「新しいタブで開く」を読み上げに追加する"],
      ["disabled", "boolean", "false", "href を外し、フォーカスも受けない"],
    ],
    classes: [
      [".ki-link", "<a> に付ける"],
      ["data-tone=\"muted\"", "補助的な色"],
      ["data-standalone", "単独で置く(44px)"],
      ["aria-disabled=\"true\"", "無効"],
    ],
    vars: [
      ["--color-text、--color-text-muted", "文字色"],
      ["--color-focus", "フォーカスリング"],
      ["--size-hit", "単独で置くときの高さ"],
      ["--radius-1", "フォーカスリングの角丸"],
    ],
    html: `<p>詳細は <a class="ki-link" href="#">項目の一覧</a> を参照。</p>
<a class="ki-link" data-standalone href="#">一覧へ</a>
<a class="ki-link" data-tone="muted" data-standalone href="#">トークン使用量</a>`,
    htmlNote: "文中のリンクは、タップ領域の基準の対象外とする。単独で置く場合は data-standalone を付ける。",
  },
  menu: {
    lead: "1 つのボタンから、関連する操作の一覧を開く。矢印キーで移動し、Esc で閉じ、閉じるとボタンにフォーカスが戻る。危険な操作は区切り線の下に置き、data-tone で色を変える。ページ遷移には使わない。",
    props: [
      ["trigger", "ReactElement", "-", "メニューを開くボタン。要素 1 つ"],
      ["items", "MenuEntry[]", "-", "{ label, icon?, tone?, disabled?, onSelect?, href? }、{ type: \"separator\" }、{ type: \"label\", label }"],
      ["align", "\"start\" | \"center\" | \"end\"", "\"start\"", "ボタンに対するそろえる位置"],
    ],
    classes: [
      [".ki-menu__popup、__item、__separator、__label", "Base UI の Popup と Item に当てる。素の HTML では見た目だけを提供する(開閉の動作は持たない)"],
      ["[data-tone=\"danger\"]", "危険な操作"],
      ["[data-highlighted]", "矢印キーで選択中の項目"],
      ["[data-disabled]", "無効な項目"],
    ],
    vars: [
      ["--color-surface、--color-line、--color-surface-2", "背景、枠線、選択中の項目の背景"],
      ["--color-error", "危険な操作"],
      ["--shadow-pop", "影(浮かび上がる要素用)"],
      ["--size-hit", "項目の高さ"],
      ["--radius-2、--radius-3", "項目と全体の角丸"],
    ],
    html: `<div class="ki-menu__popup" role="menu" aria-label="操作" style="position: static; display: inline-block;">
  <div class="ki-menu__item" role="menuitem" tabindex="-1">名前を変更</div>
  <div class="ki-menu__item" role="menuitem" tabindex="-1">複製</div>
  <hr class="ki-menu__separator" />
  <div class="ki-menu__item" role="menuitem" tabindex="-1" data-tone="danger">削除</div>
</div>`,
    htmlNote: "素の HTML では見た目だけを提供する。開閉や矢印キーの動作が必要なときは、React の Menu を使う。",
  },
  pagination: {
    lead: "長い一覧を複数ページに分ける。現在のページは aria-current で示し、プライマリカラー(現在地)で塗る。ページごとに URL がある場合は、getHref を渡してリンクにする。",
    props: [
      ["page / pageCount", "number", "-", "現在のページ(1 始まり)と総ページ数。必須"],
      ["onPageChange", "(page) => void", "-", "ページを移動したときに呼ばれる"],
      ["getHref", "(page) => string", "-", "渡すと、ボタンではなくリンクになる"],
      ["siblings", "number", "1", "現在のページの前後に表示する数。多いときは … で省略する"],
      ["label", "string", "\"ページ送り\"", "nav の名前"],
    ],
    classes: [
      [".ki-pagination__list、__item、__gap", "リスト、ページ、省略記号"],
      ["aria-current=\"page\"", "現在のページ"],
      [":disabled、aria-disabled", "最初と最後での「前へ」「次へ」ボタン"],
    ],
    vars: [
      ["--color-primary、--color-on-primary", "現在のページ"],
      ["--color-surface-2", "ホバー時の背景"],
      ["--size-hit", "1 つあたりの大きさ(44px)"],
      ["--space-1", "間隔"],
    ],
    html: `<nav class="ki-pagination" aria-label="ページ送り">
  <ul class="ki-pagination__list">
    <li><button type="button" class="ki-pagination__item" aria-label="前のページ" disabled>\${icon("chevron-left")}</button></li>
    <li><a class="ki-pagination__item" href="#" aria-label="1 ページ">1</a></li>
    <li><a class="ki-pagination__item" href="#" aria-label="2 ページ" aria-current="page">2</a></li>
    <li><a class="ki-pagination__item" href="#" aria-label="3 ページ">3</a></li>
    <li><a class="ki-pagination__item" href="#" aria-label="次のページ">\${icon("chevron-right")}</a></li>
  </ul>
</nav>`,
    htmlNote: null,
  },
  quote: {
    lead: "ほかの文書から引用した文。左に 2px の線を引き、出典を下に書く。斜体にはしない。強調したい自分の文章には使わない。",
    props: [
      ["cite", "ReactNode", "-", "出典"],
      ["children", "ReactNode", "-", "引用する文"],
    ],
    classes: [
      [".ki-quote", "figure に付ける"],
      ["blockquote、figcaption", "引用文、出典"],
    ],
    vars: [
      ["--color-line-strong", "左の線"],
      ["--color-text、--color-text-muted", "引用文、出典の色"],
      ["--space-4", "線との間隔"],
    ],
    html: `<figure class="ki-quote">
  <blockquote>答えはまだない。だから試す。</blockquote>
  <figcaption>KNOW IDEA のロゴに添える一言</figcaption>
</figure>`,
    htmlNote: null,
  },
  radio: {
    lead: "複数の選択肢から 1 つだけ選択する。見出し(legend)は必須。矢印キーで選択を移動できる。選択肢は 2〜6 個を目安とし、それより多い場合は Select を使う。",
    props: [
      ["legend", "ReactNode", "-", "見出し。必須"],
      ["options", "{ value, label, disabled? }[]", "-", "選択肢"],
      ["value / defaultValue / onValueChange", "string", "-", "制御と非制御"],
      ["invalid", "boolean", "false", "エラー状態の枠線"],
      ["disabled", "boolean", "false", "すべての選択肢を無効にする"],
    ],
    classes: [
      [".ki-fieldset", "見出しと選択肢をまとめる(fieldset と legend)"],
      [".ki-choice > .ki-radio", "素の HTML では <input type=\"radio\"> を使う"],
      ["[data-checked]、:checked", "選択済み"],
    ],
    vars: [
      ["--color-primary", "選択時のドットと枠線"],
      ["--color-line-strong、--color-surface", "未選択時の枠線と背景"],
      ["--color-error", "エラー状態"],
      ["--size-hit", "ラベルを含むタップ領域の高さ"],
    ],
    html: `<fieldset class="ki-fieldset">
  <legend>実行間隔</legend>
  <div class="ki-choice-group">
    <label class="ki-choice"><input type="radio" name="r" class="ki-radio" checked /><span>毎日</span></label>
    <label class="ki-choice"><input type="radio" name="r" class="ki-radio" /><span>毎週</span></label>
  </div>
</fieldset>`,
    htmlNote: null,
  },
  select: {
    lead: "選択肢から 1 つを選択する。選択肢が 7 つ以内ならラジオも検討する。React では Base UI の Select(キーボード操作とスクリーンリーダー対応を含む)、素の HTML ではブラウザ標準の select を使う。",
    props: [
      ["options", "{ value, label, disabled? }[]", "-", "選択肢。必須"],
      ["value / defaultValue / onValueChange", "string | null", "-", "制御と非制御"],
      ["placeholder", "string", "\"選択\"", "未選択のときに表示する文言"],
      ["invalid", "boolean", "false", "エラー状態の枠線"],
      ["loading", "boolean", "false", "開けなくなり、スピナーと「読み込み中」を表示する"],
      ["disabled", "boolean", "false", "操作できない"],
      ["aria-label", "string", "-", "Field の外で使うときの名前"],
    ],
    classes: [
      [".ki-select-wrap > select.ki-select", "素の HTML 用。右端の矢印は wrap が描画する"],
      ["aria-invalid=\"true\"", "エラー状態"],
      [".ki-select__popup、.ki-select__item", "Base UI の選択肢リストに当てるクラス"],
    ],
    vars: [
      ["--color-surface、--color-line-strong、--color-surface-2", "背景、枠線、項目のホバー時の背景"],
      ["--shadow-pop", "選択肢リストの影"],
      ["--size-hit、--radius-2、--radius-3", "高さ、角丸"],
    ],
    html: `<span class="ki-select-wrap">
  <select class="ki-select" aria-label="実行間隔">
    <option>毎日</option><option>毎週</option><option>毎月</option>
  </select>
</span>`,
    htmlNote: "開いたときの選択肢リストの見た目は、ブラウザに任せる。",
  },
  skeleton: {
    lead: "コンテンツが届くまでの仮の形(プレースホルダー)。アニメーションはさせない(終わらない脈動は使わない)。ラッパーに aria-busy を付け、スクリーンリーダーには「読み込み中」を 1 回だけ伝える。読み込みに 2 秒以上かかるときに表示する。",
    props: [
      ["Skeleton: size", "\"short\" | \"medium\" | \"long\"", "\"long\"", "幅 30%、60%、100%"],
      ["Skeleton: shape", "\"text\" | \"block\"", "\"text\"", "1 行か、ブロックか"],
      ["SkeletonText: lines / label", "number / string", "3 / \"読み込み中\"", "テキストの仮の行。最後の行は短い"],
    ],
    classes: [
      [".ki-skeleton[data-size][data-shape]", "プレースホルダー"],
      [".ki-skeleton-stack", "縦に並べる"],
    ],
    vars: [
      ["--color-line", "背景"],
      ["--radius-1、--radius-2", "角丸"],
      ["--space-3", "行の間隔"],
    ],
    html: `<div class="ki-skeleton-stack" aria-busy="true">
  <span class="ki-sr-only" role="status">読み込み中</span>
  <span class="ki-skeleton" data-size="long"></span>
  <span class="ki-skeleton" data-size="long"></span>
  <span class="ki-skeleton" data-size="medium"></span>
</div>`,
    htmlNote: null,
  },
  spinner: {
    lead: "短い待ち時間を示す、小さな回転の印。ボタンや入力欄の中で使う。大きさは周囲の文字サイズ(1em)に合わせる。prefers-reduced-motion では回転させず、点線の輪にする。",
    props: [
      ["label", "string", "-", "スクリーンリーダーが読み上げる文言。なければ装飾として扱う"],
      ["className", "string", "-", "追加のクラス"],
    ],
    classes: [
      [".ki-spinner", "スピナー。大きさは font-size で変える"],
    ],
    vars: [
      ["currentColor", "色は周囲の文字色に従う"],
    ],
    html: `<span class="ki-spinner" aria-hidden="true"></span>
<span class="ki-sr-only" role="status">読み込み中</span>`,
    htmlNote: "スクリーンリーダー向けに、ki-sr-only のテキストを添える。",
  },
  switch: {
    lead: "操作するとすぐに反映されるオンとオフの切り替え。フォームで「保存」を押してから反映される設定には、Checkbox を使う。ラベルには状態ではなく対象を書く(「オン」ではなく「自動で実行する」)。",
    props: [
      ["label", "ReactNode", "-", "ラベル。対象を書く"],
      ["checked / defaultChecked / onCheckedChange", "boolean", "-", "制御と非制御"],
      ["loading", "boolean", "false", "反映を待つ間。操作できなくなり、スピナーを表示する"],
      ["disabled", "boolean", "false", "操作できない"],
    ],
    classes: [
      [".ki-choice > .ki-switch", "素の HTML では <input type=\"checkbox\" role=\"switch\"> を使う"],
      ["[data-checked]、:checked", "オン"],
    ],
    vars: [
      ["--color-primary", "オン時の背景"],
      ["--color-line-strong、--color-surface", "オフ時の背景とつまみ"],
      ["--space-5、--space-6、--space-2", "サイズ(24px、40px)"],
      ["--motion-duration-state", "つまみの動き。prefers-reduced-motion で止まる"],
    ],
    html: `<label class="ki-choice"><input type="checkbox" role="switch" class="ki-switch" checked /><span>自動で実行する</span></label>`,
    htmlNote: null,
  },
  table: {
    lead: "行と列で比較するための表。数字の列は等幅で右揃えにする。狭い幅では表の中だけが横にスクロールし、ページ全体は動かない。並べ替えは見出しのボタンで行い、aria-sort が付く。",
    props: [
      ["label", "string", "-", "表の名前。必須。横スクロール領域の名前にもなる"],
      ["columns", "Column[]", "-", "key、header、numeric、sortable、wrap、render"],
      ["rows / rowKey", "T[] / (row) => string", "-", "行と、行ごとに一意なキー"],
      ["sort / onSortChange", "{ key, direction } | null", "-", "並べ替え。見出しを押すと、昇順、降順、解除の順に切り替わる。実際の並べ替え処理は呼び出し側が行う"],
      ["selectable / selected / onSelectedChange", "boolean / string[] / fn", "false", "行の選択。見出しのチェックボックスで全選択する"],
      ["loading", "boolean", "false", "仮の行を 3 つ表示する。aria-busy が付く"],
      ["error / onRetry", "ReactNode / () => void", "-", "エラーの表示と「再試行」ボタン"],
      ["emptyTitle / emptyText / emptyAction", "-", "-", "行が 0 件のときの Empty state"],
    ],
    classes: [
      [".ki-table-wrap > table.ki-table", "外側の枠が横にスクロールする。tabindex=\"0\"、role=\"region\"、aria-label を付ける"],
      ["th[aria-sort]、.ki-table__sort", "並べ替えできる見出し"],
      ["td[data-numeric]、th[data-numeric]", "数字の列。右揃えで等幅"],
      ["tr[aria-selected=\"true\"]", "選択中の行。左端にプライマリカラーの 2px の線が付く"],
      ["[data-select]", "選択用チェックボックスの列"],
    ],
    vars: [
      ["--color-surface、--color-surface-2、--color-line", "背景、見出しの背景、行の区切り線"],
      ["--color-primary", "選択中の行のマーク"],
      ["--font-mono、--font-size-2", "数字と表のフォント"],
      ["--space-2、--space-3、--size-hit", "余白、見出しボタンの高さ"],
    ],
    html: `<div class="ki-table-wrap" role="region" aria-label="項目の一覧" tabindex="0">
  <table class="ki-table">
    <thead><tr>
      <th scope="col" aria-sort="ascending"><button type="button" class="ki-table__sort">名前</button></th>
      <th scope="col" data-numeric>実行回数</th>
      <th scope="col" data-numeric>使用トークン数</th>
    </tr></thead>
    <tbody>
      <tr><td>review</td><td data-numeric>24</td><td data-numeric>182,400</td></tr>
      <tr aria-selected="true"><td>production</td><td data-numeric>7</td><td data-numeric>96,250</td></tr>
    </tbody>
  </table>
</div>`,
    htmlNote: "並べ替えと選択の動作は自分で実装する(React の Table には組み込まれている)。",
  },
  tabs: {
    lead: "同じ場所で内容を切り替える。矢印キーでタブ間を移動し、Tab で内容に入る。選択中のタブの下に、プライマリカラー(現在地)の 2px の線を引く。ページ遷移にはタブではなくリンクを使う。",
    props: [
      ["label", "string", "-", "タブ一覧の名前。必須"],
      ["items", "{ value, label, content, disabled? }[]", "-", "タブ"],
      ["value / defaultValue / onValueChange", "string", "最初のタブ", "制御と非制御"],
    ],
    classes: [
      [".ki-tabs__list、__tab、__panel", "一覧、タブ、内容。role は tablist、tab、tabpanel"],
      ["aria-selected=\"true\"、[data-active]", "選択中のタブ"],
      ["[data-disabled]", "無効なタブ"],
    ],
    vars: [
      ["--color-primary", "選択中のタブの下線"],
      ["--color-line、--color-surface-2", "一覧の線、ホバー時の背景"],
      ["--color-text、--color-text-muted", "文字色"],
      ["--size-hit", "タブの高さ"],
    ],
    html: `<div class="ki-tabs">
  <div class="ki-tabs__list" role="tablist" aria-label="表示の切り替え">
    <button class="ki-tabs__tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">概要</button>
    <button class="ki-tabs__tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">実行履歴</button>
  </div>
  <div class="ki-tabs__panel" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0"><p>項目数と、直近の更新。</p></div>
  <div class="ki-tabs__panel" role="tabpanel" id="p2" aria-labelledby="t2" hidden><p>実行履歴。</p></div>
</div>`,
    htmlNote: "切り替えの動作(aria-selected、hidden、矢印キー)は自分で実装する。React の Tabs には組み込まれている。",
  },
  textarea: {
    lead: "複数行のテキストを入力する。サイズ変更は縦方向のみ可能。",
    props: [
      ["invalid", "boolean", "false", "エラー状態の枠線と aria-invalid"],
      ["rows", "number", "3", "初期の行数"],
      ["...textarea", "-", "-", "value、onChange、disabled など"],
    ],
    classes: [
      [".ki-textarea", "<textarea> に付ける"],
      ["aria-invalid=\"true\"", "エラー状態"],
    ],
    vars: [
      ["--color-surface、--color-line-strong、--color-error、--color-focus", "背景、枠線、エラー、フォーカス"],
      ["--size-hit、--space-2、--space-3、--radius-2", "最小の高さ(--size-hit の 2 倍)、余白、角丸"],
    ],
    html: `<textarea class="ki-textarea" rows="3" aria-label="メモ" placeholder="メモを入力"></textarea>`,
    htmlNote: null,
  },
  toast: {
    props: [
      ["ToastProvider", "{ timeout?, limit? }", "5000, 3", "アプリのルートに 1 つ置く。消えるまでの時間(ms)と、同時に表示する数"],
      ["useToast().show", "{ title, description?, tone?, timeout? }", "-", "トーストを表示する。tone は info、success、warn、error"],
      ["useToast().close", "(id?) => void", "-", "トーストを閉じる"],
    ],
    classes: [
      [".ki-toast-viewport", "トーストの表示領域。画面下部に置き、左右に 16px の余白を取る"],
      [".ki-toast[data-type]", "トースト本体。data-type は info、success、warn、error"],
      [".ki-toast__icon、__content、__title、__description、__close", "内部の要素"],
    ],
    vars: [
      ["--color-surface、--color-line、--color-text-muted", "背景、枠線、説明の色"],
      ["--color-success、--color-warn、--color-error", "アイコンの色"],
      ["--shadow-pop", "影(浮かび上がる要素用)"],
      ["--space-4", "画面端との余白(16px)"],
    ],
    html: `<div class="ki-toast" data-type="success" role="status">
  <span class="ki-toast__icon"><svg class="ki-icon" aria-hidden="true"><use href="#success"/></svg></span>
  <div class="ki-toast__content"><p class="ki-toast__title">成功</p><p class="ki-toast__description">設定を保存した。</p></div>
</div>`,
    htmlNote: "トーストを消す動作は自分で実装する。",
  },
  tooltip: {
    lead: "ポインターを置いたときやフォーカスしたときに、短い補足を表示する。ホバーとフォーカスで開き、Esc で閉じる。操作要素や重要な文章は入れない(タッチ端末では表示されないため)。アイコンだけのボタンの名前は aria-label で付け、Tooltip は補足にとどめる。",
    props: [
      ["content", "ReactNode", "-", "補足の文。短くする"],
      ["children", "ReactElement", "-", "対象の要素 1 つ"],
      ["side", "\"top\" | \"bottom\" | \"left\" | \"right\"", "\"top\"", "表示する側"],
    ],
    classes: [
      [".ki-tooltip", "吹き出し。Base UI の Popup に当てる"],
      [".ki-tooltip-wrap", "素の HTML 用。ホバーと focus-within で表示する。Esc では閉じない(React 版は閉じる)"],
    ],
    vars: [
      ["--color-surface、--color-line、--color-text", "背景、枠線、文字色"],
      ["--shadow-pop", "影(浮かび上がる要素用)"],
      ["--radius-2、--space-1、--space-3", "角丸、余白"],
    ],
    html: `<span class="ki-tooltip-wrap">
  <button type="button" class="ki-button" data-variant="secondary" aria-describedby="tt1">集計</button>
  <span id="tt1" role="tooltip" class="ki-tooltip">日付は日本時間の 0 時で区切る</span>
</span>`,
    htmlNote: "素の HTML では、ホバーとフォーカスで表示するだけ(Esc では閉じない)。",
  },
  alert: {
    vars: [
      ["--color-info-soft、--color-success-soft、--color-warn-soft、--color-error-soft", "各種類の背景"],
      ["--color-info、--color-success、--color-warn、--color-error", "アイコンの色"],
      ["--color-text", "文字色(すべての種類でコントラスト比 4.5:1 以上)"],
      ["--radius-2、--space-3、--space-4", "角丸、余白"],
    ],
    html: `<div class="ki-alert" data-tone="info">\${icon("info")}
  <div class="ki-alert__body"><p class="ki-alert__title">設定を更新した</p><p class="ki-alert__text">変更は次回の読み込みから反映される。</p></div>
</div>
<div class="ki-alert" data-tone="error" role="alert">\${icon("error")}
  <div class="ki-alert__body"><p class="ki-alert__text">保存できなかった。</p></div>
</div>`,
    htmlNote: null,
  },
};
