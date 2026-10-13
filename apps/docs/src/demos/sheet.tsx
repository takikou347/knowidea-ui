import { useState } from "react";
import { Sheet, SheetClose, Button, Field, Input, Switch, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Sheet
      trigger={<Button variant="secondary">シートを開く</Button>}
      title="表示の設定"
      description="この画面の表示だけが変わる。"
      actions={<><SheetClose>キャンセル</SheetClose><SheetClose variant="primary">保存</SheetClose></>}
    >
      <Switch label="完了した項目を表示する" placement="end" defaultChecked />
      <Switch label="週の始まりを月曜にする" placement="end" />
    </Sheet>
  );
}

export function WithForm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" icon={<Icon name="add" />} onClick={() => setOpen(true)}>予定を足す</Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="予定を足す"
        actions={<><SheetClose>キャンセル</SheetClose><Button variant="primary" onClick={() => setOpen(false)}>足す</Button></>}
      >
        <Field label="名前"><Input placeholder="例: 定例の打ち合わせ" /></Field>
        <Field label="場所" hint="空でもよい"><Input /></Field>
      </Sheet>
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "中身の無いシートは開かない" },
    { label: "Loading", node: <Sheet trigger={<Button variant="secondary">読み込み中のシート</Button>} title="履歴" loading />, note: "開くと、中身の代わりに本文の形をまねた Skeleton を出す" },
    { label: "Error", na: "中身の中で Alert を使う" },
    { label: "Disabled", na: "開くボタンを Disabled にする" },
    { label: "Focus", text: "開くと focus がシートの中に閉じ込められる。閉じると開いたボタンに戻る" },
  ];
}
