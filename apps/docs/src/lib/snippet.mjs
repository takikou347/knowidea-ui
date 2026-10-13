// デモのファイル(demos/<slug>.tsx)から、1 つのデモの関数とその import を切り出す。
// 画面に出すコードは、実際に動いているデモと同じ文字列になる。
//  - 先頭が export function の塊がデモ。export を外して出す
//  - export の無い const / function / type の塊(同じファイルの上のほう)は、デモが使っていれば前に付ける
//  - import は、デモが使っている名前だけを残す
const TOP = /\n\n(?=(?:export |const |function |type |interface |import |\/\*\*|\/\/))/;

export function snippet(src, fn) {
  const chunks = src.replace(/\r\n/g, "\n").split(TOP);
  const imports = [], helpers = [];
  let demo = null;
  for (const c of chunks) {
    const head = c.replace(/^(?:\/\*\*[\s\S]*?\*\/\n|\/\/.*\n)+/, "");
    if (/^import /m.test(c) && c.split("\n").every((l) => l === "" || l.startsWith("import ") || l.startsWith(" ") || l.startsWith("}") || l.startsWith("//"))) imports.push(c);
    else if (new RegExp(`^export (?:default )?function ${fn}\\b`).test(head)) demo = c.replace(/^((?:\/\*\*[\s\S]*?\*\/\n|\/\/.*\n)*)export /, "$1");
    else if (/^(const|function|type|interface) /.test(head)) helpers.push(c);
  }
  if (!demo) throw new Error(`デモが無い: ${fn}`);
  // 使っている helper を、推移的に集める
  const used = [];
  const take = (text) => {
    for (const h of helpers) {
      const name = h.match(/^(?:const|function|type|interface) (\w+)/)?.[1];
      if (name && !used.includes(h) && new RegExp(`(?<![\\w.$])${name}\\b(?!\\s*=(?!=))`).test(text)) { used.push(h); take(h); }
    }
  };
  take(demo);
  const body = [...helpers.filter((h) => used.includes(h)), demo].join("\n\n");
  // import: 名前ごとに、本文で使っている物だけ
  const lines = [];
  for (const block of imports) {
    for (const m of block.matchAll(/import\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+"([^"]+)";/g)) {
      const names = m[2].split(",").map((s) => s.trim()).filter(Boolean);
      const keep = names.filter((n) => new RegExp(`\\b${n.replace(/^type\s+/, "")}\\b`).test(body));
      if (!keep.length || m[3].startsWith("./")) continue;
      lines.push(`import ${m[1] ?? ""}{ ${keep.join(", ")} } from "${m[3]}";`);
    }
  }
  return (lines.length ? lines.join("\n") + "\n\n" : "") + body.trimEnd() + "\n";
}
