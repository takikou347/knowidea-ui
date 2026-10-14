export type OklchTriple = [number, number, number];

export interface ThemeOptions {
  /** 主の色。"#rrggbb"、"#rgb"、"oklch(L C h)" */
  primary?: string;
  /** ダークの主の色。省略すると、同じ色相で明るくして作る */
  primaryDark?: string;
  /** 角丸の基準(中)。数(px)、"none" | "sm" | "md" | "lg"、"6px"。小は半分、大は 1.5 倍 */
  radius?: number | "none" | "sm" | "md" | "lg" | `${number}px`;
  /** 密度。compact が既定の詰めた形 */
  density?: "compact" | "comfortable";
  /** 本文の字の大きさ(px、12〜20)。ほかの段はこれを元に決まる */
  fontSize?: number;
  /** 見た目。flat が既定。gradient は主の色の面(主のボタン、進み具合、選んだ印)に、主の色から色相を 40 度回した色へのグラデーションを掛ける */
  look?: "flat" | "gradient";
}

export interface ThemeWarning {
  id: string;
  mode?: "light" | "dark";
  ratio?: number;
  message: string;
}

export interface Theme {
  options: ThemeOptions;
  light: Record<string, string>;
  dark: Record<string, string>;
  common: Record<string, string>;
  warnings: ThemeWarning[];
  /** selector の下に効く CSS 変数の上書き。既定は ":root" */
  css(selector?: string): string;
}

export function createTheme(options?: ThemeOptions): Theme;
export function parseColor(input: string): OklchTriple | null;
export function contrast(a: OklchTriple, b: OklchTriple): number;
export function luminance(c: OklchTriple): number;
export function hex(c: OklchTriple): string;
export function oklchString(c: OklchTriple): string;
export function oklchToLinear(c: OklchTriple): [number, number, number];
/** グラデーションの終わりの色(主の色の色相を GRADIENT_SHIFT 度回す) */
export function gradientEnd(c: OklchTriple): OklchTriple;
export const GRADIENT_SHIFT: number;
export const BASE: Record<"light" | "dark", Record<"bg" | "surface" | "onLight" | "onDark", OklchTriple>>;
