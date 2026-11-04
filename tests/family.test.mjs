// The family's language and theme from Dashboard (server/wall.mjs's manifest, src/lib/defaults.ts,
// public/boot.js): npm test. The order a setting is decided in: this device's own choice, then
// Dashboard's default, then the built-in one, today's.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { MANIFEST, WALL, createWall } from '../server/wall.mjs';
import { checkManifest, resolve } from '../vendor/ewo/elements/config-core.js';
import { languageFor, themeFor } from '../src/lib/defaults.ts';

const HTML = '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n  </head>\n</html>\n';
const block = (html) => html.match(/<script type="application\/json" id="ewo-config">([^<]*)<\/script>/)?.[1];

test('the manifest takes the family’s language and theme beside the wall, with no default of its own', () => {
  const { ok, problems, manifest } = checkManifest(MANIFEST);
  assert.deepEqual(problems, []);
  assert.ok(ok);
  assert.deepEqual(Object.keys(manifest.settings), ['wall', 'lang', 'theme']);
  assert.deepEqual(manifest.settings.lang, { family: true });
  assert.deepEqual(manifest.settings.theme, { family: true });
});

test('with nothing set in Dashboard, both follow the device: the page as it ships', () => {
  const { values, sources } = resolve(MANIFEST, {});
  assert.equal(values.lang, 'system');
  assert.equal(values.theme, 'system');
  assert.equal(sources.lang, 'built-in');
  assert.equal(sources.theme, 'built-in');
  assert.equal(themeFor('system', values.theme), 'system');
  assert.equal(languageFor('system', values.lang, 'de'), 'de');
  assert.equal(languageFor('system', values.lang, 'en'), 'en');
  // No #ewo-config at all (offline, the dev server): the same.
  assert.equal(themeFor('system', undefined), 'system');
  assert.equal(languageFor('system', undefined, 'de'), 'de');
  // The page gets the two built-in values, first in <head>, and nothing of the wall.
  assert.equal(block(createWall().inject(HTML)), '{"lang":"system","theme":"system"}');
});

test('Dashboard’s family default and this app’s own value reach the page', () => {
  const family = resolve(MANIFEST, { family: { theme: 'dark', lang: 'en' } }).values;
  assert.deepEqual([family.lang, family.theme], ['en', 'dark']);
  const own = resolve(MANIFEST, { family: { theme: 'dark', lang: 'en' }, app: { theme: 'light' } }).values;
  assert.deepEqual([own.lang, own.theme], ['en', 'light']);
});

test('the device’s own choice beats Dashboard’s default, which beats the built-in one', () => {
  assert.equal(themeFor('light', 'dark'), 'light');
  assert.equal(themeFor('system', 'dark'), 'dark');
  assert.equal(themeFor('system', 'system'), 'system');
  assert.equal(themeFor('system', 'purple'), 'system');
  // QA's `ewo:lang` = `en` is this device's own choice, so it keeps winning.
  assert.equal(languageFor('en', 'de', 'de'), 'en');
  assert.equal(languageFor('system', 'en', 'de'), 'en');
  assert.equal(languageFor('system', 'system', 'de'), 'de');
});

test('Dashboard’s language and theme reach the page’s block; the wall, which names the owner’s apps, never does', async () => {
  const dashboard = http.createServer((req, res) => {
    if (req.method === 'PUT' && req.url === '/v1/manifest/atrium') return req.resume().on('end', () => res.writeHead(204).end());
    if (req.url === '/v1/config/atrium') return res.writeHead(200, { 'content-type': 'application/json', etag: '"1"' }).end(JSON.stringify({ family: { theme: 'dark', lang: 'en' }, app: { wall: WALL } }));
    res.writeHead(404).end();
  });
  await new Promise((r) => dashboard.listen(0, '127.0.0.1', r));
  const wall = createWall({ url: `http://127.0.0.1:${dashboard.address().port}`, log: () => {} });
  try {
    const before = wall.etag();
    await wall.start();
    assert.notEqual(wall.etag(), before);
    const page = wall.inject(HTML);
    assert.equal(block(page), '{"lang":"en","theme":"dark"}');
    assert.match(page, /<head>\n {4}<script type="application\/json" id="ewo-config">/);
    assert.doesNotMatch(page, /census|folio|dashboard|clinch/);
  } finally {
    wall.stop();
    dashboard.close();
  }
});

/** public/boot.js against a stub page: the theme and language it applies before first paint. */
function boot({ stored = {}, config, language = 'de-DE' }) {
  const root = { dataset: {}, lang: 'en', classList: { add() {}, remove() {} }, style: { setProperty() {} } };
  const metas = [{ content: '#09090b', media: '(prefers-color-scheme: dark)' }, { content: '#f5f4f1', media: '(prefers-color-scheme: light)' }];
  const document = {
    documentElement: root,
    getElementById: (id) => (id === 'ewo-config' && config ? { textContent: JSON.stringify(config) } : null),
    querySelectorAll: () => metas,
    addEventListener() {},
  };
  vm.runInNewContext(readFileSync(new URL('../public/boot.js', import.meta.url), 'utf8'), {
    document,
    localStorage: { getItem: (key) => stored[key] ?? null },
    matchMedia: () => ({ matches: false }),
    navigator: { language },
    location: { search: '' },
    screen: {},
    addEventListener() {},
    setTimeout() {},
  });
  return { theme: root.dataset.theme, lang: root.lang, colors: metas.map((m) => m.content) };
}

test('before first paint: the saved theme and language, else Dashboard’s, else the system’s and the browser’s', () => {
  assert.deepEqual(boot({}), { theme: undefined, lang: 'de', colors: ['#09090b', '#f5f4f1'] });
  assert.deepEqual(boot({ language: 'en-US', config: { theme: 'system', lang: 'system' } }), { theme: undefined, lang: 'en', colors: ['#09090b', '#f5f4f1'] });
  assert.deepEqual(boot({ config: { theme: 'dark', lang: 'en' } }), { theme: 'dark', lang: 'en', colors: ['#09090b', '#09090b'] });
  assert.deepEqual(boot({ stored: { 'ewo:theme': 'light', 'ewo:lang': 'de' }, config: { theme: 'dark', lang: 'en' } }), { theme: 'light', lang: 'de', colors: ['#f5f4f1', '#f5f4f1'] });
  assert.equal(boot({ stored: { 'ewo:lang': 'en' }, config: { lang: 'de' } }).lang, 'en');
});
