import { Avatar } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <>
      <Avatar name="Sample User" />
      <Avatar name="サンプル" />
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
    { label: "Empty", node: <><Avatar /><Avatar name="サンプル" /></>, note: "名前も画像もないときは人のアイコンを表示する。名前だけのときはイニシャルを表示する" },
    { label: "Loading", node: <Avatar name="Sample User" src="data:image/gif;base64,invalid" />, note: "画像を読み込めない間と、読み込めなかったときは、イニシャルに切り替わる" },
    { label: "Error", na: "画像の読み込み失敗は、イニシャルへの切り替えで示す(Empty と同じ見た目)" },
    { label: "Disabled", na: "Avatar は操作できない。操作できるようにするときは Button で包む" },
    { label: "Focus", na: "Avatar は操作できないため、フォーカスを受けない" },
  ];
}
