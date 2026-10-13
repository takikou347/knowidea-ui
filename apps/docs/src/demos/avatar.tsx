import { Avatar } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <>
      <Avatar name="Sample User" />
      <Avatar name="見本" />
      <Avatar />
    </>
  );
}

export function Sizes() {
  return (
    <>
      <Avatar name="Sample User" size="sm" />
      <Avatar name="Sample User" />
      <Avatar name="Sample User" size="lg" />
      <Avatar name="Sample User" size="lg" shape="circle" />
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", node: <><Avatar /><Avatar name="見本" /></>, note: "名前も画像も無いときは人のアイコン。名前だけのときは頭文字" },
    { label: "読み込み", node: <Avatar name="Sample User" src="data:image/gif;base64,invalid" />, note: "画像が読み込めない間と、読み込めなかったときは頭文字に切り替わる" },
    { label: "失敗", na: "画像の失敗は頭文字に切り替えて示す(空の状態と同じ見た目)" },
    { label: "無効", na: "アバターは押せない。押せるようにするときは Button で包む" },
    { label: "focus", na: "アバターは押せないので focus を受けない" },
  ];
}
