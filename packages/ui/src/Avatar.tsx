import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Icon } from "./Icon.js";
import { cx } from "./utils.js";

export interface AvatarProps {
  /** 名前。画像が無いときの頭文字になり、読み上げの名前にもなる */
  name?: string;
  /** 画像の URL。読み込めなければ頭文字に切り替わる */
  src?: string;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "circle";
  className?: string;
}

function initials(name: string) {
  const t = name.trim();
  if (!t) return "";
  const words = t.split(/\s+/);
  if (words.length > 1 && /^[\x00-\x7f]+$/.test(t)) return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
  return Array.from(t)[0]!.toUpperCase();
}

/** 画像、無ければ頭文字、名前も無ければ人のアイコン。 */
export function Avatar({ name, src, size = "md", shape = "square", className }: AvatarProps) {
  return (
    <BaseAvatar.Root className={cx("ki-avatar", className)} data-size={size === "md" ? undefined : size} data-shape={shape === "circle" ? "circle" : undefined} role="img" aria-label={name ?? "人"}>
      {src ? <BaseAvatar.Image className="ki-avatar__image" src={src} alt="" /> : null}
      <BaseAvatar.Fallback>{name ? initials(name) : <Icon name="user" />}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
