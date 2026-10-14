// Inputs カテゴリのコンポーネント。demos の fn は src/demos/<slug>.tsx の export 名。
export const input = [
  {
    slug: "button", name: "Button", imports: ["Button"],
    demos: [
      { fn: "Variants", title: "Variants", text: "プライマリは 1 画面に 1 つまでとする。セカンダリは複数並べてもよい。quiet は枠線も背景もないボタン。" },
      { fn: "Sizes", title: "Sizes", text: "標準(md)の高さは 44px、大きいサイズ(lg)は 52px。どちらもタップ領域の基準を満たす。" },
      { fn: "WithIcon", title: "With icon", text: "アイコンはラベルの前に置く。アイコンだけのボタンには IconButton を使う。" },
      { fn: "GradientLook", title: "Gradient look", text: "ThemeProvider の theme に look: \"gradient\" を渡すと、プライマリのボタン、選んだ印、進み具合の線に、主の色から色相を 40 度回した色へのグラデーションが掛かる。既定は flat。セカンダリ、quiet、danger は変わらない。" },
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
    slug: "combobox", name: "Combobox", imports: ["Combobox", "Field"],
    lead: "打って絞り込み、1 つを選ぶ欄。候補が多く(目安は 10 個より多い)、Select では探しにくい時に使う。ひらがなとカタカナ、全角と半角、大文字と小文字を同じに見て探す。読み仮名は keywords に入れる。",
    demos: [
      { fn: "Basic", title: "Basic", text: "47 の都道府県から探す例。「とうきょう」「トウキョウ」でも東京都が出る。" },
      { fn: "WithDescription", title: "With description", text: "候補の下に補足を出す。補足でも探せる(「UTC+9」で東京とソウル)。" },
    ],
    props: [
      ["options", "{ value, label, description?, keywords?, disabled? }[]", "-", "候補。keywords は画面に出さず、探す時だけ使う"],
      ["value / defaultValue / onValueChange", "string | null", "null", "制御と非制御"],
      ["placeholder", "string", "\"入力して探す\"", "空の時の文"],
      ["emptyText", "string", "\"合う物が無い\"", "合う候補が無い時の文"],
      ["loading", "boolean", "false", "候補を読み込み中。欄に回転、開くと「読み込み中」"],
      ["invalid / disabled", "boolean", "false", "エラーの枠、操作できない"],
      ["name / id / aria-label", "string", "-", "フォームの名前、Field の label と結ぶ id、読み上げの名前"],
    ],
    classes: [
      [".ki-combobox", "欄(Base UI の InputGroup)。data-invalid"],
      [".ki-combobox__input、__button", "打つ所と、「消す」「開く」のボタン(44px 四方)"],
      [".ki-combobox__popup、__item、__empty、__status", "候補の面、候補、合う物が無い時、読み込み中"],
    ],
    vars: [["--color-line-strong、--color-surface", "欄の枠と背景(Input と同じ)"], ["--color-surface-2、--color-focus", "選びかけの候補の背景と輪"], ["--shadow-pop、--radius-3", "候補の面の影と角丸"]],
    html: `<!-- React を使わない時は、ブラウザの候補つきの入力が近い(絞り込みの仕方はブラウザに任せる) -->
<input class="ki-input" list="pref" aria-label="都道府県" placeholder="入力して探す" />
<datalist id="pref"><option value="東京都"></option><option value="大阪府"></option></datalist>`,
    a11y: ["Base UI の Combobox。role=\"combobox\" の入力と role=\"listbox\" の候補。上下の矢印で候補を移り、Enter で選び、Esc で閉じる", "合う物が無い時と読み込み中は、読み上げで知らせる", "「消す」と「開く」のボタンには名前がある"],
  },
  {
    slug: "date-picker", name: "DatePicker", imports: ["DatePicker", "Field"],
    lead: "日付を 1 つ選ぶ欄。押すとカレンダーが開き、日を押すと閉じる。見た目は Select と同じ欄で、値は「2026年1月5日(月)」のように曜日まで出す。フォームで送ると YYYY-MM-DD になる。",
    demos: [
      { fn: "Basic", title: "Basic", text: "Field と一緒に使う。clearable で「消す」を出し、未選択に戻せる。" },
      { fn: "Limits", title: "Min, max and week start", text: "選べる期間を min と max で決める。weekStartsOn=1 で月曜始まり。name を渡すと、隠した input で YYYY-MM-DD を送る。" },
    ],
    props: [
      ["value / defaultValue / onValueChange", "Date | null", "null", "制御と非制御"],
      ["placeholder", "string", "\"日付を選ぶ\"", "未選択の時の文"],
      ["clearable", "boolean", "false", "「消す」を出す"],
      ["min / max / isDateDisabled", "Date / Date / (date) => boolean", "-", "選べる期間と、選べない日"],
      ["isDateMarked", "(date) => boolean", "-", "点を付ける日(予定のある日など)"],
      ["weekStartsOn", "0 | 1", "0", "週の始まり。0 は日曜、1 は月曜"],
      ["invalid / disabled", "boolean", "false", "エラーの枠、操作できない"],
      ["name", "string", "-", "フォームで送る名前。値は YYYY-MM-DD"],
      ["aria-label", "string", "-", "欄の名前。Field の中では label と同じ文を渡す。読み上げでは今の値も続けて読む"],
    ],
    classes: [
      [".ki-datepicker > .ki-select", "欄。Select と同じクラス"],
      [".ki-datepicker__popup、__foot", "開いた面と、「今日」「消す」の行"],
    ],
    vars: [["--color-line-strong、--color-surface", "欄の枠と背景(Select と同じ)"], ["--shadow-pop、--radius-3", "開いた面の影と角丸"], ["--motion-duration-fast", "開く時の動き。prefers-reduced-motion で止まる"]],
    html: `<!-- 素の HTML では、ブラウザの日付の欄を使う -->
<input class="ki-input" type="date" aria-label="締め切り" />`,
    a11y: ["欄は Base UI の Popover の Trigger。開くと、選んだ日(無ければ今日)に focus が移り、Esc で閉じて欄に戻る", "読み上げは「締め切り、2026年1月5日(月)」のように、名前と今の値を続けて読む", "カレンダーの操作は Calendar と同じ"],
  },
  {
    slug: "calendar", name: "Calendar", imports: ["Calendar"],
    lead: "月のカレンダー。日を 1 つ選ぶ。今日は枠、選んだ日は主の色で塗り、予定のある日には点を付ける。1 日は 44px 四方で、360px の画面にも収まる。月を移ると、表が移った向きから少し滑って出る。",
    demos: [
      { fn: "Basic", title: "Basic", text: "isDateMarked で、予定のある日に点を付ける。点は色だけでなく、読み上げでも「予定あり」と伝える。" },
      { fn: "Limits", title: "Disabled dates", text: "min と max で期間を決め、isDateDisabled で土日を選べなくした例。月曜始まり。" },
    ],
    props: [
      ["value / defaultValue / onValueChange", "Date | null", "null", "選んだ日。制御と非制御"],
      ["month / defaultMonth / onMonthChange", "Date", "選んだ日か今日の月", "表示する月"],
      ["min / max", "Date", "-", "選べる最初と最後の日。外の月へは移れない"],
      ["isDateDisabled", "(date) => boolean", "-", "選べない日"],
      ["isDateMarked", "(date) => boolean", "-", "点を付ける日"],
      ["weekStartsOn", "0 | 1", "0", "週の始まり。0 は日曜、1 は月曜"],
      ["label", "string", "表示中の年月", "表の名前"],
      ["autoFocus", "boolean", "false", "出た時に、選んだ日(無ければ今日)へ focus を移す"],
    ],
    classes: [
      [".ki-calendar、__head、__title", "本体、上の行、年月"],
      [".ki-calendar__grid[role=grid]、__row、__weekday", "表、行、曜日。data-dir は月を移った向き"],
      [".ki-calendar__day", "日のボタン。data-selected、data-outside、data-marked、aria-current=\"date\"(今日)、aria-disabled"],
    ],
    vars: [
      ["--color-primary、--color-on-primary", "選んだ日の塗りと字、予定の点"],
      ["--color-line-strong", "今日の枠"],
      ["--size-hit、--radius-2", "1 日の大きさ(44px)と角丸"],
      ["--font-mono", "日の数字(等幅)"],
      ["--motion-duration-state", "月を移った時の動き。prefers-reduced-motion で止まる"],
    ],
    html: `<!-- Calendar は React だけ。素の HTML では、ブラウザの日付の欄を使う -->
<input class="ki-input" type="date" aria-label="受け取る日" />`,
    a11y: ["表は role=\"grid\"。Tab で入るのは 1 日だけで、矢印キーで日、Home と End で週の頭と終わり、PageUp と PageDown で月、Shift と一緒で年を移る", "日のボタンは「2026年1月5日月曜日、今日、予定あり」のように読む。選んだ日は aria-selected", "年月の見出しは aria-live で、月を移ると読み上げる"],
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
    slug: "slider", name: "Slider", imports: ["Slider"],
    lead: "量を指で選ぶ。音量や明るさのように、ちょうどの数より加減が大事な時に使う。ちょうどの数を入れる時は Stepper か Input を使う。value を [下限, 上限] にすると範囲を選べる。",
    demos: [
      { fn: "Basic", title: "Basic", text: "上に名前と今の値を出す。formatValue で「60%」のように見せ、読み上げも同じにする。" },
      { fn: "Range", title: "Range", text: "つまみを 2 つにして範囲を選ぶ。つまみは「下限」「上限」と読み上げ、全体の名前は label の「価格帯」になる。" },
    ],
    props: [
      ["label", "string", "-", "何の量か。必須。上に出し、読み上げの名前にもなる"],
      ["value / defaultValue / onValueChange", "number | number[]", "min", "制御と非制御。配列にすると範囲"],
      ["onValueCommitted", "(value) => void", "-", "指を離した時、キーで変えた時に 1 度呼ぶ。保存はこちらで"],
      ["min / max / step / largeStep", "number", "0 / 100 / 1 / 10", "範囲と、矢印、PageUp と PageDown で動く幅"],
      ["formatValue", "(value: number) => string", "-", "値の見せ方。読み上げにも使う"],
      ["thumbLabels", "[string, string]", "[\"下限\", \"上限\"]", "範囲の時の、つまみの名前"],
      ["hideValue / disabled / name", "boolean / string", "-", "値を出さない、操作できない、フォームの名前"],
    ],
    classes: [
      [".ki-slider", "本体。data-dragging、data-disabled"],
      [".ki-slider__head、__label、__value", "名前と今の値"],
      [".ki-slider__control、__track、__indicator", "押せる所(44px の高さ)、線、選んだ分の色の帯"],
      [".ki-slider__thumb", "つまみ。見た目は 20px、押せる所は 44px 四方"],
      [".ki-range", "素の HTML の <input type=\"range\">"],
    ],
    vars: [["--color-line-strong、--color-primary", "線と、選んだ分の帯とつまみの枠"], ["--size-hit", "押せる所の大きさ(44px)"], ["--motion-duration-fast", "キーで動いた時の滑り。掴んでいる間は指に付いて動く"]],
    html: `<label class="ki-field__label" for="vol">読み上げの音量</label>
<input class="ki-range" id="vol" type="range" min="0" max="100" value="60" />`,
    a11y: ["つまみは role=\"slider\"。左右と上下の矢印で step、PageUp と PageDown で largeStep、Home と End で端へ動く", "label が全体の名前になる。範囲の時は、つまみごとに「下限」「上限」の名前を付ける", "formatValue で、読み上げも「60%」のように単位まで言う"],
  },
  {
    slug: "stepper", name: "Stepper", imports: ["Stepper", "Field"],
    lead: "段のある数を、− と + で 1 つずつ変える。人数や何分前のように、小さな範囲のちょうどの数に使う。欄に打っても入れられる。端の値では、その向きのボタンが押せなくなる。",
    demos: [
      { fn: "Basic", title: "Basic", text: "Field で名前と補足を付ける。min と max で範囲を決める。" },
      { fn: "WithUnit", title: "With unit and step", text: "format で「15 分」のように単位を付け、step で 5 ずつ変える。" },
    ],
    props: [
      ["value / defaultValue / onValueChange", "number | null", "-", "制御と非制御。空の時は null"],
      ["min / max / step / largeStep", "number", "- / - / 1 / step × 10", "範囲と、ボタンと矢印、PageUp と PageDown で変わる幅"],
      ["format", "Intl.NumberFormatOptions", "-", "数の見せ方。{ style: \"unit\", unit: \"minute\" } で「15 分」"],
      ["invalid / disabled", "boolean", "false", "エラーの枠、操作できない"],
      ["name / id / aria-label", "string", "-", "フォームの名前、Field の外で使う時の読み上げの名前"],
      ["decrementLabel / incrementLabel", "string", "\"減らす\" / \"増やす\"", "− と + の読み上げの名前"],
    ],
    classes: [
      [".ki-stepper、__group", "本体と枠。data-invalid"],
      [".ki-stepper__input", "真ん中の欄。等幅の数字で、真ん中にそろえる"],
      [".ki-stepper__button", "− と +(44px 四方)。押すと小さく沈む"],
    ],
    vars: [["--color-line-strong、--color-surface", "枠と背景(Input と同じ)"], ["--size-hit", "高さとボタンの幅(44px)"], ["--motion-duration-fast", "押した時の沈み。prefers-reduced-motion で止まる"]],
    html: `<div class="ki-stepper"><div class="ki-stepper__group">
  <button class="ki-stepper__button" type="button" aria-label="減らす" onclick="const i = this.nextElementSibling; i.stepDown(); i.dispatchEvent(new Event('change', { bubbles: true }))">−</button>
  <input class="ki-stepper__input" type="number" aria-label="人数" min="1" max="10" value="2" />
  <button class="ki-stepper__button" type="button" aria-label="増やす" onclick="const i = this.previousElementSibling; i.stepUp(); i.dispatchEvent(new Event('change', { bubbles: true }))">+</button>
</div></div>`,
    a11y: ["欄は数を入れる textbox。上下の矢印で step、PageUp と PageDown で largeStep ずつ変わる", "− と + には「減らす」「増やす」の名前がある。端の値では押せなくなる", "Field の中では、Field の label が欄の名前になる", "素の HTML の例は、端でボタンを押せなくしない。要る時は min と max を見て disabled を付ける"],
  },
  {
    slug: "file-upload", name: "FileUpload", imports: ["FileUpload"],
    lead: "ファイルを選ぶ、または置く。スマホと iPad では押すと選ぶ画面が開き、パソコンではファイルを持ってきて置ける。選んだ物は下に並び、1 つずつ外せる。送る処理は持たない(フォームで送るか、onFilesChange で受け取って送る)。",
    demos: [
      { fn: "Basic", title: "Basic", text: "画像か PDF を、いくつでも選ぶ。maxSize を超えた物は加えず、名前と理由を出す。" },
      { fn: "Single", title: "Single", text: "multiple を付けないと 1 つだけ。選び直すと入れ替わる。" },
    ],
    props: [
      ["label", "string", "\"ファイルを選ぶ\"", "置き場の見出し。読み上げの名前にもなる"],
      ["accept / multiple", "string / boolean", "- / false", "選べる形式(input の accept と同じ)、いくつも選べるか"],
      ["maxSize", "number(バイト)", "-", "1 つの上限。超えた物は加えず、理由を出す"],
      ["hint", "string", "-", "置き場の下の補足。欄の説明として読み上げる"],
      ["value / defaultValue / onFilesChange", "File[]", "[]", "制御と非制御"],
      ["invalid / disabled / name", "boolean / string", "-", "エラーの枠、操作できない、フォームで送る名前"],
    ],
    classes: [
      [".ki-file-upload", "本体。data-invalid、data-disabled"],
      [".ki-file-upload__zone", "置き場(<label>)。data-dragging はファイルを持って上に来た時"],
      [".ki-file-upload__input", "置き場いっぱいに広げた、見えない <input type=\"file\">"],
      [".ki-file-upload__list、__item、__name、__size", "選んだ物の一覧。行は加えた時に滑って出る"],
      [".ki-file-upload__error", "加えなかった理由(role=\"alert\")"],
    ],
    vars: [["--color-line-strong、--color-primary", "置き場の点線と、持って来た時の実線"], ["--radius-3、--radius-2", "置き場と、一覧の行の角丸"], ["--motion-duration-state", "行が出る動き。prefers-reduced-motion で止まる"]],
    html: `<label class="ki-file-upload__zone">
  <span class="ki-file-upload__label">添付を選ぶ</span>
  <span class="ki-file-upload__hint">画像か PDF、1 つ 5 MB まで</span>
  <input class="ki-file-upload__input" type="file" accept="image/*,.pdf" multiple />
</label>`,
    a11y: ["中身はブラウザの <input type=\"file\">。Tab で移り、Enter か Space で選ぶ画面が開く", "label が名前、hint が説明になる", "選んだ物の「外す」ボタンは「(名前) を外す」と読み上げる。外した後は置き場へ focus が戻る", "加えなかった物は、role=\"alert\" で知らせる"],
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
