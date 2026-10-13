import type { SVGProps } from "react";
import { iconPaths, type IconName } from "./icon-data.js";
import { cx } from "./utils.js";

export type { IconName };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** 意味を持つときだけ付ける。無ければ装飾として隠す */
  label?: string;
}

/** 部品の中で使う小さな inline の SVG(Phosphor regular)。部品の `icon` には packages/icons の物も渡せる。 */
export function Icon({ name, label, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cx("ki-icon", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
