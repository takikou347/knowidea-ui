import { useState } from "react";
import { Chip, Icon } from "knowidea-ui";
import type { StateRow } from "./types";

export function Filter() {
  const [on, setOn] = useState<string[]>(["all"]);
  const toggle = (k: string) => setOn((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  return (
    <>
      {[["all", "すべて"], ["open", "未完了"], ["done", "完了"]].map(([k, l]) => (
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
      {tags.length === 0 ? <span className="muted">タグがない</span> : null}
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
    { label: "Empty", node: <Chip label="タグがない" />, note: "選択できるチップが 1 つもないときは、一覧側で Empty state を表示する" },
    { label: "Loading", node: <Chip label="絞り込み" loading onClick={() => {}} /> },
    { label: "Error", na: "Chip 自身はエラー状態を持たない。絞り込みの失敗は一覧側の Alert で示す" },
    { label: "Disabled", node: <><Chip label="無効" disabled onClick={() => {}} /><Chip label="無効(削除可)" disabled onDelete={() => {}} /></> },
    { label: "Focus", node: <Chip label="フォーカス" onClick={() => {}} className="is-focus" />, note: "フォーカスリングは、タップ領域の 44px の範囲に付く。実物は Tab で確認する" },
    { label: "Hover", note: "タップ領域の背景が変わる。実物はポインターで確認する" },
    { label: "Active", node: <Chip label="選択中" selected onClick={() => {}} /> },
  ];
}
