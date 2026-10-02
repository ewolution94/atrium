# Atrium

The ewolution apps in one place, at apps.ewolution.cloud. Each app gets a tile that shows a live
glimpse of it: Clinch's current playoff seeds, today's dish at the canteen from Cantina, 90 days of
uptime from Pulse. Apps without data to share show their motif. A tile opens the app's own page
(its write-up line, status, uptime and links), and from there the app itself.

Svelte 5 and Vite in front, a zero-dependency Node server behind, Folio's shared tokens and
elements throughout.

## How it works

- **Nothing is discovered.** The apps are listed in `server/catalog.mjs`, with the landing's own
  line and description for each (English and German), so the two sites never disagree.
- **The server fetches the live data, the browser never does.** `server/sources.mjs` reads
  Clinch's `/api/snapshot`, Cantina's `/api/menu` and Pulse's `/api/status` (over the LAN on the
  NAS), keeps the last good copy of each and serves a small summary as `GET /api/apps`. The page
  only talks to its own origin, so the CSP stays `'self'` and the apps need no changes.
  - A cold source gets 2.5 s, then the tile renders without its data and fills in on the next
    poll. A failed refresh keeps the old data (marked stale once it's three refreshes old) and is
    retried after 30 s.
  - Refreshes: Pulse every minute, Clinch every 5, Cantina every 15.
  - The dish photo comes through `/api/cantina/photo?d=<dish>`, which only ever fetches the
    featured dish's image from Cantina's own image proxy, so it can't be used as an open proxy.
- **Status comes from Pulse.** Each tile's dot, the wall's summary line and an app page's 90 ticks
  are Pulse's states and uptime. Pulse doesn't check itself; its own dot says whether it answered.
- **The page refreshes every minute while visible**, keeps the last good copy on the device, and
  says "Last known" once that copy is more than three minutes old.
- **Two layouts**, a bento wall and app icons like a home screen, kept per device. ⌘K (Ctrl K, or
  `/`) opens a launcher: Enter opens the app, Shift+Enter its page here.
- **An app's page is a page**, not an overlay (`/clinch`): Back works, it scrolls and shares like
  any page. The tile grows into it with a view transition where the browser has them.
- **Calm by default.** The dot field behind the page only draws while the mouse moves; tiles
  animate only while hovered; hover pauses while the page scrolls (`src/lib/scrolling.ts`).

## Sign-in (prepared, off)

Census and Folio are on the catalog with `audience: 'owner'`: they never leave the server for a
guest, not even their names. Signing in shows them on the wall under "Only for you".

It's off until three variables are set. To turn it on:

1. Cloudflare Zero Trust → Access controls → Applications → add a **self-hosted** application for
   `apps.ewolution.cloud` with the **path `login`** only, and a policy that allows the owner's
   email. The rest of the site stays public. (Menus as of October 2026; check them against
   developers.cloudflare.com first, see `learnings/cloudflare.md`.)
2. Copy its AUD tag (Configure → Additional settings).
3. In the Portainer stack, set `ATRIUM_ACCESS_TEAM=ewolution.cloudflareaccess.com`,
   `ATRIUM_ACCESS_AUD=<the tag>`, and `ATRIUM_SESSION_SECRET` to a random string of at least
   32 characters (`openssl rand -base64 48`). Optionally `ATRIUM_OWNERS=<email>`.

Then the footer shows "Sign in". `/login` goes through Access; the server checks Access's token
itself (the NAS port would skip Access), like Census does, and answers with its own signed session
cookie (HttpOnly, Secure, SameSite=Lax, 30 days). `/logout` drops it and ends the Access session.
A guest never gets a cookie.

## Run it

```bash
npm install
npm run dev        # http://localhost:5400, with the same API as production
npm test           # the server: sources, sign-in, API
npm run check      # svelte-check
npm run build && npm start   # the production server on :8080 (or --port 5401)
```

Locally the API reads the apps' public hostnames. On the managed Mac, Node may need
`NODE_USE_SYSTEM_CA=1` for those (`learnings/local-machine.md`); the `atrium-dev` and
`atrium-prod` entries in `development/.claude/launch.json` set it.

## Deploy (NAS)

Like the other apps:

- `ci.yml` runs the typecheck, the tests and the build, then smoke-tests the production server
  with every upstream down (the page and the API still answer, no owner app reaches a guest,
  sign-in is off, the photo route refuses other dishes).
- `docker-publish.yml` gates on `ci.yml`, then pushes `ghcr.io/ewolution94/atrium:latest` for
  amd64 and arm64. A push to `release` is the whole deploy; Watchtower picks it up.
- The NAS runs `deploy/portainer-stack.yml` on port **5400**. It joins the external network
  `ewolution`, where Census listens as `census:4901`.
- Atrium keeps no state, so the stack has no volume.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` / `--port` | `8080` | Listen port |
| `ATRIUM_CLINCH` | `https://clinch.ewolution.cloud` | Where Clinch's API is read (`http://192.168.178.36:4600` on the NAS) |
| `ATRIUM_CANTINA` | `https://cantina.ewolution.cloud` | Where Cantina's API and photos are read |
| `ATRIUM_PULSE` | `https://pulse.ewolution.cloud` | Where Pulse's status is read |
| `ATRIUM_CANTINA_OUTLET` | `4` | The canteen outlet on the tile (4 = Kochwerk Elbe) |
| `ATRIUM_CENSUS` | off | Census's ingest origin, `http://census:4901` on the NAS |
| `ATRIUM_ACCESS_TEAM` | off | Cloudflare Access team domain, for sign-in |
| `ATRIUM_ACCESS_AUD` | off | The Access application's AUD tag |
| `ATRIUM_SESSION_SECRET` | off | Signs the session cookie; at least 32 characters |
| `ATRIUM_OWNERS` | anyone Access allows | Comma-separated emails that count as the owner |

## Adding an app

1. An entry in `server/catalog.mjs` (`audience: 'owner'` to keep it to the owner). Its `pulse` id
   must match the app's id in Pulse's `services.json`.
2. Its icon as `public/apps/<slug>.svg` (from the app's `brand/app-icon.svg`).
3. A motif or a live glimpse in `src/components/viz/`, wired in `src/components/Viz.svelte`.
4. A place in the wall's grid (`src/components/Wall.svelte`, and `PLACED` in `Tile.svelte`);
   without one it flows in after the others.

## Project layout

```
server/
  server.mjs        static files, security headers, /healthz, shutdown
  api.mjs           /api/apps, /api/cantina/photo; shared with the Vite dev server
  catalog.mjs       the apps and what Atrium says about them
  sources.mjs       live data from Clinch, Cantina and Pulse, cached
  auth.mjs          the optional owner sign-in (Cloudflare Access + a signed cookie)
  census.mjs        the forwarder for Census's beacon (/_e, /_e.js)
src/
  App.svelte        the wall or an app's page, the launcher
  components/       Bar, Intro, Wall, Tile, Icons, AppPage, Palette, Uptime, Footer, Field
  components/viz/   one glimpse or motif per app
  lib/              data, route, i18n (EN/DE), transition, field, scrolling, census
public/             boot.js (theme and language before paint), sw.js, manifest, icons, apps/
vendor/ewo/         Folio's tokens, fonts and elements (`npm run vendor -- atrium` in Folio)
brand/              the app icon (Field style, see development/plans/app-icons)
tests/              node --test, with trimmed copies of the apps' real answers in fixtures/
```
