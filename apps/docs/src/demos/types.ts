import type { ReactNode } from "react";

/** 状態の 1 行。部品に合わない状態は na に理由を書く */
export interface StateRow {
  label: string;
  node?: ReactNode;
  na?: string;
  note?: string;
}
