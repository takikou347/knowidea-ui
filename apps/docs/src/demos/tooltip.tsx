import { Tooltip, IconButton, Icon, Button } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  return (
    <>
      <Tooltip content="コピーする"><IconButton variant="secondary" label="コピー" icon={<Icon name="copy" />} /></Tooltip>
      <Tooltip content="日付は日本時間の 0 時で区切る" side="bottom"><Button variant="secondary">集計の区切り</Button></Tooltip>
    </>
  );
}

export function states(): StateRow[] {
  return [
    { label: "Empty", na: "中身のない Tooltip は作らない" },
    { label: "Loading", na: "Tooltip は短い補足なので、ローディング状態を持たない" },
    { label: "Error", na: "エラーの説明は Tooltip に入れず、近くの文章か Alert に書く" },
    { label: "Disabled", na: "無効なボタンはフォーカスもホバーも受けないため、Tooltip は表示されない。理由は隣の文章で伝える" },
    { label: "Focus", node: <Tooltip content="フォーカスで表示される"><Button variant="secondary" className="is-focus">フォーカス</Button></Tooltip>, note: "ポインターを置くか、Tab でフォーカスを移すと表示される。Esc で閉じる" },
  ];
}
