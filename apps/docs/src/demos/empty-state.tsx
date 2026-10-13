import { EmptyState, Button, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <div style={{ width: "100%" }}>
      <EmptyState title="項目が無い" icon={<Icon name="file" />} action={<Button variant="secondary">項目を作る</Button>}>
        項目を作ると、ここに並ぶ。
      </EmptyState>
    </div>
  );
}

export function NoAction() {
  return (
    <div style={{ width: "100%" }}>
      <EmptyState title="検索に合う物が無い" icon={<Icon name="search" />}>条件を減らすと見つかることがある。</EmptyState>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", node: <Basic />, note: "この部品自身が「空」を示す部品" },
    { label: "読み込み", na: "読み込み中は Skeleton を出し、空の状態は出さない(先に空と見せない)" },
    { label: "失敗", node: <div style={{ width: "100%" }}><EmptyState title="一覧を取れなかった" icon={<Icon name="warning" />} action={<Button variant="secondary">もう一度</Button>}>通信を確かめてから、もう一度試す。</EmptyState></div> },
    { label: "無効", na: "無効を持たない。行動のボタンが無効になるだけ" },
    { label: "focus", na: "行動のボタンに focus が入る" },
  ];
}
