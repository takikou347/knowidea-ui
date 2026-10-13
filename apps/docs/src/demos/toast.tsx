import { Button, ToastProvider, useToast, type ToastTone } from "@knowidea/ui";
import type { StateRow } from "./types";

function Buttons() {
  const t = useToast();
  const tones: [ToastTone, string, string][] = [
    ["info", "情報", "一覧を更新した。"],
    ["success", "成功", "設定を保存した。"],
    ["warn", "警告", "容量が上限の 80% に近い。"],
    ["error", "エラー", "保存できなかった。"],
  ];
  return (
    <>
      {tones.map(([tone, label, text]) => (
        <Button key={tone} variant="secondary" onClick={() => t.show({ tone, title: label, description: text })}>{label}のトーストを表示</Button>
      ))}
    </>
  );
}

export function Tones() {
  return <ToastProvider><Buttons /></ToastProvider>;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "表示するトーストがないときは、何も描画しない" },
    { label: "Loading", na: "トーストは結果を伝えるものなので、処理中は Alert か Progress で示す" },
    { label: "Error", node: <Tones />, note: "「エラー」のボタンを押すと、エラーのトーストが表示される(5 秒で消える。閉じるボタンでも消せる)" },
    { label: "Disabled", na: "トーストは操作を受けない。閉じるボタンだけを持つ" },
    { label: "Focus", text: "表示されたトーストの閉じるボタンには、Tab で移れる。F6 でトーストの領域に移れる" },
  ];
}
