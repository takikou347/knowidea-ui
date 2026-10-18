// Data display カテゴリのコンポーネント。
export const display = [
  {
    slug: "avatar", name: "Avatar", imports: ["Avatar"],
    lead: "人や所有者を表す小さな画像。画像がなければイニシャル、名前もなければ人のアイコンを表示する。",
    demos: [
      { fn: "Basic", title: "Without image", text: "名前があればイニシャルを表示し、スクリーンリーダー向けの名前としても使う。" },
      { fn: "Sizes", title: "Sizes and shapes", text: "sm(24px)、md(32px)、lg(44px)の 3 サイズ。形は角丸(デフォルト)か円形。" },
    ],
    props: [
      ["name", "string", "-", "名前。イニシャルと、スクリーンリーダー向けの名前に使う"],
      ["src", "string", "-", "画像の URL。読み込めなければイニシャルに切り替わる"],
      ["size", '"sm" | "md" | "lg"', '"md"', "24px、32px、44px"],
      ["shape", '"square" | "circle"', '"square"', "角丸(--radius-2)か円形"],
    ],
    classes: [[".ki-avatar", "本体。data-size、data-shape"], [".ki-avatar__image", "画像"], [".ki-avatar-group", "重ねて並べるためのラッパー"]],
    vars: [["--color-surface-2、--color-line、--color-text", "背景、枠線、イニシャルの色"], ["--radius-2", "角丸"], ["--space-5、--space-6", "サイズ"]],
    html: `<span class="ki-avatar" role="img" aria-label="Sample User">SU</span>
<span class="ki-avatar" data-size="lg" data-shape="circle" role="img" aria-label="サンプル">サ</span>`,
    a11y: ["role=\"img\" と aria-label に名前を入れる。画像の alt は空にして、名前が二重に読み上げられないようにする", "Avatar 自体は操作できない。操作可能にする場合は Button か Link で包み、包んだ側が 44px を満たすようにする"],
  },
  {
    slug: "badge", name: "Badge", imports: ["Badge", "Icon"],
    demos: [
      { fn: "Tones", title: "Tones", text: "色だけに頼らず、必ず文字を入れる。アイコンは任意。" },
      { fn: "Numeric", title: "Numeric", text: "数字を等幅で表示する。" },
    ],
    sample: true,
    a11y: ["色だけで意味を伝えない。必ず文字を入れる", "Badge は操作できない。操作できるものには Chip を使う"],
  },
  {
    slug: "chip", name: "Chip", imports: ["Chip"],
    lead: "小さなラベル。単なる表示、フィルター用の選択、削除できるタグのいずれにも使える。",
    demos: [
      { fn: "Filter", title: "Filter", text: "押すと選択状態が切り替わる(aria-pressed)。選択中は太い枠線と先頭のチェックで示す。プライマリカラーはプライマリボタンと現在地にだけ使うため、背景は塗らない。" },
      { fn: "Removable", title: "Removable", text: "右端の × で削除する。削除後のフォーカスは、呼び出し側が次の要素に移す。" },
      { fn: "Static", title: "Static", text: "操作できない表示専用のチップ。見た目の高さは 32px。" },
    ],
    props: [
      ["label", "ReactNode", "-", "テキスト。必須"],
      ["icon", "ReactNode", "-", "先頭に表示する小さなアイコン"],
      ["onClick", "() => void", "-", "指定すると、操作できるチップ(フィルターなど)になる"],
      ["selected", "boolean", "false", "操作できるチップの選択状態。aria-pressed になる"],
      ["onDelete", "() => void", "-", "指定すると、右側に削除ボタンが表示される"],
      ["deleteLabel", "string", "{label} を外す", "削除ボタンの名前"],
      ["disabled / loading", "boolean", "false", "無効、ローディング中"],
    ],
    classes: [
      [".ki-chip", "本体。data-selected、data-disabled、data-loading"],
      [".ki-chip__label", "操作できないチップの文字"],
      [".ki-chip__main、.ki-chip__remove", "タップ領域(44px)。見た目の高さ 32px から上下にはみ出す"],
      [".ki-chips", "並べるためのラッパー"],
    ],
    vars: [["--color-surface、--color-line-strong、--color-text", "背景、枠線、文字色"], ["--color-text", "選択状態の枠線とマーク"], ["--radius-2、--space-6", "角丸、見た目の高さ"], ["--size-hit", "タップ領域"]],
    html: `<span class="ki-chip"><span class="ki-chip__label">下書き</span></span>
<span class="ki-chip" data-selected><button type="button" class="ki-chip__main" aria-pressed="true"><svg class="ki-icon" aria-hidden="true"><use href="#check"/></svg>すべて</button></span>`,
    a11y: ["見た目の高さは 32px でも、タップ領域は 44px ある(ボタンが上下にはみ出す)", "選択できるチップは aria-pressed を持つ。削除ボタンの名前には、何を外すのかを含める"],
  },
  {
    slug: "status", name: "Status", imports: ["Status"],
    lead: "状態を形(アイコン)、文字、色で伝えるマーク。状態の種類は kind で渡し、文字は label に書く。",
    demos: [
      { fn: "Kinds", title: "Kinds", text: "neutral、info、success、warn、error と、working、paused、pending、stopped。" },
      { fn: "Sizes", title: "Sizes", text: "lg は、一目で状態を伝えたい場所に使う。" },
      { fn: "Custom", title: "Custom", text: "tone と icon を渡すと、デフォルトにない状態も作れる。" },
    ],
    props: [
      ["kind", '"neutral" | "info" | "success" | "warn" | "error" | "working" | "paused" | "pending" | "stopped"', '"neutral"', "状態の種類。色とアイコンのデフォルトが決まる"],
      ["label", "string", "-", "テキスト。必須。色だけに頼らないために使う"],
      ["tone", '"neutral" | "info" | "success" | "warn" | "error"', "kind に応じる", "色を変える"],
      ["icon", "IconName", "kind に応じる", "アイコンを変える"],
      ["size", '"md" | "lg"', '"md"', "lg は高さ 32px"],
    ],
    classes: [[".ki-status", "本体。data-tone、data-size"]],
    vars: [["--color-info(-soft)、--color-success(-soft)、--color-warn(-soft)、--color-error(-soft)", "文字色と背景"], ["--color-surface-2、--color-text", "neutral の背景と文字色"], ["--radius-1、--radius-2", "角丸"]],
    html: `<span class="ki-status" data-tone="success"><svg class="ki-icon" aria-hidden="true"><use href="#success"/></svg>完了</span>
<span class="ki-status" data-tone="warn" data-size="lg"><svg class="ki-icon" aria-hidden="true"><use href="#paused"/></svg>待機中</span>`,
    a11y: ["色だけで伝えない。アイコンと文字を必ず付ける", "Status は操作できない。文字は短くし、状態を言い切る"],
  },
  {
    slug: "stat", name: "Stat", imports: ["Stat", "Sparkline"],
    lead: "1 つの数値を、単位、前回との差、推移の小さな折れ線とあわせて表示する。数字は等幅で、桁をそろえる。",
    sample: true,
    demos: [
      { fn: "Basic", title: "Basic", text: "差の矢印は上下のみで、良し悪しを示す色は付けない。", block: true },
      { fn: "Spark", title: "Sparkline only", text: "線と最後の点だけを描く。値は Stat の数字が伝える。" },
    ],
    props: [
      ["label", "string", "-", "何の数値か。必須"],
      ["icon", "IconName", "-", "ラベルの前に表示するアイコン"],
      ["value", "number | string | null", "-", "数値。null の場合は「不明」と表示する"],
      ["unit", "string", "-", "単位"],
      ["delta", '{ dir: "up" | "down" | "flat" | "none"; text?: string }', "-", "前回との差。矢印は上下のみ"],
      ["deltaLabel", "string", '"前回比"', "差の前に付ける語"],
      ["sub", "string", "-", "数値の下の補足"],
      ["spark / sparkLabel", "number[] / string", "-", "推移の小さな折れ線と、スクリーンリーダー向けの文言"],
      ["asOf / asOfFormat", "string", '- / "{time} 時点"', "いつ時点の数値か。時刻は等幅で表示する"],
      ["stale", "boolean", "false", "数値が古いことを示す。「古い値」のマークが付く"],
      ["fallback", "string", '"不明"', "数値がないときに表示する語"],
      ["state / error", '"ready" | "loading" | "error"', '"ready"', "ローディングとエラーの状態(error には理由を渡す)"],
    ],
    classes: [
      [".ki-stat", "本体。data-state: loading | error"],
      [".ki-stat__head、__value、__num、__unit、__foot、__delta、__sub、__spark、__asof、__error", "内部の要素"],
      [".ki-stats", "並べるためのグリッド(auto-fit)"],
      [".ki-spark", "Sparkline の SVG"],
    ],
    vars: [["--color-surface、--color-line、--color-text", "背景、枠線、数値の色"], ["--color-text-muted", "ラベル、単位、補足"], ["--color-error", "エラー時の枠線と文字色"], ["--font-mono", "数値のフォント"], ["--font-size-5", "数値のサイズ(24px)"]],
    a11y: ["role=\"group\" と aria-label で、ラベルを名前にする", "差の矢印は文字(「前回比 +12%」)と一緒に表示し、矢印だけで伝えない", "推移の折れ線は role=\"img\" と、スクリーンリーダー向けの文言を持つ"],
  },
  {
    slug: "table", name: "Table", imports: ["Table", "Badge"],
    demos: [
      { fn: "Sortable", title: "Sorting and selection", text: "見出しを押すと並べ替わる。左端のチェックボックスで行を選択する。", block: true },
      { fn: "Reorderable", title: "Reorderable", text: "行の先頭の掴む所を、マウスか指で押したまま動かすと、行が移る。キーボードでは、掴む所に Tab で移り、Space で持ち上げ、上下の矢印で動かし、Space か Enter で置く。Esc で元に戻す。", block: true },
    ],
    sample: true,
    props: [
      ["label", "string", "-", "表の名前。必須(スクリーンリーダーが読み上げる)"],
      ["columns", "Column[]", "-", "{ key, header, numeric?, sortable?, wrap?, render? }"],
      ["rows / rowKey", "T[] / (row) => string", "-", "行と、行ごとの一意なキー"],
      ["sort / onSortChange", "SortState | null / (sort) => void", "-", "並べ替えの列と向き"],
      ["selectable / selected / onSelectedChange / rowLabel", "boolean / string[] / (keys) => void / (row) => string", "-", "行の選択。rowLabel はチェックボックスと掴む所の名前に使う"],
      ["reorderable", "boolean", "false", "行の先頭に掴む所を出す。onReorder が無いと働かない"],
      ["onReorder", "(fromIndex: number, toIndex: number) => void", "-", "並べ替えが確定したとき。位置は rows の中の 0 から数える番号。呼び出し側が rows を並べ直す"],
      ["loading / error / onRetry", "boolean / ReactNode / () => void", "-", "読み込み中と失敗の表示。このあいだ掴む所は押せない"],
      ["emptyTitle / emptyText / emptyAction", "string / string / ReactNode", "-", "行が無いときの表示"],
      ["caption", "ReactNode", "-", "見える表題"],
    ],
    classes: [
      [".ki-table-wrap、.ki-table", "表と、横に動く外枠。数字の列は td[data-numeric]"],
      [".ki-table__sort", "並べ替えの見出しのボタン"],
      [".ki-table__handle", "行の掴む所のボタン。data-active は掴んでいる間。見た目だけ。ドラッグの動きは React の Table だけが持つ"],
      ["th/td[data-handle]", "掴む所の列。狭い幅で横に動いても、左端に残る"],
      ["tr[data-dragging]、tr[data-shift]", "持ち上げた行(弱い影)と、間でずれる行(落とす所に空きができる)"],
    ],
    vars: [["--color-line、--color-surface、--color-surface-2", "枠、行、見出しの背景"], ["--size-hit", "掴む所とチェックボックスの大きさ(44px)"], ["--color-focus", "focus の輪"]],
    a11y: [
      "<table> と scope=\"col\" を使う。並べ替え中の列には aria-sort が付く",
      "横にあふれる表は region として Tab で入り、矢印キーでスクロールできる",
      "行の選択用チェックボックスにも名前を付ける(rowLabel)",
      "並べ替え: 掴む所は <button> で「(行の名前) を並べ替える(3 行目)」という名前を持つ。Space で持ち上げ、上下の矢印で 1 行ずつ動かし、Space か Enter で置く。Esc か、掴む所から focus が離れると元に戻る",
      "動いた位置は、表の外にある aria-live の領域が日本語で伝える(例「3 行目から 1 行目へ移した」)。操作の手順は aria-describedby で読まれる",
      "指では掴む所だけを押して動かす(touch-action: none は掴む所だけ)。表のほかの所は、ふつうに画面をスクロールできる",
      "掴む所は 44px 四方。reduced-motion のときは、動きを付けない(行は指に付いて動くだけで、遷移の動きは無い)",
      "並べ替えの中身(rows の順序)は呼び出し側が持つ。列の並べ替え(sort)とは別なので、sort を使う表では、並べ替えの列を選んでいない間だけ reorderable を使う",
    ],
  },
  {
    slug: "list", name: "List", imports: ["List"],
    lead: "行の一覧。タイトル、2 行目のメタ情報、末尾の操作を持ち、行を選択できるようにもできる。幅に応じてレイアウトが切り替わる。",
    sample: true,
    demos: [
      { fn: "Basic", title: "Basic", text: "タイトルはリンクで、行全体がクリック領域になる。", block: true },
      { fn: "Selectable", title: "Selectable", text: "左端のチェックボックスで行を選択する。上部のチェックボックスですべてを選択する。", block: true },
      { fn: "Queue", title: "Queue before sending", text: "選択して操作すると「送信待ち」の一覧に追加され、あとからまとめて 1 回で送信する。SelectionBar と組み合わせた例。", block: true },
      { fn: "Motion", title: "Motion", text: "足した行は上から少し滑って出る。消した時と並べ替えた時は、残った行が新しい位置へ滑る。初めて出た時と、動きを減らす設定では動かない。", block: true },
    ],
    props: [
      ["label", "string", "-", "一覧の名前。必須(スクリーンリーダーが読み上げる)"],
      ["items", "ListEntry[]", "-", "{ id, title, href?, meta?, side?, disabled? }"],
      ["selected / onSelectedChange", "string[] / (ids) => void", "-", "両方を渡すと、選択できる一覧になる"],
      ["state", '"ready" | "loading" | "empty" | "error"', '"ready"', "状態"],
      ["summary", "ReactNode", "-", "チェックボックスの横に表示するテキスト(件数など)"],
      ["selectAllLabel / selectedLabel", "string", '"すべて選択" / "{count} 件を選択中"', "上部のチェックボックスの文言"],
      ["emptyText / errorText / loadingText", "string", "-", "各状態のメッセージ"],
    ],
    classes: [
      [".ki-list", "一覧。container を持ち、幅が 560px 以上になると 1 行のレイアウトに切り替わる。data-selectable"],
      [".ki-list__item", "行。data-selected、data-disabled、data-state"],
      [".ki-list__pick、__main、__title、__meta、__side、__head、__state", "内部の要素"],
    ],
    vars: [["--color-surface、--color-surface-2、--color-line", "背景、ホバー時の背景、区切り線"], ["--color-primary", "選択中の行の左線と背景"], ["--size-hit", "タイトルのリンクとチェックボックスの高さ"], ["--font-mono", "時刻と番号"]],
    a11y: ["<ul> の各行として描画する。タイトルのリンクの ::after によって行全体がクリック領域になるが、チェックボックスと末尾の操作は前面に出し、個別に操作できる", "チェックボックスの名前は「{タイトル} を選択」。上部のチェックボックスは indeterminate を持つ"],
  },
  {
    slug: "timeline", name: "Timeline", imports: ["Timeline"],
    lead: "イベントを新しい順に並べる一覧。時刻、タイトル、本文、補足を持つ。",
    sample: true,
    demos: [{ fn: "Basic", title: "Basic", text: "tone でマークの色を変える。リンクがある行は、行全体がクリック領域になる。", block: true }],
    props: [
      ["items", "TimelineEntry[]", "-", "{ id, time, title, text, icon?, tone?, href?, meta? }"],
      ["state", '"ready" | "loading" | "empty" | "error"', '"ready"', "状態"],
      ["emptyText / errorText / loadingText", "string", "-", "各状態のメッセージ"],
    ],
    classes: [[".ki-timeline", "一覧"], [".ki-timeline__item", "行。data-tone: success | warn | error | info"], [".ki-timeline__icon、__body、__text、__title、__meta", "内部の要素"]],
    vars: [["--color-success、--color-warn、--color-error、--color-info", "マークの色"], ["--color-text-muted", "時刻と補足の文字色"], ["--font-mono", "時刻のフォント"]],
    a11y: ["<ul> で描画し、時刻には <time> を使う", "マークの色は意味を補うだけにする。何が起きたかはタイトルの文字で伝える"],
  },
  {
    slug: "tooltip", name: "Tooltip", imports: ["Tooltip"],
    demos: [{ fn: "Basic", title: "Basic", text: "短い補足だけを入れる。重要な情報は本文に書く。" }],
    a11y: ["フォーカスでも表示される。Esc で閉じる", "補足であり、名前の代わりにはならない(IconButton には label が必要)", "タッチ端末では表示されない前提で、なくても使えるようにする"],
  },
  {
    slug: "popover", name: "Popover", imports: ["Popover", "Button"],
    lead: "ボタンの近くに出る小さな面。表示の設定や、言葉の説明のように、今の画面から離れずに済む短い中身に使う。中で押せる物があってよい点が Tooltip と違う。外を押すか Esc で閉じ、開いたボタンに focus が戻る。",
    demos: [
      { fn: "Basic", title: "Basic", text: "表示の設定を開く例。closable で右上に閉じるボタンを出す。" },
      { fn: "Info", title: "Explanation", text: "言葉の横の i から説明を出す。指で触る画面では Tooltip が出ないので、説明は Popover にする。" },
    ],
    props: [
      ["trigger", "ReactElement", "-", "開くボタン。必須"],
      ["title / description", "ReactNode", "-", "見出しと説明。見出しが読み上げの名前になる"],
      ["children", "ReactNode", "-", "中身"],
      ["side / align", "\"top\" | \"bottom\" | \"left\" | \"right\" / \"start\" | \"center\" | \"end\"", "\"bottom\" / \"start\"", "開く向き。画面の端では反対へ回る"],
      ["closable / closeLabel", "boolean / string", "false / \"閉じる\"", "右上の閉じるボタン"],
      ["aria-label", "string", "-", "見出しが無い時の名前"],
      ["open / defaultOpen / onOpenChange", "boolean", "-", "制御と非制御"],
    ],
    classes: [[".ki-popover", "面。data-starting-style と data-ending-style で出入りする"], [".ki-popover__head、__title、__description、__body", "見出しの行、見出し、説明、中身"]],
    vars: [["--color-surface、--color-line、--shadow-pop", "背景、枠線、影"], ["--radius-3", "角丸"], ["--motion-duration-fast", "出入りの動き。prefers-reduced-motion で止まる"]],
    html: `<!-- React を使わない時は、ブラウザの popover 属性を使う -->
<button type="button" class="ki-button" data-variant="secondary" popovertarget="p1">表示</button>
<div id="p1" popover class="ki-popover" style="position: fixed; inset: auto; margin: auto"><p class="ki-popover__description">ブラウザの popover は、外を押すか Esc で閉じる。</p></div>`,
    a11y: ["Base UI の Popover。開くと中へ focus が移り、Esc で閉じて開いたボタンに戻る", "見出しが無い時は aria-label で名前を付ける", "説明だけの時も、指で触る画面で読めるように Tooltip ではなく Popover を使う"],
  },
  {
    slug: "code-block", name: "CodeBlock", imports: ["CodeBlock"],
    demos: [
      { fn: "Basic", title: "Basic", text: "コピーボタンが付く。" },
      { fn: "LineNumbers", title: "Line numbers", text: "行番号は、コピーされる文字には含まれない。" },
    ],
    a11y: ["横スクロールする領域は tabindex=\"0\" と名前を持つ。Tab で入り、矢印キーでスクロールする", "コピーの結果は role=\"status\" で伝える"],
  },
  {
    slug: "kbd", name: "Kbd", imports: ["Kbd"],
    lead: "キーボードのキー。ショートカットを文の中や一覧に出す。同時に押すキーは + でつなぐ。⌘ や ↵ のような記号は、読み上げでは名前(Command、Enter)にする。",
    demos: [
      { fn: "Basic", title: "Basic", text: "文の中に置く。字の大きさは周りに合わせる。" },
      { fn: "Combination", title: "Combination", text: "keys を配列にすると、同時に押すキーになる。" },
    ],
    props: [
      ["keys", "string | string[]", "-", "1 つのキーか、同時に押すキーの並び"],
    ],
    classes: [
      [".ki-kbd", "全体(<kbd>)。字の大きさは周りに合わせる"],
      [".ki-kbd__key", "1 つのキー(中の <kbd>)。下の線を太くして、キーの形に見せる"],
      [".ki-kbd__plus", "キーの間の +(読み上げない)"],
    ],
    vars: [["--color-line-strong、--color-surface", "キーの枠と背景"], ["--font-mono、--radius-1", "等幅の字と、小さな角丸"]],
    html: `<kbd class="ki-kbd"><kbd class="ki-kbd__key">Ctrl</kbd><span class="ki-kbd__plus" aria-hidden="true">+</span><kbd class="ki-kbd__key">K</kbd></kbd>`,
    a11y: ["<kbd> の中に、キーごとの <kbd> を入れる(HTML の決まりの、同時に押すキーの書き方)", "記号のキーは、見た目は記号のまま、読み上げでは名前にする", "押せる物ではないので、focus しない"],
  },
  {
    slug: "quote", name: "Quote", imports: ["Quote"],
    demos: [{ fn: "Basic", title: "Basic", text: "出典は figcaption に入る。" }],
    a11y: ["<figure> と <blockquote> を使う。出典は <figcaption> に書く"],
  },
  {
    slug: "display", name: "Display", imports: ["Display"],
    lead: "大きな見出し。ページの題と、節の頭の大きな見出しだけに使い、1 画面に 1〜2 か所にする。書体は見出し用の Murecho(800)で、本文の IBM Plex Sans JP と形で分ける。大きさは画面の幅に付いてくる(size 1 は 40〜56px、size 2 は 32〜44px)。",
    demos: [
      { fn: "Basic", title: "Basic", text: "既定は h1、size 1。本文は今までの大きさのまま、題だけを大きくする。" },
      { fn: "Sizes", title: "Sizes", text: "size 1 は画面で一番大きな字、size 2 は節の頭。ふつうの見出し(18px、Plex)と並べた時の差。" },
    ],
    props: [
      ["as", '"h1" | "h2" | "h3" | "p"', '"h1"', "見出しの段。見た目の大きさとは別に、文書の構造で選ぶ"],
      ["size", "1 | 2", "1", "1 は 1 画面に 1 か所、2 は節の頭"],
      ["children", "ReactNode", "-", "見出しの文字"],
    ],
    classes: [[".ki-display", "本体。data-size=\"2\" で 2 段目"]],
    vars: [["--font-display、--font-weight-display", "見出しの書体(Murecho)と太さ 800"], ["--font-size-display-1、--font-size-display-2", "clamp() の大きさ"], ["--font-line-height-display-1、--font-line-height-display-2", "行の高さ 1.12 と 1.2"]],
    html: `<h1 class="ki-display">夜更けの台所ラジオ</h1>
<h2 class="ki-display" data-size="2">今週の回</h2>`,
    a11y: ["見出しの段(h1〜h3)は文書の構造で選び、大きさのために段を飛ばさない", "書体が届く前も IBM Plex Sans JP で読める(font-display: swap)"],
  },
  {
    slug: "jacket", name: "Jacket", imports: ["Jacket"],
    lead: "題字のジャケット。番組、回、記事、作品の顔を、色の面に題字を組んで出す。アイコンを色の四角に入れたタイルの代わりに使う。画像の面なので角は直角で、テーマの角丸にも付いていかない。題字の大きさはジャケットの幅と題の長さに付いてくる。",
    demos: [
      { fn: "Basic", title: "Basic", text: "title の \\n で行を切る。meta は題の後ろに添える 1 行で、題の上には置かない。" },
      { fn: "Tones", title: "Tones and colors", text: "primary、ink、paper の 3 つと、番組ごとの color と textColor。color を渡す時は、字との差を 3:1 以上にする(題字は大きな字)。" },
      { fn: "Layouts", title: "Layouts", text: "縦書き(orientation=\"vertical\")、下寄せ(align=\"end\")、4:5 の portrait。長い題は自動で字を小さくする。" },
      { fn: "WithTitle", title: "Next to a title", text: "一覧の行で、隣に同じ題が文字で出ている時は decorative にして、読み上げを 1 回にする。" },
    ],
    props: [
      ["title", "string", "-", "題字。\"\\n\" で行を切れる"],
      ["meta", "ReactNode", "-", "題の後ろに添える 1 行(番組名、回の番号など)"],
      ["tone", '"primary" | "ink" | "paper"', '"primary"', "面の色。ink は字の色の面、paper は淡い面"],
      ["color、textColor", "string", "-", "番組ごとの面の色と字の色。組で渡す"],
      ["ratio", '"square" | "portrait" | "landscape"', '"square"', "1:1、4:5、16:9"],
      ["align", '"start" | "end"', '"start"', "題を上に置くか、下に寄せるか"],
      ["orientation", '"horizontal" | "vertical"', '"horizontal"', "vertical は題を縦書きにする"],
      ["fit", '"auto" | "xl" | "l" | "m" | "s"', '"auto"', "題字の大きさ(幅の 24%、19%、15%、11%)。auto は題の長さから選ぶ(jacketFit)"],
      ["decorative", "boolean", "false", "隣に同じ題が出ている時に読み上げから外す"],
    ],
    classes: [
      [".ki-jacket", "本体。data-tone、data-ratio、data-align、data-orientation、data-fit。container query の入れ物"],
      [".ki-jacket__face", "中の余白(幅の 7%)と並び"],
      [".ki-jacket__title", "題字。--font-display、大きさは cqw"],
      [".ki-jacket__meta", "添える 1 行"],
    ],
    vars: [["--ki-jacket-bg、--ki-jacket-fg", "面の色と字の色(既定は --color-primary と --color-on-primary)"], ["--ki-jacket-size", "題字の大きさ(既定 15cqw)"], ["--font-display、--font-weight-display", "題字の書体と太さ"]],
    html: `<div class="ki-jacket">
  <div class="ki-jacket__face">
    <p class="ki-jacket__title">夜更けの<br>台所ラジオ</p>
    <p class="ki-jacket__meta">第 12 回 しょうがと鶏の話</p>
  </div>
</div>
<div class="ki-jacket" data-tone="ink" data-orientation="vertical" data-fit="l">
  <div class="ki-jacket__face">
    <p class="ki-jacket__title">雨の日の本棚</p>
  </div>
</div>`,
    a11y: ["題字はふつうの文字なので、読み上げでそのまま読まれる。画像にして alt を書く必要が無い", "隣に同じ題が文字で出ている時は decorative(aria-hidden)にする", "Jacket は操作できない。押せる物にする時は <a> で包み、包んだ側が focus の輪と 44px を持つ"],
  },
];
