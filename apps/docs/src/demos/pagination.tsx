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
    { label: "Empty", na: "ページが 1 つだけのときは表示しない" },
    { label: "Loading", na: "Pagination 自体にローディング状態はない。コンテンツの読み込み中に前後のボタンを無効にするかどうかは、使う側が決める" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", node: <Pagination page={1} pageCount={4} />, note: "先頭では「前へ」、最後では「次へ」が操作できなくなる" },
    { label: "Focus", node: <Pagination page={3} pageCount={9} />, note: "操作できる要素に Tab で移ると、2px のリングが表示される" },
  ];
}
