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
        desc: 'Join a room with its four-letter code or QR code, no account needed. Guess the price, guess without going over, call higher or lower against the last item, or sort four items by price, alone or in teams, while a big-screen view shows the game on the meeting room’s projector. Guesses are scored by the ratio: 10% off earns about 850 of 1,000 points, half or double the price earns nothing. A Node server without dependencies keeps the rooms in memory and streams them over Server-Sent Events; until its eBay keys are set, it plays 95 demo items and labels them as such.',
      },
      de: {
        line: 'Gemeinsam den Preis von eBay-Angeboten schätzen, in vier Spielarten: ein Partyspiel für unser Nachmittags-Meeting.',
        desc: 'Beitreten mit dem Code aus vier Buchstaben oder per QR-Code, ohne Konto. Den Preis schätzen, schätzen ohne drüberzuliegen, teurer oder billiger als der letzte Artikel, oder vier Artikel nach Preis sortieren, allein oder in Teams; eine Ansicht für den großen Bildschirm zeigt das Spiel am Beamer im Besprechungsraum. Tipps zählen nach dem Verhältnis: 10\u00a0% daneben bringt etwa 850 von 1.000 Punkten, der halbe oder doppelte Preis nichts. Ein Node-Server ohne Abhängigkeiten hält die Räume im Speicher und schickt sie per Server-Sent Events; bis seine eBay-Schlüssel gesetzt sind, spielt es mit 95 Demo-Artikeln und sagt das auch.',
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
        desc: 'Found a village, share its four-letter code, and the app deals the cards: werewolves, villagers and eight special roles from the Seer to the Elder, each a woodcut in two inks drawn for the game. It runs the nights and days by itself; at night everyone taps something, so no screen gives a role away, and the wolves agree on a victim without a word. Classic or quick, with a deck that shows its balance and a big-screen view for sharing; bots fill a table for trying it out. A Node server without dependencies holds the villages in memory and sends each player only their own view over Server-Sent Events.',
      },
      de: {
        line: 'Das Partyspiel Werwolf für unser Nachmittags-Meeting, mit der App als Erzählerin, im Videocall oder am selben Tisch.',
        desc: 'Ein Dorf gründen, den Code aus vier Buchstaben teilen, und die App verteilt die Karten: Werwölfe, Dorfbewohner und acht Sonderrollen von der Seherin bis zum Alten, jede ein Holzschnitt in zwei Farben, gezeichnet für das Spiel. Nächte und Tage laufen von selbst; nachts tippen alle etwas, damit kein Bildschirm eine Rolle verrät, und die Wölfe einigen sich ohne ein Wort auf ein Opfer. Klassisch oder schnell, mit einem Deck, das sein Gleichgewicht zeigt, und einer Ansicht für den großen Bildschirm; Bots füllen den Tisch zum Ausprobieren. Ein Node-Server ohne Abhängigkeiten hält die Dörfer im Speicher und schickt jedem per Server-Sent Events nur seine eigene Sicht.',
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
        desc: 'Share a room’s four-letter code, build a face with a few arrows, and take turns drawing while everyone else guesses in the chat; a right guess never shows, only who got it. The strokes reach every screen as they’re drawn and play back on the drawer’s own timing, fills included. Classic or Blitz, with hidden or combination words, German or English word lists in nine themes and your own words; bots fill a room for trying it out. At the end a podium, awards and a gallery where every drawing replays as a timelapse. A Node server without dependencies keeps the rooms in memory and sends each page only what it may see over Server-Sent Events.',
      },
      de: {
        line: 'Ein Wort zeichnen, die der anderen raten: unser eigenes skribbl.io fürs Nachmittags-Meeting, mit Avatar-Baukasten und Galerie am Ende.',
        desc: 'Den Code aus vier Buchstaben teilen, mit ein paar Pfeilen ein Gesicht bauen, und reihum zeichnet einer, während alle anderen im Chat raten; ein richtiger Tipp erscheint nie, nur wer es hat. Die Striche erreichen jeden Bildschirm, während sie entstehen, und laufen im Takt des Zeichners ab, Füllungen inklusive. Klassisch oder Blitz, mit versteckten oder kombinierten Wörtern, deutschen oder englischen Wortlisten in neun Themen und eigenen Wörtern; Bots füllen den Raum zum Ausprobieren. Am Ende ein Podest, Auszeichnungen und eine Galerie, in der jede Zeichnung im Zeitraffer abläuft. Ein Node-Server ohne Abhängigkeiten hält die Räume im Speicher und schickt jeder Seite per Server-Sent Events nur, was sie sehen darf.',
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
        desc: 'Share a room’s four-letter code and take a seat in a team: one spymaster each, everyone else guesses. The spymaster taps the cards a clue is meant for and types one word, checked against the board as it’s typed; the team points at cards and holds to turn one over. Boards of 25 words, 20 picture cards that each put two line motifs together, or both; German or English words in six themes and your own; an objection for the other spymaster, clocks and bots. At the end the whole key and what every clue was meant for. A Node server without dependencies keeps the rooms in memory and sends each page only what it may see over Server-Sent Events, so the key never leaves the spymasters’ screens.',
      },
      de: {
        line: 'Ein Wort, eine Zahl, ein Brett voller Karten: unser eigenes Codenames fürs Nachmittags-Meeting, mit Wort- und Bildkarten.',
        desc: 'Den Code aus vier Buchstaben teilen und in einem Team Platz nehmen: je ein Chef, alle anderen raten. Der Chef tippt die Karten an, die ein Hinweis meint, und schreibt ein Wort, das schon beim Tippen gegen das Brett geprüft wird; das Team zeigt auf Karten und hält gedrückt, um eine aufzudecken. Bretter aus 25 Wörtern, aus 20 Bildkarten, die je zwei Strichmotive zusammensetzen, oder beides; deutsche oder englische Wörter in sechs Themen und eigene; Einspruch für den anderen Chef, Uhren und Bots. Am Ende der ganze Schlüssel und was jeder Hinweis gemeint hat. Ein Node-Server ohne Abhängigkeiten hält die Räume im Speicher und schickt jeder Seite per Server-Sent Events nur, was sie sehen darf, so verlässt der Schlüssel nie die Bildschirme der Chefs.',
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
        desc: 'Share a table’s four-letter code and take a seat; the dealer turns up trump, everyone bids, and the cards are played by flicking them from the hand onto the pile, where they stay visible like a real stack. Sixty letterpress cards drawn in SVG, numbers as paper-cut figures from beggar to king, a foil that moves with the phone. Open bids, bids that mustn’t add up, or secret ones; a clock if you want one, bots, a big screen for the meeting room. Achievements and the tables they unlock are kept on your own device. A Node server without dependencies keeps the tables in memory and sends each page only its own hand over Server-Sent Events.',
      },
      de: {
        line: 'Ansagen, wie viele Stiche man macht, und sie dann machen: unser eigenes Wizard fürs Nachmittags-Meeting, auf Karten, die man kippen kann.',
        desc: 'Den Code aus vier Buchstaben teilen und Platz nehmen; der Geber deckt Trumpf auf, alle sagen an, und gespielt wird, indem man die Karte aus der Hand auf den Stapel schnippt, wo sie wie bei einem echten Stapel sichtbar liegen bleibt. Sechzig Karten im Buchdruck-Stil, als SVG gezeichnet, die Zahlen als Scherenschnitt-Figuren vom Bettler bis zum König, eine Folie, die sich mit dem Handy bewegt. Offene Ansagen, Ansagen, die nicht aufgehen dürfen, oder verdeckte; auf Wunsch eine Uhr, Bots und ein großer Bildschirm für den Besprechungsraum. Erfolge und die Tische, die sie freischalten, bleiben auf dem eigenen Gerät. Ein Node-Server ohne Abhängigkeiten hält die Tische im Speicher und schickt jeder Seite per Server-Sent Events nur ihre eigene Hand.',
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
        desc: 'Share a table’s four-letter code, pick the game and its house rules, and play deal after deal, with bots in the empty seats. Doppelkopf to the German Doppelkopf Association’s rules, Skat to the International Skat Order, Mau-Mau and Durak the way most tables play them; every house rule is a switch. The German deck is drawn in SVG, its Unter, Ober and König as paper cuts, and held as a fan you scrub, flick or tap; how each game goes is in the app, page by page. A Node server without dependencies keeps the tables in memory and sends each page only its own hand over Server-Sent Events.',
      },
      de: {
        line: 'Mau-Mau, Doppelkopf, Skat und Durak an einem Tisch: die klassischen Kartenspiele fürs Nachmittags-Meeting, mit dem deutschen Blatt.',
        desc: 'Den Code aus vier Buchstaben teilen, Spiel und Hausregeln wählen und Spiel um Spiel spielen, leere Plätze füllen Bots. Doppelkopf nach den Regeln des Deutschen Doppelkopf-Verbands, Skat nach der Internationalen Skatordnung, Mau-Mau und Durak so, wie die meisten Tische sie spielen; jede Hausregel ist ein Schalter. Das deutsche Blatt ist als SVG gezeichnet, Unter, Ober und König als Scherenschnitte, und liegt als Fächer in der Hand, zum Drüberstreichen, Schnippen oder Antippen; wie jedes Spiel geht, erklärt die App Seite für Seite. Ein Node-Server ohne Abhängigkeiten hält die Tische im Speicher und schickt jeder Seite per Server-Sent Events nur ihre eigene Hand.',
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
        desc: 'Throw five cobalt glass dice with a flick across the table or a button, keep the ones you like on the rail, and write the score in a block laid out like the paper one, one column per game. Alone, the rules and up to three bots run in the page, offline too; with friends, share a four-letter code and everyone sees each throw land and each die kept. Every throw is played through by the physics before it’s shown, then lands on the numbers the server rolled. Schmidt’s championship rules by default, its basic rules and the joker rule as the host’s choice, and with several games the house rule that lets a roll go into any column. A Node server without dependencies keeps the tables in memory and sends every page the room over Server-Sent Events.',
      },
      de: {
        line: 'Das klassische Würfelspiel mit fünf Würfeln, allein oder mit Freunden am Tisch: Glaswürfel zum Schnippen und der Papierblock für bis zu sechs Spiele.',
        desc: 'Fünf Würfel aus Kobaltglas mit einem Wisch über den Tisch oder per Knopf werfen, die guten an die Leiste legen und den Wurf in einen Block schreiben, der aussieht wie der aus Papier, eine Spalte pro Spiel. Allein laufen die Regeln und bis zu drei Bots in der Seite, auch offline; mit Freunden den Code aus vier Buchstaben teilen, und alle sehen jeden Wurf landen und jeden behaltenen Würfel. Jeder Wurf wird von der Physik erst ganz durchgespielt und dann gezeigt, und er landet auf den Zahlen, die der Server gewürfelt hat. Schmidts Meisterschaftsregeln sind voreingestellt, die Grundregel und die Joker-Regel wählt der Gastgeber, bei mehreren Spielen auch die Hausregel, nach der jeder Wurf in jede Spalte darf. Ein Node-Server ohne Abhängigkeiten hält die Tische im Speicher und schickt jeder Seite den Tisch per Server-Sent Events.',
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
        desc: 'Match the top card’s colour, number or sign, play Skips, Reverses and Draw Twos, name the colour with a wild, and tap “yksi!” before your second-to-last card, or anyone can catch you and you draw two; a Wild Draw Four can be challenged. Against up to five bots the rules run in the page, offline too; with friends, share a four-letter code, and bots fill the empty seats. The 108-card deck is drawn as SVG like a Finnish screen print, each colour with its own sign so the colours tell apart without colour vision, in light and dark. The printed rules by default; stacking, jump-in, 7-0 and drawing until a card fits are the host’s house rules. A Node server without dependencies keeps the tables in memory and sends every page only its own hand over Server-Sent Events.',
      },
      de: {
        line: 'Unser Kartenspiel fürs Nachmittags-Meeting, gegen Bots oder mit Freunden am Tisch: Farbe oder Zahl, und vor der letzten Karte „yksi!“ rufen.',
        desc: 'Eine Karte legen, die zur obersten passt, in Farbe, Zahl oder Zeichen, Aussetzen, Richtungswechsel und +2 spielen, mit einer Farbwahl die Farbe bestimmen und vor der vorletzten Karte auf „yksi!“ tippen, sonst darf dich jeder erwischen, und du ziehst zwei; eine +4 lässt sich anzweifeln. Gegen bis zu fünf Bots laufen die Regeln in der Seite, auch offline; mit Freunden den Code aus vier Buchstaben teilen, leere Plätze füllen Bots. Die 108 Karten sind als SVG gezeichnet wie ein finnischer Siebdruck, jede Farbe mit ihrem eigenen Zeichen, damit man sie auch ohne Farbsehen unterscheidet, hell und dunkel. Voreingestellt sind die gedruckten Regeln; Stapeln, Reinwerfen, 7-0 und Ziehen, bis es passt, sind Hausregeln des Gastgebers. Ein Node-Server ohne Abhängigkeiten hält die Tische im Speicher und schickt jeder Seite per Server-Sent Events nur ihre eigene Hand.',
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
        desc: 'Play out your stock before everyone else: onto four shared piles that count from 1 to 12, from your hand, your stock or your four discard piles, and end each turn on a discard pile. Every card is an enamel house-number plate drawn in the page, blue, green or fuchsia by its number, the Joker in all three. Alone, the rules and up to five bots in three ranks run in the page, offline too; with friends, share a four-letter code, play one round or to 500, in teams of two if you like. Drag a plate or tap it; the table is laid out for an iPad on its side or upright, grows with a big screen and has a layout of its own on the phone. A Node server without dependencies keeps the tables in memory and sends each page only its own hand over Server-Sent Events.',
      },
      de: {
        line: 'Unser eigenes Kartenspiel mit dem eigenen Stapel, allein gegen Bots oder mit Freunden am Tisch: Emaille-Nummernschilder, von 1 bis 12 gestapelt, zuerst fürs Tablet gemacht.',
        desc: 'Den eigenen Stapel als Erstes leer spielen: auf vier gemeinsame Aufbaustapel, die von 1 bis 12 zählen, aus der Hand, vom Stapel oder von den vier eigenen Ablagen, und jeden Zug auf einer Ablage beenden. Jede Karte ist ein Hausnummernschild aus Emaille, in der Seite gezeichnet, blau, grün oder fuchsia nach ihrer Zahl, der Joker in allen dreien. Allein laufen die Regeln und bis zu fünf Bots in drei Rängen in der Seite, auch offline; mit Freunden den Code aus vier Buchstaben teilen, eine Runde oder bis 500 spielen, wer mag zu zweit im Team. Ein Schild ziehen oder antippen; der Tisch ist fürs iPad gemacht, quer oder hochkant, wächst mit großen Bildschirmen und hat auf dem Handy sein eigenes Layout. Ein Node-Server ohne Abhängigkeiten hält die Tische im Speicher und schickt jeder Seite per Server-Sent Events nur ihre eigene Hand.',
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
    writeup: null,
    stack: 'Svelte · Node',
    since: 2026,
    text: {
      en: {
        line: 'Who hosts today? The afternoon meeting’s draw, at the fair: a painted wheel, a jackpot or a duck race, made for the laptop shared in the call.',
        desc: 'Put the meeting’s names in, then spin the painted wheel, pull the jackpot’s lever or start the duck race; the name that comes up swings in on a hanging sign. The winner is drawn first, evenly, from the browser’s random source, and the machine only plays its way there: on Max the wheel stops against the neighbour’s nail and creeps over, the reel stops one short, the race is won by a beak. Everyone once lets the winners sit out until all have had a turn, and the last draws keep their time. The names stay on the device, it works offline, and the jackpot is the same reel as Aale Spiele’s draw.',
      },
      de: {
        line: 'Wer moderiert heute? Die Auslosung fürs Nachmittags-Meeting, auf der Kirmes: ein bemaltes Glücksrad, ein Jackpot oder ein Entenrennen, gemacht für den Laptop, der im Call geteilt wird.',
        desc: 'Die Namen der Runde eintragen, dann das Glücksrad drehen, am Hebel des Jackpots ziehen oder das Entenrennen starten; der gezogene Name schwingt auf einem hängenden Schild herein. Gezogen wird zuerst, gleichmäßig, mit dem Zufall des Browsers, die Maschine spielt sich nur dorthin: Auf Maximal bleibt das Rad am Nagel des Nachbarn hängen und rutscht dann weiter, die Walze hält eins zu früh, das Rennen geht um Schnabelbreite aus. „Jeder einmal“ lässt Gezogene aussetzen, bis alle dran waren, und die letzten Ziehungen stehen mit Uhrzeit da. Die Namen bleiben auf dem Gerät, es läuft auch offline, und der Jackpot ist dieselbe Walze wie die Auslosung von Aale Spiele.',
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
