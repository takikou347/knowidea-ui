import { useMemo, useState } from "react";
import { Combobox, Field, type ComboboxOption } from "@knowidea/ui";
import type { StateRow } from "./types";

export function Basic() {
  // 都道府県。読み仮名(keywords)でも探せる
  const prefectures = useMemo<ComboboxOption[]>(() => [
    ["北海道", "ほっかいどう"], ["青森県", "あおもりけん"], ["岩手県", "いわてけん"], ["宮城県", "みやぎけん"], ["秋田県", "あきたけん"],
    ["山形県", "やまがたけん"], ["福島県", "ふくしまけん"], ["茨城県", "いばらきけん"], ["栃木県", "とちぎけん"], ["群馬県", "ぐんまけん"],
    ["埼玉県", "さいたまけん"], ["千葉県", "ちばけん"], ["東京都", "とうきょうと"], ["神奈川県", "かながわけん"], ["新潟県", "にいがたけん"],
    ["富山県", "とやまけん"], ["石川県", "いしかわけん"], ["福井県", "ふくいけん"], ["山梨県", "やまなしけん"], ["長野県", "ながのけん"],
    ["岐阜県", "ぎふけん"], ["静岡県", "しずおかけん"], ["愛知県", "あいちけん"], ["三重県", "みえけん"], ["滋賀県", "しがけん"],
    ["京都府", "きょうとふ"], ["大阪府", "おおさかふ"], ["兵庫県", "ひょうごけん"], ["奈良県", "ならけん"], ["和歌山県", "わかやまけん"],
    ["鳥取県", "とっとりけん"], ["島根県", "しまねけん"], ["岡山県", "おかやまけん"], ["広島県", "ひろしまけん"], ["山口県", "やまぐちけん"],
    ["徳島県", "とくしまけん"], ["香川県", "かがわけん"], ["愛媛県", "えひめけん"], ["高知県", "こうちけん"], ["福岡県", "ふくおかけん"],
    ["佐賀県", "さがけん"], ["長崎県", "ながさきけん"], ["熊本県", "くまもとけん"], ["大分県", "おおいたけん"], ["宮崎県", "みやざきけん"],
    ["鹿児島県", "かごしまけん"], ["沖縄県", "おきなわけん"],
  ].map(([label, kana], i) => ({ value: String(i + 1).padStart(2, "0"), label: label!, keywords: [kana!] })), []);
  const [v, setV] = useState<string | null>(null);
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "min(100%, 320px)" }}>
      <Field label="都道府県" hint="漢字でも、ひらがなやカタカナの読みでも探せる"><Combobox aria-label="都道府県" options={prefectures} value={v} onValueChange={setV} /></Field>
      <p style={{ margin: 0, color: "var(--color-text-muted)" }}>値: {v ?? "なし"}</p>
    </div>
  );
}

export function WithDescription() {
  return (
    <div style={{ width: "min(100%, 320px)" }}>
      <Field label="時間帯">
        <Combobox
          aria-label="時間帯"
          defaultValue="tokyo"
          options={[
            { value: "tokyo", label: "東京", description: "Asia/Tokyo、UTC+9" },
            { value: "seoul", label: "ソウル", description: "Asia/Seoul、UTC+9" },
            { value: "singapore", label: "シンガポール", description: "Asia/Singapore、UTC+8" },
            { value: "london", label: "ロンドン", description: "Europe/London、UTC+0" },
            { value: "new-york", label: "ニューヨーク", description: "America/New_York、UTC-5" },
          ]}
        />
      </Field>
    </div>
  );
}

export function states(): StateRow[] {
  const prefectures: ComboboxOption[] = [
    { value: "01", label: "北海道", keywords: ["ほっかいどう"] },
    { value: "13", label: "東京都", keywords: ["とうきょうと"] },
    { value: "27", label: "大阪府", keywords: ["おおさかふ"] },
  ];
  return [
    { label: "Empty", node: <Combobox aria-label="未選択" options={prefectures} />, note: "合う物が無い時は、候補の代わりに「合う物が無い」を出す" },
    { label: "Loading", node: <Combobox aria-label="読み込み中" options={[]} loading />, note: "欄に回転を出し、開くと「読み込み中」を出す" },
    { label: "Error", node: <Combobox aria-label="エラー" options={prefectures} invalid />, note: "Field の error と一緒に使い、理由を文で出す" },
    { label: "Disabled", node: <Combobox aria-label="無効" options={prefectures} defaultValue="13" disabled /> },
    { label: "Focus", text: "欄に focus すると 2px のリングが出る。上下の矢印で候補を移り、Enter で選ぶ。Esc で閉じる" },
  ];
}
