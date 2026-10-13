import type { ReactNode } from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { useId } from "react";
import { Spinner } from "./Spinner.js";
import { cx } from "./utils.js";

interface ChoiceCommon {
  label?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  /** 読み込み中。操作できず、回転を出す */
  loading?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

export interface CheckboxProps extends ChoiceCommon {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  value?: string;
  required?: boolean;
}

export function Checkbox({ label, invalid, loading, disabled, className, indeterminate, ...rest }: CheckboxProps) {
  const root = (
    <BaseCheckbox.Root
      className={cx("ki-check", className)}
      disabled={disabled || loading}
      indeterminate={indeterminate}
      data-invalid={invalid ? "" : undefined}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
  return (
    <label className="ki-choice" data-loading={loading ? "" : undefined} data-bare={label == null ? "" : undefined}>
      {root}
      {label != null ? <span>{label}</span> : null}
      {loading ? <Spinner /> : null}
    </label>
  );
}

export interface SwitchProps extends ChoiceCommon {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** ラベルの下に置く補足。名前には入れず、aria-describedby で説明として結び付く */
  description?: ReactNode;
  /** end は、ラベルを左、Switch を右端に置き、行の幅いっぱいに広げる(設定の一覧) */
  placement?: "start" | "end";
}

export function Switch({ label, description, placement = "start", invalid: _invalid, loading, disabled, className, ...rest }: SwitchProps) {
  const id = useId();
  return (
    <label className="ki-choice" data-loading={loading ? "" : undefined} data-placement={placement === "end" ? "end" : undefined}>
      <BaseSwitch.Root className={cx("ki-switch", className)} disabled={disabled || loading} aria-labelledby={description != null && label != null ? `${id}-l` : undefined} aria-describedby={description != null ? `${id}-d` : undefined} {...rest} />
      {description != null ? (
        <span className="ki-choice__text">
          {label != null ? <span id={`${id}-l`}>{label}</span> : null}
          <span id={`${id}-d`} className="ki-choice__description">{description}</span>
        </span>
      ) : label != null ? <span>{label}</span> : null}
      {loading ? <Spinner /> : null}
    </label>
  );
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** 見出し。必須 */
  legend: ReactNode;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

export function RadioGroup({ legend, options, value, defaultValue, onValueChange, name, disabled, invalid, className }: RadioGroupProps) {
  const id = useId();
  return (
    <div className={cx("ki-fieldset", className)} role="presentation">
      <div id={id} className="ki-field__label">{legend}</div>
      <BaseRadioGroup
        aria-labelledby={id}
        className="ki-choice-group"
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange ? (v) => onValueChange(v as string) : undefined}
        name={name}
        disabled={disabled}
      >
        {options.map((o) => (
          <label key={o.value} className="ki-choice">
            <BaseRadio.Root value={o.value} disabled={o.disabled} className="ki-radio" data-invalid={invalid ? "" : undefined} />
            <span>{o.label}</span>
          </label>
        ))}
      </BaseRadioGroup>
    </div>
  );
}
