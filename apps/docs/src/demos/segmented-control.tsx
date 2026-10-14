import { useState } from "react";
import { SegmentedControl, Icon } from "knowidea-ui";
import type { StateRow } from "./types";

const range = [
  { value: "day", label: "日" },
  { value: "week", label: "週" },
  { value: "month", label: "月" },
];

export function Basic() {
  const [v, setV] = useState("week");
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "start" }}>
      <SegmentedControl label="表示する期間" options={range} value={v} onValueChange={setV} />
      <p style={{ margin: 0, color: "var(--color-text-muted)" }}>今の表示: {range.find((o) => o.value === v)?.label}</p>
    </div>
  );
}

export function WithIcons() {
  return (
    <SegmentedControl
      label="表示の形"
      fullWidth
      defaultValue="list"
      options={[
        { value: "list", label: "リスト", icon: <Icon name="list" /> },
        { value: "calendar", label: "カレンダー", icon: <Icon name="calendar" /> },
        { value: "chart", label: "グラフ", icon: <Icon name="chart-bar" /> },
      ]}
    />
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "いつも 1 つを選んでいる。初めは先頭を選ぶ" },
    { label: "Loading", na: "切り替えた先の中身を、Skeleton などで待つ。SegmentedControl はすぐに切り替わる" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", node: <><SegmentedControl label="無効" options={range} defaultValue="day" disabled /><SegmentedControl label="1 つだけ無効" options={[range[0]!, range[1]!, { ...range[2]!, disabled: true }]} defaultValue="day" /></> },
    { label: "Focus", text: "Tab で選んでいる項目に移り、2px のリングが出る。矢印キーで選び直し、選ぶとすぐに切り替わる" },
  ];
}
