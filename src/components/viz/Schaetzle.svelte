<script lang="ts">
  // Schätzle's reveal in miniature, the landing's motif: a price line, the players' guesses as dots
  // in OTTO's colours, and the red price tag. At rest the tag asks "?,??€" and the guesses hang
  // above the line; hovering drops them onto it and turns the tag over to the price, as a round
  // ends in the app. Its page plays that once on arrival. Drawn, not data. Only transforms and
  // opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  /** Where each guess lands (share of the line) and its player's colour (OTTO's palette). */
  const GUESSES = [
    { at: 0.24, color: '#b198db', initial: 'B' },
    { at: 0.47, color: '#64c8b9', initial: 'A' },
    { at: 0.71, color: '#f8a171', initial: 'C' },
    { at: 0.86, color: '#6ea0eb', initial: 'D' },
  ];
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="line">
    <span class="band"></span>
    {#each GUESSES as guess, i (guess.initial)}
      <span class="dot" style:left="{guess.at * 100}%" style:--c={guess.color} style:--i={i}>{guess.initial}</span>
    {/each}
    <span class="truth">
      <span class="tag">
        <svg viewBox="0 0 10 20"><path fill-rule="evenodd" d="M10 0H6.6a2 2 0 0 0-1.6.8L.6 8.8a2 2 0 0 0 0 2.4L5 19.2a2 2 0 0 0 1.6.8H10ZM8.1 10a1.6 1.6 0 1 0-3.2 0a1.6 1.6 0 1 0 3.2 0Z" /></svg>
        <span class="face"><span class="ask">?,??€</span><span class="price">149€</span></span>
      </span>
    </span>
  </div>
</div>

<style>
  /* The line sits low, so the tag above it has room under the tile's top edge. */
  .viz {
    flex: 1;
    display: flex;
    align-items: flex-end;
    min-width: 0;
    padding: 0 30px 20px;
  }
  .line {
    position: relative;
    flex: 1;
    height: 2px;
    background: var(--ewo-line-strong);
    border-radius: 2px;
  }
  /* The stretch that scores at all: half to double the price. */
  .band {
    position: absolute;
    left: 30%;
    right: 20%;
    top: 0;
    height: 2px;
    background: var(--ewo-accent);
    opacity: 0.4;
  }

  .dot {
    position: absolute;
    top: -13px;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    margin-left: -12px;
    border-radius: 50%;
    background: var(--c);
    color: #212121;
    font: 700 11px/1 var(--ewo-sans);
    opacity: 0.35;
    transform: translateY(-16px) scale(0.8);
  }
  .truth {
    position: absolute;
    left: 58%;
    top: -14px;
    bottom: -8px;
    width: 2px;
    margin-left: -1px;
    background: var(--ewo-accent);
    border-radius: 2px;
  }
  .tag {
    position: absolute;
    bottom: 100%;
    left: 50%;
    display: flex;
    height: 26px;
    margin-bottom: 4px;
    transform: translateX(-30%) rotate(-5deg);
    filter: drop-shadow(0 6px 10px rgb(150 0 20 / 0.25));
  }
  svg {
    width: 13px;
    height: 26px;
    margin-right: -1px;
  }
  path {
    fill: #dc001d;
  }
  .face {
    display: grid;
    place-items: center;
    padding: 0 9px 0 3px;
    background: #dc001d;
    border-radius: 0 7px 7px 0;
    color: #ffffff;
    white-space: nowrap;
    font: 800 14px/1 var(--ewo-sans);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .ask,
  .price {
    grid-area: 1 / 1;
  }
  .price {
    opacity: 0;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .dot,
  .awake .dot {
    opacity: 1;
    transform: none;
    transition:
      transform 0.5s var(--ewo-ease-spring) calc(var(--i) * 70ms),
      opacity 0.3s calc(var(--i) * 70ms);
  }
  :global(.tile:hover) .ask,
  .awake .ask {
    opacity: 0;
    transition: opacity 0.2s 0.35s;
  }
  :global(.tile:hover) .price,
  .awake .price {
    opacity: 1;
    transition: opacity 0.25s 0.4s;
  }
  :global(.tile:hover) .tag,
  .awake .tag {
    transform: translateX(-30%) rotate(-2deg);
    transition: transform 0.6s var(--ewo-ease-spring) 0.3s;
  }
</style>
