import { useId, useState } from "react";
import { cx } from "./utils.js";

export interface RatingProps {
  /** 何の評価か。必須(読み上げの名前) */
  label: string;
  /** 段の数。既定は 5 */
  max?: number;
  value?: number;
  defaultValue?: number;
  /** あると選べる評価になる。無ければ見るだけ */
  onValueChange?: (value: number) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
}

/** 星の形。塗りと線は CSS が決める */
function Star() {
  return (
    <svg className="ki-rating__star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <polygon points="12,2.8 14.8,8.9 21.4,9.6 16.5,14.1 17.9,20.7 12,17.4 6.1,20.7 7.5,14.1 2.6,9.6 9.2,8.9" />
    </svg>
  );
}

/** 星の評価。選べる時はラジオのグループ(矢印キーで選び直す)、見るだけの時は 1 枚の画像として読み上げる。押せる所は 44px。 */
export function Rating({ label, max = 5, value, defaultValue = 0, onValueChange, name, disabled, className }: RatingProps) {
  const auto = useId();
  const [inner, setInner] = useState(defaultValue);
  const now = value ?? inner;
  const steps = Array.from({ length: max }, (_, i) => i + 1);
  if (!onValueChange) {
    const shown = Math.round(now);
    return (
      <span className={cx("ki-rating", className)} role="img" aria-label={`${label}: ${max} 段階中 ${shown}`} data-readonly="">
        {steps.map((n) => <span key={n} className="ki-rating__item" data-filled={n <= shown ? "" : undefined}><Star /></span>)}
      </span>
    );
  }
  return (
    <div className={cx("ki-rating", className)} role="radiogroup" aria-label={label} data-disabled={disabled ? "" : undefined}>
      {steps.map((n) => (
        <label key={n} className="ki-rating__item" data-filled={n <= now ? "" : undefined}>
          <input
            type="radio" className="ki-rating__input" name={name ?? auto} value={n}
            aria-label={`${max} 段階中 ${n}`}
            checked={now === n} disabled={disabled}
            onChange={() => { setInner(n); onValueChange(n); }}
          />
          <Star />
        </label>
      ))}
    </div>
  );
}
