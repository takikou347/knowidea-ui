// 素の HTML の例で使う。sprite(Base.astro が body の頭に置く)の <use> を返す。
export const ic = (name, extra = "") => `<svg class="ki-icon" aria-hidden="true"${extra}><use href="#${name}"/></svg>`;
export const status = (tone, icon, text, size) => `<span class="ki-status"${tone ? ` data-tone="${tone}"` : ""}${size ? ` data-size="${size}"` : ""}>${ic(icon)}${text}</span>`;
