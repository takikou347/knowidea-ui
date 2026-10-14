import { useState } from "react";
import { Slider } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  const [v, setV] = useState(60);
  return (
    <div style={{ width: "min(100%, 360px)" }}>
      <Slider label="読み上げの音量" value={v} onValueChange={(n) => setV(n as number)} formatValue={(n) => `${n}%`} />
    </div>
  );
}

const yen = new Intl.NumberFormat("ja-JP");

export function Range() {
  return (
    <div style={{ width: "min(100%, 360px)" }}>
      <Slider label="価格帯" defaultValue={[2000, 8000]} min={0} max={10000} step={500} largeStep={2000} formatValue={(n) => `${yen.format(n)} 円`} />
    </div>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "いつも値を持つ。初めは min" },
    { label: "Loading", na: "値はすぐに変わる。保存を待つ時は、近くに Spinner を出す" },
    { label: "Error", na: "範囲の外の値にならないので、エラー状態を持たない" },
    { label: "Disabled", node: <div style={{ width: "min(100%, 360px)" }}><Slider label="無効" defaultValue={30} disabled /></div> },
    { label: "Focus", text: "つまみに focus すると 2px のリングが出る。左右の矢印で step、PageUp と PageDown で largeStep、Home と End で端へ動く" },
  ];
}
