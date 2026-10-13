import type { ReactNode } from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { Icon, type IconName } from "./Icon.js";

export type ToastTone = "info" | "success" | "warn" | "error";
const toneIcon: Record<ToastTone, IconName> = { info: "info", success: "check-circle", warn: "warning", error: "warning-circle" };

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <>
      {toasts.map((t) => {
        const tone = (t.type as ToastTone | undefined) ?? "info";
        return (
          <BaseToast.Root key={t.id} toast={t} className="ki-toast" data-type={tone}>
            <span className="ki-toast__icon"><Icon name={toneIcon[tone]} /></span>
            <div className="ki-toast__content">
              <BaseToast.Title className="ki-toast__title" />
              <BaseToast.Description className="ki-toast__description" />
            </div>
            <BaseToast.Close className="ki-button ki-icon-button ki-toast__close" data-variant="quiet" aria-label="閉じる">
              <Icon name="x" />
            </BaseToast.Close>
          </BaseToast.Root>
        );
      })}
    </>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** 自動で消えるまでの ms。0 で消えない。既定 5000 */
  timeout?: number;
  /** 同時に出す数 */
  limit?: number;
}

/** アプリの根に 1 つ置く。中から useToast() で出す */
export function ToastProvider({ children, timeout = 5000, limit = 3 }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="ki-toast-viewport">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  timeout?: number;
}

export function useToast() {
  const m = BaseToast.useToastManager();
  return {
    show: (o: ToastOptions) => m.add({ title: o.title, description: o.description, type: o.tone ?? "info", timeout: o.timeout }),
    close: (id?: string) => m.close(id),
  };
}
