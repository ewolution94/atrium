// Optional sign-in for the owner. Off unless ATRIUM_ACCESS_TEAM, ATRIUM_ACCESS_AUD and
// ATRIUM_SESSION_SECRET are all set; until then everyone is a guest and the owner's apps
// (catalog.mjs, audience 'owner') never leave the server.
//
// How it works once set up:
//
//   1. A Cloudflare Access application covers only the path apps.ewolution.cloud/login.
//      The rest of the site stays public; Access never sees it.
//   2. /login is reached through Access, which attaches its signed token
//      (Cf-Access-Jwt-Assertion). This server checks the token itself, like Census does,
//      because Access only guards the hostname and the NAS port would skip it.
//   3. A valid token (and, if ATRIUM_OWNERS is set, an email on that list) gets a session
//      cookie signed by this server: HttpOnly, Secure, SameSite=Lax, for SESSION_DAYS. That
//      cookie, not Access's, marks the owner on every other path.
//   4. /logout drops the cookie and ends the Access session too.
//
// The cookie is set only on sign-in; a guest gets none. No dependencies.

import { createHmac, createPublicKey, timingSafeEqual, verify } from 'node:crypto';

export const COOKIE = 'atrium_session';
const SESSION_DAYS = 30;

/**
 * Checks Cloudflare Access tokens (RS256, signed by the team's rotating keys).
 * The same rules as census/server/src/auth.ts.
 */
export class AccessVerifier {
  #keys = new Map();
  #fetchedAt = -Infinity;
  #pending;

  /**
   * @param {string} team e.g. ewolution.cloudflareaccess.com
   * @param {string} aud the Access application's AUD tag
   */
  constructor(team, aud, fetcher = globalThis.fetch, now = Date.now) {
    this.team = team;
    this.aud = aud;
    this.fetcher = fetcher;
    this.now = now;
  }

  /** The signed-in email, or undefined for anything not signed by this team for this app. */
  async verify(token) {
    const [head, body, signature] = (token ?? '').split('.');
    if (!head || !body || !signature) return undefined;
    let header;
    let claims;
    try {
      header = JSON.parse(Buffer.from(head, 'base64url').toString());
      claims = JSON.parse(Buffer.from(body, 'base64url').toString());
    } catch {
      return undefined;
    }
    if (header.alg !== 'RS256' || !header.kid) return undefined;

    let key = this.#keys.get(header.kid);
    // Cloudflare rotates its signing keys; an unknown kid triggers a refresh, at most once a minute.
    if (!key && this.now() - this.#fetchedAt > 60_000) {
      await this.#refresh();
      key = this.#keys.get(header.kid);
    }
    if (!key) return undefined;
    if (!verify('RSA-SHA256', Buffer.from(`${head}.${body}`), key, Buffer.from(signature, 'base64url'))) return undefined;

    const seconds = this.now() / 1000;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audiences.includes(this.aud)) return undefined;
    if (claims.iss !== `https://${this.team}`) return undefined;
    if (typeof claims.exp !== 'number' || claims.exp < seconds - 30) return undefined;
    if (typeof claims.nbf === 'number' && claims.nbf > seconds + 30) return undefined;
    return typeof claims.email === 'string' ? claims.email : undefined;
  }

  #refresh() {
    this.#pending ??= (async () => {
      try {
        const res = await this.fetcher(`https://${this.team}/cdn-cgi/access/certs`);
        if (!res.ok) return;
        const { keys } = await res.json();
        for (const jwk of keys ?? []) {
          if (jwk.kty === 'RSA' && jwk.kid) this.#keys.set(jwk.kid, createPublicKey({ key: { kty: 'RSA', n: jwk.n, e: jwk.e }, format: 'jwk' }));
        }
      } catch {
        // Cloudflare unreachable: sign-ins are refused until it answers again.
      } finally {
        this.#fetchedAt = this.now();
        this.#pending = undefined;
      }
    })();
    return this.#pending;
  }
}

/** The value of one cookie from a Cookie header. */
function readCookie(header, name) {
  for (const part of (header ?? '').split(';')) {
    const eq = part.indexOf('=');
    if (eq > -1 && part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return undefined;
}

/**
 * @param {{
 *   team?: string, aud?: string, secret?: string, owners?: string,
 *   fetch?: typeof fetch, now?: () => number, verifier?: { verify(token?: string): Promise<string | undefined> },
 * }} options owners: comma-separated emails; empty means anyone Access lets through
 */
export function createAuth({ team, aud, secret, owners, fetch: fetcher, now = Date.now, verifier } = {}) {
  const enabled = Boolean(team && aud && secret && secret.length >= 32);
  const access = verifier ?? (enabled ? new AccessVerifier(team, aud, fetcher, now) : null);
  const allowed = new Set(
    (owners ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );

  const sign = (payload) => createHmac('sha256', secret).update(payload).digest('base64url');

  function issue(email) {
    const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(now() / 1000) + SESSION_DAYS * 86_400 })).toString('base64url');
    return `${payload}.${sign(payload)}`;
  }

  /** The owner behind a request, from its session cookie, or null. */
  function viewer(req) {
    if (!enabled) return null;
    const [payload, mac] = (readCookie(req.headers.cookie, COOKIE) ?? '').split('.');
    if (!payload || !mac) return null;
    const given = Buffer.from(mac);
    const wanted = Buffer.from(sign(payload));
    if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;
    try {
      const { email, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
      if (typeof email !== 'string' || typeof exp !== 'number' || exp * 1000 < now()) return null;
      if (allowed.size && !allowed.has(email.toLowerCase())) return null;
      return { email };
    } catch {
      return null;
    }
  }

  const cookie = (value, maxAge) => `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

  /**
   * Answers /login and /logout. Resolves to true when the request was one of them.
   * @param {import('node:http').IncomingMessage} req
   * @param {import('node:http').ServerResponse} res
   */
  async function handle(req, res) {
    const { pathname } = new URL(req.url, 'http://localhost');
    if (pathname !== '/login' && pathname !== '/logout') return false;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end();
      return true;
    }
    const noStore = { 'cache-control': 'no-store' };
    if (!enabled) {
      res.writeHead(404, { ...noStore, 'content-type': 'text/plain; charset=utf-8' }).end('Sign-in is not set up.');
      return true;
    }
    if (pathname === '/logout') {
      // Cloudflare's own endpoint ends the Access session as well, then shows its signed-out page.
      res.writeHead(303, { ...noStore, location: '/cdn-cgi/access/logout', 'set-cookie': cookie('', 0) }).end();
      return true;
    }
    const email = await access.verify(req.headers['cf-access-jwt-assertion']);
    if (!email || (allowed.size && !allowed.has(email.toLowerCase()))) {
      res.writeHead(403, { ...noStore, 'content-type': 'text/plain; charset=utf-8' }).end('Sign in through apps.ewolution.cloud/login.');
      return true;
    }
    res.writeHead(303, { ...noStore, location: '/', 'set-cookie': cookie(issue(email), SESSION_DAYS * 86_400) }).end();
    return true;
  }

  return { enabled, viewer, handle };
}
