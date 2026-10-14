import { useState } from "react";
import { FileUpload } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ display: "grid", gap: "var(--space-2)", width: "min(100%, 420px)" }}>
      <FileUpload label="添付を選ぶ" accept="image/*,.pdf" multiple maxSize={5 * 1024 * 1024} hint="画像か PDF、1 つ 5 MB まで" value={files} onFilesChange={setFiles} />
      <p style={{ margin: 0, color: "var(--color-text-muted)" }}>選んだ数: {files.length}</p>
    </div>
  );
}

export function Single() {
  const sample = [new File(["x".repeat(184_320)], "プロフィールの写真.png", { type: "image/png" })];
  return (
    <div style={{ width: "min(100%, 420px)" }}>
      <FileUpload label="写真を選ぶ" accept="image/*" defaultValue={sample} hint="1 枚だけ。選び直すと入れ替わる" />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <div style={{ width: "min(100%, 420px)" }}><FileUpload /></div>, note: "何も選んでいない時は、置き場だけを出す" },
    { label: "Loading", na: "選ぶとすぐに一覧へ加わる。送る間は、送るボタンの loading か Progress を使う" },
    { label: "Error", node: <div style={{ width: "min(100%, 420px)" }}><FileUpload invalid hint="1 つ以上を選ぶ" /></div>, note: "上限を超えた物は加えず、名前と理由を文で出す(読み上げでも知らせる)" },
    { label: "Disabled", node: <div style={{ width: "min(100%, 420px)" }}><FileUpload disabled /></div> },
    { label: "Focus", text: "置き場に focus すると 2px のリングが出る。Enter か Space で選ぶ画面が開く。ファイルを持って上に来ると、枠が主の色の実線になる" },
  ];
}
