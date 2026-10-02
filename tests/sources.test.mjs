import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { berlinDate, cached, dayState, dayWindow, summarizeCantina, summarizeClinch, summarizePulse } from '../server/sources.mjs';

// The fixtures are trimmed copies of the live answers on 2026-10-02.
const fixture = (name) => JSON.parse(readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8'));
const NOW = Date.UTC(2026, 9, 2, 15, 40);

test('Clinch: seeds one to eight per conference, in seed order', () => {
  const tile = summarizeClinch(fixture('clinch-snapshot.json'));
  assert.equal(tile.week, 4);
  assert.equal(tile.season, 2026);
  assert.equal(tile.postseason, false);
  assert.deepEqual(
    tile.conferences.map((c) => c.id),
    ['AFC', 'NFC'],
  );
  const afc = tile.conferences[0].seeds;
  assert.deepEqual(
    afc.map((s) => s.seed),
    [1, 2, 3, 4, 5, 6, 7, 8],
  );
  assert.deepEqual(afc[0], { seed: 1, abbr: 'KC', record: '3-0', status: 'in' });
  assert.equal(afc[7].status, 'bubble');
});

test('Clinch: an empty snapshot gives an empty picture, not an error', () => {
  assert.deepEqual(summarizeClinch({}).conferences, []);
});

test("Cantina: today's main dish at Elbe, from The Original", () => {
  const tile = summarizeCantina(fixture('cantina-menu.json'), { outletId: 4, today: '2026-10-02' });
  assert.equal(tile.outlet, 'Elbe');
  assert.equal(tile.path, '/elbe/2026-10-02');
  assert.equal(tile.today, true);
  assert.deepEqual(tile.hours, [['11:30', '14:00']]);
  assert.equal(tile.dish.id, 249312);
  assert.equal(tile.dish.price, 2.5);
  assert.match(tile.dish.name.de, /Leberkäse/);
  assert.match(tile.dish.photo, /^\/img\/KMSLiveRessources\//);
});

test('Cantina: on a Saturday it shows Monday', () => {
  const tile = summarizeCantina(fixture('cantina-menu.json'), { outletId: 4, today: '2026-10-03' });
  assert.equal(tile.date, '2026-10-05');
  assert.equal(tile.today, false);
  assert.equal(tile.dish.id, 246398);
  assert.equal(tile.dish.photo, null);
});

test('Cantina: an unknown outlet falls back to the first; nothing ahead is null', () => {
  assert.equal(summarizeCantina(fixture('cantina-menu.json'), { outletId: 99, today: '2026-10-02' }).outlet, 'Elbe');
  assert.equal(summarizeCantina(fixture('cantina-menu.json'), { outletId: 4, today: '2026-10-10' }), null);
  assert.equal(summarizeCantina({}, { outletId: 4, today: '2026-10-02' }), null);
});

test('Cantina: only its own image paths are kept as photos', () => {
  const doc = fixture('cantina-menu.json');
  const dish = doc.menus['4']['2026-10-02'].find((s) => s.id === 'the-original').dishes[0];
  for (const thumb of ['/img/KMSLiveRessources/../../etc/passwd.jpg', 'https://elsewhere.example/x.jpg', '/img/other/x.jpg']) {
    dish.thumb = thumb;
    assert.equal(summarizeCantina(doc, { outletId: 4, today: '2026-10-02' }).dish.photo, null, thumb);
  }
});

test('berlinDate is the local calendar date', () => {
  assert.equal(berlinDate(Date.UTC(2026, 9, 2, 22, 30)), '2026-10-03');
  assert.equal(berlinDate(Date.UTC(2026, 0, 1, 22, 30)), '2026-01-01');
});

test("Pulse: a day's colour follows Pulse's own rule", () => {
  assert.equal(dayState(undefined), 'none');
  assert.equal(dayState({ checks: 0, upChecks: 0 }), 'none');
  assert.equal(dayState({ checks: 10, upChecks: 10 }), 'ok');
  assert.equal(dayState({ checks: 10, upChecks: 9 }), 'warn');
  assert.equal(dayState({ checks: 10, upChecks: 0 }), 'bad');
});

test('Pulse: 90 UTC days ending today, per service', () => {
  const dates = dayWindow(NOW);
  assert.equal(dates.length, 90);
  assert.equal(dates.at(-1), '2026-10-02');
  assert.equal(dates[0], '2026-07-05');

  const summary = summarizePulse(fixture('pulse-status.json'), NOW);
  assert.equal(summary.overall, 'operational');
  const clinch = summary.services.clinch;
  assert.equal(clinch.state, 'operational');
  assert.equal(clinch.uptime, 99.9);
  assert.equal(clinch.days.length, 90);
  assert.deepEqual(clinch.days[0].slice(0, 2), ['2026-07-05', 'none']);
  const [date, state, pct] = clinch.days.find((d) => d[0] === '2026-09-17');
  assert.deepEqual([date, state, pct], ['2026-09-17', 'warn', 98.8]);
  // Never the URL Pulse checks.
  assert.doesNotMatch(JSON.stringify(summary), /192\.168|"url"/);
});

test('cached: concurrent readers share one load', async () => {
  let loads = 0;
  let release;
  const source = cached(
    () => {
      loads++;
      return new Promise((resolve) => (release = () => resolve('value')));
    },
    { ttl: 1000 },
  );
  const reads = [source.get({ wait: 1000 }), source.get({ wait: 1000 })];
  release();
  const [a, b] = await Promise.all(reads);
  assert.equal(loads, 1);
  assert.equal(a.value, 'value');
  assert.equal(b.value, 'value');
});

test('cached: a failed refresh keeps the last value, marks it stale later, and retries after a pause', async () => {
  let clock = 0;
  let fail = false;
  let loads = 0;
  const source = cached(
    async () => {
      loads++;
      if (fail) throw Object.assign(new Error('down'), { code: 'ECONNREFUSED' });
      return loads;
    },
    { ttl: 100, retry: 1000, now: () => clock },
  );
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.equal((await source.get()).value, 1);
    fail = true;
    clock = 150; // due: refresh fails in the background, the old value is served
    assert.equal((await source.get()).value, 1);
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(loads, 2);
    clock = 400; // past three TTLs, inside the retry pause
    const old = await source.get();
    assert.equal(old.stale, true);
    assert.equal(loads, 2);
    fail = false;
    clock = 1200; // pause over: retried
    await source.get();
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(loads, 3);
    assert.equal((await source.get()).value, 3);
  } finally {
    console.warn = warn;
  }
});

test('cached: a cold reader gives up after `wait` and gets null', async () => {
  const source = cached(() => new Promise(() => {}), { ttl: 1000 });
  const started = Date.now();
  assert.equal(await source.get({ wait: 50 }), null);
  assert.ok(Date.now() - started < 1000);
});
