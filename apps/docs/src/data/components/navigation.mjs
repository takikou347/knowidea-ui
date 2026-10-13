// Navigation カテゴリのコンポーネント。
export const navigation = [
  {
    slug: "link", name: "Link", imports: ["Link"],
    demos: [
      { fn: "Basic", title: "Inline", text: "文中のリンクは、下線で見分けられるようにする。" },
      { fn: "Standalone", title: "Standalone", text: "文の外に単独で置くときは、高さを 44px にする。外部サイトは別のタブで開き、その旨をスクリーンリーダーに伝える。" },
    ],
    a11y: ["<a> 要素として描画する。操作を実行するときは Button を使う", "色だけに頼らず、下線を付ける。外部サイトでは「(新しいタブで開く)」を読み上げる"],
  },
  {
    slug: "tabs", name: "Tabs", imports: ["Tabs"],
    demos: [
      { fn: "Basic", title: "Basic", text: "選択中のタブの下に、プライマリカラーの線を引く。無効なタブは選択できない。", block: true },
      { fn: "Many", title: "Many tabs", text: "幅が狭いときは、タブの一覧が横にスクロールする。", block: true },
    ],
    a11y: ["矢印キーでタブ間を移動し、Tab で選択中のタブの内容に入る", "Home と End で先頭と末尾に移動する。label がタブ一覧の名前になる"],
  },
  {
    slug: "menu", name: "Menu", imports: ["Menu", "Button", "Icon"],
    demos: [
      { fn: "Basic", title: "From a button" },
      { fn: "IconTrigger", title: "From an icon button", text: "右端に置くときは、align=\"end\" を指定する。" },
    ],
    a11y: ["矢印キーで項目を移動し、Enter で決定し、Esc で閉じる。閉じると開いたボタンにフォーカスが戻る", "危険な項目は tone=\"danger\" にし、実行の前に ConfirmDialog で確認する"],
  },
  {
    slug: "breadcrumbs", name: "Breadcrumbs", imports: ["Breadcrumbs"],
    lead: "現在のページまでの階層を、上位から順に示す。最後は現在のページで、リンクにしない。",
    demos: [
      { fn: "Basic", title: "Basic", block: true },
      { fn: "Long", title: "Long path", text: "幅が狭いときは折り返す。", block: true },
    ],
    props: [
      ["items", "{ label, href? }[]", "-", "上位の階層から順に並べる。最後が現在のページ"],
      ["label", "string", '"現在地"', "nav の名前"],
    ],
    classes: [[".ki-breadcrumbs", "nav。内部は ol"], ["[aria-current=\"page\"]", "現在のページ(リンクにしない)"]],
    vars: [["--color-text-muted、--color-text", "リンクと現在のページの色"], ["--size-hit", "リンクの高さ"], ["--color-focus", "フォーカスリング"]],
    html: `<nav class="ki-breadcrumbs" aria-label="現在地">
  <ol>
    <li><a href="#">ホーム</a></li>
    <li><a href="#">設定</a></li>
    <li><span aria-current="page">通知</span></li>
  </ol>
</nav>`,
    a11y: ["<nav aria-label=\"現在地\"> と <ol> を使う。現在のページには aria-current=\"page\" を付ける", "区切りは CSS による装飾で、読み上げない"],
  },
  {
    slug: "pagination", name: "Pagination", imports: ["Pagination"],
    demos: [
      { fn: "Basic", title: "Buttons" },
      { fn: "Links", title: "Links", text: "ページごとに URL があるときは、getHref を渡す。" },
    ],
    a11y: ["<nav> の中にページ番号を並べる。現在のページには aria-current=\"page\" が付く", "最初のページでは「前へ」、最後のページでは「次へ」が無効になる"],
  },
  {
    slug: "app-bar", name: "AppBar", imports: ["AppBar", "IconButton", "Icon"],
    lead: "画面上部のバー。タイトル(h1)、左側の要素、右側の操作、小さな補足を持つ。上部に固定することもできる。",
    demos: [
      { fn: "Basic", title: "Basic", text: "左にナビゲーションを開くボタン、右に操作を置く。補足は右寄せにする。", block: true },
      { fn: "Plain", title: "Long title", text: "タイトルは 1 行に収め、はみ出す分は省略記号で省く。", block: true },
    ],
    props: [
      ["title", "ReactNode", "-", "タイトル(h1)。必須"],
      ["leading", "ReactNode", "-", "タイトルの左に置く要素。ナビゲーションを開くボタンや戻るボタン"],
      ["actions", "ReactNode", "-", "右側に置く操作。IconButton を並べる"],
      ["meta", "ReactNode", "-", "右寄せの小さな補足。2 行まで"],
      ["headingLevel", "1 | 2 | 3", "1", "タイトルの見出しレベル。ほかの見出しと並ぶ場所では 2 にする"],
      ["position", '"static" | "sticky"', '"static"', "sticky を指定すると上部に固定される"],
    ],
    classes: [[".ki-appbar", "本体。data-position"], [".ki-appbar__leading、__brand、__title、__meta、__actions", "内部の要素"]],
    vars: [["--color-bg、--color-line", "背景と下線"], ["--font-size-4", "タイトルのフォントサイズ"], ["--size-hit", "最小の高さの基準"]],
    html: `<header class="ki-appbar">
  <h1 class="ki-appbar__title">ホーム</h1>
  <div class="ki-appbar__actions"><button type="button" class="ki-button ki-icon-button" data-variant="quiet" aria-label="更新"><svg class="ki-icon" aria-hidden="true"><use href="#refresh"/></svg></button></div>
</header>`,
    a11y: ["<header> の中に h1 を 1 つ置く。AppBar は 1 画面に 1 つだけ使う", "右側の操作には IconButton を使い、名前(label)を必ず付ける"],
  },
  {
    slug: "drawer", name: "Drawer", imports: ["Drawer", "Button", "Icon"],
    lead: "サイドナビゲーション。広い幅ではその場所に常に表示し(permanent)、狭い幅では開閉する引き出し(temporary)にする。",
    demos: [
      { fn: "Permanent", title: "Permanent", text: "現在のページは aria-current=\"page\" とプライマリカラーの線で示す。件数のバッジも付けられる。" },
      { fn: "Temporary", title: "Temporary", text: "開くとフォーカスが中に移り、Esc か外側のクリックで閉じる。" },
    ],
    props: [
      ["items / groups", "NavItem[] / { label?, items }[]", "-", "項目、または分類ごとの項目。NavItem は { id, label, icon?, href, count?, disabled? }"],
      ["current", "string", "-", "現在のページの id"],
      ["brand", "{ name, sub? }", "-", "上部の見出し"],
      ["variant", '"permanent" | "temporary"', '"permanent"', "常に表示するか、引き出しにするか"],
      ["open / defaultOpen / onOpenChange", "boolean / boolean / (open) => void", "-", "temporary の開閉"],
      ["label / closeLabel", "string", '"ナビゲーション" / "ナビゲーションを閉じる"', "nav の名前、閉じるボタンの名前"],
      ["footer", "ReactNode", "-", "下部に置く要素"],
    ],
    classes: [
      [".ki-drawer", "本体。data-variant: permanent | temporary"],
      [".ki-drawer__head、__brand、__group、__list、__item", "内部の要素。__item の aria-current=\"page\" が現在のページ"],
      ["<dialog class=\"ki-drawer\" data-variant=\"temporary\">", "素の HTML の引き出し。data-ki-dialog-open で開く(ki.js)"],
    ],
    vars: [["--color-bg、--color-line", "背景と境界線"], ["--color-primary", "現在のページの色と線"], ["--color-surface-2", "ホバー時の背景"], ["--shadow-pop", "引き出しの影"], ["--motion-duration-state", "表示と非表示のアニメーション(prefers-reduced-motion で止まる)"]],
    html: `<aside class="ki-drawer" data-variant="permanent">
  <nav aria-label="サイドナビゲーション">
    <ul class="ki-drawer__list">
      <li><a class="ki-drawer__item" href="#" aria-current="page"><svg class="ki-icon" aria-hidden="true"><use href="#home"/></svg>ホーム</a></li>
      <li><a class="ki-drawer__item" href="#"><svg class="ki-icon" aria-hidden="true"><use href="#list"/></svg>一覧</a></li>
    </ul>
  </nav>
</aside>`,
    a11y: ["<nav> に aria-label を付ける。現在のページには aria-current=\"page\" を付ける", "temporary は Dialog として動作する。フォーカスを閉じ込め、Esc で閉じ、閉じると開いたボタンにフォーカスが戻る", "項目の高さは 44px"],
  },
  {
    slug: "bottom-navigation", name: "BottomNavigation", imports: ["BottomNavigation"],
    lead: "狭い幅での主要な移動手段。アイコンと短い文字を 3〜5 個並べる。",
    demos: [{ fn: "Basic", title: "Basic", text: "件数のバッジは、項目の右上に表示される。", block: true }],
    props: [
      ["items", "NavItem[]", "-", "3〜5 個。{ id, label, icon?, href, count?, disabled? }"],
      ["current", "string", "-", "現在のページの id"],
      ["label", "string", '"画面の切り替え"', "nav の名前"],
      ["position", '"static" | "sticky"', '"static"', "sticky を指定すると下部に固定される"],
    ],
    classes: [[".ki-bottomnav", "nav。data-position"], [".ki-bottomnav__list、__item", "リストと項目(aria-current=\"page\" が現在のページ)"]],
    vars: [["--color-surface、--color-line", "背景と上の線"], ["--color-primary", "現在のページ"], ["--size-hit", "項目の高さの基準(52px)"]],
    html: `<nav class="ki-bottomnav" aria-label="画面の切り替え">
  <ul class="ki-bottomnav__list">
    <li><a class="ki-bottomnav__item" href="#" aria-current="page"><svg class="ki-icon" aria-hidden="true"><use href="#home"/></svg>ホーム</a></li>
    <li><a class="ki-bottomnav__item" href="#"><svg class="ki-icon" aria-hidden="true"><use href="#list"/></svg>一覧</a></li>
  </ul>
</nav>`,
    a11y: ["<nav> と <ul> を使う。現在のページには aria-current=\"page\" を付ける", "項目の高さは 52px(44px 以上)。件数のバッジは aria-label で件数を読み上げる"],
  },
];
