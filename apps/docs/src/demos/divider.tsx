import { Divider } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "100%" }}>
      <p>上の文章</p>
      <Divider />
      <p>下の文章</p>
      <Divider label="または" />
      <span>一覧<Divider orientation="vertical" />履歴<Divider orientation="vertical" strong />設定</span>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "線だけなので、Empty 状態を持たない" },
    { label: "Loading", na: "ローディング状態を持たない" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", na: "無効状態を持たない" },
    { label: "Focus", na: "Divider は操作できないため、フォーカスを受けない" },
  ];
}
