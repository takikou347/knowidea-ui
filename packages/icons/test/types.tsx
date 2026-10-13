import { Icon, ChevronRightIcon, iconNames, type IconName } from "../dist/react/index.js";
const a = <Icon name="chevron-right" size={20} weight="bold" />;
const b = <ChevronRightIcon title="進む" className="x" />;
const n: IconName = iconNames[0];
// @ts-expect-error 知らない名前
const c = <Icon name="nope" />;
export { a, b, c, n };
