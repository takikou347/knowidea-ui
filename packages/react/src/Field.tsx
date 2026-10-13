import type { ReactNode } from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { Icon } from "./Icon.js";
import { cx } from "./utils.js";

export interface FieldProps {
  label: ReactNode;
  /** 補足。入力の前に知っておくこと */
  hint?: ReactNode;
  /** 誤り。あると欄全体が失敗になる */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** Input、Textarea、Select など */
  children: ReactNode;
}

export function Field({ label, hint, error, required, disabled, className, children }: FieldProps) {
  return (
    <BaseField.Root className={cx("ki-field", className)} invalid={error ? true : undefined} disabled={disabled}>
      <BaseField.Label className="ki-field__label">
        {label}
        {required ? <span className="ki-field__required">必須</span> : null}
      </BaseField.Label>
      {children}
      {hint ? <BaseField.Description className="ki-field__hint">{hint}</BaseField.Description> : null}
      {error ? (
        <BaseField.Error match className="ki-field__error">
          <Icon name="warning-circle" />
          <span>{error}</span>
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
}
