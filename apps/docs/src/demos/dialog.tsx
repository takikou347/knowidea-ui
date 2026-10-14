import { useState } from "react";
import { Dialog, DialogClose, ConfirmDialog, Button, Field, Input, Alert, Icon, Spinner, Status } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Dialog
      trigger={<Button variant="secondary">ダイアログを開く</Button>}
      title="名前を変更する"
      description="一覧と履歴の表示が変わる。"
      actions={<><DialogClose>キャンセル</DialogClose><DialogClose variant="primary">保存</DialogClose></>}
    >
      <Field label="新しい名前"><Input placeholder="例: sample-name" /></Field>
    </Dialog>
  );
}

export function Confirm() {
  return (
    <ConfirmDialog
      trigger={<Button variant="danger">削除する</Button>}
      title="「サンプル」を削除する"
      description="履歴も削除される。元に戻せない。"
      confirmLabel="削除する"
    />
  );
}

/** 結果を確かめる操作: 確認ダイアログ → リクエスト中 → 完了 */
export function Verify() {
  const [state, setState] = useState<"idle" | "requested" | "done">("idle");
  const request = () => {
    setState("requested");
    setTimeout(() => setState("done"), 1200);
  };
  if (state === "requested") return <span style={{ display: "inline-flex", gap: "var(--space-2)", alignItems: "center" }} role="status"><Spinner />リクエスト中(反映されるまで待つ)</span>;
  if (state === "done") {
    return (
      <>
        <Status kind="stopped" label="停止した" />
        <Button variant="quiet" icon={<Icon name="resume" />} onClick={() => setState("idle")}>再開</Button>
      </>
    );
  }
  return (
    <ConfirmDialog
      trigger={<Button variant="secondary" icon={<Icon name="stop" />}>停止する</Button>}
      title="「サンプルの処理」を停止する"
      description="停止をリクエストする。反映されるまでは、処理が動き続けることがある。"
      confirmLabel="停止をリクエスト"
      cancelLabel="キャンセル"
      onConfirm={request}
    />
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "中身のないダイアログは作らない" },
    { label: "Loading", node: <Dialog trigger={<Button variant="secondary">ローディング中の例</Button>} title="履歴" loading actions={<DialogClose>閉じる</DialogClose>} /> },
    {
      label: "Error",
      node: (
        <Dialog trigger={<Button variant="secondary">エラーの例</Button>} title="履歴" actions={<><DialogClose>閉じる</DialogClose><DialogClose variant="primary">再試行</DialogClose></>}>
          <Alert tone="error">履歴を読み込めなかった。</Alert>
        </Dialog>
      ),
    },
    { label: "Disabled", node: <Button variant="secondary" disabled>ダイアログを開く</Button> },
    { label: "Focus", node: <Button variant="secondary" className="is-focus">ダイアログを開く</Button>, note: "開くと最初の要素にフォーカスが移る。確認ダイアログではキャンセル側が先" },
    { label: "Hover", na: "ダイアログ自体は変わらない。中のボタンが変わる" },
    { label: "Active", na: "押したときの見た目は、開くボタン(Button)のものを使う。確認ダイアログは「キャンセル」と「削除する」で閉じる" },
  ];
}
