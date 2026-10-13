import type { ReactNode } from "react";

/** 状態の 1 行。コンポーネントにあてはまらない状態は na に理由を書く */
export interface StateRow {
  label: string;
  node?: ReactNode;
  na?: string;
  note?: string;
}
