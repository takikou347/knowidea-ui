import {
  Button, IconButton, Icon, Dialog, DialogClose, ConfirmDialog, Menu, Tooltip, ToastProvider, useToast,
  Input, Field, Banner, type MenuEntry, type ToastTone,
} from "@knowidea/react";

export function DialogDemo() {
  return (
    <Dialog
      trigger={<Button variant="secondary">ダイアログを開く</Button>}
      title="routine の名前を変える"
      description="一覧と記録の表示が変わる。"
      actions={<><DialogClose>やめる</DialogClose><DialogClose variant="primary">保存する</DialogClose></>}
    >
      <Field label="新しい名前"><Input placeholder="例: review" /></Field>
    </Dialog>
  );
}
export function ConfirmDemo() {
  return (
    <ConfirmDialog
      trigger={<Button variant="danger">削除する</Button>}
      title="routine review を削除する"
      description="実行の記録も消える。元に戻せない。"
      confirmLabel="削除する"
    />
  );
}
export function LoadingDialog() {
  return (
    <Dialog trigger={<Button variant="secondary">読み込み中の例</Button>} title="実行の記録" loading
      actions={<DialogClose>閉じる</DialogClose>} />
  );
}
export function ErrorDialog() {
  return (
    <Dialog trigger={<Button variant="secondary">失敗の例</Button>} title="実行の記録"
      actions={<><DialogClose>閉じる</DialogClose><DialogClose variant="primary">もう一度</DialogClose></>}>
      <Banner tone="error">記録を読み込めなかった。</Banner>
    </Dialog>
  );
}
export function DisabledTrigger() {
  return <Button variant="secondary" disabled>ダイアログを開く</Button>;
}
export function FocusTrigger() {
  return <Button variant="secondary" className="is-focus">ダイアログを開く</Button>;
}

const entries: MenuEntry[] = [
  { label: "名前を変える", icon: <Icon name="check" /> },
  { label: "複製する", icon: <Icon name="copy" /> },
  { label: "止める", disabled: true },
  { type: "separator" },
  { label: "削除する", tone: "danger", icon: <Icon name="trash" /> },
];
export function MenuDemo({ disabled, className }: { disabled?: boolean; className?: string }) {
  return (
    <Menu
      items={entries}
      trigger={<Button variant="secondary" disabled={disabled} className={className} icon={<Icon name="dots-three" />}>操作</Button>}
    />
  );
}
export function IconMenuDemo() {
  return <Menu items={entries} align="end" trigger={<IconButton variant="secondary" label="その他の操作" icon={<Icon name="dots-three" />} />} />;
}

export function TooltipDemo() {
  return (
    <>
      <Tooltip content="コピーする"><IconButton variant="secondary" label="コピー" icon={<Icon name="copy" />} /></Tooltip>
      <Tooltip content="使用量のトークンは日本時間の 0 時で区切る" side="bottom"><Button variant="secondary">使用量</Button></Tooltip>
    </>
  );
}

function ToastButtons() {
  const t = useToast();
  const tones: [ToastTone, string, string][] = [
    ["info", "情報", "routine の一覧を更新した。"],
    ["success", "成功", "routine review を保存した。"],
    ["warn", "警告", "使用量が上限の 80% に近い。"],
    ["error", "失敗", "PR を作れなかった。"],
  ];
  return (
    <>
      {tones.map(([tone, label, text]) => (
        <Button key={tone} variant="secondary" onClick={() => t.show({ tone, title: label, description: text })}>{label}の知らせを出す</Button>
      ))}
    </>
  );
}
export function ToastDemo() {
  return <ToastProvider><ToastButtons /></ToastProvider>;
}
