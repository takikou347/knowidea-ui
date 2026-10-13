import { useState } from "react";
import { Chip, Icon } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Filter() {
  const [on, setOn] = useState<string[]>(["all"]);
  const toggle = (k: string) => setOn((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  return (
    <>
      {[["all", "すべて"], ["open", "開いている"], ["done", "終わった"]].map(([k, l]) => (
        <Chip key={k} label={l!} selected={on.includes(k!)} onClick={() => toggle(k!)} />
      ))}
    </>
  );
}

export function Removable() {
  const [tags, setTags] = useState(["デザイン", "アイコン", "色"]);
  return (
    <>
      {tags.map((t) => <Chip key={t} label={t} onDelete={() => setTags((s) => s.filter((x) => x !== t))} />)}
      {tags.length === 0 ? <span className="muted">タグは無い</span> : null}
    </>
  );
}

export function Static() {
  return (
    <>
      <Chip label="下書き" />
      <Chip label="公開前" icon={<Icon name="clock" />} />
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", node: <Chip label="タグは無い" />, note: "選べるチップが 1 つも無いときは、一覧側で空の状態を出す" },
    { label: "読み込み", node: <Chip label="絞り込み" loading onClick={() => {}} /> },
    { label: "失敗", na: "チップ自身は失敗を持たない。絞り込みの失敗は一覧側の Alert で示す" },
    { label: "無効", node: <><Chip label="無効" disabled onClick={() => {}} /><Chip label="無効(消せる)" disabled onDelete={() => {}} /></> },
    { label: "focus", node: <Chip label="focus" onClick={() => {}} className="is-focus" />, note: "focus の輪は押せる 44px の範囲に付く。実物は Tab で確かめる" },
    { label: "hover", na: "押せる範囲の背景が変わる。実物はポインタで確かめる" },
    { label: "押した時", node: <Chip label="選んでいる" selected onClick={() => {}} /> },
  ];
}
