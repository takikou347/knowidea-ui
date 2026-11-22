// 使う側の bundle に、使わない部品とアイコンの絵が入らない事を確かめる。pnpm --filter knowidea-ui build の後に node --test で回す
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { rolldown } from "rolldown";

const dist = fileURLToPath(new URL("../dist/index.js", import.meta.url));

/**
 * 1 つの入口を、塊に分けて bundle し、入口の塊の中身を返す
 *
 * @param source 入口のコード
 * @returns 入口の塊のコード (中の region の注釈で、入った元のファイルが分かる)
 */
async function entryChunk(source) {
  const dir = mkdtempSync(join(tmpdir(), "ki-bundle-"));
  try {
    const entry = join(dir, "entry.js");
    writeFileSync(entry, source.replaceAll("knowidea-ui", dist));
    const build = await rolldown({ input: entry, external: [/^react($|\/)/, /^react-dom($|\/)/], logLevel: "silent" });
    const { output } = await build.generate({ format: "esm" });
    await build.close();
    return output.find((o) => o.type === "chunk" && o.isEntry).code;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("部品が中で使うアイコンだけが入口に入り、ほかの絵は名前ごとの塊に分かれる", async () => {
  const code = await entryChunk(`import { Icon } from "knowidea-ui"; export const a = Icon;`);
  assert.match(code, /icons\/CheckIcon\.js/);
  assert.doesNotMatch(code, /icons\/LightbulbIcon\.js/);
  assert.doesNotMatch(code, /react\/data\.js/);
});

test("List だけを使う画面の入口に、選ぶ枠 (Choice) が入らない", async () => {
  const code = await entryChunk(`import { List } from "knowidea-ui"; export const a = List;`);
  assert.doesNotMatch(code, /src\/Choice|dist\/Choice\.js/);
  assert.doesNotMatch(code, /@base-ui\/react\/(checkbox|radio|switch)\//);
});
