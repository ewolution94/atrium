import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { generateKeyPairSync, sign } from 'node:crypto';
import { AccessVerifier, COOKIE, createAuth } from '../server/auth.mjs';

const TEAM = 'ewolution.cloudflareaccess.com';
const AUD = 'aud-tag-for-atrium';
const SECRET = 'x'.repeat(48);
const NOW = Date.UTC(2026, 9, 2, 12);

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1' };
let certFetches = 0;
const fetcher = async (url) => {
  certFetches++;
  assert.equal(url, `https://${TEAM}/cdn-cgi/access/certs`);
  return { ok: true, json: async () => ({ keys: [jwk] }) };
};

function token(claims = {}, header = {}) {
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const head = enc({ alg: 'RS256', kid: 'k1', ...header });
  const body = enc({ aud: [AUD], iss: `https://${TEAM}`, exp: NOW / 1000 + 3600, email: 'owner@example.com', ...claims });
  return `${head}.${body}.${sign('RSA-SHA256', Buffer.from(`${head}.${body}`), privateKey).toString('base64url')}`;
}

/** Runs one request through auth.handle and returns the response. */
async function call(auth, path, headers = {}) {
  const server = http.createServer(async (req, res) => {
    if (!(await auth.handle(req, res))) res.writeHead(418).end();
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    return await fetch(`http://127.0.0.1:${server.address().port}${path}`, { headers, redirect: 'manual' });
  } finally {
    server.close();
  }
}

const enabled = (extra = {}) => createAuth({ team: TEAM, aud: AUD, secret: SECRET, fetch: fetcher, now: () => NOW, ...extra });
const sessionFrom = (res) => res.headers.get('set-cookie').split(';')[0];

test('Access tokens: signature, audience, issuer and expiry are all checked', async () => {
  const v = new AccessVerifier(TEAM, AUD, fetcher, () => NOW);
  assert.equal(await v.verify(token()), 'owner@example.com');
  assert.equal(await v.verify(token({ aud: ['another-app'] })), undefined);
  assert.equal(await v.verify(token({ iss: 'https://evil.cloudflareaccess.com' })), undefined);
  assert.equal(await v.verify(token({ exp: NOW / 1000 - 120 })), undefined);
  assert.equal(await v.verify(token({ nbf: NOW / 1000 + 600 })), undefined);
  assert.equal(await v.verify(token({}, { alg: 'none' })), undefined);
  const [h, b] = token().split('.');
  assert.equal(await v.verify(`${h}.${b}.${Buffer.from('forged').toString('base64url')}`), undefined);
  assert.equal(await v.verify(undefined), undefined);
  assert.equal(await v.verify('not.a.token'), undefined);
});

test('Access tokens: an unknown key id refreshes the keys at most once a minute', async () => {
  let clock = NOW;
  certFetches = 0;
  const v = new AccessVerifier(TEAM, AUD, fetcher, () => clock);
  await v.verify(token({}, { kid: 'unknown' }));
  await v.verify(token({}, { kid: 'unknown' }));
  assert.equal(certFetches, 1);
  clock += 61_000;
  await v.verify(token({}, { kid: 'unknown' }));
  assert.equal(certFetches, 2);
});

test('off by default: no viewer, and /login says so', async () => {
  const auth = createAuth({});
  assert.equal(auth.enabled, false);
  assert.equal(auth.viewer({ headers: { cookie: `${COOKIE}=anything` } }), null);
  assert.equal((await call(auth, '/login')).status, 404);
  // A secret that's too short keeps it off, rather than signing with a weak key.
  assert.equal(createAuth({ team: TEAM, aud: AUD, secret: 'short' }).enabled, false);
});

test('a valid Access token at /login becomes a session cookie', async () => {
  const auth = enabled();
  const res = await call(auth, '/login', { 'cf-access-jwt-assertion': token() });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/');
  const cookie = res.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\//);
  assert.deepEqual(auth.viewer({ headers: { cookie: `theme=dark; ${sessionFrom(res)}` } }), { email: 'owner@example.com' });
});

test('/login refuses a missing or wrong token, and an email not on the owners list', async () => {
  const auth = enabled({ owners: 'someone@example.com, OTHER@example.com' });
  assert.equal((await call(auth, '/login')).status, 403);
  assert.equal((await call(auth, '/login', { 'cf-access-jwt-assertion': token({ aud: 'nope' }) })).status, 403);
  assert.equal((await call(auth, '/login', { 'cf-access-jwt-assertion': token() })).status, 403);
  assert.equal((await call(auth, '/login', { 'cf-access-jwt-assertion': token({ email: 'other@example.com' }) })).status, 303);
});

test('a session cookie is only good if it is ours, unaltered and unexpired', async () => {
  let clock = NOW;
  const auth = enabled({ now: () => clock });
  const cookie = sessionFrom(await call(auth, '/login', { 'cf-access-jwt-assertion': token() }));
  const [name, value] = cookie.split('=');
  const [payload, mac] = value.split('.');
  const forged = Buffer.from(JSON.stringify({ email: 'owner@example.com', exp: 9e9 })).toString('base64url');
  assert.equal(auth.viewer({ headers: { cookie: `${name}=${forged}.${mac}` } }), null);
  assert.equal(auth.viewer({ headers: { cookie: `${name}=${payload}.${mac.slice(0, -2)}xx` } }), null);
  assert.equal(enabled({ secret: 'y'.repeat(48) }).viewer({ headers: { cookie } }), null);
  clock += 31 * 86_400_000;
  assert.equal(auth.viewer({ headers: { cookie } }), null);
});

test('/logout drops the cookie and ends the Access session', async () => {
  const res = await call(enabled(), '/logout');
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/cdn-cgi/access/logout');
  assert.match(res.headers.get('set-cookie'), new RegExp(`^${COOKIE}=;.*Max-Age=0`));
});

test('other paths are not auth’s business', async () => {
  assert.equal((await call(enabled(), '/api/apps')).status, 418);
  assert.equal((await call(enabled(), '/login/extra')).status, 418);
});
