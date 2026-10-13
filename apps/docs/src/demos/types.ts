import type { ReactNode } from "react";

/** 状態の 1 行。コンポーネントにあてはまらない状態は na に理由を書く */
export interface StateRow {
  label: string;
  node?: ReactNode;
  na?: string;
  /** 見た目を文章だけで書く行。「対象外」とは付けない */
  text?: string;
  note?: string;
}
