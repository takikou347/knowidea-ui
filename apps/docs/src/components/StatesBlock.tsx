import { demos } from "../demos/index";
import type { StateRow } from "../demos/types";

/** 5 つの状態(空、読み込み、失敗、無効、focus)と、hover、押した時の表 */
export default function StatesBlock({ slug }: { slug: string }) {
  const states = (demos as Record<string, { states?: () => StateRow[] }>)[slug]?.states;
  const rows = states ? states() : [];
  return (
    <div className="table-wrap">
      <table className="docs-table states-table">
        <thead><tr><th>状態</th><th>見え方</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>
                {r.na ? <span className="muted">該当しない。{r.na}</span> : (
                  <div className="state-cell">{r.node}{r.note ? <p className="state-note">{r.note}</p> : null}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
