import { useThemeScope } from "./ThemeScope.js";
import type { ReactElement, ReactNode } from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { Button, type ButtonProps } from "./Button.js";
import { Icon } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import { SkeletonText } from "./Skeleton.js";

export interface SheetProps {
  /** 開くボタン。1 つの要素 */
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** 下の操作。SheetClose を使うと閉じる */
  actions?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 中身を読み込み中。本文の形をまねた Skeleton を出す */
  loading?: boolean;
  /** 右上の閉じるボタンの名前 */
  closeLabel?: string;
}

/** 閉じるボタン。Sheet の actions の中で使う */
export function SheetClose(props: ButtonProps) {
  return <BaseDrawer.Close render={<Button variant="secondary" {...props} />} />;
}

/** 下から出る面。指で下へ引くか、Esc か、外を押すと閉じる。 */
export function Sheet({ trigger, title, description, children, actions, open, defaultOpen, onOpenChange, loading, closeLabel = "閉じる" }: SheetProps) {
  const scope = useThemeScope();
  return (
    <BaseDrawer.Root swipeDirection="down" open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange ? (o) => onOpenChange(o) : undefined}>
      {trigger ? <BaseDrawer.Trigger render={trigger} /> : null}
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="ki-sheet__backdrop" {...scope} />
        <BaseDrawer.Viewport className="ki-sheet__viewport" {...scope}>
          <BaseDrawer.Popup className="ki-sheet">
            <span className="ki-sheet__handle" aria-hidden="true" />
            <div className="ki-sheet__head">
              <BaseDrawer.Title className="ki-sheet__title">{title}</BaseDrawer.Title>
              <BaseDrawer.Close render={<IconButton variant="quiet" label={closeLabel} icon={<Icon name="close" />} />} />
            </div>
            {description ? <BaseDrawer.Description className="ki-sheet__description">{description}</BaseDrawer.Description> : null}
            {loading ? (
              <div className="ki-sheet__loading"><SkeletonText /></div>
            ) : children ? <BaseDrawer.Content className="ki-sheet__body">{children}</BaseDrawer.Content> : null}
            {actions ? <div className="ki-sheet__actions">{actions}</div> : null}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
