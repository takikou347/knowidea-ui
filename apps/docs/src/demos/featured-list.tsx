import { EmptyState, FeaturedList, Icon, Jacket, Skeleton } from "knowidea-ui";
import type { StateRow } from "./types";

const sample = [
  { title: "春の献立を、冷蔵庫にある物から決める", date: "2026-10-20", kind: "記事", jacket: "台所の手帖", series: "台所の手帖" },
  { title: "朝の 5 分で、机の上を空にする", date: "2026-10-17", kind: "記事", series: "台所の手帖" },
  { title: "雨の日の本棚を整える手順", date: "2026-10-12", kind: "記事" },
  { title: "町の音を録る、3 つの置き方", date: "2026-10-05", kind: "音声" },
];

function Entries({ rows = sample, style }: { rows?: { title: string; date: string; kind: string; jacket?: string; series?: string }[]; style?: React.CSSProperties }) {
  return (
    <FeaturedList style={style}>
      {rows.map((r, i) => (
        <div key={r.title}>
          {i === 0 && r.jacket ? <div className="ki-featured__media"><Jacket title={r.jacket} ratio="landscape" decorative /></div> : null}
          <div className="ki-featured__title"><a href="#featured-list">{r.title}</a></div>
          <p className="ki-featured__meta"><time dateTime={r.date}>{r.date}</time><span>{r.kind}</span>{r.series ? <a href="#featured-list">{r.series}</a> : null}</p>
        </div>
      ))}
    </FeaturedList>
  );
}

export function Basic() {
  return <div style={{ width: "100%" }}><Entries /></div>;
}

export function Narrow() {
  return <div style={{ width: "100%" }}><Entries style={{ width: "min(100%, 400px)" }} /></div>;
}

export function Single() {
  return <div style={{ width: "100%" }}><Entries rows={sample.slice(0, 1)} /></div>;
}

function Loading() {
  return (
    <div style={{ width: "100%" }} aria-busy="true">
      <FeaturedList>
        <div style={{ display: "grid", gap: "var(--space-3)" }}><Skeleton shape="block" /><Skeleton size="long" /><Skeleton size="short" /></div>
        <div style={{ display: "grid", gap: "var(--space-2)" }}><Skeleton size="long" /><Skeleton size="short" /></div>
        <div style={{ display: "grid", gap: "var(--space-2)" }}><Skeleton size="long" /><Skeleton size="short" /></div>
        <div style={{ display: "grid", gap: "var(--space-2)" }}><Skeleton size="long" /><Skeleton size="short" /></div>
      </FeaturedList>
    </div>
  );
}

export function states(): StateRow[] {
  return [
    {
      label: "Empty",
      node: <div style={{ width: "100%" }}><EmptyState title="まだ記事がない" icon={<Icon name="file" />}>記事が出ると、ここに大きな 1 つと行で並ぶ。</EmptyState></div>,
      note: "項目が 0 の時、FeaturedList は何も描かない。空の見せ方は使う側が EmptyState などで決める",
    },
    { label: "Loading", node: <Loading />, note: "Skeleton で大きな 1 つと行の形をまねる。動かさない。ラッパーに aria-busy を付ける" },
    { label: "Error", na: "エラー状態を持たない。取得に失敗したら、一覧をやめて Alert か EmptyState に切り替える" },
    { label: "Disabled", na: "無効状態を持たない。押せる所は、各行の題のリンクだけ" },
    { label: "Focus", text: "題のリンクに Tab で移り、2px のリングが出る。大きな 1 つから行の順に移る" },
  ];
}
