import { Status, type StatusKind } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Kinds() {
  return (
    <>
      <Status kind="neutral" label="下書き" />
      <Status kind="info" label="案内" />
      <Status kind="success" label="完了" />
      <Status kind="warn" label="注意" />
      <Status kind="error" label="失敗" />
      <Status kind="working" label="処理中" />
      <Status kind="paused" label="待機中" />
      <Status kind="pending" label="予定" />
      <Status kind="stopped" label="停止" />
    </>
  );
}

export function Sizes() {
  return (
    <>
      <Status kind="success" label="標準" />
      <Status kind="success" label="大きい" size="lg" />
    </>
  );
}

export function Custom() {
  return <Status label="確認待ち" tone="warn" icon="clock" />;
}

const kinds: StatusKind[] = ["neutral", "info", "success", "warn", "error"];
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Status kind="neutral" label="状態なし" />, note: "状態がないときは、neutral のマークと「状態なし」の文字で示す" },
    { label: "Loading", node: <Status kind="working" label="確認中" /> },
    { label: "Error", node: <Status kind="error" label="失敗" /> },
    { label: "Disabled", node: <Status kind="stopped" label="停止中" /> },
    { label: "Focus", na: "Status は操作できないため、フォーカスを受けない" },
    { label: "All tones", node: kinds.map((k) => <Status key={k} kind={k} label={k} />) },
  ];
}
