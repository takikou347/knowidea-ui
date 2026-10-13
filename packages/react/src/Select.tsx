import { Select as BaseSelect } from "@base-ui/react/select";
import { Icon } from "./Icon.js";
import { Spinner } from "./Spinner.js";
import { cx } from "./utils.js";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  /** 読み込み中。開けなくなり、回転と文を出す */
  loading?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

export function Select({
  options, value, defaultValue, onValueChange, placeholder = "選ぶ", disabled, invalid, loading, name, className, ...rest
}: SelectProps) {
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(v as string | null)}
      disabled={disabled || loading}
      name={name}
    >
      <BaseSelect.Trigger
        className={cx("ki-select", className)}
        aria-invalid={invalid || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}><Spinner />読み込み中</span>
        ) : (
          <BaseSelect.Value placeholder={placeholder} />
        )}
        <BaseSelect.Icon className="ki-select__icon"><Icon name="caret-down" /></BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="ki-select__positioner" sideOffset={4} alignItemWithTrigger={false}>
          <BaseSelect.Popup className="ki-select__popup">
            <BaseSelect.List>
              {options.map((o) => (
                <BaseSelect.Item key={o.value} value={o.value} disabled={o.disabled} className="ki-select__item">
                  <span className="ki-select__item-mark"><Icon name="check" /></span>
                  <BaseSelect.ItemText>{o.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
