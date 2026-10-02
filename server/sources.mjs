// Live data for the tiles. This server fetches it from the apps themselves (over the LAN on the
// NAS, see the env table in the README) and hands the browser a small summary, so the page only
// ever talks to its own origin and the apps need no changes for it.
//
// Each source keeps its last good result. A page never waits on a slow app for long: a cold
// source gets a couple of seconds, after that the tile renders without its data and fills in on
// the next poll. A failed refresh keeps the old result (marked stale once it's old) and is
// retried after a short pause, so one bad minute upstream doesn't stick until a restart.
//
// No dependencies.

const BERLIN = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' });
/** The calendar date in Berlin, YYYY-MM-DD: Cantina's dates are local. */
export const berlinDate = (ms) => BERLIN.format(new Date(ms));

const DAY = 86_400_000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms).unref?.());

/**
 * A value with a time to live, loaded single-flight: concurrent readers share one load.
 * @template T
 * @param {() => Promise<T>} load
 * @param {{ ttl: number, retry?: number, now?: () => number, name?: string }} options
 */
export function cached(load, { ttl, retry = 30_000, now = Date.now, name = 'source' }) {
  /** @type {{ value: T, at: number } | null} */
  let last = null;
  /** @type {Promise<void> | null} */
  let pending = null;
  let failedAt = -Infinity;

  function refresh() {
    pending ??= load()
      .then((value) => {
        last = { value, at: now() };
      })
      .catch((error) => {
        failedAt = now();
        console.warn(`${name} failed: ${error?.code ?? error?.message ?? error}`);
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  }

  return {
    /**
     * The last good value (null if there never was one), refreshing it when it's due.
     * @param {{ wait?: number }} [options] how long a reader with nothing cached waits for a load
     */
    async get({ wait = 2500 } = {}) {
      const due = !last || now() - last.at >= ttl;
      if (due && !pending && now() - failedAt >= retry) void refresh();
      if (!last && pending) await Promise.race([pending, sleep(wait)]);
      if (!last) return null;
      return { value: last.value, at: last.at, stale: now() - last.at > ttl * 3 };
    },
  };
}

/** GET a JSON document, with a timeout. Errors carry a code, never the URL (it may be a LAN address). */
async function getJson(fetcher, url, timeout) {
  let res;
  try {
    res = await fetcher(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(timeout) });
  } catch (error) {
    throw Object.assign(new Error('fetch failed'), { code: error?.cause?.code ?? error?.cause?.name ?? error?.name ?? 'FETCH' });
  }
  if (!res.ok) throw Object.assign(new Error('bad status'), { code: `HTTP ${res.status}` });
  return res.json();
}

// --- Clinch: the playoff picture -------------------------------------------------------------

/** Seeds one to eight per conference from Clinch's /api/snapshot (eight shows who's first out). */
export function summarizeClinch(snapshot) {
  const conferences = (snapshot?.conferences ?? []).map((conference) => ({
    id: conference.id,
    seeds: (conference.seeds ?? [])
      .filter((team) => Number.isInteger(team.seed) && team.seed >= 1 && team.seed <= 8)
      .sort((a, b) => a.seed - b.seed)
      .map(({ seed, abbr, record, status }) => ({ seed, abbr, record, status })),
  }));
  return {
    season: snapshot?.season?.year ?? null,
    postseason: snapshot?.season?.type === 3,
    week: snapshot?.week?.number ?? null,
    live: Boolean(snapshot?.live),
    conferences,
  };
}

// --- Cantina: today's dish ---------------------------------------------------------------------

/** The sections a featured dish is taken from, in order of preference: the hot main meals first. */
const FEATURED = ['the-original', 'grill', 'f-t-vegan', 'green'];

/**
 * One dish for the tile: at the given outlet, today if it serves today, else its next day with a
 * menu. Null when the outlet has nothing ahead.
 */
export function summarizeCantina(doc, { outletId, today }) {
  const outlet = doc?.outlets?.find((o) => o.id === outletId) ?? doc?.outlets?.[0];
  if (!outlet) return null;
  const menus = doc.menus?.[outlet.id] ?? {};
  const priced = (section) => section?.dishes?.find((dish) => typeof dish.price === 'number');
  for (const date of (doc.days ?? []).filter((d) => d >= today).sort()) {
    const sections = menus[date] ?? [];
    const section = FEATURED.map((id) => sections.find((s) => s.id === id)).find(priced) ?? sections.find(priced);
    if (!section) continue;
    const dish = priced(section);
    const weekday = (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0, as Cantina's hours
    const name = outlet.name.replace(/^Kochwerk\s+/i, '');
    return {
      outlet: name,
      // Cantina's own route for that outlet and day (its outletSlug()).
      path: `/${outletSlug(name)}/${date}`,
      date,
      today: date === today,
      hours: outlet.hours?.[weekday] ?? [],
      dish: {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        co2: dish.co2?.rating ?? null,
        diet: dish.diet ?? null,
        photo: typeof dish.thumb === 'string' && PHOTO_PATH.test(dish.thumb) ? dish.thumb : null,
      },
    };
  }
  return null;
}

/** Cantina's outletSlug(), from the short name ("Elbe" → "elbe"). */
const outletSlug = (name) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Cantina's own photo proxy paths, the only thing /api/cantina/photo will fetch. */
export const PHOTO_PATH = /^\/img\/KMSLiveRessources\/[A-Za-z0-9_\-/]+\.(?:jpe?g|png|webp)$/;

// --- Pulse: status and uptime ------------------------------------------------------------------

/** Pulse's colours for a day: all checks up, none up, some up, or no checks at all. */
export function dayState(day) {
  if (!day || !day.checks) return 'none';
  if (day.upChecks === day.checks) return 'ok';
  if (day.upChecks === 0) return 'bad';
  return 'warn';
}

/** The last `size` UTC dates ending today, like Pulse's day buckets. */
export function dayWindow(now, size = 90) {
  return Array.from({ length: size }, (_, i) => new Date(now - (size - 1 - i) * DAY).toISOString().slice(0, 10));
}

/**
 * Per Pulse id: the state, the 90-day uptime and one tick per day (date, state, uptime, response time).
 * Only what Pulse publishes on its own public page; the URLs it checks never leave Pulse.
 */
export function summarizePulse(status, now) {
  const dates = dayWindow(now);
  const services = {};
  for (const service of status?.services ?? []) {
    const byDate = new Map((service.days ?? []).map((d) => [d.date, d]));
    services[service.id] = {
      state: service.state ?? 'unknown',
      uptime: service.uptimePct90d ?? null,
      days: dates.map((date) => {
        const day = byDate.get(date);
        return [date, dayState(day), day?.checks ? Math.round((day.upChecks / day.checks) * 1000) / 10 : null, day?.avgResponseMs ?? null];
      }),
    };
  }
  return { overall: status?.overall ?? 'unknown', checkedAt: status?.generatedAt ?? null, services };
}

// --- Wiring ------------------------------------------------------------------------------------

/**
 * @param {{
 *   upstreams: { clinch: string, cantina: string, pulse: string },
 *   cantinaOutlet?: number,
 *   fetch?: typeof fetch, now?: () => number, timeout?: number,
 * }} options
 */
export function createSources({ upstreams, cantinaOutlet = 4, fetch: fetcher = globalThis.fetch, now = Date.now, timeout = 6000 }) {
  const url = (name, path) => new URL(path, upstreams[name]).href;
  const opts = (ttl, name) => ({ ttl, now, name });

  const clinch = cached(async () => summarizeClinch(await getJson(fetcher, url('clinch', '/api/snapshot'), timeout)), opts(5 * 60_000, 'clinch'));
  const cantina = cached(async () => {
    const doc = await getJson(fetcher, url('cantina', '/api/menu'), timeout);
    return summarizeCantina(doc, { outletId: cantinaOutlet, today: berlinDate(now()) });
  }, opts(15 * 60_000, 'cantina'));
  const pulse = cached(async () => summarizePulse(await getJson(fetcher, url('pulse', '/api/status'), timeout), now()), opts(60_000, 'pulse'));

  /** One photo at a time: the featured dish's. @type {{ path: string | null, body: Buffer | null, type: string | null }} */
  let photo = { path: null, body: null, type: null };

  return {
    clinch,
    cantina,
    pulse,

    /** All three, each waiting at most `wait` ms when it has nothing yet. */
    async all({ wait } = {}) {
      const [c, k, p] = await Promise.all([clinch.get({ wait }), cantina.get({ wait }), pulse.get({ wait })]);
      return { clinch: c, cantina: k, pulse: p };
    },

    /**
     * The featured dish's photo, fetched through Cantina's own image proxy. Only the dish the
     * tile currently shows: anything else is a 404, so this never becomes an open proxy.
     * @returns {Promise<{ body: Buffer, type: string } | null>}
     */
    async photo(dishId) {
      const current = (await cantina.get({ wait: 0 }))?.value;
      if (!current || String(current.dish.id) !== String(dishId) || !current.dish.photo) return null;
      if (photo.path === current.dish.photo) return photo;
      let res;
      try {
        res = await fetcher(url('cantina', current.dish.photo), { signal: AbortSignal.timeout(timeout) });
      } catch {
        return null;
      }
      const type = res.headers.get('content-type') ?? '';
      if (!res.ok || !/^image\/(jpeg|png|webp)$/.test(type)) return null;
      photo = { path: current.dish.photo, body: Buffer.from(await res.arrayBuffer()), type };
      return photo;
    },
  };
}
