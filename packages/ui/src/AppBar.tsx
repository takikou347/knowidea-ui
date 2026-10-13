import type { ReactNode } from "react";
import { cx } from "./utils.js";

export interface AppBarProps {
  /** 題(h1)。必須 */
  title: ReactNode;
  /** 題の左に置く物。目次を開くボタン、戻るボタン、ロゴ */
  leading?: ReactNode;
  /** 右に置く操作。IconButton を並べる */
  actions?: ReactNode;
  /** 右に寄せた小さな補足(いつの数か、など)。2 行まで */
  meta?: ReactNode;
  /** 題の見出しの段。既定 1(画面の最上位)。ほかの見出しと並ぶ所では 2 */
  headingLevel?: 1 | 2 | 3;
  /** sticky で上に貼り付く */
  position?: "static" | "sticky";
  className?: string;
}

/** アプリや画面の上のバー。題は h1。 */
export function AppBar({ title, leading, actions, meta, position = "static", headingLevel = 1, className }: AppBarProps) {
  const H = `h${headingLevel}` as "h1" | "h2" | "h3";
  return (
    <header className={cx("ki-appbar", className)} data-position={position === "sticky" ? "sticky" : undefined}>
      {leading ? <div className="ki-appbar__leading">{leading}</div> : null}
      <H className="ki-appbar__title">{title}</H>
      {meta ? <p className="ki-appbar__meta">{meta}</p> : null}
      {actions ? <div className="ki-appbar__actions">{actions}</div> : null}
    </header>
  );
}
