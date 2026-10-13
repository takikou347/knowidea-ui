import { demos } from "../demos/index";
import type { StateRow } from "../demos/types";

/** 5 つの状態(Empty、Loading、Error、Disabled、Focus)と、Hover、Active の表 */
export default function StatesBlock({ slug }: { slug: string }) {
  const states = (demos as Record<string, { states?: () => StateRow[] }>)[slug]?.states;
  const rows = states ? states() : [];
  return (
    <div className="table-wrap">
      <table className="docs-table states-table">
        <thead><tr><th>State</th><th>Appearance</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>
                {r.na ? <span className="muted">対象外。{r.na}</span> : (
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
