// エディタの、CodeMirror に依らない所。言語の決め方と、行と列と文字の位置の行き来

export type EditorLanguage = "typescript" | "tsx" | "javascript" | "jsx" | "css" | "markdown" | "json" | "text";

const byExt: Record<string, EditorLanguage> = {
  ts: "typescript", mts: "typescript", cts: "typescript", tsx: "tsx",
  js: "javascript", mjs: "javascript", cjs: "javascript", jsx: "jsx",
  css: "css", md: "markdown", markdown: "markdown", json: "json", jsonc: "json",
};

/** パスの終わり(拡張子)から、エディタの言語を決める。知らない物は text */
export function editorLanguageOfPath(path: string): EditorLanguage {
  const name = path.slice(path.lastIndexOf("/") + 1);
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return "text";
  return byExt[name.slice(dot + 1).toLowerCase()] ?? "text";
}

/** 行と列(どちらも 1 から。列は UTF-16 の単位)を、文字の位置(0 から)にする。外にはみ出す時は中に収める */
export function editorOffset(text: string, line: number, column: number): number {
  let start = 0;
  for (let l = 1; l < line; l++) {
    const next = text.indexOf("\n", start);
    if (next < 0) return text.length;
    start = next + 1;
  }
  const end = text.indexOf("\n", start);
  const length = (end < 0 ? text.length : end) - start;
  return start + Math.min(Math.max(column - 1, 0), length);
}

/** 文字の位置(0 から)を、行と列(どちらも 1 から)にする */
export function editorPosition(text: string, offset: number): { line: number; column: number } {
  const at = Math.min(Math.max(offset, 0), text.length);
  let line = 1;
  let start = 0;
  for (let next = text.indexOf("\n"); next >= 0 && next < at; next = text.indexOf("\n", start)) {
    line++;
    start = next + 1;
  }
  return { line, column: at - start + 1 };
}
