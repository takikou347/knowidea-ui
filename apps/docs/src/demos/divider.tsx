import { Divider } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "100%" }}>
      <p>上の文</p>
      <Divider />
      <p>下の文</p>
      <Divider label="または" />
      <span>一覧<Divider orientation="vertical" />記録<Divider orientation="vertical" strong />設定</span>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "線だけなので空を持たない" },
    { label: "読み込み", na: "読み込みを持たない" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", na: "無効を持たない" },
    { label: "focus", na: "区切りは押せないので focus を受けない" },
  ];
}
