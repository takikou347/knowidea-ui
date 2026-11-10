// 差分の読み取りと組み方のテスト。pnpm --filter knowidea-ui build の後に node --test で回す
import assert from "node:assert/strict";
import { test } from "node:test";
import { diffLineKey, diffWords, pairDiffLines, parseUnifiedDiff } from "../dist/diff.js";

const modified = `diff --git a/src/a.ts b/src/a.ts
index 1111111..2222222 100644
--- a/src/a.ts
+++ b/src/a.ts
@@ -1,4 +1,5 @@
 const a = 1;
-const b = 2;
+const b = 3;
+const c = 4;
 export { a };
\\ No newline at end of file
@@ -10,2 +11,2 @@ function f() {
-  return a;
+  return a + b;
 }
`;

test("直したファイルを、行の番号と一緒に読む", () => {
  const files = parseUnifiedDiff(modified);
  assert.equal(files.length, 1);
  const f = files[0];
  assert.equal(f.path, "src/a.ts");
  assert.equal(f.status, "modified");
  assert.equal(f.hunks.length, 2);
  assert.deepEqual(f.hunks[0].lines, [
    { type: "context", oldNumber: 1, newNumber: 1, text: "const a = 1;" },
    { type: "del", oldNumber: 2, text: "const b = 2;" },
    { type: "add", newNumber: 2, text: "const b = 3;" },
    { type: "add", newNumber: 3, text: "const c = 4;" },
    { type: "context", oldNumber: 3, newNumber: 4, text: "export { a };" },
  ]);
  assert.equal(f.hunks[1].header, "@@ -10,2 +11,2 @@ function f() {");
  assert.deepEqual(f.hunks[1].lines[0], { type: "del", oldNumber: 10, text: "  return a;" });
  assert.deepEqual(f.hunks[1].lines[1], { type: "add", newNumber: 11, text: "  return a + b;" });
});

test("新しいファイル、消したファイル、名前を変えたファイルを見分ける", () => {
  const files = parseUnifiedDiff(`diff --git a/new.txt b/new.txt
new file mode 100644
--- /dev/null
+++ b/new.txt
@@ -0,0 +1 @@
+hello
diff --git a/old.txt b/old.txt
deleted file mode 100644
--- a/old.txt
+++ /dev/null
@@ -1 +0,0 @@
-bye
diff --git a/from.txt b/to.txt
similarity index 90%
rename from from.txt
rename to to.txt
--- a/from.txt
+++ b/to.txt
@@ -1 +1 @@
-x
+y
`);
  assert.deepEqual(files.map((f) => [f.path, f.status, f.oldPath]), [
    ["new.txt", "added", undefined],
    ["old.txt", "deleted", undefined],
    ["to.txt", "renamed", "from.txt"],
  ]);
  assert.deepEqual(files[0].hunks[0].lines, [{ type: "add", newNumber: 1, text: "hello" }]);
  assert.deepEqual(files[1].hunks[0].lines, [{ type: "del", oldNumber: 1, text: "bye" }]);
});

test("改行が CRLF でも読む。空の文字列は 0 件", () => {
  assert.equal(parseUnifiedDiff("").length, 0);
  const files = parseUnifiedDiff(modified.replace(/\n/g, "\r\n"));
  assert.equal(files[0].hunks[0].lines[1].text, "const b = 2;");
});

test("行の鍵は、後の番号があれば n、無ければ o", () => {
  assert.equal(diffLineKey({ type: "add", newNumber: 12, text: "" }), "n12");
  assert.equal(diffLineKey({ type: "context", oldNumber: 3, newNumber: 4, text: "" }), "n4");
  assert.equal(diffLineKey({ type: "del", oldNumber: 7, text: "" }), "o7");
});

