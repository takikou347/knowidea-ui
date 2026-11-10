// エディタの、CodeMirror に依らない所のテスト。pnpm --filter knowidea-ui build の後に node --test で回す
import assert from "node:assert/strict";
import { test } from "node:test";
import { editorLanguageOfPath, editorOffset, editorPosition } from "../dist/editorText.js";

test("パスの終わりから、エディタの言語を決める", () => {
  assert.equal(editorLanguageOfPath("src/App.tsx"), "tsx");
  assert.equal(editorLanguageOfPath("src/gate/index.ts"), "typescript");
  assert.equal(editorLanguageOfPath("a.mts"), "typescript");
  assert.equal(editorLanguageOfPath("vite.config.mjs"), "javascript");
  assert.equal(editorLanguageOfPath("x.jsx"), "jsx");
  assert.equal(editorLanguageOfPath("packages/css/src/diff.css"), "css");
  assert.equal(editorLanguageOfPath("README.md"), "markdown");
  assert.equal(editorLanguageOfPath("README.MD"), "markdown");
  assert.equal(editorLanguageOfPath("package.json"), "json");
  assert.equal(editorLanguageOfPath("LICENSE"), "text");
  assert.equal(editorLanguageOfPath(".gitignore"), "text");
});

test("行と列(1 から)を、文字の位置にする", () => {
  const text = "ab\ncde\n\nf";
  assert.equal(editorOffset(text, 1, 1), 0);
  assert.equal(editorOffset(text, 1, 3), 2);
  assert.equal(editorOffset(text, 2, 2), 4);
  assert.equal(editorOffset(text, 3, 1), 7);
  assert.equal(editorOffset(text, 4, 2), 9);
});

test("行や列が外にはみ出す時は、中に収める", () => {
  const text = "ab\ncde";
  assert.equal(editorOffset(text, 1, 99), 2);
  assert.equal(editorOffset(text, 99, 1), 6);
  assert.equal(editorOffset(text, 0, 0), 0);
  assert.equal(editorOffset("", 1, 1), 0);
});

test("文字の位置を、行と列(1 から)にする", () => {
  const text = "ab\ncde\n\nf";
  assert.deepEqual(editorPosition(text, 0), { line: 1, column: 1 });
  assert.deepEqual(editorPosition(text, 4), { line: 2, column: 2 });
  assert.deepEqual(editorPosition(text, 7), { line: 3, column: 1 });
  assert.deepEqual(editorPosition(text, 999), { line: 4, column: 2 });
});
