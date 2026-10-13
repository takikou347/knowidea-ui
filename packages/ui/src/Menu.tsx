import type { ReactElement, ReactNode } from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";

export type MenuEntry =
  | { type?: "item"; label: string; icon?: ReactNode; tone?: "danger"; disabled?: boolean; onSelect?: () => void; href?: string }
  | { type: "separator" }
  | { type: "label"; label: string };

export interface MenuProps {
  /** 開くボタン。1 つの要素 */
  trigger: ReactElement;
  items: MenuEntry[];
  align?: "start" | "center" | "end";
}

export function Menu({ trigger, items, align = "start" }: MenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner className="ki-menu__positioner" sideOffset={4} align={align}>
          <BaseMenu.Popup className="ki-menu__popup">
            {items.map((it, i) => {
              if (it.type === "separator") return <BaseMenu.Separator key={i} className="ki-menu__separator" />;
              if (it.type === "label") return <div key={i} className="ki-menu__label" role="presentation">{it.label}</div>;
              if (it.href) {
                return (
                  <BaseMenu.LinkItem key={i} href={it.href} className="ki-menu__item" data-tone={it.tone}>
                    {it.icon}{it.label}
                  </BaseMenu.LinkItem>
                );
              }
              return (
                <BaseMenu.Item key={i} className="ki-menu__item" data-tone={it.tone} disabled={it.disabled} onClick={it.onSelect}>
                  {it.icon}{it.label}
                </BaseMenu.Item>
              );
            })}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
