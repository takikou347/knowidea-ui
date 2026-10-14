import { Button, Icon, Progress, Switch, ThemeProvider, type ButtonVariant } from "knowidea-ui";
import type { StateRow } from "./types";

export function Variants() {
  return (
    <>
      <Button>保存する</Button>
      <Button variant="secondary">下書きにする</Button>
      <Button variant="quiet">あとで</Button>
      <Button variant="danger">削除する</Button>
    </>
  );
}

export function Sizes() {
  return (
    <>
      <Button>標準(44px)</Button>
      <Button size="lg">大きい(52px)</Button>
    </>
  );
}

export function WithIcon() {
  return (
    <>
      <Button icon={<Icon name="check" />}>完了にする</Button>
      <Button variant="secondary" icon={<Icon name="download" />}>エクスポート</Button>
    </>
  );
}

export function GradientLook() {
  return (
    <>
      <ThemeProvider theme={{ look: "gradient" }}>
        <div style={{ display: "grid", gap: "var(--space-3)", width: "min(100%, 320px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <Button>保存する</Button>
            <Button variant="secondary">下書きにする</Button>
          </div>
          <Switch label="自動で更新する" defaultChecked />
          <Progress label="進み具合" value={60} />
        </div>
      </ThemeProvider>
    </>
  );
}

const variants: ButtonVariant[] = ["primary", "secondary", "quiet", "danger"];
export function states(): StateRow[] {
  const row = (props: Record<string, unknown>) => variants.map((v) => <Button key={v} variant={v} {...props}>送信</Button>);
  return [
    { label: "Empty", na: "ラベルのないボタンは作らない。アイコンだけのときは IconButton を使う" },
    { label: "Loading", node: row({ loading: true }) },
    { label: "Error", na: "Button 自身はエラー状態を持たない。押した結果のエラーは、近くの Alert か Field のエラーメッセージで示す" },
    { label: "Disabled", node: row({ disabled: true }) },
    { label: "Focus", node: row({ className: "is-focus" }) },
    { label: "Hover", node: row({ className: "is-hover" }) },
    { label: "Active", node: row({ className: "is-active" }) },
  ];
}
