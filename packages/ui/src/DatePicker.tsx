import { useState } from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Button } from "./Button.js";
import { Calendar, type CalendarProps } from "./Calendar.js";
import { Icon } from "./Icon.js";
import { useThemeScope } from "./ThemeScope.js";
import { cx } from "./utils.js";

const fmt = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export interface DatePickerProps extends Pick<CalendarProps, "min" | "max" | "isDateDisabled" | "isDateMarked" | "weekStartsOn"> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  /** 未選択の時の文 */
  placeholder?: string;
  /** 「消す」を出し、未選択に戻せるようにする */
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** フォームで送る名前。値は YYYY-MM-DD */
  name?: string;
  /** 欄の名前(読み上げ)。Field の中では label と同じ文を渡す */
  "aria-label"?: string;
  className?: string;
}

/** 日付を選ぶ欄。押すとカレンダーが開き、日を選ぶと閉じる。 */
export function DatePicker({
  value, defaultValue = null, onValueChange, placeholder = "日付を選ぶ", clearable, disabled, invalid, name, className,
  min, max, isDateDisabled, isDateMarked, weekStartsOn, ...rest
}: DatePickerProps) {
  const scope = useThemeScope();
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const selected = value !== undefined ? value : inner;
  const set = (d: Date | null) => {
    if (value === undefined) setInner(d);
    onValueChange?.(d);
  };
  const now = new Date();
  // Calendar と同じく、0 時の Date で比べて渡す
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayOff = (min && today < new Date(min.getFullYear(), min.getMonth(), min.getDate()))
    || (max && today > new Date(max.getFullYear(), max.getMonth(), max.getDate())) || !!isDateDisabled?.(today);
  const label = rest["aria-label"];
  return (
    <div className={cx("ki-datepicker", className)}>
      <BasePopover.Root open={open} onOpenChange={(o) => setOpen(o)}>
        <BasePopover.Trigger
          className="ki-select"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-label={label ? `${label}、${selected ? fmt.format(selected) : "未選択"}` : undefined}
          data-placeholder={selected ? undefined : ""}
        >
          <span className="ki-datepicker__value">{selected ? fmt.format(selected) : placeholder}</span>
          <span className="ki-select__icon"><Icon name="calendar" /></span>
        </BasePopover.Trigger>
        <BasePopover.Portal>
          <BasePopover.Positioner className="ki-datepicker__positioner" sideOffset={4} align="start" collisionPadding={16} {...scope}>
            <BasePopover.Popup className="ki-datepicker__popup" aria-label={label ?? "日付を選ぶ"}>
              <Calendar
                value={selected}
                onValueChange={(d) => { set(d); setOpen(false); }}
                min={min} max={max} isDateDisabled={isDateDisabled} isDateMarked={isDateMarked} weekStartsOn={weekStartsOn}
                autoFocus
              />
              <div className="ki-datepicker__foot">
                <Button variant="quiet" disabled={todayOff} onClick={() => { set(today); setOpen(false); }}>今日</Button>
                {clearable ? <Button variant="quiet" disabled={!selected} onClick={() => { set(null); setOpen(false); }}>消す</Button> : null}
              </div>
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
      {name ? <input type="hidden" name={name} value={selected ? iso(selected) : ""} disabled={disabled} /> : null}
    </div>
  );
}
