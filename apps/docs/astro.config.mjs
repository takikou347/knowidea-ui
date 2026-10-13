import { defineConfig } from "astro/config";

// 公開しない。デプロイの設定は置かない。
export default defineConfig({
  devToolbar: { enabled: false },
});
