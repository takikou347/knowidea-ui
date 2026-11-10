import type { CSSProperties, ReactNode } from "react";
import { Button } from "./Button.js";
import { cx } from "./utils.js";

export interface ListDetailProps {
  /** 一覧。List や Table など */
  list: ReactNode;
  /** 選んだ物の詳細。無ければ empty を出す */
  detail?: ReactNode;
  /** 1 列の時に、一覧でなく詳細を出す。2 列の時は両方が出るので関係しない */
  showDetail?: boolean;
  /** 1 列で詳細を出している時の、一覧へ戻るボタン。渡した時だけ出る(2 列では出ない) */
  onBack?: () => void;
  backLabel?: string;
  /** 2 列で、まだ何も選んでいない時に詳細の側に出す物 */
  empty?: ReactNode;
  /** 読み上げの名前。既定「一覧」と「詳細」 */
  listLabel?: string;
  detailLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * 一覧と詳細。PC(1024px 以上)と iPad の横は 2 列、スマホ(横向きも)と iPad の縦は 1 列で、showDetail で片方を出す。
 * 切り替えは CSS だけで決まるので、幅が変わっても選んだ物はそのまま残る。
 */
export function ListDetail({ list, detail, showDetail = false, onBack, backLabel = "一覧へ戻る", empty, listLabel = "一覧", detailLabel = "詳細", className, style }: ListDetailProps) {
  return (
    <div className={cx("ki-listdetail", className)} style={style} data-show={showDetail ? "detail" : "list"}>
      <section className="ki-listdetail__list" aria-label={listLabel}>{list}</section>
      <section className="ki-listdetail__detail" aria-label={detailLabel}>
        {onBack ? <div className="ki-listdetail__back"><Button variant="quiet" onClick={onBack}>{backLabel}</Button></div> : null}
        {detail ?? <div className="ki-listdetail__empty">{empty}</div>}
      </section>
    </div>
  );
}
