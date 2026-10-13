import { cx } from "./utils.js";

export interface SpinnerProps {
  /** 読み上げる文。無ければ装飾として隠す */
  label?: string;
  className?: string;
}

export function Spinner({ label, className }: SpinnerProps) {
  return (
    <>
      <span className={cx("ki-spinner", className)} aria-hidden="true" />
      {label ? <span className="ki-sr-only" role="status">{label}</span> : null}
    </>
  );
}
