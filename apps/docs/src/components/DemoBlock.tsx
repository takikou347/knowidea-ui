import type * as React from "react";
import { CodeBlock } from "@knowidea/ui";
import { demos } from "../demos/index";

interface Props {
  slug: string;
  fn: string;
  /** 実際のデモと同じ関数の本文(ページのビルド時にファイルから切り出す) */
  code: string;
  /** ステージを折り返しの横並びではなく、幅いっぱいの 1 つにする */
  block?: boolean;
}

/** デモと "Show code"。コードはデモの関数そのもの。 */
export default function DemoBlock({ slug, fn, code, block }: Props) {
  const C = (demos as Record<string, Record<string, unknown>>)[slug]?.[fn] as (() => React.JSX.Element) | undefined;
  if (!C) return <p>デモがない: {slug}/{fn}</p>;
  return (
    <div className="demo">
      <div className="demo-stage" data-block={block ? "" : undefined}><C /></div>
      <details className="demo-code">
        <summary>Show code</summary>
        <CodeBlock code={code} language="tsx" label={`${fn} code`} />
      </details>
    </div>
  );
}
