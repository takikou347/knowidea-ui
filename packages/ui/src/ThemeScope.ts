import { createContext, useContext } from "react";

/**
 * ThemeProvider の id。ポータルに出る物(Dialog、Menu、Select、Tooltip、Toast、Drawer)は、
 * ThemeProvider の外(body の直下)に描かれるため、この id を属性で付けて、テーマの変数を届ける。
 */
export const ThemeScopeContext = createContext<string | null>(null);

/** ThemeProvider の見た目(look)。ポータルにも data-ki-look で届ける。外に gradient が無ければ null */
export const ThemeLookContext = createContext<"gradient" | "flat" | null>(null);

export function useThemeScope(): { "data-ki-theme"?: string; "data-ki-look"?: string } {
  const id = useContext(ThemeScopeContext);
  const look = useContext(ThemeLookContext);
  return { ...(id ? { "data-ki-theme": id } : null), ...(look ? { "data-ki-look": look } : null) };
}
