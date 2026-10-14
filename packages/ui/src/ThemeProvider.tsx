import { useContext, useId, useMemo, type ElementType, type ReactNode } from "react";
import { createTheme, type ThemeOptions, type ThemeWarning } from "knowidea-tokens/create-theme";
import { cx } from "./utils.js";
import { ThemeLookContext, ThemeScopeContext } from "./ThemeScope.js";

export interface ThemeProviderProps {
  /** 主の色、角丸、密度、字の大きさ、見た目(look)。無い項目は基本のまま */
  theme: ThemeOptions;
  /** 描画する要素。既定は div(display: contents なので、見た目の箱は作らない) */
  as?: ElementType;
  /** コントラストが足りないとき呼ばれる。既定は console.warn */
  onWarn?: (warnings: ThemeWarning[]) => void;
  className?: string;
  children?: ReactNode;
}

/**
 * 子の下の CSS 変数を上書きする。<style> を子の前に出すので、SSR でもちらつかない。
 * ライトとダークの両方を作る(ダークは同じ色相で明るくした別の値)。
 */
export function ThemeProvider({ theme, as: Tag = "div", onWarn, className, children }: ThemeProviderProps) {
  const id = "ki" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const key = JSON.stringify(theme);
  const built = useMemo(() => createTheme(theme), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  if (built.warnings.length > 0) {
    if (onWarn) onWarn(built.warnings);
    else if (typeof console !== "undefined") for (const w of built.warnings) console.warn("[knowidea-ui] ThemeProvider: " + w.message);
  }
  // look を書かなければ外の ThemeProvider の見た目を受け継ぐ。"flat" と書けば、その下はグラデーションを外す
  const outer = useContext(ThemeLookContext);
  const look = theme.look === undefined ? outer : theme.look === "gradient" ? "gradient" : outer ? "flat" : null;
  return (
    <Tag className={cx(className)} data-ki-theme={id} data-ki-look={look ?? undefined} style={{ display: "contents" }}>
      <style>{built.css(`[data-ki-theme="${id}"]`)}</style>
      <ThemeScopeContext.Provider value={id}>
        <ThemeLookContext.Provider value={look}>{children}</ThemeLookContext.Provider>
      </ThemeScopeContext.Provider>
    </Tag>
  );
}

export { createTheme, type ThemeOptions, type ThemeWarning };
