import { useMemo } from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Icon } from "./Icon.js";
import { Spinner } from "./Spinner.js";
import { useThemeScope } from "./ThemeScope.js";
import { cx } from "./utils.js";

export interface ComboboxOption {
  value: string;
  label: string;
  /** 名前の下に置く補足。絞り込みにも使う */
  description?: string;
  /** 画面に出さず、絞り込みにだけ使う言葉(読み仮名など) */
  keywords?: string[];
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /** 合う物が無い時の文 */
  emptyText?: string;
  /** 候補を読み込み中 */
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

/** ひらがなとカタカナ、全角と半角、大文字と小文字を同じに見る */
export function normalizeForSearch(s: string): string {
  return s.normalize("NFKC").toLowerCase().replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** 打って絞り込み、1 つを選ぶ欄。候補が多く、Select では探しにくい時に使う。 */
export function Combobox({
  options, value, defaultValue, onValueChange, placeholder = "入力して探す", emptyText = "合う物が無い", loading, disabled, invalid, name, id, className, ...rest
}: ComboboxProps) {
  const scope = useThemeScope();
  const items = useMemo(() => BaseCombobox.createItems(options, { getValue: (o) => o.value, getLabel: (o) => o.label }), [options]);
  const filter = (o: ComboboxOption, q: string) => {
    const n = normalizeForSearch(q.trim());
    return !n || normalizeForSearch(o.label).includes(n) || [o.description, ...(o.keywords ?? [])].some((k) => !!k && normalizeForSearch(k).includes(n));
  };
  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (v) => onValueChange((v as string | null) ?? null) : undefined}
      filter={filter}
      disabled={disabled}
      name={name}
    >
      <BaseCombobox.InputGroup className={cx("ki-combobox", className)} {...(invalid ? { "data-invalid": "" } : null)}>
        <span className="ki-combobox__search" aria-hidden="true"><Icon name="search" /></span>
        <BaseCombobox.Input className="ki-combobox__input" placeholder={placeholder} id={id} {...(invalid ? { "aria-invalid": true } : null)} aria-label={rest["aria-label"]} />
        {loading ? <Spinner /> : null}
        <BaseCombobox.Clear className="ki-combobox__button" aria-label="消す"><Icon name="close" /></BaseCombobox.Clear>
        <BaseCombobox.Trigger className="ki-combobox__button" aria-label="候補を開く"><Icon name="chevron-down" /></BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className="ki-combobox__positioner" sideOffset={4} collisionPadding={16} {...scope}>
          <BaseCombobox.Popup className="ki-combobox__popup" aria-busy={loading || undefined}>
            {/* 読み上げの場所は出したままにし、中身だけを替える */}
            <BaseCombobox.Status className="ki-combobox__status">{loading ? <><Spinner />読み込み中</> : null}</BaseCombobox.Status>
            <BaseCombobox.Empty className="ki-combobox__empty">{loading ? null : emptyText}</BaseCombobox.Empty>
            <BaseCombobox.List className="ki-combobox__list">
              {(o: ComboboxOption) => (
                <BaseCombobox.Item key={o.value} value={o.value} disabled={o.disabled} className="ki-combobox__item">
                  <BaseCombobox.ItemIndicator className="ki-combobox__mark" keepMounted><Icon name="check" /></BaseCombobox.ItemIndicator>
                  <span className="ki-combobox__text">
                    <span>{o.label}</span>
                    {o.description ? <span className="ki-combobox__description">{o.description}</span> : null}
                  </span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
