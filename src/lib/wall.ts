// Where each tile sits on the wall (server/wall.mjs): from the document's layout, which Dashboard
// can change, or the built-in one when the document has none (a copy kept on the device from
// before the wall came from Dashboard).

import WALL from '../../server/wall.json';
import type { App, Cells, WallLayout } from './types';

export const BUILT_IN = WALL as unknown as WallLayout;

/** Each audience's group on the wall. */
export const GROUP: Record<App['audience'], string> = { public: 'web', private: 'private', owner: 'owner' };

/** A tile's spot as grid-area values per width, and its height in the phone's one column. */
export type Place = { wide: string | null; mid: string | null; narrow: string };

const area = (c: Cells | undefined) => (c ? `${c[1]} / ${c[0]} / span ${c[3]} / span ${c[2]}` : null);

function spot(grid: WallLayout['wide'], group: string, slug: string): Cells | undefined {
  const cells = grid[group];
  return typeof cells === 'object' ? cells[slug] : undefined;
}

/** A tile without a spot on a grid flows in after the placed ones. */
export function placeOf(wall: WallLayout, app: App): Place {
  const group = GROUP[app.audience];
  return {
    wide: area(spot(wall.wide, group, app.slug)),
    mid: area(spot(wall.mid, group, app.slug)),
    narrow: `${wall.narrow.heights[app.slug] ?? wall.narrow.base}px`,
  };
}

/** A group's apps in the phone's order; an app the order doesn't name keeps its place after the named ones. */
export function inOrder(apps: App[], order: string[] | undefined): App[] {
  if (!order) return apps;
  const rank = new Map(order.map((slug, i) => [slug, i]));
  return apps
    .map((app, i) => ({ app, key: rank.get(app.slug) ?? order.length + i }))
    .sort((a, b) => a.key - b.key)
    .map(({ app }) => app);
}

/** The layout's public group only, for the copy kept on the device. */
export function publicOnly(wall: WallLayout | undefined): WallLayout | undefined {
  if (!wall) return undefined;
  const grid = (g: WallLayout['wide']) => ({ columns: g.columns, web: g.web });
  const web = new Set([...(wall.narrow.order?.web ?? []), ...Object.keys((wall.wide.web as Record<string, Cells> | undefined) ?? {})]);
  const heights = Object.fromEntries(Object.entries(wall.narrow.heights).filter(([slug]) => web.has(slug)));
  return { wide: grid(wall.wide), mid: grid(wall.mid), narrow: { base: wall.narrow.base, heights, order: { web: wall.narrow.order?.web ?? [] } } };
}
