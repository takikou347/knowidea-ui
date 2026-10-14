import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import { cx } from "./utils.js";

/** 日付だけを比べる(時刻は見ない) */
export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
/** 月を足す。日は、その月に無ければ月末にそろえる(1 月 31 日 + 1 か月 = 2 月 28 日) */
function addMonths(d: Date, n: number): Date {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
}
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fmtMonth = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long" });
const fmtDay = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const WEEKDAYS_LONG = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

export interface CalendarProps {
  /** 選んだ日。null は未選択 */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  /** 表示している月(その月のどの日でもよい) */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** 選べる最初の日と最後の日 */
  min?: Date;
  max?: Date;
  /** 選べない日 */
  isDateDisabled?: (date: Date) => boolean;
  /** 予定のある日など、点を付ける日 */
  isDateMarked?: (date: Date) => boolean;
  /** 週の始まり。0 は日曜、1 は月曜 */
  weekStartsOn?: 0 | 1;
  /** 表の名前。既定は表示している年月 */
  label?: string;
  /** 開いた時に、選んだ日(無ければ今日)へ focus を移す */
  autoFocus?: boolean;
  className?: string;
}

/** 月のカレンダー。矢印キーで日を、PageUp と PageDown で月を移る。 */
export function Calendar({
  value, defaultValue = null, onValueChange, month, defaultMonth, onMonthChange,
  min, max, isDateDisabled, isDateMarked, weekStartsOn = 0, label, autoFocus, className,
}: CalendarProps) {
  const [innerValue, setInnerValue] = useState<Date | null>(defaultValue);
  const selected = value !== undefined ? value : innerValue;
  const today = dayStart(new Date());

  const outOfRange = (d: Date) => (min && d < dayStart(min)) || (max && d > dayStart(max));
  const disabled = (d: Date) => !!outOfRange(d) || !!isDateDisabled?.(d);
  /** 選べる日のうち、d にいちばん近い日。範囲の外なら端へ寄せ、選べない日なら先へ、無ければ前へ探す */
  const nearest = (d: Date): Date => {
    let x = dayStart(d);
    if (min && x < dayStart(min)) x = dayStart(min);
    if (max && x > dayStart(max)) x = dayStart(max);
    for (let i = 0; i < 366; i++) {
      const f = addDays(x, i);
      if (!disabled(f)) return f;
      const b = addDays(x, -i);
      if (!disabled(b)) return b;
    }
    return x;
  };

  const [innerMonth, setInnerMonth] = useState<Date>(() => monthStart(defaultMonth ?? selected ?? nearest(today)));
  const shown = monthStart(month ?? innerMonth);
  const [focusDay, setFocusDay] = useState<Date>(() => selected ? dayStart(selected) : nearest(today));
  // 月を移った向き。表の出方の動きに使う
  const [dir, setDir] = useState<"next" | "prev" | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const wantFocus = useRef(!!autoFocus);
  const titleId = useId();

  const setMonth = (d: Date) => {
    const m = monthStart(d);
    if (m.getTime() === shown.getTime()) return;
    setDir(m > shown ? "next" : "prev");
    if (month === undefined) setInnerMonth(m);
    onMonthChange?.(m);
  };

  // focus する日が、表示している月の外へ出たら月を移る
  const moveFocus = (d: Date) => {
    if (min && d < dayStart(min)) d = dayStart(min);
    if (max && d > dayStart(max)) d = dayStart(max);
    setFocusDay(d);
    if (d.getMonth() !== shown.getMonth() || d.getFullYear() !== shown.getFullYear()) setMonth(d);
    wantFocus.current = true;
  };

  useEffect(() => {
    if (!wantFocus.current) return;
    wantFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${key(focusDay)}"]`)?.focus();
  });

  // 表示している月が外から変わったら、focus する日をその月の中へ寄せる
  const inShown = (d: Date) => d.getMonth() === shown.getMonth() && d.getFullYear() === shown.getFullYear();
  const tabDay = inShown(focusDay) ? focusDay
    : selected && inShown(selected) ? dayStart(selected)
    : inShown(today) ? nearest(today) : nearest(shown);

  const pick = (d: Date) => {
    if (disabled(d)) return;
    setFocusDay(d);
    if (value === undefined) setInnerValue(d);
    onValueChange?.(d);
    if (d.getMonth() !== shown.getMonth()) setMonth(d);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const weekPos = (d.getDay() - weekStartsOn + 7) % 7;
    const to: Record<string, () => Date> = {
      ArrowLeft: () => addDays(d, -1),
      ArrowRight: () => addDays(d, 1),
      ArrowUp: () => addDays(d, -7),
      ArrowDown: () => addDays(d, 7),
      Home: () => addDays(d, -weekPos),
      End: () => addDays(d, 6 - weekPos),
      PageUp: () => addMonths(d, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(d, e.shiftKey ? 12 : 1),
    };
    const f = to[e.key];
    if (!f) return;
    e.preventDefault();
    moveFocus(f());
  };

  // 6 週ぶん。月の始まりの週の頭から
  const first = addDays(shown, -((shown.getDay() - weekStartsOn + 7) % 7));
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i));
  const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7));
  const order = Array.from({ length: 7 }, (_, i) => (i + weekStartsOn) % 7);
  const prevMonth = addMonths(shown, -1);
  const nextMonth = addMonths(shown, 1);
  const prevDisabled = !!min && new Date(shown.getFullYear(), shown.getMonth(), 0) < dayStart(min);
  const nextDisabled = !!max && addMonths(shown, 1) > dayStart(max);

  return (
    <div className={cx("ki-calendar", className)}>
      <div className="ki-calendar__head">
        <IconButton variant="quiet" label="前の月" icon={<Icon name="chevron-left" />} disabled={prevDisabled} onClick={() => { setMonth(prevMonth); setFocusDay(nearest(prevMonth)); }} />
        <div id={titleId} className="ki-calendar__title" aria-live="polite">{fmtMonth.format(shown)}</div>
        <IconButton variant="quiet" label="次の月" icon={<Icon name="chevron-right" />} disabled={nextDisabled} onClick={() => { setMonth(nextMonth); setFocusDay(nearest(nextMonth)); }} />
      </div>
      <div
        ref={grid}
        role="grid"
        aria-labelledby={label ? undefined : titleId}
        aria-label={label}
        className="ki-calendar__grid"
        key={key(shown)}
        data-dir={dir ?? undefined}
      >
        <div role="row" className="ki-calendar__row">
          {order.map((w) => (
            <span key={w} role="columnheader" className="ki-calendar__weekday" data-weekday={w} aria-label={WEEKDAYS_LONG[w]}>{WEEKDAYS[w]}</span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div role="row" key={wi} className="ki-calendar__row">
            {week.map((d) => {
              const outside = d.getMonth() !== shown.getMonth();
              const isSel = sameDay(d, selected);
              const isToday = sameDay(d, today);
              const off = disabled(d);
              const marked = isDateMarked?.(d);
              return (
                <span role="gridcell" key={key(d)} aria-selected={isSel}>
                  <button
                    type="button"
                    className="ki-calendar__day"
                    data-day={key(d)}
                    data-weekday={d.getDay()}
                    data-outside={outside ? "" : undefined}
                    data-selected={isSel ? "" : undefined}
                    data-marked={marked ? "" : undefined}
                    aria-current={isToday ? "date" : undefined}
                    aria-disabled={off || undefined}
                    aria-label={`${fmtDay.format(d)}${isToday ? "、今日" : ""}${marked ? "、予定あり" : ""}`}
                    tabIndex={sameDay(d, tabDay) ? 0 : -1}
                    onClick={() => pick(d)}
                    onKeyDown={(e) => onKeyDown(e, d)}
                  >
                    {d.getDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
