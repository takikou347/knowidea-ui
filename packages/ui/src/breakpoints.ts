/** 幅の区切り(px)。knowidea-tokens の --breakpoint-tablet と --breakpoint-desktop と同じ値。 */
export const breakpoints = { tablet: 600, desktop: 1024 } as const;
export type Breakpoint = keyof typeof breakpoints;

/** matchMedia に渡す式。phone は 600px 未満、tablet は 600px から 1024px 未満、desktop は 1024px 以上 */
export const mediaQuery = {
  phone: `(max-width: ${breakpoints.tablet - 0.02}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 0.02}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
} as const;
