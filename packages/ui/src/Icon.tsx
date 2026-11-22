import { useLayoutEffect, useState, type FC } from "react";
import {
  AddIcon, ArrowDownIcon, ArrowUpIcon, CalendarIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  ChevronUpIcon, ClockIcon, CloseIcon, CopyIcon, DragIcon, ErrorIcon, FileIcon, InboxIcon, InfoIcon, NoteIcon,
  PausedIcon, PulseIcon, RemoveIcon, SearchIcon, SortIcon, StaleIcon, StoppedIcon, SuccessIcon, UploadIcon, UserIcon,
  WarningIcon, WorkingIcon, iconLoaders, type IconName, type IconProps as BaseIconProps,
} from "knowidea-icons/react";
import { cx } from "./utils.js";

export type { IconName };

type IconComponent = FC<BaseIconProps>;

export interface IconProps extends Omit<BaseIconProps, "title"> {
  name: IconName;
  /** 意味を持つときだけ付ける。無ければ装飾として隠す(読み上げない) */
  label?: string;
}

/**
 * このライブラリの部品が中で使うアイコン。最初から持ち、すぐ描く。
 * ここに無い名前は、初めて描く時に名前ごとの塊を読む。全部の絵を最初の JS に入れないため
 */
const BUILT_IN: Partial<Record<IconName, IconComponent>> = {
  add: AddIcon, "arrow-down": ArrowDownIcon, "arrow-up": ArrowUpIcon, calendar: CalendarIcon, check: CheckIcon,
  "chevron-down": ChevronDownIcon, "chevron-left": ChevronLeftIcon, "chevron-right": ChevronRightIcon,
  "chevron-up": ChevronUpIcon, clock: ClockIcon, close: CloseIcon, copy: CopyIcon, drag: DragIcon, error: ErrorIcon,
  file: FileIcon, inbox: InboxIcon, info: InfoIcon, note: NoteIcon, paused: PausedIcon, pulse: PulseIcon,
  remove: RemoveIcon, search: SearchIcon, sort: SortIcon, stale: StaleIcon, stopped: StoppedIcon, success: SuccessIcon,
  upload: UploadIcon, user: UserIcon, warning: WarningIcon, working: WorkingIcon,
};

/** 名前から部品を引く表。最初から持つ物と registerIcons で足した物が入り、サーバーとブラウザで同じ最初の描画になる */
const registry = new Map<IconName, IconComponent>(Object.entries(BUILT_IN) as [IconName, IconComponent][]);

/** 読み終えた部品。最初の描画には使わず (hydration の食い違いを出さない)、描いた後に替える */
const loadedIcons = new Map<IconName, IconComponent>();

/**
 * 使う側のアプリが最初の画面で使うアイコンを足す。足した物は読み込みを待たずにすぐ描く。
 * 部品は `knowidea-icons/react` の名前ごとの物 (例 `HomeIcon`) を渡す
 *
 * @param icons 名前と部品の組
 */
export function registerIcons(icons: Partial<Record<IconName, IconComponent>>): void {
  for (const [name, component] of Object.entries(icons) as [IconName, IconComponent | undefined][]) {
    if (component) registry.set(name, component);
  }
}

/**
 * `packages/icons`(workspace の `icons`)の部品を、`ki-icon`(1.25em、currentColor)で包む。
 * 表に無い名前は読み終えるまで同じ大きさの空きを描き、読み終えたら絵に替える
 */
export function Icon({ name, label, className, size, ...rest }: IconProps) {
  const [loaded, setLoaded] = useState<{ name: IconName; component: IconComponent }>();
  const Component = registry.get(name) ?? (loaded?.name === name ? loaded.component : undefined);

  // 絵を出す前に替えるので、読み終えた物はちらつかない
  useLayoutEffect(() => {
    if (registry.has(name)) return;
    const cached = loadedIcons.get(name);
    if (cached) {
      setLoaded({ name, component: cached });
      return;
    }
    const load = iconLoaders[name];
    if (!load) return;
    let alive = true;
    load()
      .then((component) => {
        loadedIcons.set(name, component);
        if (alive) setLoaded({ name, component });
      })
      // 読めない時は空きのままにする (画面は止めない)
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [name]);

  if (!Component) {
    // size を渡された時は絵と同じ幅と高さにする。渡されなければ ki-icon の 1.25em
    const box = size === undefined ? undefined : { width: size, height: size };
    return label
      ? <span role="img" aria-label={label} className={cx("ki-icon", className)} style={box} />
      : <span aria-hidden="true" className={cx("ki-icon", className)} style={box} />;
  }
  return <Component title={label} className={cx("ki-icon", className)} size={size} {...rest} />;
}
