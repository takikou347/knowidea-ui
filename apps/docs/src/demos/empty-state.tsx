import { EmptyState, Button, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "100%" }}>
      <EmptyState title="項目がない" icon={<Icon name="file" />} action={<Button variant="secondary">項目を作成</Button>}>
        項目を作成すると、ここに表示される。
      </EmptyState>
    </div>
  );
}

export function NoAction() {
  return (
    <div style={{ width: "100%" }}>
      <EmptyState title="検索に一致する項目がない" icon={<Icon name="search" />}>条件を減らすと見つかることがある。</EmptyState>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Basic />, note: "このコンポーネント自身が、Empty 状態を示すためのもの" },
    { label: "Loading", na: "ローディング中は Skeleton を表示し、Empty state は表示しない(先に空だと思わせない)" },
    { label: "Error", node: <div style={{ width: "100%" }}><EmptyState title="一覧を取得できなかった" icon={<Icon name="warning" />} action={<Button variant="secondary">再試行</Button>}>通信を確認してから、もう一度試す。</EmptyState></div> },
    { label: "Disabled", na: "無効状態を持たない。操作のボタンが無効になるだけ" },
    { label: "Focus", na: "操作のボタンにフォーカスが移る" },
  ];
}
