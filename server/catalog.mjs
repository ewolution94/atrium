// The apps Atrium shows, and what it says about them. Nothing is discovered: an app is here
// because it's listed here.
//
// `audience` decides who sees an entry: 'public' for everyone; 'private' for everyone too, but in
// its own group on the wall, for apps only invited people can use (a login of their own, like
// Verso's Spotify allow-list); 'owner' only for a signed-in owner (see auth.mjs). Owner entries
// never reach a guest's browser, not even their names: /api/apps filters on the server.
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
 *   slug: string, name: string, audience: 'public' | 'private' | 'owner',
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
  {
    slug: 'aale-spiele',
    name: 'Aale Spiele',
    audience: 'public',
    host: 'aale-spiele.ewolution.cloud',
    pulse: 'aale-spiele',
    repo: 'https://github.com/ewolution94/aale-spiele',
    writeup: '/aale-spiele/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'The games our afternoon meeting plays, and a button that picks one.',
        desc: 'Eleven browser games, from skribbl.io to HaxBall, each with a sentence on how it plays, what kind it is and whether it’s teams or everyone for themselves. “Was spielen wir?” spins a reel through them like a slot machine and stops on one, never the same twice in a row, and a filter narrows the draw to creative, guessing, geo or action games. The games ship with the page, so it works offline.',
      },
      de: {
        line: 'Die Spiele aus unserem Nachmittags-Meeting, und ein Knopf, der eins aussucht.',
        desc: 'Elf Browser-Spiele von skribbl.io bis HaxBall, jedes mit einem Satz dazu, wie es läuft, welche Art es ist und ob in Teams oder jeder gegen jeden. „Was spielen wir?“ dreht eine Walze wie am Spielautomaten durch die Spiele und hält auf einem, nie zweimal hintereinander auf demselben, und ein Filter beschränkt die Auslosung auf kreative, Rate-, Geo- oder Action-Spiele. Die Spiele kommen mit der Seite, also funktioniert sie auch offline.',
      },
    },
  },

  {
    slug: 'tcgsl',
    name: 'TCGSL',
    audience: 'public',
    host: 'tcgsl.ewolution.cloud',
    pulse: 'tcgsl',
    repo: 'https://github.com/ewolution94/tcgsl',
    writeup: '/tcgsl/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Every English and Japanese Pokémon TCG set, newest first, with its logo and its best cards.',
        desc: 'All English sets since Base Set in 1999 and the Japanese ones since 1996, one row each and grouped by year, with a switch between the two lists and a scrubber along the edge on a phone. Each set opens its full card list, led by its three most valuable cards at Cardmarket’s trend price, or by its highest-numbered ones for a Japanese set. A small server resizes every logo and card to the size the page draws and keeps it, so the images of the English list weigh 11 MB instead of 104 MB, and it fetches the sets again once a day.',
      },
      de: {
        line: 'Jedes englische und japanische Pokémon-TCG-Set, das neueste zuerst, mit seinem Logo und seinen besten Karten.',
        desc: 'Alle englischen Sets seit dem Base Set von 1999 und die japanischen seit 1996, eins pro Zeile und nach Jahren gruppiert, mit einem Schalter zwischen den beiden Listen und auf dem Handy einer Leiste am Rand, über die man durch die Jahre fährt. Jedes Set öffnet seine ganze Kartenliste, angeführt von seinen drei wertvollsten Karten zum Cardmarket-Trendpreis, bei einem japanischen Set von denen mit den höchsten Nummern. Ein kleiner Server verkleinert jedes Logo und jede Karte auf die Größe, in der die Seite sie zeigt, und hebt sie auf, sodass die Bilder der englischen Liste 11 MB wiegen statt 104 MB, und er holt die Sets einmal am Tag neu.',
      },
    },
  },

  {
    slug: 'schaetzle',
    name: 'Schätzle',
    audience: 'public',
    host: 'schaetzle.ewolution.cloud',
    pulse: 'schaetzle',
    repo: 'https://github.com/ewolution94/schaetzle',
    writeup: '/schaetzle/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Guess the price of eBay listings together, in four modes: a party game for our afternoon meeting.',
        desc: 'Join a room with its four-letter code, no account needed: guess the price, guess without going over, call higher or lower, or sort four items by price, alone or in teams, with a big-screen view for the meeting room’s projector. Guesses are scored by the ratio: 10% off earns about 850 of 1,000 points, half or double the price earns nothing.',
      },
      de: {
        line: 'Gemeinsam den Preis von eBay-Angeboten schätzen, in vier Spielarten: ein Partyspiel für unser Nachmittags-Meeting.',
        desc: 'Beitreten mit dem Code aus vier Buchstaben, ohne Konto: den Preis schätzen, schätzen ohne drüberzuliegen, teurer oder billiger als der letzte Artikel oder vier Artikel nach Preis sortieren, allein oder in Teams, mit einer Ansicht für den Beamer im Besprechungsraum. Tipps zählen nach dem Verhältnis: 10 % daneben bringt etwa 850 von 1.000 Punkten, der halbe oder doppelte Preis nichts.',
      },
    },
  },

  {
    slug: 'vollmond',
    name: 'Vollmond',
    audience: 'public',
    host: 'vollmond.ewolution.cloud',
    pulse: 'vollmond',
    repo: 'https://github.com/ewolution94/vollmond',
    writeup: '/vollmond/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'The party game Werewolf for our afternoon meeting, with the app as the narrator, on a video call or at one table.',
        desc: 'Found a village, share its four-letter code, and the app deals the cards: werewolves, villagers and eight special roles from the Seer to the Elder, each a woodcut in two inks drawn for the game. It runs the nights and days by itself; at night everyone taps something, so no screen gives a role away. Bots fill a table for trying it out, and a big-screen view is there for sharing.',
      },
      de: {
        line: 'Das Partyspiel Werwolf für unser Nachmittags-Meeting, mit der App als Erzählerin, im Videocall oder am selben Tisch.',
        desc: 'Ein Dorf gründen, den Code aus vier Buchstaben teilen, und die App verteilt die Karten: Werwölfe, Dorfbewohner und acht Sonderrollen von der Seherin bis zum Alten, jede ein Holzschnitt in zwei Farben, gezeichnet für das Spiel. Nächte und Tage laufen von selbst; nachts tippen alle etwas, damit kein Bildschirm eine Rolle verrät. Bots füllen den Tisch zum Ausprobieren, und eine Ansicht für den großen Bildschirm ist zum Teilen da.',
      },
    },
  },

  {
    slug: 'kritzle',
    name: 'Kritzle',
    audience: 'public',
    host: 'kritzle.ewolution.cloud',
    pulse: 'kritzle',
    repo: 'https://github.com/ewolution94/kritzle',
    writeup: '/kritzle/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Draw a word, guess the others’: our own skribbl.io for the afternoon meeting, with an avatar maker and a gallery at the end.',
        desc: 'Share a room’s four-letter code, build a face with a few arrows, and take turns drawing while everyone else guesses in the chat; a right guess never shows, only who got it. Classic or Blitz, German or English word lists in nine themes or your own words, and bots to fill a room. At the end a podium, awards and a gallery where every drawing replays as a timelapse.',
      },
      de: {
        line: 'Ein Wort zeichnen, die der anderen raten: unser eigenes skribbl.io fürs Nachmittags-Meeting, mit Avatar-Baukasten und Galerie am Ende.',
        desc: 'Den Code aus vier Buchstaben teilen, mit ein paar Pfeilen ein Gesicht bauen, und reihum zeichnet einer, während alle anderen im Chat raten; ein richtiger Tipp erscheint nie, nur wer es hat. Klassisch oder Blitz, deutsche oder englische Wortlisten in neun Themen oder eigene Wörter, und Bots füllen den Raum. Am Ende ein Podest, Auszeichnungen und eine Galerie, in der jede Zeichnung im Zeitraffer abläuft.',
      },
    },
  },

  {
    slug: 'cdnms',
    name: 'CDNMS',
    audience: 'public',
    host: 'cdnms.ewolution.cloud',
    pulse: 'cdnms',
    repo: 'https://github.com/ewolution94/cdnms',
    writeup: '/cdnms/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'One word, a number, a board of cards: our own Codenames for the afternoon meeting, with word and picture cards.',
        desc: 'Share a room’s four-letter code and take a seat in a team: one spymaster each, everyone else guesses. Boards of 25 words, 20 picture cards that each put two line motifs together, or both, with German or English words in six themes and your own. Each page gets only what it may see, so the key never leaves the spymasters’ screens.',
      },
      de: {
        line: 'Ein Wort, eine Zahl, ein Brett voller Karten: unser eigenes Codenames fürs Nachmittags-Meeting, mit Wort- und Bildkarten.',
        desc: 'Den Code aus vier Buchstaben teilen und in einem Team Platz nehmen: je ein Chef, alle anderen raten. Bretter aus 25 Wörtern, aus 20 Bildkarten, die je zwei Strichmotive zusammensetzen, oder beides, mit deutschen oder englischen Wörtern in sechs Themen und eigenen. Jede Seite bekommt nur, was sie sehen darf, so verlässt der Schlüssel nie die Bildschirme der Chefs.',
      },
    },
  },

  {
    slug: 'stichle',
    name: 'Stichle',
    audience: 'public',
    host: 'stichle.ewolution.cloud',
    pulse: 'stichle',
    repo: 'https://github.com/ewolution94/stichle',
    writeup: '/stichle/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Say how many tricks you’ll take, then take them: our own Wizard for the afternoon meeting, on cards you can tilt.',
        desc: 'Share a table’s four-letter code and take a seat; the dealer turns up trump, everyone bids, and the cards are played by flicking them from the hand onto the pile. Sixty letterpress cards drawn in SVG, numbers as paper-cut figures from beggar to king, a foil that moves with the phone. Open bids, secret ones or bids that mustn’t add up; bots and a big screen for the meeting room.',
      },
      de: {
        line: 'Ansagen, wie viele Stiche man macht, und sie dann machen: unser eigenes Wizard fürs Nachmittags-Meeting, auf Karten, die man kippen kann.',
        desc: 'Den Code aus vier Buchstaben teilen und Platz nehmen; der Geber deckt Trumpf auf, alle sagen an, und gespielt wird, indem man die Karte aus der Hand auf den Stapel schnippt. Sechzig Karten im Buchdruck-Stil, als SVG gezeichnet, die Zahlen als Scherenschnitt-Figuren vom Bettler bis zum König, eine Folie, die sich mit dem Handy bewegt. Offene Ansagen, verdeckte oder solche, die nicht aufgehen dürfen; Bots und ein großer Bildschirm für den Besprechungsraum.',
      },
    },
  },

  {
    slug: 'stammtisch',
    name: 'Stammtisch',
    audience: 'public',
    host: 'stammtisch.ewolution.cloud',
    pulse: 'stammtisch',
    repo: 'https://github.com/ewolution94/stammtisch',
    writeup: '/stammtisch/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Mau-Mau, Doppelkopf, Skat and Durak at one table: the classic card games for the afternoon meeting, in the German deck.',
        desc: 'Share a table’s four-letter code, pick the game and its house rules, and play deal after deal, with bots in the empty seats. Doppelkopf to the German Doppelkopf Association’s rules, Skat to the International Skat Order, Mau-Mau and Durak the way most tables play them; every house rule is a switch. The German deck is drawn in SVG, its Unter, Ober and König as paper cuts.',
      },
      de: {
        line: 'Mau-Mau, Doppelkopf, Skat und Durak an einem Tisch: die klassischen Kartenspiele fürs Nachmittags-Meeting, mit dem deutschen Blatt.',
        desc: 'Den Code aus vier Buchstaben teilen, Spiel und Hausregeln wählen und Spiel um Spiel spielen, leere Plätze füllen Bots. Doppelkopf nach den Regeln des Deutschen Doppelkopf-Verbands, Skat nach der Internationalen Skatordnung, Mau-Mau und Durak so, wie die meisten Tische sie spielen; jede Hausregel ist ein Schalter. Das deutsche Blatt ist als SVG gezeichnet, Unter, Ober und König als Scherenschnitte.',
      },
    },
  },

  {
    slug: 'wuerfle',
    name: 'Würfle',
    audience: 'public',
    host: 'wuerfle.ewolution.cloud',
    pulse: 'wuerfle',
    repo: 'https://github.com/ewolution94/wuerfle',
    writeup: '/wuerfle/',
    stack: 'Svelte · three.js · Node',
    since: 2026,
    text: {
      en: {
        line: 'The classic five-dice game, alone or at a table with friends: glass dice you flick across the table, and the paper block with up to six games.',
        desc: 'Throw five cobalt glass dice with a flick across the table or a button, keep the ones you like on the rail, and write the score in a block laid out like the paper one. Alone, the rules and up to three bots run in the page, offline too; with friends, share a four-letter code and everyone sees each throw land. Every throw is played through by the physics before it’s shown, then lands on the numbers the server rolled.',
      },
      de: {
        line: 'Das klassische Würfelspiel mit fünf Würfeln, allein oder mit Freunden am Tisch: Glaswürfel zum Schnippen und der Papierblock für bis zu sechs Spiele.',
        desc: 'Fünf Würfel aus Kobaltglas mit einem Wisch über den Tisch oder per Knopf werfen, die guten an die Leiste legen und den Wurf in einen Block schreiben, der aussieht wie der aus Papier. Allein laufen die Regeln und bis zu drei Bots in der Seite, auch offline; mit Freunden den Code aus vier Buchstaben teilen, und alle sehen jeden Wurf landen. Jeder Wurf wird von der Physik erst ganz durchgespielt und dann gezeigt, und er landet auf den Zahlen, die der Server gewürfelt hat.',
      },
    },
  },

  {
    slug: 'yksi',
    name: 'Yksi',
    audience: 'public',
    host: 'yksi.ewolution.cloud',
    pulse: 'yksi',
    repo: 'https://github.com/ewolution94/yksi',
    writeup: '/yksi/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Our colour-matching card game for the afternoon meeting, against bots or at a table with friends: match the colour or the number, and call “yksi!” before your last card.',
        desc: 'Match the top card’s colour, number or sign, and tap “yksi!” before your second-to-last card, or anyone can catch you and you draw two. Against up to five bots the rules run in the page, offline too; with friends, share a four-letter code, and the house rules are the host’s. The 108-card deck is drawn like a Finnish screen print, each colour with its own sign so the colours tell apart without colour vision.',
      },
      de: {
        line: 'Unser Kartenspiel fürs Nachmittags-Meeting, gegen Bots oder mit Freunden am Tisch: Farbe oder Zahl, und vor der letzten Karte „yksi!“ rufen.',
        desc: 'Eine Karte legen, die zur obersten passt, in Farbe, Zahl oder Zeichen, und vor der vorletzten Karte auf „yksi!“ tippen, sonst darf dich jeder erwischen, und du ziehst zwei. Gegen bis zu fünf Bots laufen die Regeln in der Seite, auch offline; mit Freunden den Code aus vier Buchstaben teilen, die Hausregeln wählt der Gastgeber. Die 108 Karten sind gezeichnet wie ein finnischer Siebdruck, jede Farbe mit ihrem eigenen Zeichen, damit man sie auch ohne Farbsehen unterscheidet.',
      },
    },
  },

  {
    slug: 'skibbo',
    name: 'Skibbo',
    audience: 'public',
    host: 'skibbo.ewolution.cloud',
    pulse: 'skibbo',
    repo: 'https://github.com/ewolution94/skibbo',
    writeup: '/skibbo/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Our own take on the stock-pile card game, alone against bots or at a table with friends: enamel number plates built up from 1 to 12, laid out for the tablet first.',
        desc: 'Play out your stock before everyone else, onto four shared piles that count from 1 to 12. Every card is an enamel house-number plate drawn in the page, blue, green or fuchsia by its number, the Joker in all three. Alone against up to five bots, offline too, or with friends at a four-letter code, in teams of two if you like; the table is laid out for an iPad first.',
      },
      de: {
        line: 'Unser eigenes Kartenspiel mit dem eigenen Stapel, allein gegen Bots oder mit Freunden am Tisch: Emaille-Nummernschilder, von 1 bis 12 gestapelt, zuerst fürs Tablet gemacht.',
        desc: 'Den eigenen Stapel als Erstes leer spielen, auf vier gemeinsame Aufbaustapel, die von 1 bis 12 zählen. Jede Karte ist ein Hausnummernschild aus Emaille, in der Seite gezeichnet, blau, grün oder fuchsia nach ihrer Zahl, der Joker in allen dreien. Allein gegen bis zu fünf Bots, auch offline, oder mit Freunden über einen Code aus vier Buchstaben, wer mag zu zweit im Team; der Tisch ist zuerst fürs iPad gemacht.',
      },
    },
  },

  {
    slug: 'randomiser',
    name: 'Randomiser',
    audience: 'public',
    host: 'randomiser.ewolution.cloud',
    pulse: 'randomiser',
    repo: 'https://github.com/ewolution94/randomiser',
    writeup: '/randomiser/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Our wheel of fortune for the afternoon meeting, at the fair: a painted wheel, a jackpot or a duck race draws a name, and the winner is decided before anything moves.',
        desc: 'Type the meeting’s names once, pick the wheel, the jackpot or the duck race and press the ticket: the winner is drawn first from the browser’s crypto random source and the machine only plays its way there, with a near miss and a clown horn on Max drama and a prize ticket in a spotlight at the end. Each machine’s length and feel are set in Settings, and Everyone once lets the winners sit out until all have had a turn. Made for a laptop shared in the call, it fills the window exactly, keeps everything on the device, works offline and makes its fairground sounds with Web Audio.',
      },
      de: {
        line: 'Unser Glücksrad fürs Nachmittags-Meeting, auf der Kirmes: ein bemaltes Rad, ein Jackpot oder ein Entenrennen zieht einen Namen, und der Gewinner steht fest, bevor sich etwas bewegt.',
        desc: 'Die Namen der Runde einmal eintragen, Glücksrad, Jackpot oder Entenrennen wählen und das Los drücken: Der Gewinner wird zuerst aus der Zufallsquelle des Browsers gezogen, und die Maschine spielt sich nur noch dorthin, bei Maximal mit Beinahe-Treffer und Clownshupe, am Ende mit einem Gewinnlos im Scheinwerferlicht. Dauer und Tempo jeder Maschine stehen in den Einstellungen, und mit „Jeder einmal“ setzen die Gewinner aus, bis alle dran waren. Gemacht für den Laptop, der im Call geteilt wird, füllt es das Fenster genau, behält alles auf dem Gerät, läuft offline und macht seine Kirmesklänge mit Web Audio.',
      },
    },
  },

  {
    slug: 'curveextreme',
    name: 'CurveExtreme',
    audience: 'public',
    host: 'curveextreme.ewolution.cloud',
    pulse: 'curveextreme',
    repo: 'https://github.com/ewolution94/curveextreme',
    writeup: '/curveextreme/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Our own curve game for the afternoon meeting: steer a line that never stops, slip through its gaps and outlast everyone, up to ten in a room.',
        desc: 'Every line moves at a measured speed and turns on a measured circle, leaves a gap now and then, and its round ends at any line or the wall; whoever is still driving scores. Share a four-letter code for up to ten curves, or put up to four people on one keyboard, with 25 powerups and a Tune panel that turns every number of the feel. No page is told where a curve is: each simulates the round itself on the server’s clock, and only steering changes travel.',
      },
      de: {
        line: 'Unser eigenes Kurvenspiel für das Nachmittags-Meeting: eine Linie lenken, die nie anhält, durch ihre Lücken schlüpfen und alle überleben, bis zu zehn in einem Raum.',
        desc: 'Jede Linie fährt mit gemessenem Tempo und lenkt auf einem gemessenen Kreis, lässt ab und zu eine Lücke, und ihre Runde endet an jeder Linie und an der Wand; wer noch fährt, punktet. Einen Code aus vier Buchstaben teilen, für bis zu zehn Kurven, oder bis zu vier Leute an eine Tastatur setzen, mit 25 Powerups und einem Feintuning, das jede Zahl des Fahrgefühls dreht. Keiner Seite wird je gesagt, wo eine Kurve ist: Jede simuliert die Runde selbst nach der Uhr des Servers, und unterwegs sind nur Lenkwechsel.',
      },
    },
  },

  {
    slug: 'pokeproxy',
    name: 'PokeProxy',
    audience: 'public',
    host: 'pokeproxy.ewolution.cloud',
    pulse: 'pokeproxy',
    repo: 'https://github.com/ewolution94/pokeproxy',
    // Its write-up waits on the landing's branch pokeproxy-launch; '/pokeproxy/' once that is live.
    writeup: '/pokeproxy/',
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Printable sheets of Pokémon card proxies at the real card size, for the cards the binder is still missing.',
        desc: 'Choose the paper and the card size, 63 × 88\u00a0mm by default, and the page shows the grid that fits, with cut marks and a 50\u00a0mm line to check the printer kept the size. Fill a slot from a search over every English and Japanese card in TCGSL’s list, from a link to a card page or a picture, or from a picture of your own, and print in colour, greyscale or a lighter ink saver. A card comes out at 63 × 88\u00a0mm because every position on the page is set in millimetres. The sheet stays on your own device; a small Node server searches the cards in memory and reads pasted links, only from public addresses.',
      },
      de: {
        line: 'Druckbare Bögen mit Pokémon-Karten als Platzhalter in echter Kartengröße, für die Karten, die im Ordner noch fehlen.',
        desc: 'Papier und Kartengröße wählen, 63 × 88\u00a0mm sind voreingestellt, und die Seite zeigt das Raster, das passt, mit Schnittmarken und einer 50-mm-Linie, an der man nachmisst, ob der Drucker die Größe gehalten hat. Einen Platz füllt eine Suche über jede englische und japanische Karte aus der Liste von TCGSL, ein Link auf eine Kartenseite oder ein Bild, oder ein eigenes Bild; gedruckt wird in Farbe, in Graustufen oder heller und tintensparend. Eine Karte kommt mit 63 × 88\u00a0mm aus dem Drucker, weil jede Position auf der Seite in Millimetern gesetzt ist. Der Bogen bleibt auf dem eigenen Gerät; ein kleiner Node-Server durchsucht die Karten im Speicher und liest eingefügte Links, nur von öffentlichen Adressen.',
      },
    },
  },

  {
    slug: 'pitcher',
    name: 'Pitcher',
    audience: 'public',
    host: 'pitcher.ewolution.cloud',
    pulse: 'pitcher',
    repo: 'https://github.com/ewolution94/pitcher',
    writeup: '/pitcher/',
    stack: 'Svelte · WebAssembly',
    since: 2026,
    text: {
      en: {
        line: 'Paste a YouTube link, set a BPM, and hear the track at it, the key held or resampled: a bootleg tested before the DAW opens.',
        desc: 'Type the tempo into the big number or throw the ruler and let it settle on a genre: House 124, Techno 132, Drum & bass 174. Keep key holds the key while the tempo moves; Resample lets the pitch follow the tempo like a record, FL Studio’s default. The page reads the track’s tempo, beat grid and key itself, lays a kick on every beat, loops bars and jumps to YouTube’s most replayed part. The audio comes through a small relay to YouTube, the same as Fermata’s, and is decoded, analysed and stretched in the browser with WebAssembly, never stored.',
      },
      de: {
        line: 'YouTube-Link einfügen, BPM setzen und den Track darin hören, die Tonart gehalten oder resampelt: ein Bootleg getestet, bevor die DAW aufgeht.',
        desc: 'Das Tempo in die große Zahl tippen oder das Lineal werfen und auf einem Genre landen lassen: House 124, Techno 132, Drum & Bass 174. „Tonart halten“ hält die Tonart, während sich das Tempo bewegt; „Resample“ lässt die Tonhöhe dem Tempo folgen wie bei einer Platte, FL Studios Standard. Die Seite liest Tempo, Beat-Raster und Tonart des Tracks selbst, legt eine Kick auf jeden Schlag, loopt Takte und springt zur meistgehörten Stelle auf YouTube. Die Audiospur kommt über ein kleines Relay zu YouTube, dasselbe wie bei Fermata, und wird im Browser mit WebAssembly dekodiert, analysiert und gestreckt, nie gespeichert.',
      },
    },
  },

  // --- Private: shown to everyone, usable by invited people only. -------------------------
  // Not on the landing, so the texts restate the README.
  {
    slug: 'verso',
    name: 'Verso',
    audience: 'private',
    host: 'verso.ewolution.cloud',
    pulse: 'verso',
    repo: 'https://github.com/ewolution94/verso',
    writeup: null,
    stack: 'Svelte · Node · SQLite',
    since: 2026,
    text: {
      en: {
        line: 'Type a message and get a Spotify playlist whose song titles, read top to bottom, spell it out.',
        desc: 'Log in with Spotify, type a message, and Verso searches the catalogue for songs whose titles say its words: whole phrases where it can (“Thank You For Everything”, “See You Later”), single words where it must. Choose fewer or more songs, shuffle, or swap a song for another with the same title, then save it as a playlist in your own account. Spotify limits apps like this one to five invited accounts.',
      },
      de: {
        line: 'Tipp eine Nachricht und bekomm eine Spotify-Playlist, deren Songtitel sie von oben nach unten ergeben.',
        desc: 'Mit Spotify anmelden, eine Nachricht tippen, und Verso sucht im Katalog nach Songs, deren Titel ihre Wörter sagen: ganze Phrasen, wo es geht („Thank You For Everything“, „See You Later“), einzelne Wörter, wo es sein muss. Weniger oder mehr Songs wählen, neu mischen oder einen Song gegen einen anderen mit demselben Titel tauschen, dann als Playlist im eigenen Konto speichern. Spotify begrenzt Apps wie diese auf fünf eingeladene Konten.',
      },
    },
  },
  // Not on the landing (one person's tool, behind Cloudflare Access), so the texts restate the README.
  {
    slug: 'encore',
    name: 'Encore',
    audience: 'private',
    host: 'encore.ewolution.cloud',
    pulse: 'encore',
    repo: 'https://github.com/ewolution94/encore',
    writeup: null,
    stack: 'Svelte · Node · SQLite · ffmpeg',
    since: 2026,
    text: {
      en: {
        line: 'YouTube live sets, checked and cut into tracks, into Spotify on the phone.',
        desc: 'A set saved to a YouTube playlist is downloaded on the NAS, and Encore finds its tracklist in the description or the top comments, or takes one you paste. You check the times and trim the ends; it cuts the set into tagged tracks that play through without gaps, and Synology Drive takes them to Spotify’s local files. One person’s tool, behind a login.',
      },
      de: {
        line: 'YouTube-Livesets, geprüft und in Tracks geschnitten, in Spotify auf dem Handy.',
        desc: 'Ein in einer YouTube-Playlist gespeichertes Set wird auf dem NAS geladen, und Encore findet seine Trackliste in der Beschreibung oder den Top-Kommentaren oder nimmt eine eingefügte. Du prüfst die Zeiten und kürzt Anfang und Ende; es schneidet das Set in getaggte Tracks, die ohne Lücken durchlaufen, und Synology Drive bringt sie in Spotifys lokale Dateien. Ein Werkzeug für eine Person, hinter einem Login.',
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

/** The entries a viewer may see: everyone gets the public and private ones, an owner all of them. */
export function visibleApps(isOwner) {
  return APPS.filter((app) => app.audience !== 'owner' || isOwner);
}
