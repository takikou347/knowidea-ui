import { Icon as BaseIcon, type IconName, type IconProps as BaseIconProps } from "knowidea-icons/react";
import { cx } from "./utils.js";

export type { IconName };

export interface IconProps extends Omit<BaseIconProps, "title"> {
  name: IconName;
  /** 意味を持つときだけ付ける。無ければ装飾として隠す(読み上げない) */
  label?: string;
}

/** `packages/icons`(workspace の `icons`)の部品を、`ki-icon`(1.25em、currentColor)で包む。 */
export function Icon({ name, label, className, ...rest }: IconProps) {
  return <BaseIcon name={name} title={label} className={cx("ki-icon", className)} {...rest} />;
}
