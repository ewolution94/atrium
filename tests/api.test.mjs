import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { createApi, readConfig } from '../server/api.mjs';

const fixture = (name) => readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8');
const NOW = Date.UTC(2026, 9, 2, 15, 40);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);

/** The three apps, as seen over the LAN, plus Cantina's image proxy. */
const requested = [];
async function upstream(url) {
  const { host, pathname } = new URL(url);
  requested.push(`${host}${pathname}`);
  const body = {
    'clinch.lan/api/snapshot': fixture('clinch-snapshot.json'),
    'cantina.lan/api/menu': fixture('cantina-menu.json'),
    'pulse.lan/api/status': fixture('pulse-status.json'),
  }[`${host}${pathname}`];
  if (body) return new Response(body, { headers: { 'content-type': 'application/json' } });
  if (host === 'cantina.lan' && pathname.startsWith('/img/')) return new Response(JPEG, { headers: { 'content-type': 'image/jpeg' } });
  return new Response('nope', { status: 404 });
}

const config = readConfig({ ATRIUM_CLINCH: 'http://clinch.lan', ATRIUM_CANTINA: 'http://cantina.lan', ATRIUM_PULSE: 'http://pulse.lan' });
let base;
let server;

before(async () => {
  // Sign-in on, with a stand-in for Cloudflare's check.
  const api = createApi(
    { ...config, auth: { team: 'team.example', aud: 'aud', secret: 's'.repeat(40) } },
    { fetch: upstream, now: () => NOW, verifier: { verify: async (t) => (t === 'good' ? 'owner@example.com' : undefined) } },
  );
  server = http.createServer(async (req, res) => {
    if (!(await api(req, res))) res.writeHead(418).end();
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test('a guest sees the six public apps, with status and live tiles', async () => {
  const res = await fetch(`${base}/api/apps`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.match(res.headers.get('vary'), /cookie/);
  const doc = await res.json();
  assert.equal(doc.login, true);
  assert.equal(doc.viewer, null);
  assert.deepEqual(
    doc.apps.map((a) => a.slug),
    ['clinch', 'planum', 'pulse', 'cantina', 'axioma', 'fermata'],
  );
  assert.equal(doc.status.overall, 'operational');

  const by = Object.fromEntries(doc.apps.map((a) => [a.slug, a]));
  assert.equal(by.clinch.url, 'https://clinch.ewolution.cloud/');
  assert.equal(by.clinch.writeup, 'https://ewolution.cloud/clinch/');
  assert.equal(by.clinch.status.state, 'operational');
  assert.equal(by.clinch.status.days.length, 90);
  assert.equal(by.clinch.tile.conferences[0].seeds[0].abbr, 'KC');
  assert.equal(by.cantina.tile.dish.photo, '/api/cantina/photo?d=249312');
  assert.equal(by.pulse.status.state, 'operational');
  assert.equal(by.pulse.tile.of, 5);
  assert.equal(by.pulse.tile.ticks.length, 90);
  assert.equal(by.planum.tile, null);
  assert.equal(by.axioma.repo, null);
  // Nothing about the owner's apps, and no LAN address anywhere.
  const text = JSON.stringify(doc);
  assert.doesNotMatch(text, /"slug":"(census|folio)"|census\.ewolution|folio\.ewolution|Census|Folio/);
  assert.doesNotMatch(text, /\.lan|192\.168/);
});

test('the owner, signed in, also sees Census and Folio', async () => {
  const login = await fetch(`${base}/login`, { headers: { 'cf-access-jwt-assertion': 'good' }, redirect: 'manual' });
  assert.equal(login.status, 303);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const doc = await (await fetch(`${base}/api/apps`, { headers: { cookie } })).json();
  assert.deepEqual(doc.viewer, { email: 'owner@example.com' });
  const owner = doc.apps.filter((a) => a.audience === 'owner');
  assert.deepEqual(
    owner.map((a) => a.slug),
    ['census', 'folio'],
  );
  assert.equal(owner.find((a) => a.slug === 'folio').url, null);
});

test("the dish photo comes through Cantina's proxy, and only the featured dish's", async () => {
  await fetch(`${base}/api/apps`);
  const ok = await fetch(`${base}/api/cantina/photo?d=249312`);
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get('content-type'), 'image/jpeg');
  assert.deepEqual(Buffer.from(await ok.arrayBuffer()), JPEG);
  assert.ok(requested.some((r) => r.startsWith('cantina.lan/img/KMSLiveRessources/')));
  assert.equal((await fetch(`${base}/api/cantina/photo?d=1`)).status, 404);
  assert.equal((await fetch(`${base}/api/cantina/photo`)).status, 404);
});

test('unknown API paths are 404, writes are 405, the rest is not the API', async () => {
  assert.equal((await fetch(`${base}/api/nope`)).status, 404);
  assert.equal((await fetch(`${base}/api/apps`, { method: 'POST' })).status, 405);
  assert.equal((await fetch(`${base}/clinch`)).status, 418);
});

test('apps that are down upstream still list, without tile data', async () => {
  const api = createApi(readConfig({ ATRIUM_CLINCH: 'http://down.lan', ATRIUM_CANTINA: 'http://down.lan', ATRIUM_PULSE: 'http://down.lan' }), {
    fetch: async () => {
      throw Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } });
    },
    now: () => NOW,
  });
  const s = http.createServer(async (req, res) => void (await api(req, res)));
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  const warn = console.warn;
  console.warn = () => {};
  try {
    const doc = await (await fetch(`http://127.0.0.1:${s.address().port}/api/apps`)).json();
    assert.equal(doc.login, false);
    assert.equal(doc.apps.length, 6);
    assert.equal(doc.status.overall, 'unknown');
    assert.ok(doc.apps.every((a) => a.tile === null));
    assert.equal(doc.apps.find((a) => a.slug === 'pulse').status.state, 'unknown');
  } finally {
    console.warn = warn;
    s.close();
  }
});
