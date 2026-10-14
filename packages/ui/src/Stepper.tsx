import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Icon } from "./Icon.js";
import { cx } from "./utils.js";

export interface StepperProps {
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** PageUp と PageDown、Shift と矢印で動く幅 */
  largeStep?: number;
  /** 数の見せ方(例: { style: "unit", unit: "minute" } で「5 分」) */
  format?: Intl.NumberFormatOptions;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  /** 欄の名前(読み上げ)。Field の中では要らない */
  "aria-label"?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  className?: string;
}

/** 段のある数を、− と + で 1 つずつ変える。欄に打っても入れられる。上下の矢印キーでも変わる。 */
export function Stepper({
  value, defaultValue, onValueChange, min, max, step = 1, largeStep, format, disabled, invalid, name, id, className,
  decrementLabel = "減らす", incrementLabel = "増やす", ...rest
}: StepperProps) {
  return (
    <BaseNumberField.Root
      className={cx("ki-stepper", className)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (v) => onValueChange(v) : undefined}
      min={min} max={max} step={step} largeStep={largeStep ?? step * 10}
      format={format}
      disabled={disabled}
      name={name}
      id={id}
      locale="ja-JP"
    >
      {/* invalid の時だけ渡す。undefined を渡すと、Field の error から来る状態を消してしまう */}
      <BaseNumberField.Group className="ki-stepper__group" {...(invalid ? { "data-invalid": "" } : null)}>
        <BaseNumberField.Decrement className="ki-stepper__button" aria-label={decrementLabel}><Icon name="remove" /></BaseNumberField.Decrement>
        <BaseNumberField.Input className="ki-stepper__input" aria-label={rest["aria-label"]} aria-roledescription="数の入力" {...(invalid ? { "aria-invalid": true } : null)} />
        <BaseNumberField.Increment className="ki-stepper__button" aria-label={incrementLabel}><Icon name="add" /></BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
