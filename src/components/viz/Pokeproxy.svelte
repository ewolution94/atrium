<script lang="ts">
  // PokeProxy's sheet in miniature, the landing's motif laid out as one row: cards at a card's
  // proportions with their cut marks above and below, the ones before it printed in grey, the one
  // just placed outlined in the cutting mat's green with the yellow spark in its picture window, and
  // empty slots after it. Hovering lays proxies into the empty slots one after another and pops the
  // spark; the app's page plays that once on arrival. Drawn, not data. Only transforms and opacity
  // move.
  let { awake = false }: { awake?: boolean } = $props();

  // The card just placed sits in the middle, so a narrower tile, which crops both ends, still shows it.
  const NOW = 11;
  const slots = Array.from({ length: 24 }, (_, i) => i);
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="row">
    {#each slots as i (i)}
      <span class="cell" class:done={i < NOW} class:now={i === NOW} class:open={i > NOW} style:--k={i - NOW}>
        <span class="card">
          <i class="win">{#if i === NOW}<b class="spark"></b>{/if}</i>
          <i class="ln"></i>
          <i class="ln short"></i>
        </span>
      </span>
    {/each}
  </div>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    overflow: hidden;
    padding: 7px 22px 3px;
  }
  .row {
    display: flex;
    gap: 6px;
  }
  .cell {
    position: relative;
    flex: none;
    width: 38px;
    height: 53px;
  }
  /* The cut marks: a tick above and below each card's left edge, as on the printed sheet. */
  .cell::before,
  .cell::after {
    content: '';
    position: absolute;
    left: -3.5px;
    width: 1px;
    height: 4px;
    background: var(--ewo-fg-4);
  }
  .cell::before {
    top: -7px;
  }
  .cell::after {
    bottom: -7px;
  }
  .card {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-rows: 18px 2.5px 2.5px;
    align-content: start;
    gap: 4px;
    padding: 5px 4px;
    border: 1.5px solid var(--ewo-line-strong);
    border-radius: 4px;
    background: var(--ewo-bg-raised);
  }
  .card i {
    display: block;
    border-radius: 2px;
    background: var(--ewo-fg-4);
  }
  .win {
    position: relative;
    opacity: 0.55;
  }
  .ln.short {
    width: 62%;
  }
  .now .card {
    border-color: var(--ewo-accent);
  }
  .now .win {
    opacity: 1;
    background: color-mix(in oklab, var(--ewo-accent) 55%, transparent);
  }
  .spark {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    border-radius: 50%;
    background: var(--ewo-accent-2);
    scale: 0.8;
  }
  /* An empty slot is a dashed outline until a proxy is laid in it. */
  .open::before,
  .open::after {
    opacity: 0.6;
  }
  .open .card {
    border-style: dashed;
    background: none;
  }
  .open .card i {
    opacity: 0;
    translate: 0 -6px;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .open .card,
  .awake .open .card {
    border-style: solid;
    background: var(--ewo-bg-raised);
    transition: background 0.3s ease calc(var(--k) * 90ms);
  }
  :global(.tile:hover) .open .card i,
  .awake .open .card i {
    opacity: 1;
    translate: none;
    transition:
      opacity 0.3s ease calc(var(--k) * 90ms),
      translate 0.45s var(--ewo-ease-spring) calc(var(--k) * 90ms);
  }
  :global(.tile:hover) .open .win,
  .awake .open .win {
    opacity: 0.55;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.5;
    transition: scale 0.5s var(--ewo-ease-spring) 0.2s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .open .card i,
    .awake .open .card i {
      transition: opacity 0.2s ease;
    }
  }
</style>
