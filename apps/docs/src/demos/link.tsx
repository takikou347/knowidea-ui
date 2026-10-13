import { Link } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return <p style={{ margin: 0 }}>詳細は <Link href="#a">項目の一覧</Link> を参照。</p>;
}

export function Standalone() {
  return (
    <>
      <Link href="#a" standalone>一覧へ</Link>
      <Link href="https://example.com" external standalone>外部サイト</Link>
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "文字のないリンクは作らない" },
    { label: "Loading", na: "リンクはローディング状態を持たない。遷移の待ち時間は移動先で示す" },
    { label: "Error", na: "リンク先のエラーは、移動先の画面で示す" },
    { label: "Disabled", node: <Link disabled>無効なリンク</Link>, note: "disabled を指定すると href が外れ、aria-disabled が付く" },
    { label: "Focus", node: <Link href="#a" standalone className="is-focus">フォーカス</Link> },
    { label: "Hover", node: <Link href="#a" standalone className="is-hover">ホバー</Link> },
    { label: "Active", node: <Link href="#a" standalone className="is-active">押下時</Link> },
  ];
}
