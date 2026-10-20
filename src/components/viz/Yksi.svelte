<script lang="ts">
  // Yksi's table in miniature, after the landing's motif: the pile in the middle, a hand fanned at the
  // right, each card with its colour's sign. Hovering flies the last card of the hand onto the pile, in
  // the lagoon of the card backs, and the call's sun, the spark, pops. The app's page plays that once
  // on arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const W = 26;
  const H = 36;
  /** A card's top left for its centre (x, y). */
  const card = (x: number, y: number) => ({ x: x - W / 2, y: y - H / 2, cx: x, cy: y });
  const PILE = [card(118, 52), card(124, 50)];
  const HAND = [card(190, 60), card(208, 56), card(226, 58)];
  const FLY = card(244, 62);
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="60 0 220 92" preserveAspectRatio="xMidYMax meet">
    <rect class="card" x="70" y="34" width={W} height={H} rx="4" />
    <rect class="card" x="73" y="31" width={W} height={H} rx="4" />
    {#each PILE as c, i (i)}
      <g transform="rotate({i ? 7 : -6} {c.cx} {c.cy})"><rect class="card" x={c.x} y={c.y} width={W} height={H} rx="4" /></g>
    {/each}
    <!-- The hand: a triangle, a square, a diamond, each its colour's sign. -->
    <g transform="rotate(-12 {HAND[0].cx} {HAND[0].cy})"><rect class="card" x={HAND[0].x} y={HAND[0].y} width={W} height={H} rx="4" /><path class="sign" d="M{HAND[0].cx} {HAND[0].cy - 7}l6 11h-12z" /></g>
    <g transform="rotate(-2 {HAND[1].cx} {HAND[1].cy})"><rect class="card" x={HAND[1].x} y={HAND[1].y} width={W} height={H} rx="4" /><rect class="sign" x={HAND[1].cx - 5} y={HAND[1].cy - 5} width="10" height="10" rx="1" /></g>
    <g transform="rotate(8 {HAND[2].cx} {HAND[2].cy})"><rect class="card" x={HAND[2].x} y={HAND[2].y} width={W} height={H} rx="4" /><path class="sign" d="M{HAND[2].cx} {HAND[2].cy - 7}l6 7-6 7-6-7z" /></g>
    <!-- The card that flies: drawn upright at its place in the hand, so CSS moves it without a turn attribute. -->
    <g class="fly">
      <rect class="lagoon" x={FLY.x} y={FLY.y} width={W} height={H} rx="4" />
      <circle class="spark" cx={FLY.cx} cy={FLY.cy} r="5" />
    </g>
  </svg>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    align-items: flex-end;
    min-width: 0;
    padding: 4px 22px 0;
  }
  svg {
    width: 100%;
    max-height: 100%;
    overflow: visible;
  }
  .card {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1;
    stroke-opacity: 0.55;
  }
  .sign {
    fill: var(--ewo-fg);
    fill-opacity: 0.45;
  }
  .lagoon {
    fill: var(--ewo-accent);
  }
  .spark {
    fill: var(--ewo-accent-2);
    transform-box: fill-box;
    transform-origin: center;
    scale: 0.8;
  }
  /* One transform for the turn and the flight: a separate `rotate` would turn the flight's path too. */
  .fly {
    transform-box: fill-box;
    transform-origin: center;
    transform: rotate(16deg);
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .fly,
  .awake .fly {
    transform: translate(-118px, -10px) rotate(-4deg);
    transition: transform 0.55s var(--ewo-ease-spring) 0.05s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.4;
    transition: scale 0.5s var(--ewo-ease-spring) 0.55s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .fly,
    .awake .fly {
      transform: rotate(16deg);
    }
  }
</style>
