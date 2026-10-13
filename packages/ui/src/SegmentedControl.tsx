import type { CSSProperties, ReactNode } from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cx } from "./utils.js";

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  /** 字の前に置くアイコン */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** 何を切り替えるか。必須(スクリーンリーダー向けの名前) */
  label: string;
  /** 2 から 5 個 */
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  /** 親の幅いっぱいに広げる */
  fullWidth?: boolean;
  className?: string;
}

/** 表示の切り替え。選んだ印は、選んだ所へ滑る。矢印キーで移る(ラジオのグループ)。 */
export function SegmentedControl({ label, options, value, defaultValue, onValueChange, name, disabled, fullWidth, className }: SegmentedControlProps) {
  return (
    <BaseRadioGroup
      aria-label={label}
      className={cx("ki-segmented", className)}
      style={{ "--ki-seg-count": options.length } as CSSProperties}
      data-full-width={fullWidth ? "" : undefined}
      value={value}
      defaultValue={defaultValue ?? (value === undefined ? options[0]?.value : undefined)}
      onValueChange={onValueChange ? (v) => onValueChange(v as string) : undefined}
      name={name}
      disabled={disabled}
    >
      <span className="ki-segmented__thumb" aria-hidden="true" />
      {options.map((o) => (
        <BaseRadio.Root key={o.value} value={o.value} disabled={o.disabled} className="ki-segmented__item">
          {o.icon}{o.label}
        </BaseRadio.Root>
      ))}
    </BaseRadioGroup>
  );
}
