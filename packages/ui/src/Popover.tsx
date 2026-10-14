import { useThemeScope } from "./ThemeScope.js";
import type { ReactElement, ReactNode } from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Icon } from "./Icon.js";
import { IconButton } from "./IconButton.js";

export interface PopoverProps {
  /** 開くボタン。1 つの要素 */
  trigger: ReactElement;
  /** 見出し。読み上げの名前になる */
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** 開く向き */
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  /** 見出しが無い時の名前(読み上げ) */
  "aria-label"?: string;
  /** 右上に閉じるボタンを出す */
  closable?: boolean;
  closeLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** ボタンの近くに出る小さな面。外を押すか Esc で閉じ、開いたボタンに focus が戻る。中の操作は Tab で移れる。 */
export function Popover({
  trigger, title, description, children, side = "bottom", align = "start", closable, closeLabel = "閉じる", open, defaultOpen, onOpenChange, ...rest
}: PopoverProps) {
  const scope = useThemeScope();
  return (
    <BasePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange ? (o) => onOpenChange(o) : undefined}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner className="ki-popover__positioner" side={side} align={align} sideOffset={4} collisionPadding={16} {...scope}>
          <BasePopover.Popup className="ki-popover" aria-label={title ? undefined : rest["aria-label"]}>
            {title || closable ? (
              <div className="ki-popover__head">
                {title ? <BasePopover.Title className="ki-popover__title">{title}</BasePopover.Title> : <span />}
                {closable ? <BasePopover.Close render={<IconButton variant="quiet" label={closeLabel} icon={<Icon name="close" />} />} /> : null}
              </div>
            ) : null}
            {description ? <BasePopover.Description className="ki-popover__description">{description}</BasePopover.Description> : null}
            {children ? <div className="ki-popover__body">{children}</div> : null}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
