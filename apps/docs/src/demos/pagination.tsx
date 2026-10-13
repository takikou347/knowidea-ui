import { useState } from "react";
import { Pagination } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  const [p, setP] = useState(1);
  return <Pagination page={p} pageCount={9} onPageChange={setP} />;
}

export function Links() {
  return <Pagination page={2} pageCount={4} getHref={(n) => `#page-${n}`} />;
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "1 ページだけのときは出さない" },
    { label: "読み込み", na: "ページ送りは数字だけで、読み込みを持たない。中身が読み込み中の間は、前後のボタンを押せなくする側が決める" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", node: <Pagination page={1} pageCount={4} />, note: "先頭では「前へ」が、最後では「次へ」が押せない" },
    { label: "focus", node: <Pagination page={3} pageCount={9} />, note: "押せる物に Tab で入ると、2px の輪が出る" },
  ];
}
