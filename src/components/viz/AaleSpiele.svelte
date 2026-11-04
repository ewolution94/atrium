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
  // The games are the ones Aale Spiele shows, in its order (Dashboard turns them on and off), drawn
  // as the app draws them, from its /games.json; the server lets only plain SVG shapes through
  // (sources.mjs, cleanMark). Until they come, the window shows empty rows.
  import { onMount, untrack } from 'svelte';
  import type { AaleTile } from '../../lib/types';

  let { tile, awake = false }: { tile: AaleTile | null; awake?: boolean } = $props();

  // The reel needs three to pick from: the one showing, the next, and one between.
  const GAMES = $derived(tile && tile.games.length >= 3 ? tile.games : []);
  // The list as words: the page's refresh every minute brings the same games, and mustn't restart the reel.
  const order = $derived(GAMES.map((game) => game.slug).join(' '));

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

  let rows = $derived.by(() => (order ? untrack(() => reel(shown % GAMES.length)) : []));
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
      if (!rows.length) return;
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
      {#if rows.length}
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
      {:else}
        <div class="strip blank">
          {#each [0, 1, 2] as i (i)}
            <div class="row"><span class="game"></span><span class="name"><i></i><i></i></span></div>
          {/each}
        </div>
      {/if}
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
  /* A solid shape in the ink, for a mark drawn as a silhouette (Vollmond's wolf). */
  .game :global(.s) {
    fill: var(--ink);
    stroke: var(--ink);
    stroke-width: 1;
    stroke-linejoin: round;
  }
  .game :global(.k) {
    fill: var(--spark);
  }
  /* Before the games come (or with Aale Spiele out of reach): the rows without them, still. */
  .blank {
    top: calc(50% - var(--row) * 1.5);
    animation: none !important;
  }
  .blank .game {
    background: var(--ewo-line);
    box-shadow: none;
  }
  .blank .name i {
    display: block;
    width: 92px;
    height: 9px;
    border-radius: 5px;
    background: var(--ewo-line);
  }
  .blank .name i + i {
    width: 64px;
    height: 7px;
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
