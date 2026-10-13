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
    { label: "空", na: "中身の無いツールチップは作らない" },
    { label: "読み込み", na: "ツールチップは短い補足で、読み込みを持たない" },
    { label: "失敗", na: "失敗の説明はツールチップに入れず、近くの文か Alert に書く" },
    { label: "無効", na: "無効なボタンは focus も hover も受けないので出ない。理由は隣の文で書く" },
    { label: "focus", node: <Tooltip content="focus で出る"><Button variant="secondary" className="is-focus">focus</Button></Tooltip>, note: "ポインタを置くか、Tab で focus を入れると出る。Esc で閉じる" },
  ];
}
