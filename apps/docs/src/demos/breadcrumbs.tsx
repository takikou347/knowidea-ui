import { Breadcrumbs } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <Breadcrumbs items={[{ label: "ホーム", href: "#home" }, { label: "設定", href: "#settings" }, { label: "通知" }]} />
  );
}

export function Long() {
  return (
    <Breadcrumbs items={[{ label: "ホーム", href: "#a" }, { label: "プロジェクト", href: "#b" }, { label: "見本の項目", href: "#c" }, { label: "履歴", href: "#d" }, { label: "2026 年 10 月の更新の記録" }]} />
  );
}

export function states(): StateRow[] {
  return [
    { label: "空", na: "階層が 1 つだけなら出さない" },
    { label: "読み込み", na: "階層は URL から決まるので、読み込みを持たない" },
    { label: "失敗", na: "失敗を持たない" },
    { label: "無効", na: "途中の階層は無効にしない。行けない階層は href を外し、文字で示す" },
    { label: "focus", node: <Breadcrumbs items={[{ label: "ホーム", href: "#home", }, { label: "今いる所" }]} />, note: "リンクに focus が入ると、2px の輪が出る" },
  ];
}
