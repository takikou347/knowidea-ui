// サイトの設定。公開先に関わる値はここ 1 か所に置く。環境変数で上書きできる。
//   SITE_URL   公開するサイトの URL(末尾はスラッシュ)。GitHub Pages なら https://<owner>.github.io/<repo>/
//              og:image や canonical のように、絶対 URL が要る所だけがこれを使う。ほかのリンクは相対のまま
//   SITE_REPO  GitHub のリポジトリの URL。"Edit this page" のリンク先
//   SITE_BRANCH 編集のリンクが指すブランチ
// 公開先のリポジトリ名は未決。決まったら SITE_URL と SITE_REPO を変える(このファイルの既定値を書き換えてもよい)。
const withSlash = (u) => (u.endsWith("/") ? u : u + "/");

export const site = {
  name: "KNOW IDEA UI",
  url: withSlash(process.env.SITE_URL || "https://takikou347.github.io/design-system/"),
  repo: (process.env.SITE_REPO || "https://github.com/takikou347/design-system").replace(/\/$/, ""),
  branch: process.env.SITE_BRANCH || "main",
  // リポジトリの中での、このサイトの場所
  docsDir: "apps/docs/",
  description: "特定のアプリに依存しない UI ライブラリ。高密度で、グレーを基調とし、角丸は控えめで、数字は等幅で表示する。",
};

// サイトの URL のパス部分(例: /design-system/)。404 ページの <base> だけがこれを使う
export const basePath = new URL(site.url).pathname;
