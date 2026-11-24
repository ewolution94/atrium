// The wall's layout as one of Dashboard's settings (workspace plans/dashboard.md, Phase 4c): each
// tile's spot on the 12-column grid and the 6-column one, and its order and height in the phone's
// one column. wall.json is the built-in layout, today's wall cell for cell. Dashboard's value
// arrives through Folio's config-server and is checked against the manifest below, so a layout with
// a tile off the grid, on top of another or below its smallest size is refused whole and the
// built-in one stays. With Dashboard unset or down, the wall is wall.json.
//
// A viewer gets the groups they may see and nothing else: a guest's /api/apps never names the
// owner's apps, not even as a spot on a grid.
//
// A draft is the owner's preview (?draft=<id>, opened from Dashboard's wall editor): read from
// Dashboard's apps' port for a signed-in owner only, checked like a value, and shown instead of the
// live layout in that one answer. It's never kept: the next answer without it is the live wall again.
//
// The same manifest takes the family's language and theme (Phase 5): the page gets those two as
// #ewo-config, first in <head> (server.mjs), and a device that hasn't picked starts from them
// (src/lib/defaults.ts). Only those two: the wall names every app, the owner's too, so it never
// goes into the page.

import { readFileSync } from 'node:fs';
import { check, specOf } from '../vendor/ewo/elements/config-core.js';
import { createConfig } from '../vendor/ewo/elements/config-server.js';
import { APPS } from './catalog.mjs';
import { withDeadline } from './deadline.mjs';

export const WALL = JSON.parse(readFileSync(new URL('./wall.json', import.meta.url), 'utf8'));

/** The wall's group for each audience, in the order the page draws them. */
const GROUP = { public: 'web', private: 'private', owner: 'owner' };

/**
 * Each tile's smallest spot in cells, [columns, rows]: measured 2026-11-04 with every tile alone at
 * every size, at the narrowest width each grid runs at. Two columns leave the footer's line a
 * single letter, so three is everyone's smallest; Clinch's standings run into their records below
 * four columns and under the footer below three rows, and Cantina's dish needs two rows.
 */
const MIN = { clinch: [4, 3], cantina: [3, 2] };
const SMALLEST = [3, 1];

const text = (en, de) => ({ en, de });

export const MANIFEST = {
  app: 'atrium',
  version: 1,
  settings: {
    wall: {
      type: 'layout',
      group: text('Wall', 'Wand'),
      label: text('Wall', 'Wand'),
      help: text(
        'The tiles at apps.ewolution.cloud: their spots on a desktop and at mid width, and their order and height on a phone.',
        'Die Kacheln auf apps.ewolution.cloud: ihre Plätze am Desktop und in mittlerer Breite, Reihenfolge und Höhe am Telefon.',
      ),
      grids: { wide: { columns: 12, label: text('Wide', 'Breit') }, mid: { columns: 6, label: text('Mid', 'Mittel') } },
      groups: [
        { id: 'web', label: text('Public', 'Öffentlich') },
        { id: 'private', label: text('Private', 'Privat') },
        { id: 'owner', label: text('Only for you', 'Nur für dich') },
      ],
      tiles: APPS.map((app) => ({ id: app.slug, label: app.name, hint: app.host, group: GROUP[app.audience], min: MIN[app.slug] ?? SMALLEST })),
      heights: [160, 290, 470],
      base: WALL.narrow.base,
      default: WALL,
    },
    lang: { family: true },
    theme: { family: true },
  },
};

/** The settings the page carries as #ewo-config: the family's, never the wall. */
const PAGE = ['lang', 'theme'];

/** A draft's id: 128 random bits, base64url, made by Dashboard's page. */
export const DRAFT_ID = /^[A-Za-z0-9_-]{22}$/;
const SPEC = specOf('wall', MANIFEST.settings.wall);
/** The preview polls every few seconds; a Dashboard that doesn't answer by then leaves the live wall. */
const DRAFT_TIMEOUT = 2500;

/** @param {{ url?: string, log?: (line: string) => void, fetch?: typeof fetch }} [options] */
export function createWall({ url = '', log, fetch: fetcher = globalThis.fetch } = {}) {
  const config = createConfig({ manifest: MANIFEST, url, ...(log && { log }) });

  return {
    start: () => config.start(),
    stop: () => config.stop(),
    /** Changes whenever the values do: a key for caching the page. */
    etag: () => config.etag(),
    /**
     * The page with the family's values as `<script type="application/json" id="ewo-config">`,
     * first in <head>: Folio's `inject`, for the page's settings alone.
     * @param {string} html
     */
    inject(html) {
      const { values } = config.get();
      const json = JSON.stringify(Object.fromEntries(PAGE.map((key) => [key, values[key]]))).replace(/</g, '\\u003c');
      return html.replace(/<head(\s[^>]*)?>/i, (head) => `${head}\n    <script type="application/json" id="ewo-config">${json}</script>`);
    },
    /**
     * A draft of the wall from Dashboard, checked like a value; null when there's none (applied,
     * discarded, a day old), it doesn't fit, or Dashboard doesn't answer.
     * @param {string} id
     */
    async draft(id) {
      if (!url || !DRAFT_ID.test(id)) return null;
      try {
        const value = await withDeadline(DRAFT_TIMEOUT, async (signal) => {
          const res = await fetcher(`${url.replace(/\/+$/, '')}/v1/draft/atrium/${id}`, { signal, headers: { accept: 'application/json' } });
          if (!res.ok) return undefined;
          const body = await res.json();
          return body?.key === 'wall' ? body.value : undefined;
        });
        return value === undefined ? null : (check(SPEC, value) ?? null);
      } catch {
        return null;
      }
    },
    /**
     * The layout for the apps a viewer sees: per grid only their groups and spots, and in one
     * column their order and heights. `draft`, checked, replaces the live one.
     * @param {{ slug: string, audience: string }[]} apps
     * @param {any} [draft]
     */
    for(apps, draft) {
      const wall = draft ?? config.get().values.wall;
      const slugs = new Set(apps.map((app) => app.slug));
      const groups = [...new Set(apps.map((app) => GROUP[app.audience]))];
      const pick = (record = {}) => Object.fromEntries(Object.entries(record).filter(([slug]) => slugs.has(slug)));
      const out = {};
      for (const grid of Object.keys(MANIFEST.settings.wall.grids)) {
        out[grid] = { columns: wall[grid].columns };
        for (const group of groups) out[grid][group] = pick(wall[grid][group]);
      }
      out.narrow = {
        base: wall.narrow.base,
        heights: pick(wall.narrow.heights),
        order: Object.fromEntries(groups.map((group) => [group, wall.narrow.order[group].filter((slug) => slugs.has(slug))])),
      };
      return out;
    },
  };
}
