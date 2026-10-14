import { useLayoutEffect, useRef, type RefObject } from "react";

/** トークンの時間("160ms")を数に。動きを減らす設定ではトークンが 0ms になる */
function duration(el: Element, name: string): number {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v.endsWith("ms") ? parseFloat(v) : v.endsWith("s") ? parseFloat(v) * 1000 : 0;
}

/**
 * 一覧の行を、足した時は上から少し滑って出し、消した時と並べ替えた時は新しい位置へ滑らせる。
 * 行には data-id を付ける。初めて出た時は動かさない(状態が変わる時だけ動かす)。
 */
export function useListMotion(ref: RefObject<HTMLElement | null>, key: string) {
  const tops = useRef<Map<string, number> | null>(null);
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    const rows = Array.from(box.querySelectorAll<HTMLElement>(":scope > [data-id]"));
    // 動いている途中の行は止めてから測る(続けて押した時に、途中の位置を覚えないように)
    rows.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    // 一覧の中のスクロールの分を足し、スクロールしただけで動いたと見ないようにする
    const base = box.getBoundingClientRect().top - box.scrollTop;
    const next = new Map(rows.map((el) => [el.dataset.id!, el.getBoundingClientRect().top - base]));
    const prev = tops.current;
    tops.current = next;
    const ms = duration(box, "--motion-duration-state");
    // 行が無かった所(初め、読み込み中、空)から出た時は動かさない
    if (!prev || prev.size === 0 || ms === 0 || typeof box.animate !== "function") return;
    const easing = getComputedStyle(box).getPropertyValue("--motion-ease").trim() || "ease";
    for (const el of rows) {
      const was = prev.get(el.dataset.id!);
      const now = next.get(el.dataset.id!)!;
      if (was === undefined) el.animate([{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "none" }], { duration: ms, easing });
      else if (Math.abs(was - now) > 1) el.animate([{ transform: `translateY(${was - now}px)` }, { transform: "none" }], { duration: ms, easing });
    }
  }, [ref, key]);
}
