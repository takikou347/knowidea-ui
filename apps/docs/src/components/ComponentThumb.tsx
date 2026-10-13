import type * as React from "react";
import { demos } from "../demos/index";
import { pick } from "../lib/tiles.mjs";

/** 部品の一覧に置く、触れる見本。デモのページと同じ本物の部品を、そのまま描く。 */
export default function ComponentThumb({ slug }: { slug: string }) {
  const p = (pick as Record<string, { fn: string }>)[slug];
  const C = p ? ((demos as Record<string, Record<string, unknown>>)[slug]?.[p.fn] as (() => React.JSX.Element) | undefined) : undefined;
  if (!C) return null;
  return <div className="cp-fit" data-slug={slug}><C /></div>;
}
