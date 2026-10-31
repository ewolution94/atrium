<script lang="ts">
  // Fundus's register in miniature, the landing's motif as a window on the list: ruled articles,
  // each with its number, a figure, its name and what it takes and gives, under an ink rule, and
  // the middle row under the highlighter with its contents in ink on the yellow. Hovering flicks
  // through the register: the list runs up two articles under the band, from F-102 to F-104, and
  // the spark pops; the app's page plays that once on arrival. The band shows a second copy of the
  // list, clipped to it, so the rows change colour as they pass. Drawn, not data: numbers only, so
  // it reads the same in both languages. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  // The photo shelf and the first PDF tools, with a name and a "takes → gives" of their own length.
  const rows = [101, 102, 103, 104, 105, 106, 201].map((no, i) => ({
    no: `F-${no}`,
    name: 52 + ((i * 29) % 40),
    takes: 18 + ((i * 13) % 16),
    gives: 14 + ((i * 17) % 18),
  }));
</script>

{#snippet list()}
  <div class="list">
    {#each rows as r (r.no)}
      <div class="row">
        <span class="no">{r.no}</span>
        <i class="fig"></i>
        <i class="bar" style:--w={r.name}></i>
        <span class="tg"><i class="bar" style:--w={r.takes}></i><span class="arrow">→</span><i class="bar" style:--w={r.gives}></i></span>
      </div>
    {/each}
  </div>
{/snippet}

<div class="viz" class:awake aria-hidden="true">
  <div class="window">
    {@render list()}
    <div class="band">
      {@render list()}
      <b class="spark"></b>
    </div>
  </div>
</div>

<style>
  .viz {
    --row: 22px;
    /* How many rows show, and which one is under the highlighter (from 0). */
    --rows: 3;
    --at: 1;
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    padding: 8px 22px 4px;
  }
  /* Three rows show on the wall, five in a phone's taller tile: the highlighted one in the middle. */
  .window {
    position: relative;
    flex: 1;
    min-width: 0;
    height: calc(var(--row) * var(--rows));
    overflow: hidden;
    border-top: 1.5px solid var(--ewo-line-strong);
    mask-image: linear-gradient(to bottom, #000 66%, transparent);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    height: var(--row);
    border-bottom: 1px solid var(--ewo-line);
    font: 500 10px / 1 var(--ewo-mono);
    color: var(--ewo-fg-2);
  }
  .no {
    flex: none;
    width: 40px;
    font-variant-numeric: tabular-nums;
  }
  .fig {
    flex: none;
    width: 11px;
    height: 11px;
    border: 1.5px solid currentColor;
    border-radius: 1.5px;
    opacity: 0.7;
  }
  .bar {
    flex: none;
    width: calc(var(--w) * 1px);
    height: 3px;
    border-radius: 2px;
    background: currentColor;
    opacity: 0.45;
  }
  .tg {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
  }
  .arrow {
    opacity: 0.6;
  }
  /* The highlighter: the second row of the window, a copy of the list inside it in ink on the yellow. */
  .band {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(var(--row) * var(--at));
    height: var(--row);
    overflow: hidden;
    background: var(--ewo-accent);
  }
  .band .list {
    translate: 0 calc(var(--row) * var(--at) * -1);
  }
  .band .row {
    color: var(--ewo-bg);
    border-color: transparent;
  }
  .band .bar,
  .band .fig {
    opacity: 1;
  }
  .spark {
    position: absolute;
    right: 6px;
    top: 50%;
    width: 5px;
    height: 5px;
    margin-top: -2.5px;
    border-radius: 50%;
    background: var(--ewo-bg);
    scale: 0;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .list,
  .awake .list {
    translate: 0 calc(var(--row) * -2);
    transition: translate 0.7s var(--ewo-ease-spring);
  }
  :global(.tile:hover) .band .list,
  .awake .band .list {
    translate: 0 calc(var(--row) * (var(--at) + 2) * -1);
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1;
    transition: scale 0.5s var(--ewo-ease-spring) 0.55s;
  }
  @media (max-width: 720px) {
    .viz {
      --row: 26px;
      --rows: 5;
      --at: 2;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .list,
    .awake .list {
      transition: none;
    }
  }
</style>
