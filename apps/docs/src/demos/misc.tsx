import { useState } from "react";
import {
  Banner, Badge, Button, CodeBlock, Quote, Skeleton, SkeletonText, Spinner, EmptyState, Divider, Pagination, Icon, Link,
} from "@knowidea/react";

export function Banners() {
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "100%" }}>
      <Banner tone="info" title="routine を更新した">次の実行は明日の 3:10。</Banner>
      <Banner tone="success">routine review を保存した。</Banner>
      <Banner tone="warn" title="使用量が近い">使用量が上限の 80% に近い。</Banner>
      <Banner tone="error" title="PR を作れなかった" action={<Button variant="secondary">もう一度</Button>}>権限が足りない。</Banner>
    </div>
  );
}
export function BannerState({ kind }: { kind: "loading" | "focus" | "empty" }) {
  if (kind === "loading") return <Banner tone="info" live action={<Spinner label="更新中" />}>更新している。</Banner>;
  return <Banner tone="error" action={<Button variant="secondary" className="is-focus">もう一度</Button>}>PR を作れなかった。</Banner>;
}
export function Badges() {
  return (
    <>
      <Badge>下書き</Badge>
      <Badge tone="success" icon={<Icon name="check" />}>動作中</Badge>
      <Badge tone="warn" icon={<Icon name="warning" />}>止まった</Badge>
      <Badge tone="error" icon={<Icon name="error" />}>失敗</Badge>
      <Badge numeric>24</Badge>
    </>
  );
}
const sample = `routine: review
schedule: "0 18 * * *"
model: opus
tokens: 182400`;
export function Code({ lines, wide }: { lines?: boolean; wide?: boolean }) {
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <CodeBlock language="yaml" code={wide ? sample + "\nnote: これは長い行で、狭い幅では枠の中だけが横に動くことを確かめるための行" : sample} lineNumbers={lines} />
    </div>
  );
}
export function Quotes() {
  return <Quote cite="会社の定款 第 1 条">会社は、コンテンツを作り、公開する。</Quote>;
}
export function Skeletons() {
  return <div style={{ width: "min(100%, 360px)" }}><SkeletonText lines={3} /></div>;
}
export function Spinners() {
  return (
    <>
      <span style={{ display: "inline-flex", gap: "var(--space-2)", alignItems: "center" }}><Spinner label="読み込み中" />読み込み中</span>
      <span style={{ fontSize: "var(--font-size-4)", display: "inline-flex" }}><Spinner label="大きい読み込み" /></span>
    </>
  );
}
export function Empty({ action = true }: { action?: boolean }) {
  return (
    <div style={{ width: "100%" }}>
      <EmptyState title="routine が無い" icon={<Icon name="file" />} action={action ? <Button variant="secondary">routine を作る</Button> : undefined}>
        routine を作ると、実行の記録がここに並ぶ。
      </EmptyState>
    </div>
  );
}
export function Dividers() {
  return (
    <div style={{ width: "100%" }}>
      <p>上の文</p>
      <Divider />
      <p>下の文</p>
      <Divider label="または" />
      <span>一覧<Divider orientation="vertical" />記録<Divider orientation="vertical" strong />設定</span>
    </div>
  );
}
export function Pages({ page = 1, count = 9, loading }: { page?: number; count?: number; loading?: boolean }) {
  const [p, setP] = useState(page);
  return <Pagination page={p} pageCount={count} onPageChange={setP} />;
}
export function PagesLink() {
  return <Pagination page={2} pageCount={4} getHref={(n) => `#page-${n}`} />;
}
export { Link };