test("左右に並べる時、消した行と足した行を上から順に対にする", () => {
  const [f] = parseUnifiedDiff(modified);
  const rows = pairDiffLines(f.hunks[0].lines);
  assert.deepEqual(rows.map((r) => [r.left?.text, r.right?.text]), [
    ["const a = 1;", "const a = 1;"],
    ["const b = 2;", "const b = 3;"],
    [undefined, "const c = 4;"],
    ["export { a };", "export { a };"],
  ]);
});

test("消した行が多い時は、右が空く", () => {
  const rows = pairDiffLines([
    { type: "del", oldNumber: 1, text: "a" },
    { type: "del", oldNumber: 2, text: "b" },
    { type: "add", newNumber: 1, text: "c" },
  ]);
  assert.deepEqual(rows.map((r) => [r.left?.text, r.right?.text]), [["a", "c"], ["b", undefined]]);
});

test("行の中で変わった所を、前後の同じ所を除いて取り出す", () => {
  assert.deepEqual(diffWords("const b = 2;", "const b = 3;"), { prefix: "const b = ", left: "2", right: "3", suffix: ";" });
  assert.deepEqual(diffWords("  return a;", "  return a + b;"), { prefix: "  return a", left: "", right: " + b", suffix: ";" });
  assert.deepEqual(diffWords("abc", "abc"), { prefix: "abc", left: "", right: "", suffix: "" });
  assert.deepEqual(diffWords("", "new"), { prefix: "", left: "", right: "new", suffix: "" });
});

test("前後の同じ所が重なる時、同じ字を 2 度数えない", () => {
  assert.deepEqual(diffWords("aa", "aaa"), { prefix: "aa", left: "", right: "a", suffix: "" });
  assert.deepEqual(diffWords("abab", "ab"), { prefix: "ab", left: "ab", right: "", suffix: "" });
});

test("絵文字のような 2 つで 1 字の文字を、途中で切らない", () => {
  const r = diffWords("a😀b", "a😁b");
  assert.equal(r.prefix, "a");
  assert.equal(r.left, "😀");
  assert.equal(r.right, "😁");
  assert.equal(r.suffix, "b");
});

test("git が引用符で囲んだパス(日本語の名前)を元に戻す", () => {
  const files = parseUnifiedDiff(`diff --git "a/docs/\\346\\227\\245 \\"a\\".txt" "b/docs/\\346\\227\\245 \\"a\\".txt"
--- "a/docs/\\346\\227\\245 \\"a\\".txt"
+++ "b/docs/\\346\\227\\245 \\"a\\".txt"
@@ -1 +1 @@
-a
+b
`);
  assert.equal(files[0].path, 'docs/日 "a".txt');
  assert.equal(files[0].oldPath, undefined);
  assert.equal(files[0].status, "modified");
});

test("引用符で囲んだ名前へ変えた時、前と後のパスを分ける", () => {
  const files = parseUnifiedDiff(`diff --git a/old.txt "b/\\346\\226\\260.txt"
similarity index 100%
rename from old.txt
rename to "\\346\\226\\260.txt"
`);
  assert.equal(files[0].path, "新.txt");
  assert.equal(files[0].oldPath, "old.txt");
  assert.equal(files[0].status, "renamed");
});

test("空白の入った名前は、前と後が同じなら 1 つのパスとして読む", () => {
  const files = parseUnifiedDiff(`diff --git a/my b/file.txt b/my b/file.txt
--- a/my b/file.txt\t
+++ b/my b/file.txt\t
@@ -1 +1 @@
-a
+b
`);
  assert.equal(files[0].path, "my b/file.txt");
  assert.equal(files[0].oldPath, undefined);
});

test("頭の空白が落ちた空の行も、変わらない行として数える", () => {
  const files = parseUnifiedDiff(`--- a/x
+++ b/x
@@ -1,3 +1,2 @@
 a

-b
`);
  assert.deepEqual(files[0].hunks[0].lines, [
    { type: "context", oldNumber: 1, newNumber: 1, text: "a" },
    { type: "context", oldNumber: 2, newNumber: 2, text: "" },
    { type: "del", oldNumber: 3, text: "b" },
  ]);
});
