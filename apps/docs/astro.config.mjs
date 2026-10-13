import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// 公開しない。デプロイの設定は置かない。
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },
});
