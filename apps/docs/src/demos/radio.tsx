import { RadioGroup } from "@knowidea/ui";
import type { StateRow } from "./types";

const options = [
  { value: "email", label: "メール" },
  { value: "push", label: "プッシュ通知" },
  { value: "none", label: "受け取らない" },
];

export function Basic() {
  return <RadioGroup legend="通知の受け取り方" options={options} defaultValue="email" />;
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <RadioGroup legend="未選択" options={options} /> },
    { label: "Loading", na: "選択肢が揃うまでは Skeleton で場所を確保する。個々のラジオにローディング状態はない" },
    { label: "Error", node: <RadioGroup legend="未選択(必須)" options={options} invalid /> },
    { label: "Disabled", node: <RadioGroup legend="無効" options={options} disabled defaultValue="push" /> },
    { label: "Focus", node: <RadioGroup legend="フォーカスは選択中の 1 つに移る" options={options} defaultValue="email" /> },
    { label: "Hover", note: "丸の枠線の色が変わる" },
    { label: "Active", na: "押すと選択が移る" },
  ];
}
