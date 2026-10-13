// consumer-test の共通の道具: コマンド、静的サーバー、Chromium。
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname, resolve, normalize } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../../", import.meta.url));

/** コマンドを流す。失敗したら出力を付けて投げる。 */
export function run(cmd, args, { cwd, env, allowFail = false } = {}) {
  const r = spawnSync(cmd, args, { cwd, env: { ...process.env, ...env }, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = (r.stdout ?? "") + (r.stderr ?? "");
  if (r.status !== 0 && !allowFail) throw new Error(`${cmd} ${args.join(" ")} (${cwd}) が失敗(${r.status})\n${out.slice(-4000)}`);
  return { status: r.status, out };
}

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2" };

/** dir を、指定した URL の下(prefix)で配る。{ url, close } を返す。 */
export async function serve(dir, prefix = "/") {
  const base = resolve(dir);
  const server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!p.startsWith(prefix)) { res.writeHead(404); res.end("not found"); return; }
    p = normalize(p.slice(prefix.length));
    let file = join(base, p);
    if (!file.startsWith(base)) { res.writeHead(403); res.end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const { port } = server.address();
  return { url: `http://127.0.0.1:${port}${prefix}`, close: () => new Promise((ok) => server.close(ok)) };
}

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = "/opt/pw-browsers";
  for (const d of readdirSync(base).sort().reverse()) {
    for (const rel of ["chrome-linux/chrome", "chrome-linux/headless_shell", "chrome-linux64/chrome"]) {
      const p = join(base, d, rel);
      if (existsSync(p)) return p;
    }
  }
  throw new Error("Chromium が /opt/pw-browsers に無い(CHROMIUM_PATH で指す)");
}

export async function launch() {
  // playwright-core は apps/docs の devDependency を使う。無ければ /opt/node-tools
  let pw;
  for (const from of [join(root, "apps/docs/"), "/opt/node-tools/"]) {
    try { pw = createRequire(from + "x.js")("playwright-core"); break; } catch { /* 次へ */ }
  }
  if (!pw) throw new Error("playwright-core が見つからない");
  return pw.chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox"] });
}

/** ページを開き、コンソールの誤り、ページの例外、失敗した要求を集める。 */
export async function openPage(browser, url, { scheme = "light", viewport = { width: 1000, height: 800 } } = {}) {
  const context = await browser.newContext({ colorScheme: scheme, viewport, reducedMotion: "reduce" });
  // 文書が勧める Google Fonts の link は、外へ出られない環境でも誤りにしない(空の CSS を返す)
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.fulfill({ status: 200, contentType: "text/css", body: "" }));
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const problems = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") problems.push(`console.${m.type()}: ${m.text()}`); });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`); });
  await page.goto(url, { waitUntil: "load" });
  return { page, context, problems };
}

/**
 * 文書に載せたシェルの手順を、そのまま流す。
 *  - 空行と # の行は飛ばす。`cd x` は以降の cwd を変える
 *  - subst: 文書の文字列を、確かめる版に置き換える(例: vite@latest を固定の版に)
 */
export function runScript(text, { cwd, subst = {}, env } = {}) {
  let dir = cwd;
  for (let line of text.split("\n")) {
    line = line.replace(/\s+#.*$/, "").trim();
    if (!line || line.startsWith("#")) continue;
    for (const [from, to] of Object.entries(subst)) line = line.split(from).join(to);
    if (line.startsWith("cd ")) { dir = join(dir, line.slice(3).trim()); continue; }
    run("sh", ["-c", line], { cwd: dir, env });
  }
  return dir;
}
