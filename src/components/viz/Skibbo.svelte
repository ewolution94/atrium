<script lang="ts">
  // Skibbo's street in miniature, after the landing's motif: four number plates in a row, the second at
  // 11, and a hand of plates below. Hovering flies the 12 from the hand onto the 11, in the fuchsia of
  // the plates that finish a pile, and the screw above it, the spark, pops. The app's page plays that
  // once on arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const W = 24;
  const H = 32;
  const PILES = [104, 134, 164, 194];
  const TOP = 32;
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="60 0 220 92" preserveAspectRatio="xMidYMax meet">
    {#each PILES as x, i (i)}
      <rect class="plate" x={x} y={TOP} width={W} height={H} rx="4" />
      <rect class="rim" x={x + 3} y={TOP + 3} width={W - 6} height={H - 6} rx="2.5" />
      <text class="num" x={x + W / 2} y={TOP + H / 2 + 4}>{[4, 11, 7, 1][i]}</text>
    {/each}
    <circle class="spark" cx={134 + W / 2} cy={TOP + 5} r="3" />
    <!-- The hand below the street. -->
    <g transform="rotate(-8 138 79)"><rect class="plate" x="128" y="68" width="20" height="24" rx="3" /></g>
    <g transform="rotate(2 162 79)"><rect class="plate" x="152" y="67" width="20" height="24" rx="3" /></g>
    <!-- The plate that flies: drawn upright at its place in the hand, so CSS moves it without a turn attribute. -->
    <g class="fly">
      <rect class="fuchsia" x="177" y="66" width="20" height="24" rx="3" />
      <text class="num on" x="187" y="82">12</text>
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
  .plate,
  .rim {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1;
    stroke-opacity: 0.55;
  }
  .rim {
    stroke-opacity: 0.3;
  }
  .num {
    fill: var(--ewo-fg);
    fill-opacity: 0.55;
    font: 600 11px/1 var(--ewo-sans);
    text-anchor: middle;
  }
  .num.on {
    fill: #ffffff;
    fill-opacity: 1;
    font-size: 9px;
  }
  .fuchsia {
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
    transform: rotate(12deg);
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .fly,
  .awake .fly {
    transform: translate(-41px, -34px) scale(1.2, 1.33) rotate(0deg);
    transition: transform 0.55s var(--ewo-ease-spring) 0.05s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.5;
    transition: scale 0.5s var(--ewo-ease-spring) 0.55s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .fly,
    .awake .fly {
      transform: rotate(12deg);
    }
  }
</style>
