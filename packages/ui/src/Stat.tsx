import { Icon, type IconName } from "./Icon.js";
import { Skeleton } from "./Skeleton.js";
import { cx, formatNumber } from "./utils.js";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  /** 読み上げる文(例: 直近 7 日の推移) */
  label: string;
  className?: string;
}

/** 小さな推移の線。線と最後の点だけ。値は Stat の数が伝える。 */
export function Sparkline({ data, width = 96, height = 28, label, className }: SparklineProps) {
  if (data.length < 2) return null;
  const pad = 3;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [pad + (i * (width - pad * 2)) / (data.length - 1), height - pad - ((v - min) / span) * (height - pad * 2)] as const);
  const last = pts[pts.length - 1]!;
  return (
    <svg className={cx("ki-spark", className)} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <polyline className="ki-spark__line" points={pts.map((p) => p.join(",")).join(" ")} />
      <circle className="ki-spark__dot" cx={last[0]} cy={last[1]} r={2.5} />
    </svg>
  );
}

export interface StatDelta {
  /** up、down は矢印と符号。flat は同じ。none は前の数が無い */
  dir: "up" | "down" | "flat" | "none";
  /** 差の文(例: +12%、-3 件) */
  text?: string;
}

export interface StatProps {
  label: string;
  icon?: IconName;
  value: number | string | null;
  unit?: string;
  delta?: StatDelta;
  /** 差の前に付ける語。既定は「前回比」 */
  deltaLabel?: string;
  /** 数の下の補足(例: 全体 12) */
  sub?: string;
  spark?: number[];
  sparkLabel?: string;
  /** いつの数か(例: 10/13 09:28)。時刻は等幅で出る */
  asOf?: string;
  /** asOf の前後の文。{time} が asOf に変わる。既定は「{time} の数」 */
  asOfFormat?: string;
  /** 数が取れなかった・無いときに出す語 */
  fallback?: string;
  /** 数が古い。印を付ける */
  stale?: boolean;
  staleLabel?: string;
  state?: "ready" | "loading" | "error";
  /** state が error のときの理由 */
  error?: string;
  className?: string;
}

export function Stat({
  label, icon, value, unit, delta, deltaLabel = "前回比", sub, spark, sparkLabel, asOf, asOfFormat = "{time} の数", fallback = "不明", stale, staleLabel = "古い数", state = "ready", error, className,
}: StatProps) {
  const loading = state === "loading";
  const failed = state === "error";
  const shown = failed || value == null ? fallback : typeof value === "number" ? formatNumber(value) : value;
  return (
    <div className={cx("ki-stat", className)} role="group" aria-label={label} data-state={state === "ready" ? undefined : state} aria-busy={loading || undefined}>
      <p className="ki-stat__head">{icon ? <Icon name={icon} /> : null}{label}</p>
      {loading ? (
        <div style={{ display: "grid", gap: "var(--space-2)" }}><Skeleton size="medium" /><Skeleton size="short" /></div>
      ) : (
        <>
          <p className="ki-stat__value">
            <span className="ki-stat__num">{shown}</span>
            {!failed && value != null && unit ? <span className="ki-stat__unit">{unit}</span> : null}
          </p>
          {failed ? <p className="ki-stat__error"><Icon name="warning" />{error ?? "取れなかった"}</p> : null}
          {!failed && sub ? <p className="ki-stat__sub">{sub}</p> : null}
          {!failed ? (
            <div className="ki-stat__foot">
              {delta ? (
                <p className="ki-stat__delta" data-dir={delta.dir}>
                  {delta.dir === "up" ? <Icon name="arrow-up" /> : delta.dir === "down" ? <Icon name="arrow-down" /> : null}
                  <span>{deltaLabel} {delta.dir === "none" ? "無し" : delta.dir === "flat" ? "変わらず" : delta.text}</span>
                </p>
              ) : <span />}
              {spark ? <span className="ki-stat__spark"><Sparkline data={spark} label={sparkLabel ?? `${label}の推移`} /></span> : null}
            </div>
          ) : null}
        </>
      )}
      {asOf || stale ? (
        <p className="ki-stat__asof">
          {asOf ? <span>{asOfFormat.split("{time}").map((part, i, a) => <span key={i}>{part}{i < a.length - 1 ? <time>{asOf}</time> : null}</span>)}</span> : null}
          {stale ? <span className="ki-status" data-tone="warn"><Icon name="stale" />{staleLabel}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
