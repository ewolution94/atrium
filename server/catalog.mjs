// The apps Atrium shows, and what it says about them. Nothing is discovered: an app is here
// because it's listed here.
//
// `audience` decides who sees an entry: 'public' for everyone, 'owner' only for a signed-in
// owner (see auth.mjs). Owner entries never reach a guest's browser, not even their names:
// /api/apps filters on the server.
//
// The lines and descriptions are the landing's (ewolution.cloud, site/index.html and
// site/i18n.js), so the two never say different things about an app. Census and Folio aren't on
// the landing; theirs restate their READMEs.
//
// `pulse` is the app's id in Pulse's services.json, where its status and uptime come from.
// `writeup` is the path of its write-up on the landing. `live: false` hides the Open link.

/** @typedef {{ line: string, desc: string }} Text */
/**
 * @typedef {{
 *   slug: string, name: string, audience: 'public' | 'owner',
 *   host: string, live?: false, pulse: string | null, repo: string | null, writeup: string | null,
 *   stack: string, since: number, text: { en: Text, de: Text },
 * }} App
 */

/** @type {App[]} */
export const APPS = [
  {
    slug: 'clinch',
    name: 'Clinch',
    audience: 'public',
    host: 'clinch.ewolution.cloud',
    pulse: 'clinch',
    repo: 'https://github.com/ewolution94/clinch',
    writeup: '/clinch/',
    stack: 'React · TypeScript',
    since: 2026,
    text: {
      en: {
        line: 'NFL standings and the playoff picture on one screen',
        desc: 'All eight divisions, seeds one to seven per conference, and the cut line drawn as a real object. Clinched and eliminated only appear once the math says so; nothing is projected. The bracket fills in as games are played, and you can try results of your own.',
      },
      de: {
        line: 'NFL-Tabellen und das Playoff-Bild auf einem Bildschirm',
        desc: 'Alle acht Divisions, die Seeds eins bis sieben pro Conference und die Playoff-Grenze als echte Linie. Qualifiziert oder ausgeschieden steht erst da, wenn es rechnerisch feststeht; hochgerechnet wird nichts. Der Turnierbaum füllt sich mit jedem gespielten Spiel, und eigene Ergebnisse lassen sich durchspielen.',
      },
    },
  },
  {
    slug: 'planum',
    name: 'Planum',
    audience: 'public',
    host: 'planum.ewolution.cloud',
    pulse: 'planum',
    repo: 'https://github.com/ewolution94/room-play-space',
    writeup: '/planum/',
    stack: 'React · Three.js',
    since: 2025,
    text: {
      en: {
        line: 'Floor plans in 2D and 3D, sloped ceilings included',
        desc: 'Built for real homes: attic rooms where the ceiling drops to 1.2 m, hallways that bend, wardrobes that have to fit. Lay rooms out on a 2D canvas, walk through them in 3D, and furnish them from 208 presets with real dimensions. Everything stays in your own browser.',
      },
      de: {
        line: 'Grundrisse in 2D und 3D, Dachschrägen inklusive',
        desc: 'Gemacht für echte Wohnungen: Dachzimmer, in denen die Decke auf 1,20 m abfällt, Flure mit Knick, Schränke, die passen müssen. Räume auf einer 2D-Fläche anlegen, in 3D durchlaufen und mit 208 Möbeln in echten Maßen einrichten. Alles bleibt im eigenen Browser.',
      },
    },
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    audience: 'public',
    host: 'pulse.ewolution.cloud',
    // Pulse doesn't check itself; its state is whether it answered us (sources.mjs).
    pulse: null,
    repo: 'https://github.com/ewolution94/pulse',
    writeup: '/pulse/',
    stack: 'React · Express',
    since: 2026,
    text: {
      en: {
        line: 'Live status and 90-day uptime for self-hosted apps',
        desc: 'Each app gets an HTTP check once a minute, and its latest checks decide between operational, degraded and down. Every app keeps 90 days of uptime, and the page updates live. Only the apps listed in one config file are checked; nothing is discovered.',
      },
      de: {
        line: 'Live-Status und 90 Tage Verfügbarkeit für selbst gehostete Apps',
        desc: 'Jede App wird einmal pro Minute per HTTP geprüft, und ihre letzten Prüfungen entscheiden zwischen in Betrieb, eingeschränkt und ausgefallen. Für jede App bleiben 90 Tage Verfügbarkeit gespeichert, und die Seite aktualisiert sich live. Geprüft wird nur, was in einer Konfigurationsdatei steht; nichts wird automatisch gefunden.',
      },
    },
  },
  {
    slug: 'cantina',
    name: 'Cantina',
    audience: 'public',
    host: 'cantina.ewolution.cloud',
    pulse: 'cantina',
    repo: 'https://github.com/ewolution94/cantina',
    writeup: '/cantina/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'The canteen menu at work: every outlet, both weeks, in German and English',
        desc: 'The canteen’s own menu service can’t be called from a browser, so a small Node server fetches it, cleans up names written for the till and serves the week as one 15 KB document. Dishes come with the kitchen’s photo or a generated dot plate, a CO₂ rating, allergens and the price. Filters dim what doesn’t fit, and an overview puts every outlet’s menu on one page.',
      },
      de: {
        line: 'Der Kantinen-Speiseplan bei der Arbeit: alle Standorte, beide Wochen, auf Deutsch und Englisch',
        desc: 'Der Speiseplan-Dienst der Kantine lässt sich nicht aus dem Browser abrufen, also holt ihn ein kleiner Node-Server, räumt die für die Kasse geschriebenen Namen auf und liefert die Woche als ein 15 KB großes Dokument. Gerichte kommen mit dem Foto der Küche oder einem generierten Punkte-Teller, CO₂-Bewertung, Allergenen und Preis. Filter blenden ab, was nicht passt, und eine Übersicht zeigt den Plan aller Standorte auf einer Seite.',
      },
    },
  },
  {
    slug: 'axioma',
    name: 'Axioma',
    audience: 'public',
    host: 'axioma.ewolution.cloud',
    pulse: 'axioma',
    repo: null,
    writeup: '/axioma/',
    stack: 'Svelte · Express · Python',
    since: 2026,
    text: {
      en: {
        line: 'A Pokémon card collection with its own Cardmarket price scraper',
        desc: 'It finds each card’s Cardmarket page and reads real listings with the country and condition filters you’d actually use, falling back through sensible tiers instead of leaving blanks. Every price it sees goes into a ledger, so each card carries its own history. Portfolios, analytics and two-page binder spreads sit on top.',
      },
      de: {
        line: 'Eine Pokémon-Kartensammlung mit eigenem Cardmarket-Preis-Scraper',
        desc: 'Für jede Karte findet es die Cardmarket-Seite und liest echte Angebote mit den Länder- und Zustandsfiltern, die man tatsächlich nutzen würde, mit sinnvollen Ausweichstufen statt leerer Felder. Jeder gesehene Preis landet in einem Verlauf, sodass jede Karte ihre eigene Preisgeschichte hat. Darauf aufbauend: Portfolios, Auswertungen und doppelseitige Binder-Ansichten.',
      },
    },
  },
  {
    slug: 'fermata',
    name: 'Fermata',
    audience: 'public',
    host: 'fermata.ewolution.cloud',
    pulse: 'fermata',
    repo: null,
    writeup: '/fermata/',
    stack: 'Svelte · WebCodecs',
    since: 2026,
    text: {
      en: {
        line: 'YouTube to MP3, MP4 and more, processed in the browser',
        desc: 'Downloading, muxing, trimming and tagging all run on your device with WebCodecs and WebAssembly; the server is a small relay that forwards bytes and stores nothing. Albums split into tagged tracks by chapter, and playlists download as a batch.',
      },
      de: {
        line: 'YouTube zu MP3, MP4 und mehr, verarbeitet im Browser',
        desc: 'Download, Muxing, Trimmen und Taggen laufen komplett auf dem eigenen Gerät, mit WebCodecs und WebAssembly; der Server ist nur ein kleines Relay, das Bytes weiterreicht und nichts speichert. Alben werden kapitelweise in getaggte Tracks aufgeteilt, Playlists als Stapel geladen.',
      },
    },
  },

  // --- Only for the owner, once sign-in is set up (auth.mjs). ------------------------------
  {
    slug: 'census',
    name: 'Census',
    audience: 'owner',
    host: 'census.ewolution.cloud',
    pulse: null,
    repo: 'https://github.com/ewolution94/census',
    writeup: null,
    stack: 'React · Express · SQLite',
    since: 2026,
    text: {
      en: {
        line: 'Visit counts for the ewolution.cloud apps, without cookies',
        desc: 'The pages load a small beacon from their own origin. The collector hashes the IP address and user agent with a salt that lives in memory only and is replaced at midnight, then drops both. Opt-outs and known bots aren’t counted, raw events are kept 30 days, and the dashboard shows aggregates only.',
      },
      de: {
        line: 'Besucherzahlen für die ewolution.cloud-Apps, ohne Cookies',
        desc: 'Die Seiten laden ein kleines Beacon von ihrer eigenen Adresse. Der Collector bildet aus IP-Adresse und User-Agent einen Hash mit einem Salt, der nur im Speicher liegt und um Mitternacht ersetzt wird, und verwirft dann beides. Opt-outs und bekannte Bots werden nicht gezählt, Rohdaten bleiben 30 Tage, und das Dashboard zeigt nur Summen.',
      },
    },
  },
  {
    slug: 'folio',
    name: 'Folio',
    audience: 'owner',
    host: 'folio.ewolution.cloud',
    // Prepared on the NAS (port 4500), not routed yet: no Open link until it is.
    live: false,
    pulse: null,
    repo: 'https://github.com/ewolution94/folio',
    writeup: null,
    stack: 'Storybook · Web components',
    since: 2026,
    text: {
      en: {
        line: 'The shared Storybook, design tokens and elements',
        desc: 'A Storybook over every ewolution project, plus the pieces they share: the tokens behind the apps’ colours and type, and native custom elements such as the segmented control and the uptime ticks. Each project keeps a built copy in its own repo, so no build needs a registry or a token.',
      },
      de: {
        line: 'Das gemeinsame Storybook, Design-Tokens und Elemente',
        desc: 'Ein Storybook über alle ewolution-Projekte, dazu die Teile, die sie gemeinsam nutzen: die Tokens hinter Farben und Schrift der Apps und native Custom Elements wie das Segmented Control und die Uptime-Ticks. Jedes Projekt hält eine gebaute Kopie im eigenen Repo, kein Build braucht eine Registry oder ein Token.',
      },
    },
  },
];

/** The entries a viewer may see: everyone gets the public ones, an owner all of them. */
export function visibleApps(isOwner) {
  return APPS.filter((app) => app.audience === 'public' || isOwner);
}
