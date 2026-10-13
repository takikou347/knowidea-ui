import { Card, Grid, Status, Button, Icon, Badge } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Grid minItemWidth={260} style={{ width: "100%" }}>
      <Card
        title="書き出しの設定"
        subtitle="sample-export"
        badge={<Status kind="working" label="処理中" />}
        href="#export"
        meta={[{ label: "最後に動いた", value: "10/13 09:28" }, { label: "今日の件数", value: "1,280" }]}
      >
        <p>見出しがリンクで、押せる範囲はカード全体に広がる。</p>
      </Card>
      <Card
        title="公開前の確認"
        badge={<Status kind="paused" label="待っている" />}
        actions={<><Button variant="secondary" icon={<Icon name="check" />}>承認</Button><Button variant="quiet">あとで</Button></>}
      >
        <p>操作を持つカード。操作はカードのリンクの上に出て、別に押せる。</p>
      </Card>
    </Grid>
  );
}

export function WithBadge() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Card title="下書き" badge={<Badge>公開前</Badge>} headingLevel={2}>本文は短く。見出しの段は headingLevel で合わせる。</Card>
    </div>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 300px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "空", node: <W><Card title="見本"><span className="muted">中身が無いときは、理由の文を本文に書く。</span></Card></W> },
    { label: "読み込み", node: <W><Card title="" state="loading" /></W> },
    { label: "失敗", node: <W><Card title="見本" state="error" error="状態が取れなかった" /></W> },
    { label: "無効", node: <W><Card title="見本" href="#x" disabled>押せない。背景が沈み、文字が薄くなる。</Card></W> },
    { label: "focus", node: <W><Card title="見本" href="#x" className="is-focus">見出しのリンクに focus が入ると、カード全体に輪が出る。</Card></W> },
    { label: "hover", node: <W><Card title="見本" href="#x" className="is-hover">押せるカードは、枠が濃くなる。</Card></W> },
    { label: "押した時", na: "押すとリンク先へ移る" },
  ];
}
