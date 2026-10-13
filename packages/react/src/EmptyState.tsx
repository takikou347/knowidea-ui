import type { ReactNode } from "react";
import { cx } from "./utils.js";

export interface EmptyStateProps {
  title: ReactNode;
  /** 理由と次にすること。1〜2 文 */
  children?: ReactNode;
  /** 行動は 1 つ(Button か Link) */
  action?: ReactNode;
  /** 小さなアイコン(任意) */
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, children, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cx("ki-empty", className)}>
      {icon ? <span className="ki-empty__icon">{icon}</span> : null}
      <p className="ki-empty__title">{title}</p>
      {children ? <p className="ki-empty__text">{children}</p> : null}
      {action ? <div className="ki-empty__action">{action}</div> : null}
    </div>
  );
}
