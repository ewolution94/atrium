// English and German, following the browser until a language is picked in Settings. The choice
// is kept under `ewo:lang` (the landing's key; System removes it); public/boot.js applies it
// before first paint.

import { themeShift } from '../../vendor/ewo/elements/theme-shift.js';
import type { Lang } from './types';

const KEY = 'ewo:lang';

export type LangPref = 'system' | Lang;

const browser = (): Lang => (navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en');

function storedPref(): LangPref {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'en' || stored === 'de') return stored;
  } catch {
    // storage blocked: follow the browser
  }
  return 'system';
}

const resolve = (pref: LangPref): Lang => (pref === 'system' ? browser() : pref);

/** `pref`: the choice in Settings. `lang`: the language on screen, which follows it. */
export const i18n = $state({ pref: storedPref(), lang: resolve(storedPref()) });

function show(lang: Lang) {
  i18n.lang = lang;
  document.documentElement.lang = lang;
}

/**
 * A pick in Settings. When it changes the language on screen, the page blurs for a moment while the
 * new one comes in (Folio's themeShift, like a theme change).
 */
export function setLanguage(pref: LangPref) {
  i18n.pref = pref;
  try {
    if (pref === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // not kept, still applied
  }
  const next = resolve(pref);
  if (next !== i18n.lang) themeShift(() => show(next));
}

// The browser's own language changing under System applies at once.
addEventListener('languagechange', () => {
  if (i18n.pref === 'system') show(browser());
});

const STRINGS = {
  en: {
    apps: 'apps',
    allOperational: 'All operational',
    degraded: '{n} degraded',
    down: '{n} down',
    statusUnknown: 'Status unknown',
    checked: 'Checked {time}',
    lastKnown: 'Last known, {time}',
    open: 'Open',
    howItWorks: 'How it works',
    source: 'Source',
    allApps: 'All apps',
    kind: 'Kind',
    webApp: 'Web app',
    stack: 'Stack',
    since: 'Since',
    address: 'Address',
    uptime: 'Uptime',
    days90: '90 days',
    daysAgo: '90 days ago',
    today: 'Today',
    wall: 'Wall',
    icons: 'Icons',
    layout: 'Layout',
    search: 'Search',
    openApp: 'Open an app',
    move: 'move',
    details: 'details',
    close: 'Close',
    settings: 'Settings',
    general: 'General',
    private: 'Private',
    yours: 'Only for you',
    signIn: 'Sign in',
    signOut: 'Sign out',
    notLive: 'Not live yet',
    theme: 'Theme',
    week: 'Week {n}',
    playoffs: 'Playoffs',
    playoffPicture: 'Playoff picture',
    live: 'Live',
    upOf: '{up} of {of} up',
    up: 'up',
    pasteLink: 'Paste a YouTube link',
    openInFermata: 'Open in Fermata',
    vegan: 'Vegan',
    vegetarian: 'Vegetarian',
    closed: 'Closed',
    nothing: 'Nothing found',
    statusFrom: 'Status from Pulse',
  },
  de: {
    apps: 'Apps',
    allOperational: 'Alles in Betrieb',
    degraded: '{n} eingeschränkt',
    down: '{n} ausgefallen',
    statusUnknown: 'Status unbekannt',
    checked: 'Geprüft {time}',
    lastKnown: 'Zuletzt bekannt, {time}',
    open: 'Öffnen',
    howItWorks: 'So funktioniert’s',
    source: 'Quellcode',
    allApps: 'Alle Apps',
    kind: 'Art',
    webApp: 'Web-App',
    stack: 'Stack',
    since: 'Seit',
    address: 'Adresse',
    uptime: 'Verfügbarkeit',
    days90: '90 Tage',
    daysAgo: 'vor 90 Tagen',
    today: 'Heute',
    wall: 'Wand',
    icons: 'Symbole',
    layout: 'Ansicht',
    search: 'Suchen',
    openApp: 'App öffnen',
    move: 'wählen',
    details: 'Details',
    close: 'Schließen',
    settings: 'Einstellungen',
    general: 'Allgemein',
    private: 'Privat',
    yours: 'Nur für dich',
    signIn: 'Anmelden',
    signOut: 'Abmelden',
    notLive: 'Noch nicht live',
    theme: 'Design',
    week: 'Woche {n}',
    playoffs: 'Playoffs',
    playoffPicture: 'Playoff-Bild',
    live: 'Live',
    upOf: '{up} von {of} erreichbar',
    up: 'erreichbar',
    pasteLink: 'YouTube-Link einfügen',
    openInFermata: 'In Fermata öffnen',
    vegan: 'Vegan',
    vegetarian: 'Vegetarisch',
    closed: 'Geschlossen',
    nothing: 'Nichts gefunden',
    statusFrom: 'Status von Pulse',
  },
} satisfies Record<Lang, Record<string, string>>;

export type Key = keyof typeof STRINGS.en;

/** A string in the current language, with {name} placeholders filled in. */
export function t(key: Key, vars: Record<string, string | number> = {}): string {
  return STRINGS[i18n.lang][key].replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

const times = new Map<string, Intl.DateTimeFormat>();
function format(lang: Lang, options: Intl.DateTimeFormatOptions) {
  const key = lang + JSON.stringify(options);
  let f = times.get(key);
  if (!f) times.set(key, (f = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { timeZone: 'Europe/Berlin', ...options })));
  return f;
}

/** 17:31, in Berlin time (where the apps and their canteen live). */
export const clock = (ms: number) => format(i18n.lang, { hour: '2-digit', minute: '2-digit' }).format(ms);

/** "Mon" / "Mo" for a YYYY-MM-DD date. */
export const weekday = (date: string) => format(i18n.lang, { weekday: 'short' }).format(new Date(`${date}T12:00:00Z`)).replace(/\.$/, '');

/** "2 Oct" / "2. Okt." for a YYYY-MM-DD date. */
export const dayMonth = (date: string) => format(i18n.lang, { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00Z`));

/** 99.9% / 99,9%: the language's decimal mark, no space before the sign. */
export const percent = (n: number) => `${n.toLocaleString(i18n.lang === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: 1 })}%`;

/** Prices as the user writes them in both languages: 5,80€. */
export const price = (euros: number) => `${euros.toFixed(2).replace('.', ',')}€`;
