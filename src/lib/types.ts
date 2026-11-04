// The shape of GET /api/apps (server/api.mjs).

export type Lang = 'en' | 'de';
export type TickState = 'ok' | 'warn' | 'bad' | 'none';
export type ServiceState = 'operational' | 'degraded' | 'down' | 'unknown';

/** One day of uptime: date, colour, uptime in percent, average response time in ms. */
export type Day = [date: string, state: TickState, pct: number | null, ms: number | null];

export type Status = {
  state: ServiceState;
  uptime: number | null;
  days: Day[] | null;
};

export type ClinchTile = {
  season: number | null;
  postseason: boolean;
  week: number | null;
  live: boolean;
  stale: boolean;
  conferences: { id: string; seeds: { seed: number; abbr: string; record: string; status: string }[] }[];
};

export type CantinaTile = {
  outlet: string;
  path: string;
  date: string;
  today: boolean;
  hours: [string, string][];
  stale: boolean;
  dish: {
    id: number;
    name: { de: string; en: string };
    price: number;
    co2: string | null;
    diet: string | null;
    photo: string | null;
  };
};

export type PulseTile = {
  overall: ServiceState;
  checkedAt: number | null;
  up: number;
  of: number;
  ticks: TickState[];
  stale: boolean;
};

export type AaleTile = {
  games: { slug: string; name: string; host: string; ground: [string, string]; ink: string; spark: string; mark: string }[];
  stale: boolean;
};

export type App = {
  slug: string;
  name: string;
  audience: 'public' | 'private' | 'owner';
  url: string | null;
  host: string;
  repo: string | null;
  writeup: string | null;
  stack: string;
  since: number;
  text: Record<Lang, { line: string; desc: string }>;
  status: Status | null;
  tile: ClinchTile | CantinaTile | PulseTile | AaleTile | null;
};

/** A tile's spot on a grid in cells (server/wall.mjs): column, row, width, height. */
export type Cells = [column: number, row: number, width: number, height: number];
/** The wall's layout for the apps in the document: per grid each group's spots, and the phone's column. */
export type WallLayout = {
  wide: { columns: number } & Record<string, Record<string, Cells> | number>;
  mid: { columns: number } & Record<string, Record<string, Cells> | number>;
  narrow: { base: number; heights: Record<string, number>; order?: Record<string, string[]> };
};

export type Doc = {
  generatedAt: number;
  login: boolean;
  viewer: { email: string } | null;
  status: { overall: ServiceState; checkedAt: number | null };
  apps: App[];
  /** Missing in a copy kept from before the wall came from Dashboard. */
  wall?: WallLayout;
};
