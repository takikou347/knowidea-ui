import { Link } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return <p style={{ margin: 0 }}>詳しくは <Link href="#a">項目の一覧</Link> を見る。</p>;
}

export function Standalone() {
  return (
    <>
      <Link href="#a" standalone>一覧へ</Link>
      <Link href="https://example.com" external>外のサイト</Link>
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "字の無いリンクは作らない" },
    { label: "読み込み", na: "リンクは読み込みを持たない。遷移の待ちは移動先で示す" },
    { label: "失敗", na: "リンク先の失敗は移動先の画面で示す" },
    { label: "無効", node: <Link disabled>使えないリンク</Link>, note: "disabled で href を外し、aria-disabled を付ける" },
    { label: "focus", node: <Link href="#a" className="is-focus">focus</Link> },
    { label: "hover", node: <Link href="#a" className="is-hover">hover</Link> },
    { label: "押した時", node: <Link href="#a" className="is-active">押した時</Link> },
  ];
}
