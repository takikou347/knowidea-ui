import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cx } from "./utils.js";

export type JacketFit = "xl" | "l" | "m" | "s";

export interface JacketProps {
  /** 題字。"\n" で行を切れる("夜更けの\n台所ラジオ") */
  title: string;
  /** 題の後ろに添える 1 行(番組名、回の番号など)。題の上には置かない */
  meta?: ReactNode;
  /** 面の色。primary(主の色)、ink(字の色の面)、paper(淡い面) */
  tone?: "primary" | "ink" | "paper";
  /** 番組ごとの面の色。textColor と組で渡し、字との差は 3:1 以上にする(題字は大きな字) */
  color?: string;
  textColor?: string;
  /** 形。square は 1:1、portrait は 4:5、landscape は 16:9 */
  ratio?: "square" | "portrait" | "landscape";
  /** 題を上に置くか(start)、下に寄せるか(end) */
  align?: "start" | "end";
  /** vertical は題を縦書きにする */
  orientation?: "horizontal" | "vertical";
  /** 題字の大きさ。auto は題の長さから選ぶ */
  fit?: "auto" | JacketFit;
  /** 隣に同じ題が文字で出ている時は true。読み上げから外す */
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** 題の長さから字の大きさの段を選ぶ。漢字とかなは 1、英数字と空白は 0.55 と数える(一番長い行で見る) */
export function jacketFit(title: string): JacketFit {
  const width = Math.max(...title.split("\n").map((line) => [...line].reduce((n, ch) => n + (/[\u0000-ɏ]/.test(ch) ? 0.55 : 1), 0)));
  const lines = title.split("\n").length;
  const total = width * lines;
  if (total <= 4) return "xl";
  if (total <= 9) return "l";
  if (total <= 18) return "m";
  return "s";
}

/** 題字のジャケット。番組や作品の顔を、アイコンのタイルでなく題字で出す。角丸は持たない。 */
export function Jacket({
  title, meta, tone = "primary", color, textColor, ratio = "square", align = "start",
  orientation = "horizontal", fit = "auto", decorative = false, className, style,
}: JacketProps) {
  const f = fit === "auto" ? jacketFit(title) : fit;
  const vars = { ...(color ? { "--ki-jacket-bg": color } : {}), ...(textColor ? { "--ki-jacket-fg": textColor } : {}), ...style } as CSSProperties;
  const lines = title.split("\n");
  return (
    <div
      className={cx("ki-jacket", className)}
      data-tone={tone === "primary" ? undefined : tone}
      data-ratio={ratio === "square" ? undefined : ratio}
      data-align={align === "end" ? "end" : undefined}
      data-orientation={orientation === "vertical" ? "vertical" : undefined}
      data-fit={f === "m" ? undefined : f}
      aria-hidden={decorative ? true : undefined}
      style={vars}
    >
      <div className="ki-jacket__face">
        <p className="ki-jacket__title">
          {lines.map((line, i) => <Fragment key={i}>{i > 0 ? <br /> : null}{line}</Fragment>)}
        </p>
        {meta ? <p className="ki-jacket__meta">{meta}</p> : null}
      </div>
    </div>
  );
}
