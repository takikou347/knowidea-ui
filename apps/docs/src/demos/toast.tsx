import { Button, ToastProvider, useToast, type ToastTone } from "@knowidea/ui";
import type { StateRow } from "./types";

function Buttons() {
  const t = useToast();
  const tones: [ToastTone, string, string][] = [
    ["info", "情報", "一覧を更新した。"],
    ["success", "成功", "設定を保存した。"],
    ["warn", "警告", "容量が上限の 80% に近い。"],
    ["error", "失敗", "保存できなかった。"],
  ];
  return (
    <>
      {tones.map(([tone, label, text]) => (
        <Button key={tone} variant="secondary" onClick={() => t.show({ tone, title: label, description: text })}>{label}の知らせを出す</Button>
      ))}
    </>
  );
}

export function Tones() {
  return <ToastProvider><Buttons /></ToastProvider>;
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "出ていないときは何も描かない" },
    { label: "読み込み", na: "知らせは結果を伝える物なので、処理中は Alert か Progress で示す" },
    { label: "失敗", node: <Tones />, note: "「失敗」を押すと、失敗の知らせが出る(5 秒で消える。閉じるボタンで消せる)" },
    { label: "無効", na: "知らせは操作を受けない。閉じるボタンだけを持つ" },
    { label: "focus", na: "出た知らせの閉じるボタンに Tab で入れる。F6 で知らせの領域に移れる" },
  ];
}
