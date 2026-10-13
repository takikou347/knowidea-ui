import type { ReactNode } from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Icon } from "./Icon.js";
import { cx } from "./utils.js";

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 最初に開く項目の value */
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  /** true で複数を同時に開ける。既定は 1 つだけ */
  multiple?: boolean;
  /** 見出しの h の段(2〜6)。既定 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

/** 見出しの行を押して、中身を開閉する。矢印キーで見出しの間を移る。 */
export function Accordion({ items, defaultValue, value, onValueChange, multiple = false, headingLevel = 3, className }: AccordionProps) {
  return (
    <BaseAccordion.Root
      className={cx("ki-accordion", className)}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange ? (v) => onValueChange(v as string[]) : undefined}
      multiple={multiple}
    >
      {items.map((it) => (
        <BaseAccordion.Item key={it.value} value={it.value} disabled={it.disabled} className="ki-accordion__item">
          <BaseAccordion.Header className="ki-accordion__header" render={<div role="heading" aria-level={headingLevel} />}>
            <BaseAccordion.Trigger className="ki-accordion__trigger">
              <span>{it.title}</span>
              <Icon name="chevron-down" />
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className="ki-accordion__panel">{it.content}</BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}
