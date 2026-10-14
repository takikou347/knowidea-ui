import { Breadcrumbs } from "knowidea-ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Breadcrumbs items={[{ label: "ホーム", href: "#home" }, { label: "設定", href: "#settings" }, { label: "通知" }]} />
  );
}

export function Long() {
  return (
    <Breadcrumbs items={[{ label: "ホーム", href: "#a" }, { label: "プロジェクト", href: "#b" }, { label: "サンプルの項目", href: "#c" }, { label: "履歴", href: "#d" }, { label: "2026 年 10 月の更新履歴" }]} />
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "階層が 1 つだけのときは表示しない" },
    { label: "Loading", na: "階層は URL から決まるため、ローディング状態を持たない" },
    { label: "Error", na: "エラー状態を持たない" },
    { label: "Disabled", na: "途中の階層を無効にはしない。移動できない階層は href を外し、テキストだけで示す" },
    { label: "Focus", node: <Breadcrumbs items={[{ label: "ホーム", href: "#home", }, { label: "現在のページ" }]} />, note: "リンクにフォーカスが移ると、2px のリングが表示される" },
  ];
}
