import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import { cx, formatCompact, formatNumber } from "./utils.js";

export interface TrendBreakdown { label: string; value: number }
export interface TrendPoint {
  key: string;
  /** 軸に出す短い名(例: 10/3) */
  label: string;
  /** 押した時の見出し(例: 10 月 3 日(金))。無ければ label */
  detail?: string;
  /** null は数の無い日。棒を置かず「記録なし」と出す */
  value: number | null;
  /** 部署などの内訳。押した時に直接ラベルで並べる */
  breakdown?: TrendBreakdown[];
}

export interface TrendChartProps {
  data: TrendPoint[];
  type?: "bar" | "line";
  unit?: string;
  /** 軸と棒の高さ(px)。既定 200 */
  height?: number;
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelect?: (key: string) => void;
  /** 基準の線(例: 上限)。直接ラベルを付ける */
  reference?: { value: number; label: string };
  /** グラフの名前(読み上げ) */
  ariaLabel: string;
  state?: "ready" | "loading" | "empty";
  emptyText?: string;
  breakdownTitle?: string;
  className?: string;
}

const M = { left: 44, right: 8, top: 14, bottom: 26 };

function niceMax(max: number): { max: number; step: number } {
  if (max <= 0) return { max: 4, step: 1 };
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = ([1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag);
  return { max: step * Math.ceil(max / step), step };
}

export function TrendChart({
  data, type = "bar", unit, height = 200, selectedKey, defaultSelectedKey, onSelect, reference, ariaLabel,
  state = "ready", emptyText = "記録なし", breakdownTitle = "内訳", className,
}: TrendChartProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const cols = useRef<Array<SVGGElement | null>>([]);
  const [width, setWidth] = useState(560);
  const [inner, setInner] = useState(defaultSelectedKey ?? data[data.length - 1]?.key);
  const key = selectedKey ?? inner;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const read = () => setWidth(Math.max(240, Math.floor(el.clientWidth)));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [state]);

  if (state !== "ready" || data.length === 0) {
    return (
      <div className={cx("ki-chart", className)} data-state={state === "ready" ? "empty" : state} aria-busy={state === "loading" || undefined}>
        <div className="ki-chart__plot" role={state === "loading" ? "status" : undefined}>
          {state === "loading" ? "読み込み中" : emptyText}
        </div>
      </div>
    );
  }

  const n = data.length;
  const idx = Math.max(0, data.findIndex((d) => d.key === key));
  const sel = data[idx]!;
  const values = data.map((d) => d.value).filter((v): v is number => v != null);
  const { max, step } = niceMax(Math.max(0, ...values, reference?.value ?? 0));
  const plotW = width - M.left - M.right;
  const H = height;
  const svgH = H + M.top + M.bottom;
  const band = plotW / n;
  const y = (v: number) => M.top + H - (v / max) * H;
  const cx0 = (i: number) => M.left + band * i + band / 2;
  const ticks: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) ticks.push(v);
  const every = Math.ceil(n / Math.max(2, Math.floor(plotW / 52)));

  const choose = (i: number, focus = false) => {
    const j = Math.min(n - 1, Math.max(0, i));
    const d = data[j]!;
    if (selectedKey === undefined) setInner(d.key);
    onSelect?.(d.key);
    if (focus) cols.current[j]?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next != null) { e.preventDefault(); choose(next, true); }
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); choose(i); }
  };

  // 折れ線は、数の無い日で線を切る
  let path = "";
  if (type === "line") {
    let pen = false;
    data.forEach((d, i) => {
      if (d.value == null) { pen = false; return; }
      path += `${pen ? "L" : "M"}${cx0(i).toFixed(1)} ${y(d.value).toFixed(1)}`;
      pen = true;
    });
  }
  const lastIdx = (() => { for (let i = n - 1; i >= 0; i--) if (data[i]!.value != null) return i; return -1; })();
  const rows = (sel.breakdown ?? []).slice().sort((a, b) => b.value - a.value);
  const rowMax = Math.max(1, ...rows.map((r) => r.value));

  return (
    <div className={cx("ki-chart", className)}>
      <div className="ki-chart__readout">
        <p className="ki-chart__readout-main" aria-live="polite">
          <span className="ki-chart__date">{sel.detail ?? sel.label}</span>
          {sel.value == null ? (
            <span className="ki-chart__value">{emptyText}</span>
          ) : (
            <><span className="ki-chart__value">{formatNumber(sel.value)}</span>{unit ? <span className="ki-chart__unit">{unit}</span> : null}</>
          )}
        </p>
        <span className="ki-chart__nav">
          <IconButton variant="secondary" label="前の日" icon={<Icon name="chevron-left" />} disabled={idx === 0} onClick={() => choose(idx - 1)} />
          <IconButton variant="secondary" label="次の日" icon={<Icon name="chevron-right" />} disabled={idx === n - 1} onClick={() => choose(idx + 1)} />
        </span>
      </div>
      <div className="ki-chart__plot" ref={wrap}>
        <svg className="ki-chart__svg" width={width} height={svgH} viewBox={`0 0 ${width} ${svgH}`}>
          {ticks.map((t) => (
            <g key={t}>
              <line className={t === 0 ? "ki-chart__baseline" : "ki-chart__grid"} x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} />
              <text className="ki-chart__tick" x={M.left - 8} y={y(t)} textAnchor="end" dominantBaseline="central">{formatCompact(t)}</text>
            </g>
          ))}
          {reference ? (
            <g>
              <line className="ki-chart__ref" x1={M.left} x2={width - M.right} y1={y(reference.value)} y2={y(reference.value)} />
              <text className="ki-chart__ref-label" x={M.left + 4} y={y(reference.value) - 5}>{reference.label}</text>
            </g>
          ) : null}
          {type === "line" ? <path className="ki-chart__line" d={path} /> : null}
          <g role="group" aria-label={ariaLabel}>
            {data.map((d, i) => {
              const isSel = i === idx;
              const aria = d.value == null ? `${d.detail ?? d.label} ${emptyText}` : `${d.detail ?? d.label} ${formatNumber(d.value)}${unit ?? ""}`;
              const bw = Math.max(2, Math.min(band * 0.64, 28));
              return (
                <g
                  key={d.key}
                  ref={(el) => { cols.current[i] = el; }}
                  className="ki-chart__col"
                  role="button"
                  tabIndex={isSel ? 0 : -1}
                  aria-pressed={isSel}
                  aria-label={aria}
                  data-selected={isSel ? "" : undefined}
                  onClick={() => choose(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <rect className="ki-chart__hit" x={M.left + band * i} y={M.top} width={band} height={H + M.bottom - 4} />
                  {isSel && type === "line" && d.value != null ? <line className="ki-chart__guide" x1={cx0(i)} x2={cx0(i)} y1={y(d.value)} y2={y(0)} /> : null}
                  {d.value == null ? (
                    <line className="ki-chart__none" x1={cx0(i) - Math.min(4, band / 3)} x2={cx0(i) + Math.min(4, band / 3)} y1={y(0) - 3} y2={y(0) - 3} />
                  ) : type === "bar" ? (
                    <rect className="ki-chart__bar" x={cx0(i) - bw / 2} y={y(d.value)} width={bw} height={Math.max(1, y(0) - y(d.value))} rx={2} />
                  ) : (
                    <circle className="ki-chart__dot" cx={cx0(i)} cy={y(d.value)} r={isSel ? 5 : n > 20 ? 2.5 : 3.5} />
                  )}
                </g>
              );
            })}
          </g>
          {data.map((d, i) => (i % every === 0 ? (
            <text key={d.key} className="ki-chart__tick" x={cx0(i)} y={M.top + H + 18} textAnchor="middle">{d.label}</text>
          ) : null))}
          {type === "line" && lastIdx >= 0 ? (
            <text className="ki-chart__end-label" x={Math.min(cx0(lastIdx), width - M.right)} y={y(data[lastIdx]!.value!) - 10} textAnchor="end">{formatCompact(data[lastIdx]!.value!)}</text>
          ) : null}
        </svg>
      </div>
      {rows.length > 0 ? (
        <div>
          <p className="ki-chart__break-title">{sel.detail ?? sel.label}の{breakdownTitle}</p>
          <ul className="ki-chart__break">
            {rows.map((r) => (
              <li key={r.label}>
                <span>{r.label}</span>
                <span className="ki-chart__break-bar" aria-hidden="true"><span style={{ width: `${(r.value / rowMax) * 100}%` }} /></span>
                <span className="ki-chart__break-num">{formatNumber(r.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
