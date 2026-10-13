import type * as React from "react";
import { CodeBlock } from "@knowidea/ui";
import { demos } from "../demos/index";

interface Props {
  slug: string;
  fn: string;
  /** 実際のデモと同じ関数の本文(ページを作る時にファイルから切り出す) */
  code: string;
  /** 舞台を折り返しの横並びでなく、幅いっぱいの 1 つにする */
  block?: boolean;
}

/** デモと「コードを見る」。コードはデモの関数そのもの。 */
export default function DemoBlock({ slug, fn, code, block }: Props) {
  const C = (demos as Record<string, Record<string, unknown>>)[slug]?.[fn] as (() => React.JSX.Element) | undefined;
  if (!C) return <p>デモが無い: {slug}/{fn}</p>;
  return (
    <div className="demo">
      <div className="demo-stage" data-block={block ? "" : undefined}><C /></div>
      <details className="demo-code">
        <summary>コードを見る</summary>
        <CodeBlock code={code} language="tsx" label={`${fn} のコード`} />
      </details>
    </div>
  );
}
