import { useState } from "react";
import { Dialog, DialogClose, ConfirmDialog, Button, Field, Input, Alert, Icon, Spinner, Status } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Dialog
      trigger={<Button variant="secondary">ダイアログを開く</Button>}
      title="名前を変える"
      description="一覧と記録の表示が変わる。"
      actions={<><DialogClose>やめる</DialogClose><DialogClose variant="primary">保存する</DialogClose></>}
    >
      <Field label="新しい名前"><Input placeholder="例: sample-name" /></Field>
    </Dialog>
  );
}

export function Confirm() {
  return (
    <ConfirmDialog
      trigger={<Button variant="danger">削除する</Button>}
      title="「見本」を削除する"
      description="記録も消える。元に戻せない。"
      confirmLabel="削除する"
    />
  );
}

/** 確かめる操作: 確かめる画面 → 依頼中 → 完了(または失敗して文面を残す) */
export function Verify() {
  const [state, setState] = useState<"idle" | "requested" | "done">("idle");
  const request = () => {
    setState("requested");
    setTimeout(() => setState("done"), 1200);
  };
  if (state === "requested") return <span style={{ display: "inline-flex", gap: "var(--space-2)", alignItems: "center" }} role="status"><Spinner />依頼中(反映されるまで待つ)</span>;
  if (state === "done") {
    return (
      <>
        <Status kind="stopped" label="止めた" />
        <Button variant="quiet" icon={<Icon name="resume" />} onClick={() => setState("idle")}>再開</Button>
      </>
    );
  }
  return (
    <ConfirmDialog
      trigger={<Button variant="secondary" icon={<Icon name="stop" />}>止める</Button>}
      title="「見本の処理」を止める"
      description="止める依頼を出す。反映されるまでは動いていることがある。"
      confirmLabel="止める依頼を出す"
      cancelLabel="やめる"
      onConfirm={request}
    />
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "中身の無いダイアログは作らない" },
    { label: "読み込み", node: <Dialog trigger={<Button variant="secondary">読み込み中の例</Button>} title="記録" loading actions={<DialogClose>閉じる</DialogClose>} /> },
    {
      label: "失敗",
      node: (
        <Dialog trigger={<Button variant="secondary">失敗の例</Button>} title="記録" actions={<><DialogClose>閉じる</DialogClose><DialogClose variant="primary">もう一度</DialogClose></>}>
          <Alert tone="error">記録を読み込めなかった。</Alert>
        </Dialog>
      ),
    },
    { label: "無効", node: <Button variant="secondary" disabled>ダイアログを開く</Button> },
    { label: "focus", node: <Button variant="secondary" className="is-focus">ダイアログを開く</Button>, note: "開くと初めの要素に focus が入る。確かめる形は取り消し側が先" },
    { label: "hover", na: "ダイアログ自体は変わらない。中のボタンが変わる" },
    { label: "押した時", na: "開く操作は押すと開く。確かめる形は「やめる」と「削除する」で閉じる" },
  ];
}
