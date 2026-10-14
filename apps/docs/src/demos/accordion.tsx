import { Accordion } from "knowidea-ui";
import type { StateRow } from "./types";

const items = [
  { value: "a", title: "カラー", content: <p style={{ margin: 0 }}>プライマリカラー、背景、文字、線、状態を表す色を定義している。</p> },
  { value: "b", title: "タイポグラフィ", content: <p style={{ margin: 0 }}>書体は、見出し、本文、数字、コードで使い分ける。</p> },
  { value: "c", title: "モーション", content: <p style={{ margin: 0 }}>状態が変わる時だけ動かす。</p> },
  { value: "d", title: "準備中", content: <p style={{ margin: 0 }}>まだ表示できない。</p>, disabled: true },
];

export function Basic() {
  return <div style={{ width: "100%" }}><Accordion items={items} defaultValue={["a"]} /></div>;
}

export function Multiple() {
  return <div style={{ width: "100%" }}><Accordion items={items.slice(0, 3)} multiple defaultValue={["a", "b"]} /></div>;
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "100%" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><Accordion items={[{ value: "e", title: "項目がない", content: <p style={{ margin: 0 }}>開くと理由を表示する。</p> }]} /></W> },
    { label: "Loading", na: "コンテンツの取得に時間がかかる場合は、開いた内容の中に Skeleton を表示する" },
    { label: "Error", na: "コンテンツの取得に失敗した場合は、開いた内容の中に Alert を表示する" },
    { label: "Disabled", node: <W><Accordion items={items.slice(3)} /></W> },
    { label: "Focus", node: <W><Accordion items={items.slice(0, 1)} /></W>, note: "見出しの行にフォーカスが移ると、2px のリングが表示される。矢印キーで見出しの間を移動する" },
    { label: "Hover", note: "見出しの行の背景が変わる" },
  ];
}
