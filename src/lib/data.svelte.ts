// The one document the page shows (GET /api/apps), refreshed every minute while the page is
// visible. The last good copy is kept on the device, so the page opens with something even
// offline; it's labelled "Last known" once it's older than a few minutes, never shown as current.

import type { Doc } from './types';

const KEY = 'atrium:last';
const EVERY = 60_000;
/** Older than this, the data on screen is "last known" rather than current. */
const FRESH = 3 * 60_000;

function restore(): Doc | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Doc) : null;
  } catch {
    return null;
  }
}

/** The public part only: the owner's apps and email stay off the disk. */
function keep(doc: Doc) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...doc, viewer: null, apps: doc.apps.filter((a) => a.audience === 'public') }));
  } catch {
    // full or blocked: the next visit just starts empty
  }
}

export const data = $state({ doc: restore(), now: Date.now() });

/** True once what's on screen is too old to call current. */
export const isStale = () => !data.doc || data.now - data.doc.generatedAt > FRESH;

let timer = 0;
let inflight: Promise<void> | null = null;

export function refresh(): Promise<void> {
  inflight ??= (async () => {
    try {
      const res = await fetch('/api/apps', { cache: 'no-store', credentials: 'same-origin' });
      if (!res.ok) return;
      const doc = (await res.json()) as Doc;
      data.doc = doc;
      keep(doc);
    } catch {
      // offline: keep showing what we have
    } finally {
      data.now = Date.now();
      inflight = null;
      schedule();
    }
  })();
  return inflight;
}

function schedule() {
  clearTimeout(timer);
  if (document.visibilityState === 'visible') timer = window.setTimeout(refresh, EVERY);
}

export function start() {
  void refresh();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void refresh();
    else clearTimeout(timer);
  });
  addEventListener('online', () => void refresh());
  setInterval(() => (data.now = Date.now()), 30_000);
}
