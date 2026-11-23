// 時刻 ("HH:MM"、24 時間) の読み書きと、選ぶ一覧の作り方。TimePicker が使う

const RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * "HH:MM" を 0 時からの分にする
 *
 * @param value "09:30" のような 2 桁ずつの 24 時間の時刻
 * @returns 0 時からの分。形が合わない時は null
 */
export function parseTime(value: string | null | undefined): number | null {
  const m = value ? RE.exec(value) : null;
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

/**
 * 0 時からの分を "HH:MM" にする
 *
 * @param minutes 0 から 1439
 * @returns "09:30" のような時刻
 */
export function formatTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export interface ListTimesOptions {
  /** 刻み (分)。1 から 720 の整数。既定 15 */
  step?: number;
  /** 選べる最初の時刻 "HH:MM"。既定 "00:00" */
  min?: string;
  /** 選べる最後の時刻 "HH:MM"。既定 "23:59" */
  max?: string;
  /** 今の値。刻みに無くても一覧に残す */
  value?: string | null;
}

/**
 * 選ぶ一覧の時刻を作る。刻みは 00:00 から数え、min と max の両端を含める
 *
 * @param options 刻み、範囲、今の値
 * @returns 早い順の "HH:MM" の並び
 */
export function listTimes({ step = 15, min, max, value }: ListTimesOptions): string[] {
  const s = Number.isInteger(step) && step >= 1 && step <= 720 ? step : 15;
  const lo = parseTime(min) ?? 0;
  const hi = parseTime(max) ?? 24 * 60 - 1;
  const out: number[] = [];
  for (let t = Math.ceil(lo / s) * s; t <= hi && t < 24 * 60; t += s) out.push(t);
  const v = parseTime(value);
  if (v !== null && !out.includes(v)) {
    out.push(v);
    out.sort((a, b) => a - b);
  }
  return out.map(formatTime);
}
