import { useThemeScope } from "./ThemeScope.js";
import type { ReactElement, ReactNode } from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { Button, type ButtonProps } from "./Button.js";
import { Spinner } from "./Spinner.js";

export interface DialogProps {
  /** 開くボタン。1 つの要素 */
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** 下の操作。DialogClose を使うと閉じる */
  actions?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 中身を読み込み中 */
  loading?: boolean;
}

/** 閉じるボタン。Dialog の actions の中で使う */
export function DialogClose(props: ButtonProps) {
  return <BaseDialog.Close render={<Button variant="secondary" {...props} />} />;
}

export function Dialog({ trigger, title, description, children, actions, open, defaultOpen, onOpenChange, loading }: DialogProps) {
  const scope = useThemeScope();
  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange ? (o) => onOpenChange(o) : undefined}>
      {trigger ? <BaseDialog.Trigger render={trigger} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="ki-dialog__backdrop" {...scope} />
        <BaseDialog.Popup className="ki-dialog ki-dialog__popup" {...scope}>
          <BaseDialog.Title className="ki-dialog__title">{title}</BaseDialog.Title>
          {description ? <BaseDialog.Description className="ki-dialog__description">{description}</BaseDialog.Description> : null}
          {loading ? (
            <div className="ki-dialog__loading" role="status"><Spinner />読み込み中</div>
          ) : children ? <div className="ki-dialog__body">{children}</div> : null}
          {actions ? <div className="ki-dialog__actions">{actions}</div> : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export interface ConfirmDialogProps {
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  /** 実行するボタンの文。「削除する」のように、何をするかを書く */
  confirmLabel: string;
  cancelLabel?: string;
  /** 取り返しがつかない操作は danger */
  tone?: "primary" | "danger";
  onConfirm?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** 確かめるダイアログ。外を押しても閉じない。初めの focus は取り消し側 */
export function ConfirmDialog({
  trigger, title, description, confirmLabel, cancelLabel = "やめる", tone = "danger", onConfirm, open, defaultOpen, onOpenChange,
}: ConfirmDialogProps) {
  const scope = useThemeScope();
  return (
    <BaseAlertDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange ? (o) => onOpenChange(o) : undefined}>
      {trigger ? <BaseAlertDialog.Trigger render={trigger} /> : null}
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="ki-dialog__backdrop" {...scope} />
        <BaseAlertDialog.Popup className="ki-dialog ki-dialog__popup" {...scope}>
          <BaseAlertDialog.Title className="ki-dialog__title">{title}</BaseAlertDialog.Title>
          {description ? <BaseAlertDialog.Description className="ki-dialog__description">{description}</BaseAlertDialog.Description> : null}
          <div className="ki-dialog__actions">
            <BaseAlertDialog.Close render={<Button variant="secondary">{cancelLabel}</Button>} />
            <BaseAlertDialog.Close render={<Button variant={tone} onClick={onConfirm}>{confirmLabel}</Button>} />
          </div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
