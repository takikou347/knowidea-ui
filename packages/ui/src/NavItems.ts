import type { IconName } from "./Icon.js";

export interface NavItem {
  id: string;
  label: string;
  icon?: IconName;
  href: string;
  /** 件数の印 */
  count?: number;
  disabled?: boolean;
}
