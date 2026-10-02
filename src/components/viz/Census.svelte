<script lang="ts">
  // Tally marks, Census's mark (four strokes and the fifth across), counted out in rows.
  let { awake = false }: { awake?: boolean } = $props();
  const GROUPS = Array.from({ length: 18 }, (_, i) => i);
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="0 0 330 150">
    {#each GROUPS as g (g)}
      {@const x = 12 + (g % 6) * 54}
      {@const y = 14 + Math.floor(g / 6) * 46}
      <g class="group" style:--i={g}>
        <path class="stroke" d="M{x} {y}v30M{x + 8} {y}v30M{x + 16} {y}v30M{x + 24} {y}v30" />
        <path class="slash" d="M{x - 4} {y + 24}L{x + 28} {y + 6}" />
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
  .stroke {
    stroke: var(--ewo-fg-3);
    stroke-width: 2.4;
    stroke-linecap: round;
  }
  .slash {
    stroke: var(--ewo-fg);
    stroke-width: 2.2;
    stroke-linecap: round;
  }
  .group {
    opacity: calc(1 - var(--i) * 0.04);
  }
  :global(.tile:hover) .group,
  .awake .group {
    opacity: 1;
    transition: opacity 0.4s calc(var(--i) * 30ms);
  }
</style>
