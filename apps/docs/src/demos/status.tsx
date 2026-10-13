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
      <Status kind="paused" label="待っている" />
      <Status kind="pending" label="予定" />
      <Status kind="stopped" label="止めた" />
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
    { label: "空", node: <Status kind="neutral" label="状態なし" />, note: "状態が無いときは中立の印で「状態なし」と字で示す" },
    { label: "読み込み", node: <Status kind="working" label="確かめている" /> },
    { label: "失敗", node: <Status kind="error" label="失敗" /> },
    { label: "無効", node: <Status kind="stopped" label="停止中" /> },
    { label: "focus", na: "状態の印は押せないので focus を受けない" },
    { label: "全ての色", node: kinds.map((k) => <Status key={k} kind={k} label={k} />) },
  ];
}
