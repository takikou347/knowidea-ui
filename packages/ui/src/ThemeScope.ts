import { createContext, useContext } from "react";

/**
 * ThemeProvider の id。ポータルに出る物(Dialog、Menu、Select、Tooltip、Toast、Drawer)は、
 * ThemeProvider の外(body の直下)に描かれるため、この id を属性で付けて、テーマの変数を届ける。
 */
export const ThemeScopeContext = createContext<string | null>(null);

export function useThemeScope(): { "data-ki-theme"?: string } {
  const id = useContext(ThemeScopeContext);
  return id ? { "data-ki-theme": id } : {};
}
