// 4 つのパッケージを build し、配る tarball を release/ に作る。
//   pnpm release:pack
// release/ は git に入れない。workspace:* と workspace:^ は pack のときに実際の版へ置き換わる。
// npm に出す前の確かめに使う(pnpm test:consumer が、文書の npm install の名前をこの tarball に置き換えて入れる)。
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = join(root, "release");
const names = ["tokens", "css", "icons", "ui"];
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit" });

// 古い tarball が混ざらないよう、毎回作り直す
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
run("pnpm", ["-r", "--filter", "./packages/*", "build"]);
for (const n of names) run("pnpm", ["-C", join("packages", n), "pack", "--pack-destination", out]);

const files = readdirSync(out).filter((f) => f.endsWith(".tgz")).sort();
if (files.length !== names.length) throw new Error(`tarball が ${names.length} 個ではない: ${files.join(", ")}`);
// tarball の package.json に workspace: が残っていないこと
for (const f of files) {
  const text = execFileSync("tar", ["-xzOf", join(out, f), "package/package.json"], { encoding: "utf8" });
  if (text.includes("workspace:")) throw new Error(`${f} に workspace: が残っている`);
  JSON.parse(text);
}
console.log("\nrelease/:\n" + files.map((f) => "  " + f).join("\n"));
