<script lang="ts">
  // Randomiser's wheel in miniature, after its icon: the rim, eight slices with one painted in the
  // fair's red, and the pointer at the top with its brass pin. Hovering spins the wheel a turn and a
  // half until the red slice stops under the pointer, the pointer flicks as the slices pass, and the
  // pin, the spark, pops. The app's page plays that once on arrival. Drawn, not data. Only transforms
  // and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const CX = 170;
  const CY = 54;
  const R = 34;
  const slices = Array.from({ length: 8 }, (_, i) => i);
  const at = (deg: number, r = R) => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180)];
  // The red slice starts a quarter turn and a bit away, so the spin lands it under the pointer.
  const [x0, y0] = at(-112.5);
  const [x1, y1] = at(-67.5);
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="60 0 220 92" preserveAspectRatio="xMidYMax meet">
    <g class="wheel">
      <path class="win" d="M{CX} {CY}L{x0} {y0}A{R} {R} 0 0 1 {x1} {y1}Z" />
      {#each slices as i (i)}
        {@const [x, y] = at(-112.5 + i * 45)}
        <line class="spoke" x1={CX} y1={CY} x2={x} y2={y} />
      {/each}
      <circle class="rim" cx={CX} cy={CY} r={R} />
      <circle class="hub" cx={CX} cy={CY} r="4.5" />
    </g>
    <g class="pointer">
      <path class="flap" d="M{CX - 6} 10L{CX + 6} 10L{CX} 25Z" />
    </g>
    <circle class="spark" cx={CX} cy="13" r="2.6" />
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
  .rim,
  .spoke,
  .hub,
  .flap {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1;
    stroke-opacity: 0.55;
  }
  .spoke {
    stroke-opacity: 0.3;
  }
  .rim {
    stroke-width: 2.5;
  }
  .flap {
    fill: var(--ewo-bg);
    stroke-linejoin: round;
    stroke-opacity: 0.7;
  }
  .win {
    fill: var(--ewo-accent);
    fill-opacity: 0.85;
  }
  .wheel {
    transform-box: view-box;
    transform-origin: 170px 54px;
    rotate: -135deg;
  }
  .pointer {
    transform-box: view-box;
    transform-origin: 170px 10px;
  }
  .spark {
    fill: var(--ewo-accent-2);
    transform-box: fill-box;
    transform-origin: center;
    scale: 0.8;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .wheel,
  .awake .wheel {
    rotate: 360deg;
    transition: rotate 1.3s cubic-bezier(0.2, 0.75, 0.2, 1);
  }
  :global(.tile:hover) .pointer,
  .awake .pointer {
    animation: flick 1.2s ease-out;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.5;
    transition: scale 0.5s var(--ewo-ease-spring) 1.2s;
  }
  @keyframes flick {
    10%,
    30%,
    50% {
      rotate: -16deg;
    }
    20%,
    40%,
    60% {
      rotate: 4deg;
    }
    80% {
      rotate: -6deg;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .wheel,
    .awake .wheel {
      rotate: -135deg;
    }
    :global(.tile:hover) .pointer,
    .awake .pointer {
      animation: none;
    }
  }
</style>
