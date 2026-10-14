import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cx } from "./utils.js";

export interface SliderProps {
  /** 何の量か。上に出し、読み上げの名前にもなる */
  label: string;
  /** 1 つの値。範囲を選ぶ時は [下限, 上限] */
  value?: number | number[];
  defaultValue?: number | number[];
  /** 動かしている間ずっと呼ぶ */
  onValueChange?: (value: number | number[]) => void;
  /** 指を離した時、キーで変えた時に 1 度呼ぶ。保存はこちらで */
  onValueCommitted?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** PageUp と PageDown、Shift と矢印で動く幅。既定は 10 */
  largeStep?: number;
  /** 値の見せ方。読み上げにも使う(例: (v) => `${v}%`) */
  formatValue?: (value: number) => string;
  /** 範囲の時の、つまみの名前。全体の名前は label が持つので、ここには付けない */
  thumbLabels?: [string, string];
  /** 上の値を出さない(すぐ近くに値を出している時) */
  hideValue?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/** 量を指で選ぶ。つまみは 44px 四方で押せる。矢印キーで step、PageUp と PageDown で largeStep ずつ動く。 */
export function Slider({
  label, value, defaultValue, onValueChange, onValueCommitted, min = 0, max = 100, step = 1, largeStep, formatValue,
  thumbLabels = ["下限", "上限"], hideValue, disabled, name, className,
}: SliderProps) {
  const current = value ?? defaultValue ?? min;
  const count = Array.isArray(current) ? current.length : 1;
  const show = (v: number) => (formatValue ? formatValue(v) : String(v));
  return (
    <BaseSlider.Root
      className={cx("ki-slider", className)}
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? min) : undefined}
      onValueChange={onValueChange ? (v) => onValueChange(v as number | number[]) : undefined}
      onValueCommitted={onValueCommitted ? (v) => onValueCommitted(v as number | number[]) : undefined}
      min={min} max={max} step={step} largeStep={largeStep}
      disabled={disabled}
      name={name}
      thumbAlignment="edge"
    >
      <div className="ki-slider__head">
        <BaseSlider.Label className="ki-slider__label">{label}</BaseSlider.Label>
        {hideValue ? null : (
          <BaseSlider.Value className="ki-slider__value">{(_, values) => values.map(show).join(" 〜 ")}</BaseSlider.Value>
        )}
      </div>
      <BaseSlider.Control className="ki-slider__control">
        <BaseSlider.Track className="ki-slider__track">
          <BaseSlider.Indicator className="ki-slider__indicator" />
          {Array.from({ length: count }, (_, i) => (
            <BaseSlider.Thumb
              key={i}
              index={i}
              className="ki-slider__thumb"
              getAriaLabel={count > 1 ? (n) => thumbLabels[n] ?? String(n + 1) : undefined}
              getAriaValueText={(_, v) => show(v)}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
