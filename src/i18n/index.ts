/**
 * Two languages, and an honest way of being half-way through.
 *
 * The interface is translated in full and lives in UI below. The dataset is not: it
 * carries something like ten thousand words of design reasoning, and a bad translation
 * of an argument is worse than no translation of it, so those fields take a Localised
 * value that may hold only English. Where that happens the page says so rather than
 * quietly serving English under a Chinese heading — a reader who cannot tell whether a
 * page is untranslated or just written in English has been misled by the switcher.
 */

export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', zh: '中文' };
/** For the html lang attribute, where a region makes the difference readable. */
export const LOCALE_TAGS: Record<Locale, string> = { en: 'en', zh: 'zh-Hant' };

/**
 * A field that may be translated. A plain string is English that has not been
 * translated yet, which is deliberately the shortest thing to write, because most of
 * the dataset is in that state and the type should not make it look finished.
 */
export type Localised<T = string> = T | { en: T; zh: T };

export interface Resolved<T> {
  value: T;
  /** True when this is English shown to a Chinese reader for want of a translation. */
  pending: boolean;
}

export function resolve<T>(field: Localised<T>, locale: Locale): Resolved<T> {
  if (field !== null && typeof field === 'object' && 'en' in (field as object)) {
    const pair = field as { en: T; zh: T };
    return { value: pair[locale], pending: false };
  }
  return { value: field as T, pending: locale !== 'en' };
}

/** The common case: the text, without asking whether it was translated. */
export const say = <T>(field: Localised<T>, locale: Locale): T => resolve(field, locale).value;

/** Counts how many of a page's fields are still English, so the count can be shown. */
export const pendingCount = (fields: Localised<unknown>[], locale: Locale): number =>
  fields.filter((field) => resolve(field, locale).pending).length;

export const isLocale = (value: string | undefined): value is Locale =>
  value !== undefined && (LOCALES as readonly string[]).includes(value);

/** Every page is under its locale, including the default one, so no route is special. */
export function localeHref(locale: Locale, path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const tail = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${tail}` || '/';
}

/** The same page in the other language, for the switcher. */
export function swapLocale(pathname: string, to: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const rest = withoutBase.replace(/^\/(en|zh)(?=\/|$)/, '') || '/';
  return localeHref(to, rest);
}

/** Reads the locale out of a URL, for components that are given no props. */
export function localeOf(url: URL): Locale {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const path = base && url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
  const first = path.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * The interface, in both languages.
 *
 * Kept as one object rather than one file per locale so that a string added on one side
 * and forgotten on the other is a type error instead of a blank on the page.
 */
const DICTIONARY = {
  nav: {
    projects: { en: 'Projects', zh: '專案' },
    catalogue: { en: 'Catalogue', zh: '物件目錄' },
    styles: { en: 'Styles', zh: '色調' },
    audit: { en: 'Audit', zh: '檢查' },
    method: { en: 'Method', zh: '丈量方法' },
    planner: { en: 'Planner', zh: '平面工具' },
    menu: { en: 'Menu', zh: '選單' },
    skip: { en: 'Skip to content', zh: '跳至內容' },
    language: { en: 'Language', zh: '語言' },
  },
  home: {
    tagline: { en: 'Interiors drawn from their dimensions', zh: '從尺寸畫出來的室內設計' },
    enter: { en: 'Open the plan', zh: '看平面圖' },
    allProjects: { en: 'All projects', zh: '所有專案' },
    designsToCompare: { en: 'Designs to compare', zh: '可比較的設計' },
    compareAll: { en: 'Compare all', zh: '全部比較' },
    tryPlanner: { en: 'Draw your own room', zh: '畫你自己的房間' },
    plannerNote: {
      en: 'Enter a room’s dimensions and get the same drawing and the same checks as everything else here.',
      zh: '輸入房間尺寸，就會得到跟這裡其他圖一樣的畫法和一樣的檢查。',
    },
  },
  common: {
    rooms: { en: 'Rooms', zh: '空間' },
    designs: { en: 'Designs', zh: '設計' },
    floor: { en: 'Floor', zh: '面積' },
    envelope: { en: 'Envelope', zh: '外圍' },
    conflicts: { en: 'conflicts', zh: '衝突' },
    findings: { en: 'Findings', zh: '檢查結果' },
    nothingFlagged: { en: 'Nothing flagged', zh: '沒有問題' },
    openQuestions: { en: 'Still open', zh: '待確認' },
    schedule: { en: 'Schedule', zh: '物件清單' },
    preferred: { en: 'Preferred', zh: '首選' },
    untranslated: {
      en: '',
      zh: '以下說明尚未翻譯，暫以英文顯示。',
    },
  },
  planner: {
    title: { en: 'Draw a room', zh: '畫一個房間' },
    lede: {
      en: 'The same engine that draws every plan on this site, running here. Nothing is sent anywhere: it is all worked out in the page.',
      zh: '這裡跑的是畫出本站每一張平面圖的同一套引擎。沒有任何資料被送出，全部在頁面裡算完。',
    },
    width: { en: 'Width, east–west', zh: '東西向寬度' },
    depth: { en: 'Depth, north–south', zh: '南北向深度' },
    wall: { en: 'Wall thickness', zh: '牆厚' },
    addPiece: { en: 'Add a piece', zh: '加入物件' },
    remove: { en: 'Remove', zh: '移除' },
    rotation: { en: 'Facing', zh: '朝向' },
    coverage: { en: 'Furniture covers', zh: '家具覆蓋' },
    exportTitle: { en: 'As data', zh: '匯出成資料' },
    exportNote: {
      en: 'This is the format the rest of the site is written in. Paste it into the dataset and the room becomes a project of its own.',
      zh: '這就是本站其他部分所使用的格式。貼進資料集，這個房間就會變成一個正式專案。',
    },
    copy: { en: 'Copy', zh: '複製' },
    copied: { en: 'Copied', zh: '已複製' },
  },
} as const;

type Dictionary = typeof DICTIONARY;
type Section = keyof Dictionary;

/** Flattens the dictionary for one locale, so a page reads strings(locale).nav.projects. */
export function strings(locale: Locale) {
  const out = {} as { [S in Section]: { [K in keyof Dictionary[S]]: string } };
  for (const section of Object.keys(DICTIONARY) as Section[]) {
    const entries = DICTIONARY[section] as Record<string, Record<Locale, string>>;
    const translated: Record<string, string> = {};
    for (const [key, pair] of Object.entries(entries)) translated[key] = pair[locale];
    out[section] = translated as never;
  }
  return out;
}
