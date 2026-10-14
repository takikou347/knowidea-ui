import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Icon } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import { cx } from "./utils.js";

export interface FileUploadProps {
  /** 置き場の見出し。読み上げの名前にもなる */
  label?: string;
  /** 選べる形式(例: "image/*,.pdf")。input の accept と同じ */
  accept?: string;
  multiple?: boolean;
  /** 1 つのファイルの上限(バイト)。超えた物は加えず、理由を出す */
  maxSize?: number;
  /** 置き場の下の補足(形式や大きさ) */
  hint?: string;
  value?: File[];
  defaultValue?: File[];
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  invalid?: boolean;
  /** フォームで送る名前。選んだファイルが input に入る */
  name?: string;
  className?: string;
}

/** バイトを「1.2 MB」のように */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB"];
  let v = n / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

/** accept("image/*,.pdf" など)に合うか。input の accept と同じ見方 */
function accepts(f: File, accept?: string): boolean {
  if (!accept) return true;
  const name = f.name.toLowerCase();
  const type = f.type.toLowerCase();
  return accept.split(",").map((a) => a.trim().toLowerCase()).filter(Boolean).some((a) =>
    a.startsWith(".") ? name.endsWith(a) : a.endsWith("/*") ? type.startsWith(a.slice(0, -1)) : type === a);
}

const same = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

/** 行の key。File ごとに 1 度だけ番号を振り、前の行を外しても後ろの行が作り直されないようにする */
const keys = new WeakMap<File, number>();
let next = 0;
const keyOf = (f: File) => {
  if (!keys.has(f)) keys.set(f, next++);
  return keys.get(f)!;
};

/** ファイルを選ぶ、または置く。スマホでは押すと選ぶ画面が開く。選んだ物は下に並び、1 つずつ外せる。 */
export function FileUpload({
  label = "ファイルを選ぶ", accept, multiple, maxSize, hint, value, defaultValue = [], onFilesChange, disabled, invalid, name, className,
}: FileUploadProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [inner, setInner] = useState<File[]>(defaultValue);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");
  const files = value !== undefined ? value : inner;
  const set = (next: File[]) => {
    if (value === undefined) setInner(next);
    onFilesChange?.(next);
  };
  // フォームで送れるよう、選んだ物だけを input に入れる(加えなかった物は送らない)
  const sync = (list: File[]) => {
    if (!input.current || typeof DataTransfer === "undefined") return;
    const dt = new DataTransfer();
    list.forEach((f) => dt.items.add(f));
    input.current.files = dt.files;
  };
  useEffect(() => { sync(files); }, [files]);
  // フォームの reset では一覧も空にする
  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    const reset = () => { set([]); setError(""); };
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  });
  const add = (picked: File[]) => {
    if (disabled) return;
    const big: string[] = [];
    const wrong: string[] = [];
    const ok: File[] = [];
    for (const f of picked) {
      if (!accepts(f, accept)) wrong.push(f.name);
      else if (maxSize && f.size > maxSize) big.push(f.name);
      else if (!files.some((g) => same(f, g)) && !ok.some((g) => same(f, g))) ok.push(f);
    }
    const extra = multiple ? [] : ok.splice(1).map((f) => f.name);
    const why = [
      wrong.length ? `形式が合わない: ${wrong.join("、")}` : "",
      big.length ? `大きすぎる: ${big.join("、")}${maxSize ? `(上限 ${formatBytes(maxSize)})` : ""}` : "",
      extra.length ? `1 つだけ選べる: ${extra.join("、")}` : "",
    ].filter(Boolean);
    // 同じ理由が続いても読み上げるよう、いったん空にしてから入れる
    setError("");
    if (why.length) requestAnimationFrame(() => setError(`加えなかった物があります。${why.join("。")}`));
    const nextFiles = ok.length ? (multiple ? [...files, ...ok] : ok) : files;
    if (ok.length) set(nextFiles);
    sync(nextFiles);
  };
  const drag = (e: DragEvent, on: boolean) => {
    e.preventDefault();
    if (disabled) return;
    // 置き場の中の別の要素へ移っただけの時は、外れたことにしない
    if (!on && e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setOver(on);
  };
  const remove = (i: number) => {
    set(files.filter((_, j) => j !== i));
    setError("");
    // 次の行の「外す」へ。無ければ前の行、それも無ければ置き場へ
    const buttons = list.current ? Array.from(list.current.querySelectorAll<HTMLButtonElement>("button")) : [];
    const target = buttons[i + 1] ?? buttons[i - 1];
    requestAnimationFrame(() => (target && target.isConnected ? target : input.current)?.focus());
  };
  const describedBy = [hint ? `${id}-h` : "", error ? `${id}-e` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cx("ki-file-upload", className)} data-disabled={disabled ? "" : undefined} data-invalid={invalid || error ? "" : undefined}>
      <label
        className="ki-file-upload__zone"
        htmlFor={id}
        data-dragging={over ? "" : undefined}
        onDragEnter={(e) => drag(e, true)}
        onDragOver={(e) => drag(e, true)}
        onDragLeave={(e) => drag(e, false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(Array.from(e.dataTransfer.files)); }}
      >
        <Icon name="upload" />
        <span className="ki-file-upload__label">{label}</span>
        <span className="ki-file-upload__sub" aria-hidden="true">押して選ぶか、ここへ置く</span>
        {hint ? <span className="ki-file-upload__hint" id={`${id}-h`} aria-hidden="true">{hint}</span> : null}
        {/* input は置き場いっぱいに広げて見えなくする。押す所も、置く所も置き場全体になる */}
        <input
          ref={input}
          id={id}
          className="ki-file-upload__input"
          type="file"
          title=""
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          name={name}
          aria-describedby={describedBy}
          aria-invalid={invalid || !!error || undefined}
          onChange={(e) => add(Array.from(e.currentTarget.files ?? []))}
        />
      </label>
      <p className="ki-file-upload__error" id={`${id}-e`} role="alert">{error}</p>
      {files.length ? (
        <ul className="ki-file-upload__list" aria-label="選んだファイル" ref={list}>
          {files.map((f, i) => (
            <li className="ki-file-upload__item" key={keyOf(f)}>
              <Icon name="file" />
              <span className="ki-file-upload__name">{f.name}</span>
              <span className="ki-file-upload__size">{formatBytes(f.size)}</span>
              <IconButton variant="quiet" label={`${f.name} を外す`} icon={<Icon name="close" />} disabled={disabled} onClick={() => remove(i)} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
