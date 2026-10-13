// 会社のロゴを brand/logo から、アイコンの sprite を packages/icons/dist から public/ に写す(正本はそれぞれ。public/ は git に入れない)。
import { mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../../", import.meta.url));
const pub = fileURLToPath(new URL("../public/", import.meta.url));
mkdirSync(pub, { recursive: true });
for (const f of ["favicon.svg", "mark.svg", "mark-white.svg"]) copyFileSync(root + "brand/logo/" + f, pub + f);
copyFileSync(root + "packages/icons/dist/sprite.svg", pub + "sprite.svg");
// 手で作った画像(OGP、ファビコンの PNG、Apple のアイコン)。作り方は scripts/make-images.mjs
for (const f of ["og.png", "favicon-32.png", "apple-touch-icon.png"]) copyFileSync(fileURLToPath(new URL("../assets-src/", import.meta.url)) + f, pub + f);
