<script module lang="ts">
  // Shared by every reel on the page, so the app's page picks up on the game the tile stopped on.
  let shown = 2;
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
</script>

<script lang="ts">
  // The games in a slot machine's window, one on the payline: Aale Spiele's "Was spielen wir?".
  // Hovering the tile spins the reel once, fast, onto another game (never the same twice in a
  // row, like the app); the app's page spins it once on arrival. Only the strip's transform moves.
  // The tiles are the app's own, copied from aale-spiele/src/lib/games.ts and glyphs.ts: the
  // marks are fixed strings, never anything a visitor typed.
  import { onMount } from 'svelte';

  let { awake = false }: { awake?: boolean } = $props();

  type Game = { name: string; host: string; ground: [string, string]; ink: string; spark: string; mark: string };

  const GAMES: Game[] = [
    {
      name: 'skribbl.io',
      host: 'skribbl.io',
      ground: ['#5bb6ff', '#1f6fe0'],
      ink: '#ffffff',
      spark: '#ffe14d',
      mark: '<path class="i" d="M40 13 L51 24 L29 46 L16 49 L18 35 Z"/><path class="i" d="M34 19 L45 30"/><circle class="k" cx="16" cy="49" r="4.5"/>',
    },
    {
      name: 'Gartic Phone',
      host: 'garticphone.com',
      ground: ['#b18bff', '#6a3be6'],
      ink: '#ffffff',
      spark: '#ffb0dc',
      mark: '<path class="i" d="M16 11 H32 Q38 11 38 17 V22 Q38 28 32 28 H22 L15 33 V27 Q11 26 11 21 V16 Q11 11 16 11 Z"/><path class="i" d="M32 33 H48 Q53 33 53 38 V43 Q53 48 49 49 V55 L42 50 H32 Q26 50 26 44 V39 Q26 33 32 33 Z"/><circle class="k" cx="39.5" cy="41.5" r="4.2"/>',
    },
    {
      name: 'Codenames',
      host: 'codenames.game',
      ground: ['#ff7a6b', '#d92b3a'],
      ink: '#ffffff',
      spark: '#1d4fd8',
      mark: '<rect class="i" x="13" y="13" width="16" height="16" rx="4"/><rect class="i" x="35" y="13" width="16" height="16" rx="4"/><rect class="i" x="13" y="35" width="16" height="16" rx="4"/><rect class="i" x="35" y="35" width="16" height="16" rx="4"/><circle class="k" cx="43" cy="43" r="4.5"/>',
    },
    {
      name: 'Travle',
      host: 'travle.earth',
      ground: ['#4fdcb4', '#13997a'],
      ink: '#ffffff',
      spark: '#0b3d33',
      mark: '<circle class="i" cx="16" cy="47" r="4.5"/><path class="i" d="M19.5 43 L27 32 L36 38 L44 26"/><circle class="k" cx="47.5" cy="20.5" r="4.8"/>',
    },
    {
      name: 'Impromptu',
      host: 'impromptu.fun',
      ground: ['#ffab5c', '#f0661a'],
      ink: '#ffffff',
      spark: '#7a2e00',
      mark: '<rect class="i" x="11" y="13" width="42" height="38" rx="8"/><path class="i" d="M18 44 L27 33 L34 40 L39 35 L46 43"/><circle class="k" cx="40" cy="24" r="4.5"/>',
    },
    {
      name: 'Songlio',
      host: 'songl.io',
      ground: ['#e07bff', '#a531db'],
      ink: '#ffffff',
      spark: '#5ef0d0',
      mark: '<path class="i" d="M37 44 V14 C42 16 47 19 47 26"/><circle class="k" cx="30" cy="44" r="7.5"/>',
    },
    {
      name: 'Guess the Price',
      host: 'guess-the-price.de',
      ground: ['#ffd45c', '#f2a20e'],
      ink: '#1b1712',
      spark: '#ffffff',
      mark: '<path class="i" d="M13 43 A19 19 0 0 1 51 43"/><path class="i" d="M32 43 L41 30"/><circle class="k" cx="32" cy="43" r="5"/>',
    },
    {
      name: 'GeoGuessr',
      host: 'geoguessr.com',
      ground: ['#8b95ff', '#4a4fe0'],
      ink: '#ffffff',
      spark: '#ff5a6e',
      mark: '<path class="i" d="M32 53 C25 45 18 38 18 28 A14 14 0 0 1 46 28 C46 38 39 45 32 53 Z"/><circle class="k" cx="32" cy="28" r="4.8"/>',
    },
    {
      name: 'CurveCrash',
      host: 'curvecrash.com',
      ground: ['#c4ef6a', '#6fb51d'],
      ink: '#14260a',
      spark: '#ff3d9a',
      mark: '<path class="i" d="M11 22 C30 22 30 45 53 45"/><path class="i" d="M13 52 C17 47 20 45 23 43"/><circle class="k" cx="27" cy="40" r="4.5"/>',
    },
    {
      name: 'HaxBall',
      host: 'haxball.com',
      ground: ['#5fd68a', '#1f9a4f'],
      ink: '#ffffff',
      spark: '#0f3a20',
      mark: '<rect class="i" x="10" y="15" width="44" height="34" rx="7"/><path class="i" d="M32 15 V49"/><circle class="k" cx="43" cy="32" r="5"/>',
    },
  ];

  /** Rows from the game on the payline to the next one: the `spin` keyframes move the strip this far. */
  const SPIN = 14;

  /** A game other than the ones given. */
  function anyBut(...not: number[]) {
    let i: number;
    do i = Math.floor(rnd() * GAMES.length);
    while (not.includes(i));
    return i;
  }

  /**
   * The strip: a row above, the game showing, the ones it spins past, the next game, a row below.
   * `above` and `below` keep the neighbours the window already shows.
   */
  function reel(from: number, above = anyBut(from), below?: number) {
    const next = anyBut(from);
    const out = below === undefined ? [above, from] : [above, from, below];
    while (out.length < SPIN) out.push(anyBut(out.at(-1)!));
    out.push(anyBut(out.at(-1)!, next), next, anyBut(next));
    return out;
  }

  let rows = $state.raw(reel(shown));
  let spun = $state(false);
  let root: HTMLElement;

  onMount(() => {
    if (awake) {
      // Once the tile has grown into the page (the view transition takes 0.5 s).
      const timer = setTimeout(() => (spun = true), 500);
      return () => clearTimeout(timer);
    }
    // Leaving the tile drops the spin at once (no transition back); the next one starts from
    // where this one stopped, even if it was cut short.
    const tile = root.closest('.tile');
    const settle = () => {
      shown = rows[SPIN + 1];
      rows = reel(shown, rows[SPIN], rows[SPIN + 2]);
    };
    tile?.addEventListener('pointerleave', settle);
    return () => tile?.removeEventListener('pointerleave', settle);
  });
