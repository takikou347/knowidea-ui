export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** 3 桁区切り(日本語) */
export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

/** 軸の目盛り用。1,000 以上は 万 や k にせず、短く「18万」と出す */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("ja-JP", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
