import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon.js";
import { cx } from "./utils.js";

export interface CodeBlockProps {
  code: string;
  /** 右上に出す言語名 */
  language?: string;
  lineNumbers?: boolean;
  /** 写すボタン。既定 true */
  copy?: boolean;
  /** pre の名前。横に動くので読み上げに要る */
  label?: string;
  className?: string;
}

export function CodeBlock({ code, language, lineNumbers, copy = true, label = "コード", className }: CodeBlockProps) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const doCopy = async () => {
    let msg = "コピーした";
    try { await navigator.clipboard.writeText(code); } catch { msg = "写せない"; }
    setStatus(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 1600);
  };

  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <figure className={cx("ki-code", className)} data-lines={lineNumbers ? "" : undefined}>
      {(language || copy) ? (
        <div className="ki-code__head">
          <span className="ki-code__lang">{language ?? ""}</span>
          {copy ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span className="ki-code__status" role="status">{status}</span>
              <button type="button" className="ki-button ki-icon-button" data-variant="quiet" aria-label="コードをコピー" onClick={doCopy}>
                <Icon name="copy" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
      <pre className="ki-code__pre" tabIndex={0} aria-label={label}>
        <code>{lines.map((l, i) => <span key={i} className="ki-code__line">{l === "" ? "​" : l}</span>)}</code>
      </pre>
    </figure>
  );
}
