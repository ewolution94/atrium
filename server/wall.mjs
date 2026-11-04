// The wall's layout as one of Dashboard's settings (workspace plans/dashboard.md, Phase 4c): each
// tile's spot on the 12-column grid and the 6-column one, and its order and height in the phone's
// one column. wall.json is the built-in layout, today's wall cell for cell. Dashboard's value
// arrives through Folio's config-server and is checked against the manifest below, so a layout with
// a tile off the grid, on top of another or below its smallest size is refused whole and the
// built-in one stays. With Dashboard unset or down, the wall is wall.json.
//
// A viewer gets the groups they may see and nothing else: a guest's /api/apps never names the
// owner's apps, not even as a spot on a grid.

import { readFileSync } from 'node:fs';
import { createConfig } from '../vendor/ewo/elements/config-server.js';
import { APPS } from './catalog.mjs';

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
  },
};

/** @param {{ url?: string, log?: (line: string) => void }} [options] */
export function createWall({ url = '', log } = {}) {
  const config = createConfig({ manifest: MANIFEST, url, ...(log && { log }) });

  return {
    start: () => config.start(),
    stop: () => config.stop(),
    /**
     * The layout for the apps a viewer sees: per grid only their groups and spots, and in one
     * column their order and heights.
     * @param {{ slug: string, audience: string }[]} apps
     */
    for(apps) {
      const wall = config.get().values.wall;
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
