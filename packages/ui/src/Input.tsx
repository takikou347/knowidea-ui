import type { ComponentPropsWithoutRef, TextareaHTMLAttributes } from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { Field as BaseField } from "@base-ui/react/field";
import { Spinner } from "./Spinner.js";
import { cx } from "./utils.js";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  /** 失敗。aria-invalid になり、枠が失敗の色になる */
  invalid?: boolean;
  /** 読み込み中。右端に回転を出す */
  loading?: boolean;
  /** 等幅で出す(数字) */
  numeric?: boolean;
}

export function Input({ invalid, loading, numeric, className, ...rest }: InputProps) {
  const input = (
    <BaseInput
      className={cx("ki-input", className)}
      aria-invalid={invalid || undefined}
      data-numeric={numeric ? "" : undefined}
      {...rest}
    />
  );
  if (!loading) return input;
  return (
    <span className="ki-input-group" data-loading="">
      {input}
      <span className="ki-input__adornment"><Spinner /></span>
    </span>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid, className, rows = 3, ...rest }: TextareaProps) {
  return (
    <BaseField.Control
      render={<textarea rows={rows} />}
      className={cx("ki-textarea", className)}
      aria-invalid={invalid || undefined}
      {...(rest as object)}
    />
  );
}
