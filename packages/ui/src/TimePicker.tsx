import { useMemo, useState, type ReactNode } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Field } from "./Field.js";
import { Icon } from "./Icon.js";
import { useThemeScope } from "./ThemeScope.js";
import { listTimes } from "./time.js";
import { cx } from "./utils.js";

export interface TimePickerProps {
  /** ラベル。必須 */
  label: ReactNode;
  /** 補足。入力の前に知っておくこと */
  hint?: ReactNode;
  /** 誤り。あると失敗になり、理由が欄の下に出る */
  error?: ReactNode;
  required?: boolean;
  /** 選んだ時刻 "HH:MM" (24 時間)。制御する時 */
  value?: string | null;
  /** 最初の時刻 "HH:MM"。制御しない時 */
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** 刻み (分)。00:00 から数える。既定 15 */
  step?: number;
  /** 選べる最初の時刻 "HH:MM" */
  min?: string;
  /** 選べる最後の時刻 "HH:MM" */
  max?: string;
  /** 未選択の時の文 */
  placeholder?: string;
  disabled?: boolean;
  /** フォームで送る名前。値は HH:MM */
  name?: string;
  className?: string;
}

/** 時刻を選ぶ欄。押すと step 分ごとの一覧が開き、選ぶと閉じる。見た目は DatePicker と同じ欄。 */
export function TimePicker({
  label, hint, error, required, value, defaultValue = null, onValueChange, step = 15, min, max,
  placeholder = "時刻を選ぶ", disabled, name, className,
}: TimePickerProps) {
  const scope = useThemeScope();
  const [inner, setInner] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : inner;
  const times = useMemo(() => listTimes({ step, min, max, value: selected }), [step, min, max, selected]);
  const items = useMemo(() => times.map((t) => ({ value: t, label: t })), [times]);
  const set = (t: string | null) => {
    if (value === undefined) setInner(t);
    onValueChange?.(t);
  };
  return (
    <Field label={label} hint={hint} error={error} required={required} disabled={disabled} className={cx("ki-timepicker", className)}>
      <BaseSelect.Root
        items={items}
        value={selected && times.includes(selected) ? selected : null}
        onValueChange={(v) => set((v as string | null) ?? null)}
        disabled={disabled}
        required={required}
        name={name}
      >
        <BaseSelect.Trigger
          className="ki-select ki-timepicker__trigger"
          aria-invalid={error ? true : undefined}
        >
          <BaseSelect.Value className="ki-timepicker__value" placeholder={placeholder} />
          <BaseSelect.Icon className="ki-select__icon"><Icon name="clock" /></BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner className="ki-select__positioner" sideOffset={4} alignItemWithTrigger={false} collisionPadding={16} {...scope}>
            <BaseSelect.Popup className="ki-select__popup ki-timepicker__popup">
              <BaseSelect.List>
                {times.map((t) => (
                  <BaseSelect.Item key={t} value={t} className="ki-select__item ki-timepicker__item">
                    <span className="ki-select__item-mark"><Icon name="check" /></span>
                    <BaseSelect.ItemText>{t}</BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </Field>
  );
}
