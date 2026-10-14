import { Field, Stepper } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Field label="人数" hint="1 から 10 人まで">
      <Stepper defaultValue={2} min={1} max={10} />
    </Field>
  );
}

export function WithUnit() {
  return (
    <Field label="知らせる時刻" hint="予定の何分前か。5 分ずつ変わる">
      <Stepper defaultValue={15} min={0} max={120} step={5} format={{ style: "unit", unit: "minute" }} />
    </Field>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", node: <Stepper aria-label="未入力" />, note: "値が無い時は空。+ を押すと min か 0 から始まる" },
    { label: "Loading", na: "値はすぐに変わる。保存を待つ時は、近くに Spinner を出す" },
    { label: "Error", node: <Stepper aria-label="エラー" defaultValue={0} invalid />, note: "Field の error と一緒に使い、理由を文で出す" },
    { label: "Disabled", node: <Stepper aria-label="無効" defaultValue={3} disabled /> },
    { label: "Focus", text: "欄に focus すると、枠の外に 2px のリングが出る。上下の矢印で step ずつ変わる。端では − か + が押せなくなる" },
  ];
}