</script>

<div class="viz" class:awake class:spun bind:this={root} aria-hidden="true">
  <div class="machine">
    <div class="window">
      <div class="payline"></div>
      <div class="strip" onanimationend={() => (shown = rows[SPIN + 1])}>
        {#each rows as g, i (i)}
          {@const game = GAMES[g]}
          <div class="row">
            <span class="game" style:--g1={game.ground[0]} style:--g2={game.ground[1]} style:--ink={game.ink} style:--spark={game.spark}>
              {@html `<svg viewBox="0 0 64 64">${game.mark}</svg>`}
            </span>
            <span class="name"><b>{game.name}</b><small>{game.host}</small></span>
          </div>
        {/each}
      </div>
    </div>
    <i class="pointer l"></i><i class="pointer r"></i>
  </div>
</div>

<style>
  .viz {
    --row: 56px;
    --chip: 38px;
    flex: 1;
    display: grid;
    place-items: center;
    min-width: 0;
    padding: 20px 26px 0;
  }
  .machine {
    position: relative;
    width: min(100%, 250px);
  }
  .window {
    position: relative;
    height: calc(var(--row) * 2.4);
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid var(--ewo-line);
    background: var(--ewo-bg-raised);
  }
  /* The rows above and below the payline fade into the window. */
  .window::before,
  .window::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    height: calc(50% - var(--row) / 2 + 3px);
    pointer-events: none;
  }
  .window::before {
    top: 0;
    background: linear-gradient(var(--ewo-bg-raised) 22%, transparent);
  }
  .window::after {
    bottom: 0;
    background: linear-gradient(transparent, var(--ewo-bg-raised) 78%);
  }
  .payline {
    position: absolute;
    left: 6px;
    right: 6px;
    top: calc(50% - var(--row) / 2 + 4px);
    height: calc(var(--row) - 8px);
    border-radius: 12px;
    border: 1.5px solid var(--ewo-accent);
    background: color-mix(in oklab, var(--ewo-accent) 9%, transparent);
  }
  .pointer {
    position: absolute;
    top: 50%;
    width: 7px;
    height: 12px;
    margin-top: -6px;
    background: var(--ewo-accent-2);
  }
  .l {
    left: -12px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }
  .r {
    right: -12px;
    clip-path: polygon(100% 0, 0 50%, 100% 100%);
  }

  .strip {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - var(--row) * 1.5);
    z-index: 1;
    will-change: transform;
  }
  /* One spin per hover; leaving drops it at once. Under reduced motion (app.css) it just lands. */
  :global(.tile:hover) .strip,
  .spun .strip {
    animation: spin 1.1s forwards;
  }
  /* 14 of the strip's 17 rows (SPIN), a slot machine's settle: just past the game, then back. */
  @keyframes spin {
    from {
      transform: translate3d(0, 0, 0);
      animation-timing-function: cubic-bezier(0.18, 0.62, 0.28, 1);
    }
    88% {
      transform: translate3d(0, calc(-100% * 14.25 / 17), 0);
      animation-timing-function: cubic-bezier(0.45, 0, 0.4, 1);
    }
    to {
      transform: translate3d(0, calc(-100% * 14 / 17), 0);
    }
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    height: var(--row);
    padding: 0 18px;
  }
  /* A game's tile, as the app draws it: its colour as the ground, its mark, one dot. */
  .game {
    position: relative;
    display: grid;
    flex: none;
    place-items: center;
    width: var(--chip);
    height: var(--chip);
    overflow: hidden;
    border-radius: calc(var(--chip) * 0.24);
    background: linear-gradient(162deg, var(--g1), var(--g2));
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.28),
      0 1px 2px rgb(0 0 0 / 0.18);
  }
  .game::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(90% 70% at 50% -10%, rgb(255 255 255 / 0.22), transparent 70%);
  }
  .game :global(svg) {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .game :global(.i) {
    fill: none;
    stroke: var(--ink);
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .game :global(.k) {
    fill: var(--spark);
  }
  .name {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
  }
  b {
    font-weight: 600;
    font-size: 15px;
    line-height: 1.1;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  small {
    font: 500 11px/1 var(--ewo-mono);
    color: var(--ewo-fg-3);
    white-space: nowrap;
  }

  .awake {
    --row: 78px;
    --chip: 54px;
  }
  .awake .machine {
    width: min(100%, 340px);
  }
  .awake .row {
    gap: 16px;
    padding: 0 22px;
  }
  .awake b {
    font-size: 20px;
  }
  .awake small {
    font-size: 12px;
  }
</style>
