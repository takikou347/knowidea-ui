import { Fragment } from "react";
import { cx } from "./utils.js";

/** 記号のキーの読み上げ。見た目は記号、読み上げは名前 */
const spoken: Record<string, string> = {
  "⌘": "Command", "⌥": "Option", "⇧": "Shift", "⌃": "Control", "↵": "Enter", "⌫": "Backspace", "⎋": "Esc",
  "↑": "上", "↓": "下", "←": "左", "→": "右",
};

export interface KbdProps {
  /** 1 つのキー("K")か、同時に押すキーの並び(["⌘", "K"]) */
  keys: string | string[];
  className?: string;
}

/** キーボードのキー。ショートカットを文の中や Menu の右に出す。同時に押すキーは + でつなぐ。 */
export function Kbd({ keys, className }: KbdProps) {
  const list = Array.isArray(keys) ? keys : [keys];
  return (
    <kbd className={cx("ki-kbd", className)}>
      {list.map((k, i) => (
        <Fragment key={i}>
          {i > 0 ? <span className="ki-kbd__plus" aria-hidden="true">+</span> : null}
          <kbd className="ki-kbd__key">
            {spoken[k] ? <><span aria-hidden="true">{k}</span><span className="ki-sr-only">{spoken[k]}</span></> : k}
          </kbd>
        </Fragment>
      ))}
    </kbd>
  );
}
