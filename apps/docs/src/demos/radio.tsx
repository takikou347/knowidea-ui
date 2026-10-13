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
    { label: "空", node: <RadioGroup legend="何も選んでいない" options={options} /> },
    { label: "読み込み", na: "選択肢が揃うまでは Skeleton で場所を取る。個々のラジオに読み込みは無い" },
    { label: "失敗", node: <RadioGroup legend="選んでいない(必須)" options={options} invalid /> },
    { label: "無効", node: <RadioGroup legend="無効" options={options} disabled defaultValue="push" /> },
    { label: "focus", node: <RadioGroup legend="focus は選んでいる 1 つに入る" options={options} defaultValue="email" /> },
    { label: "hover", na: "選ぶ丸の枠の色が変わる" },
    { label: "押した時", na: "押すと選びが移る" },
  ];
}
