import type { ReactNode } from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cx } from "./utils.js";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** タブ一覧の名前 */
  label: string;
  className?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, label, className }: TabsProps) {
  return (
    <BaseTabs.Root
      className={cx("ki-tabs", className)}
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange ? (v) => onValueChange(v as string) : undefined}
    >
      <BaseTabs.List className="ki-tabs__list" aria-label={label}>
        {items.map((t) => (
          <BaseTabs.Tab key={t.value} value={t.value} disabled={t.disabled} className="ki-tabs__tab">{t.label}</BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((t) => (
        <BaseTabs.Panel key={t.value} value={t.value} className="ki-tabs__panel">{t.content}</BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
