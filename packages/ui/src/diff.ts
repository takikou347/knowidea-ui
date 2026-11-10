// 差分の読み取りと組み方。React に依らないので、サーバーでも使える

export interface DiffLine {
  /** add は足した行、del は消した行、context は前後の変わらない行 */
  type: "add" | "del" | "context";
  /** 前のファイルの行の番号(足した行には無い) */
  oldNumber?: number;
  /** 後のファイルの行の番号(消した行には無い) */
  newNumber?: number;
  text: string;
}

export interface DiffHunk {
  /** @@ -1,4 +1,5 @@ の行 */
  header: string;
  lines: DiffLine[];
}

export interface DiffFile {
  /** 後のパス(消したファイルは前のパス) */
  path: string;
  /** 名前を変えた時の前のパス */
  oldPath?: string;
  status?: "added" | "deleted" | "modified" | "renamed";
  hunks: DiffHunk[];
}

/** 行を指す鍵。後の行の番号があれば n12、無ければ(消した行)o12 */
export function diffLineKey(line: DiffLine): string {
  return line.newNumber !== undefined ? `n${line.newNumber}` : `o${line.oldNumber}`;
}

const escapes: Record<string, number> = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34, "\\": 92 };

/** git が引用符で囲んだパス("a/\346\227\245.txt")を元の文字に戻す。囲んでいなければそのまま返す */
function unquotePath(p: string): string {
  if (p.length < 2 || !p.startsWith('"') || !p.endsWith('"')) return p;
  const body = p.slice(1, -1);
  const bytes: number[] = [];
  const enc = new TextEncoder();
  for (let i = 0; i < body.length; i++) {
    if (body[i] !== "\\") {
      const ch = String.fromCodePoint(body.codePointAt(i)!);
      bytes.push(...enc.encode(ch));
      i += ch.length - 1;
      continue;
    }
    const oct = body.slice(i + 1, i + 4);
    if (/^[0-3][0-7]{2}$/.test(oct)) { bytes.push(parseInt(oct, 8)); i += 3; continue; }
    const code = escapes[body[i + 1] ?? ""];
    if (code !== undefined) { bytes.push(code); i += 1; } else bytes.push(92);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

const quoted = String.raw`"(?:[^"\\]|\\.)*"`;
const headerPaths = new RegExp(`^(${quoted}|a/.+) (${quoted}|b/.+)$`);

/** diff --git の行の、前と後のパス。囲んでいない名前に空白がある時は、前と後が同じ名前の形を先に試す */
function gitPaths(rest: string): [string, string] | undefined {
  if (!rest.startsWith('"') && !rest.endsWith('"')) {
    const half = (rest.length - 1) / 2;
    if (Number.isInteger(half) && rest[half] === " " && rest.startsWith("a/") && rest.slice(half + 1).startsWith("b/") && rest.slice(2, half) === rest.slice(half + 3)) {
      return [rest.slice(2, half), rest.slice(half + 3)];
    }
  }
  const m = rest.match(headerPaths);
  return m ? [strip(unquotePath(m[1]!)), strip(unquotePath(m[2]!))] : undefined;
}

const strip = (p: string) => p.replace(/^[ab]\//, "");
/** --- と +++ の行のパス。空白の入った名前に git が付ける終わりのタブを除く */
const sidePath = (raw: string) => strip(unquotePath(raw.slice(4).replace(/\t$/, "")));

/** git diff(統一形式)の文字列を DiffFile の並びにする。 */
export function parseUnifiedDiff(text: string): DiffFile[] {
  const files: DiffFile[] = [];
  let file: DiffFile | undefined;
  let hunk: DiffHunk | undefined;
  let o = 0;
  let n = 0;
  // 見出しに書かれた、まとまりの残りの行数。頭の空白が落ちた空の行を、変わらない行として数えるのに使う
  let oLeft = 0;
  let nLeft = 0;
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    if (raw.startsWith("diff --git ")) {
      const m = gitPaths(raw.slice(11));
      file = { path: m ? m[1] : raw.slice(11), status: "modified", hunks: [] };
      if (m && m[0] !== m[1]) { file.oldPath = m[0]; file.status = "renamed"; }
      files.push(file);
      hunk = undefined;
      continue;
    }
    if (!file || (!hunk && raw.startsWith("--- "))) {
      if (raw.startsWith("--- ")) {
        if (!file) { file = { path: "", status: "modified", hunks: [] }; files.push(file); }
        if (raw === "--- /dev/null") file.status = "added";
        else if (!file.path) file.path = sidePath(raw);
      }
      continue;
    }
    if (!hunk && raw.startsWith("+++ ")) {
      if (raw === "+++ /dev/null") file.status = "deleted";
      else file.path = sidePath(raw);
      continue;
    }
    if (!hunk && /^(new|deleted) file mode/.test(raw)) { file.status = raw.startsWith("new") ? "added" : "deleted"; continue; }
    const h = raw.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (h) {
      o = Number(h[1]);
      n = Number(h[3]);
      oLeft = h[2] === undefined ? 1 : Number(h[2]);
      nLeft = h[4] === undefined ? 1 : Number(h[4]);
      hunk = { header: raw, lines: [] };
      file.hunks.push(hunk);
      continue;
    }
    if (!hunk) continue;
    if (raw.startsWith("+")) { hunk.lines.push({ type: "add", newNumber: n++, text: raw.slice(1) }); nLeft--; }
    else if (raw.startsWith("-")) { hunk.lines.push({ type: "del", oldNumber: o++, text: raw.slice(1) }); oLeft--; }
    else if (raw.startsWith(" ") || (raw === "" && oLeft > 0 && nLeft > 0)) { hunk.lines.push({ type: "context", oldNumber: o++, newNumber: n++, text: raw.slice(1) }); oLeft--; nLeft--; }
    // "\ No newline at end of file" と、まとまりの外の空の行は飛ばす
  }
  return files;
}

export interface DiffRow {
  /** 前の側の行。足しただけの行では無い */
  left?: DiffLine;
  /** 後の側の行。消しただけの行では無い */
  right?: DiffLine;
}

/** 左右に並べる時の行の組。変わらない行は両側に、続く消した行と足した行は上から順に対にする */
export function pairDiffLines(lines: DiffLine[]): DiffRow[] {
  const rows: DiffRow[] = [];
  let dels: DiffLine[] = [];
  let adds: DiffLine[] = [];
  const flush = () => {
    for (let i = 0; i < Math.max(dels.length, adds.length); i++) rows.push({ left: dels[i], right: adds[i] });
    dels = [];
    adds = [];
  };
  for (const l of lines) {
    if (l.type === "del") {
      if (adds.length) flush();
      dels.push(l);
    } else if (l.type === "add") adds.push(l);
    else {
      flush();
      rows.push({ left: l, right: l });
    }
  }
  flush();
  return rows;
}

export interface DiffWords {
  /** 前後で同じ頭 */
  prefix: string;
  /** 前の行だけにある所 */
  left: string;
  /** 後の行だけにある所 */
  right: string;
  /** 前後で同じ終わり */
  suffix: string;
}

/** 行の中で変わった所。頭と終わりの同じ所を除いた残り。字は書記素でなくコードポイントで数える */
export function diffWords(before: string, after: string): DiffWords {
  const a = Array.from(before);
  const b = Array.from(after);
  const max = Math.min(a.length, b.length);
  let p = 0;
  while (p < max && a[p] === b[p]) p++;
  let s = 0;
  while (s < max - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  return {
    prefix: a.slice(0, p).join(""),
    left: a.slice(p, a.length - s).join(""),
    right: b.slice(p, b.length - s).join(""),
    suffix: a.slice(a.length - s).join(""),
  };
}
