// 移動の部品。
export const navigation = [
  {
    slug: "link", name: "Link", ja: "リンク", imports: ["Link"],
    demos: [
      { fn: "Basic", title: "文中", text: "文中のリンクは下線で見分ける。" },
      { fn: "Standalone", title: "単独", text: "文の外に置くときは高さ 44px。外のサイトは別のタブで開き、読み上げる文を足す。" },
    ],
    a11y: ["<a> で描く。操作を実行するときは Button を使う", "色だけに頼らず下線を付ける。外のサイトは「(新しいタブで開く)」を読み上げる"],
  },
  {
    slug: "tabs", name: "Tabs", ja: "タブ", imports: ["Tabs"],
    demos: [
      { fn: "Basic", title: "基本", text: "選んだタブの下に主の色の線。無効なタブは選べない。", block: true },
      { fn: "Many", title: "多いタブ", text: "狭い幅では一覧が横に動く。", block: true },
    ],
    a11y: ["矢印キーでタブの間を移り、Tab で選んだタブの中身へ入る", "Home と End で先頭と末尾へ。label がタブ一覧の名前"],
  },
  {
    slug: "menu", name: "Menu", ja: "メニュー", imports: ["Menu", "Button", "Icon"],
    demos: [
      { fn: "Basic", title: "ボタンから開く" },
      { fn: "IconTrigger", title: "アイコンボタンから開く", text: "右端に置くときは align=\"end\"。" },
    ],
    a11y: ["矢印で項目を動かし、Enter で決め、Esc で閉じて開いたボタンに focus が戻る", "危ない項目は tone=\"danger\" にし、実行の前に ConfirmDialog で確かめる"],
  },
  {
    slug: "breadcrumbs", name: "Breadcrumbs", ja: "パンくず", imports: ["Breadcrumbs"],
    lead: "今いる所までの道を、上の階層から順に示す。最後は今いる所で、リンクにしない。",
    demos: [
      { fn: "Basic", title: "基本", block: true },
      { fn: "Long", title: "長い道", text: "狭い幅では折り返す。", block: true },
    ],
    props: [
      ["items", "{ label, href? }[]", "-", "上の階層から順に。最後が今いる所"],
      ["label", "string", '"現在地"', "nav の名前"],
    ],
    classes: [[".ki-breadcrumbs", "nav。中は ol"], ["[aria-current=\"page\"]", "今いる所(文字のまま)"]],
    vars: [["--color-text-muted、--color-text", "リンクと今いる所"], ["--size-hit", "リンクの高さ"], ["--color-focus", "focus の輪"]],
    html: `<nav class="ki-breadcrumbs" aria-label="現在地">
  <ol>
    <li><a href="#">ホーム</a></li>
    <li><a href="#">設定</a></li>
    <li><span aria-current="page">通知</span></li>
  </ol>
</nav>`,
    a11y: ["<nav aria-label=\"現在地\"> と <ol>。今いる所は aria-current=\"page\"", "区切りは CSS の飾りで、読み上げない"],
  },
  {
    slug: "pagination", name: "Pagination", ja: "ページ送り", imports: ["Pagination"],
    demos: [
      { fn: "Basic", title: "ボタン" },
      { fn: "Links", title: "リンク", text: "ページごとに URL があるときは getHref を渡す。" },
    ],
    a11y: ["<nav> の中に番号。今のページは aria-current=\"page\"", "前へ、次へは先頭と最後で押せなくなる"],
  },
  {
    slug: "app-bar", name: "AppBar", ja: "上のバー", imports: ["AppBar", "IconButton", "Icon"],
    lead: "画面の上のバー。題(h1)、左の物、右の操作、小さな補足を持つ。上に貼り付けることもできる。",
    demos: [
      { fn: "Basic", title: "基本", text: "左に目次を開くボタン、右に操作。補足は右に寄せる。", block: true },
      { fn: "Plain", title: "長い題", text: "題は 1 行に収め、末尾を省く。", block: true },
    ],
    props: [
      ["title", "ReactNode", "-", "題(h1)。必須"],
      ["leading", "ReactNode", "-", "題の左に置く物。目次を開くボタン、戻るボタン"],
      ["actions", "ReactNode", "-", "右に置く操作。IconButton を並べる"],
      ["meta", "ReactNode", "-", "右に寄せた小さな補足。2 行まで"],
      ["headingLevel", "1 | 2 | 3", "1", "題の見出しの段。ほかの見出しと並ぶ所では 2"],
      ["position", '"static" | "sticky"', '"static"', "sticky で上に貼り付く"],
    ],
    classes: [[".ki-appbar", "本体。data-position"], [".ki-appbar__leading、__brand、__title、__meta、__actions", "中の部品"]],
    vars: [["--color-bg、--color-line", "面と下の線"], ["--font-size-4", "題の大きさ"], ["--size-hit", "最低の高さの元"]],
    html: `<header class="ki-appbar">
  <h1 class="ki-appbar__title">ホーム</h1>
  <div class="ki-appbar__actions"><button type="button" class="ki-button ki-icon-button" data-variant="quiet" aria-label="更新"><svg class="ki-icon" aria-hidden="true"><use href="#refresh"/></svg></button></div>
</header>`,
    a11y: ["<header> の中に h1 を 1 つ。1 画面に 1 つの AppBar", "右の操作は IconButton。名前(label)を必ず付ける"],
  },
  {
    slug: "drawer", name: "Drawer", ja: "サイドの目次", imports: ["Drawer", "Button", "Icon"],
    lead: "サイドの目次。広い幅ではその場に置き(permanent)、狭い幅では開け閉めする引き出し(temporary)にする。",
    demos: [
      { fn: "Permanent", title: "その場に置く", text: "今いる所は aria-current=\"page\" と主の色の線。件数の印も付けられる。" },
      { fn: "Temporary", title: "引き出し", text: "開くと focus が中に入り、Esc か外を押して閉じる。" },
    ],
    props: [
      ["items / groups", "NavItem[] / { label?, items }[]", "-", "項目、または分類ごとの項目。NavItem は { id, label, icon?, href, count?, disabled? }"],
      ["current", "string", "-", "今いる所の id"],
      ["brand", "{ name, sub? }", "-", "上の見出し"],
      ["variant", '"permanent" | "temporary"', '"permanent"', "その場に置くか、引き出しにするか"],
      ["open / defaultOpen / onOpenChange", "boolean / boolean / (open) => void", "-", "temporary の開閉"],
      ["label / closeLabel", "string", '"目次" / "目次を閉じる"', "nav の名前、閉じるボタンの名前"],
      ["footer", "ReactNode", "-", "下に置く物"],
    ],
    classes: [
      [".ki-drawer", "本体。data-variant: permanent | temporary"],
      [".ki-drawer__head、__brand、__group、__list、__item", "中の部品。__item の aria-current=\"page\" が今いる所"],
      ["<dialog class=\"ki-drawer\" data-variant=\"temporary\">", "素の HTML の引き出し。data-ki-dialog-open で開く(ki.js)"],
    ],
    vars: [["--color-bg、--color-line", "面と境の線"], ["--color-primary", "今いる所の色と線"], ["--color-surface-2", "hover"], ["--shadow-pop", "引き出しの影"], ["--motion-duration-state", "出入り(reduced-motion で止まる)"]],
    html: `<aside class="ki-drawer" data-variant="permanent">
  <nav aria-label="目次">
    <ul class="ki-drawer__list">
      <li><a class="ki-drawer__item" href="#" aria-current="page"><svg class="ki-icon" aria-hidden="true"><use href="#home"/></svg>ホーム</a></li>
      <li><a class="ki-drawer__item" href="#"><svg class="ki-icon" aria-hidden="true"><use href="#list"/></svg>一覧</a></li>
    </ul>
  </nav>
</aside>`,
    a11y: ["<nav aria-label=\"目次\">。今いる所は aria-current=\"page\"", "temporary は Dialog。focus を閉じ込め、Esc で閉じ、閉じたら開いたボタンに戻る", "項目の高さは 44px"],
  },
  {
    slug: "bottom-navigation", name: "BottomNavigation", ja: "下のナビ", imports: ["BottomNavigation"],
    lead: "狭い幅の主な移動。アイコンと短い字を 3〜5 個並べる。",
    demos: [{ fn: "Basic", title: "基本", text: "件数の印は項目の右上に出る。", block: true }],
    props: [
      ["items", "NavItem[]", "-", "3〜5 個。{ id, label, icon?, href, count?, disabled? }"],
      ["current", "string", "-", "今いる所の id"],
      ["label", "string", '"画面の切り替え"', "nav の名前"],
      ["position", '"static" | "sticky"', '"static"', "sticky で下に貼り付く"],
    ],
    classes: [[".ki-bottomnav", "nav。data-position"], [".ki-bottomnav__list、__item", "並び、項目(aria-current=\"page\" が今いる所)"]],
    vars: [["--color-surface、--color-line", "面と上の線"], ["--color-primary", "今いる所"], ["--size-hit", "項目の高さの元(52px)"]],
    html: `<nav class="ki-bottomnav" aria-label="画面の切り替え">
  <ul class="ki-bottomnav__list">
    <li><a class="ki-bottomnav__item" href="#" aria-current="page"><svg class="ki-icon" aria-hidden="true"><use href="#home"/></svg>ホーム</a></li>
    <li><a class="ki-bottomnav__item" href="#"><svg class="ki-icon" aria-hidden="true"><use href="#list"/></svg>一覧</a></li>
  </ul>
</nav>`,
    a11y: ["<nav> と <ul>。今いる所は aria-current=\"page\"", "項目の高さは 52px(44px 以上)。件数の印は aria-label で件数を読む"],
  },
];
