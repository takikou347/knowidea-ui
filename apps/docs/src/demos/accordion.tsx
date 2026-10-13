import { Accordion } from "@knowidea/ui";
import type { StateRow } from "./types";

const items = [
  { value: "a", title: "色", content: <p style={{ margin: 0 }}>主の色、面、文字、線、意味の色を決めている。</p> },
  { value: "b", title: "字", content: <p style={{ margin: 0 }}>書体は見出し、本文、数字、コードで分ける。</p> },
  { value: "c", title: "動き", content: <p style={{ margin: 0 }}>状態が変わる時だけ動かす。</p> },
  { value: "d", title: "準備中", content: <p style={{ margin: 0 }}>まだ読めない。</p>, disabled: true },
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
    { label: "空", node: <W><Accordion items={[{ value: "e", title: "項目は無い", content: <p style={{ margin: 0 }}>開くと理由を書く。</p> }]} /></W> },
    { label: "読み込み", na: "中身が遅れて届くときは、開いた中に Skeleton を出す" },
    { label: "失敗", na: "中身の失敗は、開いた中に Alert を出す" },
    { label: "無効", node: <W><Accordion items={items.slice(3)} /></W> },
    { label: "focus", node: <W><Accordion items={items.slice(0, 1)} /></W>, note: "見出しの行に focus が入ると、2px の輪が出る。矢印キーで見出しの間を移る" },
    { label: "hover", na: "見出しの行の背景が変わる" },
  ];
}
