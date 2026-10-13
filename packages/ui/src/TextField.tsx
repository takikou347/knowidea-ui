import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Field } from "./Field.js";
import { Input, Textarea } from "./Input.js";

type InputAttrs = Omit<ComponentPropsWithoutRef<"input">, "children" | "size">;

export interface TextFieldProps extends InputAttrs {
  /** ラベル。必須 */
  label: ReactNode;
  /** 補足。入力の前に知っておくこと */
  hint?: ReactNode;
  /** 誤り。あると失敗になり、理由が欄の下に出る */
  error?: ReactNode;
  /** 複数行にする */
  multiline?: boolean;
  rows?: number;
  /** 読み込み中。右端に回転を出す(1 行のみ) */
  loading?: boolean;
  /** 等幅の数字 */
  numeric?: boolean;
}

/** ラベル、入力、補足、誤りを 1 つにした欄。 */
export function TextField({ label, hint, error, required, disabled, multiline, rows, loading, numeric, className, ...rest }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required} disabled={disabled} className={className}>
      {multiline ? (
        <Textarea invalid={!!error} rows={rows} disabled={disabled} required={required} {...(rest as object)} />
      ) : (
        <Input invalid={!!error} loading={loading} numeric={numeric} disabled={disabled} required={required} {...rest} />
      )}
    </Field>
  );
}
