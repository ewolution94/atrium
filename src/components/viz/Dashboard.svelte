<script lang="ts">
  // Dashboard's Ledger: a row per app with hairlines between, its square, a setting and a switch.
  // On a hover the third switch flips and the dot that marks a value changed here comes up beside it.
  let { awake = false }: { awake?: boolean } = $props();
  const ROWS = [
    { w: 118, on: true },
    { w: 84, on: false },
    { w: 140, on: false, flips: true },
    { w: 100, on: true },
  ];
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="0 0 330 150">
    {#each ROWS as row, i (i)}
      {@const y = 19 + i * 37}
      {#if i}<path class="rule" d="M6 {y - 18.5}H324" />{/if}
      <rect class="app" x="10" y={y - 8} width="16" height="16" rx="4" />
      <rect class="label" x="38" y={y - 4} width={row.w} height="8" rx="4" />
      {#if row.flips}<circle class="dot" cx="254" cy={y} r="3.5" />{/if}
      <g class="switch" class:on={row.on} class:flips={row.flips}>
        <rect class="track" x="270" y={y - 10} width="40" height="20" rx="10" />
        <circle class="knob" cx="280" cy={y} r="7" />
      </g>
    {/each}
  </svg>
</div>

<style>
  .viz {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 22px 26px 0;
  }
  svg {
    width: 100%;
    max-width: 420px;
    max-height: 100%;
  }
  .rule {
    stroke: var(--ewo-line);
    stroke-width: 1;
  }
  .app {
    fill: var(--ewo-fg-4);
  }
  .label {
    fill: var(--ewo-fg-3);
  }
  .track {
    fill: none;
    stroke: var(--ewo-fg-3);
    stroke-width: 1.6;
    transition:
      fill 0.25s var(--ewo-ease),
      stroke 0.25s var(--ewo-ease);
  }
  .knob {
    fill: var(--ewo-fg-3);
    transition:
      transform 0.35s var(--ewo-ease-spring),
      fill 0.25s var(--ewo-ease);
  }
  .on .track,
  :global(.tile:hover) .flips .track,
  .awake .flips .track {
    fill: var(--ewo-fg);
    stroke: var(--ewo-fg);
  }
  .on .knob,
  :global(.tile:hover) .flips .knob,
  .awake .flips .knob {
    fill: var(--ewo-bg-raised);
    transform: translateX(20px);
  }
  .dot {
    fill: var(--ewo-fg);
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.4);
    transition:
      opacity 0.2s var(--ewo-ease) 0.15s,
      transform 0.3s var(--ewo-ease-spring) 0.15s;
  }
  :global(.tile:hover) .dot,
  .awake .dot {
    opacity: 1;
    transform: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .knob,
    .track,
    .dot {
      transition: none;
    }
  }
</style>
