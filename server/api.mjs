// Atrium's API, shared by the production server (server.mjs) and the Vite dev server
// (vite.config.ts), so both behave the same. No dependencies.
//
//   GET /api/apps                 every app this viewer may see, with its status and tile data
//   GET /api/cantina/photo?d=<id> the featured dish's photo, same-origin (the CSP stays 'self')
//   GET /login, /logout           the optional owner sign-in (auth.mjs)

import { visibleApps } from './catalog.mjs';
import { createSources } from './sources.mjs';
import { createAuth } from './auth.mjs';

const RANK = { none: 0, ok: 1, warn: 2, bad: 3 };

/**
 * Settings from the environment; see the README's table.
 * @param {Record<string, string | undefined>} env
 */
export function readConfig(env) {
  return {
    upstreams: {
      clinch: env.ATRIUM_CLINCH || 'https://clinch.ewolution.cloud',
      cantina: env.ATRIUM_CANTINA || 'https://cantina.ewolution.cloud',
      pulse: env.ATRIUM_PULSE || 'https://pulse.ewolution.cloud',
    },
    cantinaOutlet: Number(env.ATRIUM_CANTINA_OUTLET || 4),
    census: env.ATRIUM_CENSUS || '',
    auth: {
      team: env.ATRIUM_ACCESS_TEAM,
      aud: env.ATRIUM_ACCESS_AUD,
      secret: env.ATRIUM_SESSION_SECRET,
      owners: env.ATRIUM_OWNERS,
    },
  };
}

const json = (res, status, body, headers = {}) => {
  const text = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(text);
};

/**
 * @param {ReturnType<typeof readConfig>} config
 * @param {{ fetch?: typeof fetch, now?: () => number, verifier?: object }} [deps]
 */
export function createApi(config, deps = {}) {
  const now = deps.now ?? Date.now;
  const sources = createSources({ upstreams: config.upstreams, cantinaOutlet: config.cantinaOutlet, fetch: deps.fetch, now });
  const auth = createAuth({ ...config.auth, fetch: deps.fetch, now, verifier: deps.verifier });

  /** What a tile shows besides the app's facts: live data for three of them, nothing for the rest. */
  function tileFor(slug, { clinch, cantina, pulse }, statuses) {
    if (slug === 'clinch' && clinch) return { ...clinch.value, stale: clinch.stale };
    if (slug === 'cantina' && cantina?.value) {
      const { dish, ...rest } = cantina.value;
      const photo = dish.photo ? `/api/cantina/photo?d=${encodeURIComponent(dish.id)}` : null;
      return { ...rest, dish: { ...dish, photo }, stale: cantina.stale };
    }
    if (slug === 'pulse' && pulse) {
      // One tick per day for all the apps together: the worst any of them had.
      const days = statuses.filter((s) => s?.days).map((s) => s.days);
      const ticks = (days[0] ?? []).map((_, i) => days.reduce((worst, list) => (RANK[list[i][1]] > RANK[worst] ? list[i][1] : worst), 'none'));
      const up = statuses.filter((s) => s?.state === 'operational').length;
      return { overall: pulse.value.overall, checkedAt: pulse.value.checkedAt, up, of: statuses.length, ticks, stale: pulse.stale };
    }
    return null;
  }

  async function apps(req) {
    const viewer = auth.viewer(req);
    const data = await sources.all({ wait: 2500 });
    const services = data.pulse?.value.services ?? {};
    const pulseState = data.pulse && !data.pulse.stale ? 'operational' : 'unknown';
    const list = visibleApps(Boolean(viewer));
    const statuses = list.filter((a) => a.pulse).map((a) => services[a.pulse] ?? null);

    return {
      generatedAt: now(),
      login: auth.enabled,
      viewer,
      status: {
        overall: data.pulse ? data.pulse.value.overall : 'unknown',
        checkedAt: data.pulse?.value.checkedAt ?? null,
      },
      apps: list.map((app) => ({
        slug: app.slug,
        name: app.name,
        audience: app.audience,
        url: app.live === false ? null : `https://${app.host}/`,
        host: app.host,
        repo: app.repo,
        writeup: app.writeup ? `https://ewolution.cloud${app.writeup}` : null,
        stack: app.stack,
        since: app.since,
        text: app.text,
        status: app.pulse ? (services[app.pulse] ?? null) : app.slug === 'pulse' ? { state: pulseState, uptime: null, days: null } : null,
        tile: tileFor(app.slug, data, statuses),
      })),
    };
  }

  /**
   * Resolves to true when the request was the API's and has been answered.
   * @param {import('node:http').IncomingMessage} req
   * @param {import('node:http').ServerResponse} res
   */
  return async function handle(req, res) {
    if (await auth.handle(req, res)) return true;
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return false;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { allow: 'GET, HEAD' }).end();
      return true;
    }

    if (url.pathname === '/api/apps') {
      // The answer depends on the session cookie: never share it between viewers.
      json(res, 200, await apps(req), { vary: 'cookie' });
      return true;
    }

    if (url.pathname === '/api/cantina/photo') {
      const photo = await sources.photo(url.searchParams.get('d') ?? '');
      if (!photo) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
        return true;
      }
      // The URL names the dish, so a new dish is a new URL.
      res.writeHead(200, { 'content-type': photo.type, 'content-length': photo.body.length, 'cache-control': 'public, max-age=86400' });
      res.end(req.method === 'HEAD' ? undefined : photo.body);
      return true;
    }

    json(res, 404, { error: 'not found' });
    return true;
  };
}
