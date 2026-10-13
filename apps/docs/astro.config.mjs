import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// dist/ を、静的に配れる任意の場所の下に置いても動く形にする。
//  - build.format "file": ページは components/button.html の形(ディレクトリ + index.html にしない)
//  - リンクは Base.astro がページの深さから相対で書く(src/lib/paths.mjs)
//  - 出力した HTML の /_astro/... は scripts/relativize.mjs が相対に直す(`pnpm build` が続けて回す)
// base は "/" のまま。サブパスは build の後の相対化で吸収する。
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },
  trailingSlash: "ignore",
  build: { format: "file", assets: "_astro" },
});
