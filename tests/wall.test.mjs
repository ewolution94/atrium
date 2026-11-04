// The wall's layout as Dashboard's setting (server/wall.mjs): npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { APPS, visibleApps } from '../server/catalog.mjs';
import { createApi, readConfig } from '../server/api.mjs';
import { MANIFEST, WALL, createWall } from '../server/wall.mjs';
import { check, checkManifest, resolve } from '../vendor/ewo/elements/config-core.js';

const spec = MANIFEST.settings.wall;
const GROUP = { public: 'web', private: 'private', owner: 'owner' };

test('the manifest is one Dashboard takes, with every app in the catalogue as a tile in its group', () => {
  const { manifest, problems } = checkManifest(MANIFEST);
  assert.deepEqual(problems, []);
  assert.equal(manifest.app, 'atrium');
  assert.deepEqual(
    spec.tiles.map((tile) => [tile.id, tile.group]),
    APPS.map((app) => [app.slug, GROUP[app.audience]]),
  );
  assert.deepEqual(spec.tiles.find((tile) => tile.id === 'clinch').min, [4, 3]);
});

test('with nothing set in Dashboard, the wall is wall.json: every app placed at both widths, in the catalogue’s order on a phone', () => {
  const { values, sources } = resolve(MANIFEST, {});
  assert.equal(sources.wall, 'built-in');
  for (const grid of ['wide', 'mid']) {
    for (const app of APPS) assert.ok(values.wall[grid][GROUP[app.audience]][app.slug], `${app.slug} has no spot at ${grid}`);
    assert.deepEqual(values.wall[grid], WALL[grid]);
  }
  for (const group of spec.groups) {
    assert.deepEqual(values.wall.narrow.order[group.id], APPS.filter((app) => GROUP[app.audience] === group.id).map((app) => app.slug));
  }
  assert.deepEqual(values.wall.narrow.heights, { clinch: 470, pulse: 160 });
});

test('a layout that puts a tile below its smallest size, or on another, is refused whole', () => {
  const moved = structuredClone(WALL);
  [moved.wide.web.planum, moved.wide.web['aale-spiele']] = [moved.wide.web['aale-spiele'], moved.wide.web.planum];
  assert.deepEqual(check(spec, moved).wide.web.planum, [10, 1, 3, 2]);

  const short = structuredClone(WALL);
  short.wide.web.clinch = [1, 1, 6, 2];
  assert.equal(check(spec, short), undefined);

  const narrow = structuredClone(WALL);
  narrow.mid.web.cantina = [1, 7, 2, 2];
  assert.equal(check(spec, narrow), undefined);

  const onTop = structuredClone(WALL);
  onTop.wide.web.pulse = [1, 3, 6, 1];
  assert.equal(check(spec, onTop), undefined);
  assert.deepEqual(resolve(MANIFEST, { app: { wall: onTop } }).values.wall.wide, WALL.wide);
});

test('a guest’s layout names only the apps a guest sees; the owner’s has their group too', () => {
  const wall = createWall();
  const guest = wall.for(visibleApps(false));
  assert.deepEqual(Object.keys(guest.wide), ['columns', 'web', 'private']);
  assert.deepEqual(Object.keys(guest.narrow.order), ['web', 'private']);
  assert.doesNotMatch(JSON.stringify(guest), /census|folio|dashboard/);
  const owner = wall.for(visibleApps(true));
  assert.deepEqual(owner.wide.owner, WALL.wide.owner);
  assert.deepEqual(owner.narrow.order.owner, ['census', 'folio', 'dashboard']);
});

test('Dashboard’s layout reaches /api/apps, for the tiles the viewer sees', async () => {
  const moved = structuredClone(WALL);
  [moved.wide.web.planum, moved.wide.web['aale-spiele']] = [moved.wide.web['aale-spiele'], moved.wide.web.planum];
  moved.narrow = { heights: { planum: 470 }, order: { web: ['linea', 'clinch'] } };
  const answer = { family: {}, app: { wall: moved } };
  const announced = [];
  const dashboard = http.createServer((req, res) => {
    if (req.method === 'PUT' && req.url === '/v1/manifest/atrium') {
      let body = '';
      req.on('data', (chunk) => (body += chunk)).on('end', () => (announced.push(JSON.parse(body)), res.writeHead(204).end()));
      return;
    }
    if (req.url === '/v1/config/atrium') return res.writeHead(200, { 'content-type': 'application/json', etag: '"1"' }).end(JSON.stringify(answer));
    res.writeHead(404).end();
  });
  await new Promise((r) => dashboard.listen(0, '127.0.0.1', r));
  const api = createApi({ ...readConfig({ ATRIUM_CLINCH: 'http://127.0.0.1:9', ATRIUM_CANTINA: 'http://127.0.0.1:9', ATRIUM_PULSE: 'http://127.0.0.1:9', ATRIUM_AALE: 'http://127.0.0.1:9' }), dashboard: `http://127.0.0.1:${dashboard.address().port}` });
  const server = http.createServer(async (req, res) => {
    if (!(await api(req, res))) res.writeHead(418).end();
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const doc = async () => (await fetch(`http://127.0.0.1:${server.address().port}/api/apps`)).json();
  const until = async (ok) => {
    for (let i = 0; i < 100; i++) {
      const d = await doc();
      if (ok(d)) return d;
      await new Promise((r) => setTimeout(r, 50));
    }
    assert.fail('the layout never arrived');
  };
  try {
    const d = await until((d) => d.wall.wide.web.planum[0] === 10);
    assert.equal(announced[0]?.app, 'atrium');
    assert.deepEqual(d.wall.wide.web['aale-spiele'], [7, 1, 3, 2]);
    assert.deepEqual(d.wall.narrow.heights, { planum: 470 });
    assert.deepEqual(d.wall.narrow.order.web.slice(0, 3), ['linea', 'clinch', 'planum']);
    assert.doesNotMatch(JSON.stringify(d.wall), /census|folio|dashboard/);
  } finally {
    api.stop();
    server.close();
    dashboard.close();
  }
});
