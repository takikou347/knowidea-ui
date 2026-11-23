import { Card, Grid, Status, Button, Icon, Badge, Switch, TimePicker } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Grid minItemWidth={260} style={{ width: "100%" }}>
      <Card
        title="エクスポート設定"
        subtitle="sample-export"
        badge={<Status kind="working" label="処理中" />}
        href="#export"
        meta={[{ label: "最終実行", value: "10/13 09:28" }, { label: "今日の件数", value: "1,280" }]}
      >
        <p>見出しがリンクで、クリック領域はカード全体に広がる。</p>
      </Card>
      <Card
        title="公開前の確認"
        badge={<Status kind="paused" label="待ち" />}
        actions={<><Button variant="secondary" icon={<Icon name="check" />}>承認</Button><Button variant="quiet">あとで</Button></>}
      >
        <p>操作つきのカード。操作はカードのリンクより前面に表示され、リンクとは別に操作できる。</p>
      </Card>
    </Grid>
  );
}

export function WithBadge() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Card title="下書き" badge={<Badge>公開前</Badge>} headingLevel={2}>本文は短く。見出しのレベルは headingLevel で合わせる。</Card>
    </div>
  );
}

export function Settings() {
  return (
    <Grid minItemWidth={280} style={{ width: "100%" }}>
      <Card title="通知" titleSize="lg" headingLevel={2} actionsAlign="end" actions={<Button variant="primary">保存</Button>}>
        <TimePicker label="知らせる時刻" hint="毎日この時刻に、前の日の件数を知らせる" defaultValue="09:00" />
      </Card>
      <Card title="表示" titleSize="lg" headingLevel={2} actionsAlign="end" actions={<Button variant="primary">保存</Button>}>
        <Switch label="細かい記録を出す" placement="end" />
      </Card>
    </Grid>
  );
}

const W = ({ children }: { children: React.ReactNode }) => <div style={{ width: "min(100%, 300px)" }}>{children}</div>;
export function states(): StateRow[] {
  return [
    { label: "Empty", node: <W><Card title="サンプル"><span className="muted">中身がないときは、理由を本文に書く。</span></Card></W> },
    { label: "Loading", node: <W><Card title="" state="loading" /></W> },
    { label: "Error", node: <W><Card title="サンプル" state="error" error="状態を取得できなかった" /></W> },
    { label: "Disabled", node: <W><Card title="サンプル" href="#x" disabled>操作できない。背景が暗くなり、文字が薄くなる。</Card></W> },
    { label: "Focus", node: <W><Card title="サンプル" href="#x" className="is-focus">見出しのリンクにフォーカスが移ると、カード全体にリングが表示される。</Card></W> },
    { label: "Hover", node: <W><Card title="サンプル" href="#x" className="is-hover">操作できるカードは、枠線が濃くなる。</Card></W> },
    { label: "Active", na: "押すとリンク先へ移動する" },
  ];
}
