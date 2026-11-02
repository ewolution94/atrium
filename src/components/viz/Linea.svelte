<script lang="ts">
  // Linea's plan in miniature, the landing's motif: three lanes drawn as metro lines with their
  // badges, a section on each with a stop at either end (M2's in the blue of line 3), a station on
  // M3, dashed weeks and today's red line with its tag. Hovering works the plan: M2's section is
  // stretched a week by its end stop, which pops into the spark, and M3's is dragged a week on, up
  // to the station; the app's page plays that once on arrival. Drawn, not data: positions are
  // percentages of the line, so it reads the same at any width. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  // x and w in % of the line; d stretches the end by that much, dx drags the whole section.
  const lanes = [
    { x: 4.1, w: 37.8 },
    { x: 29.1, w: 47.3, d: 16.2, alt: true },
    { x: 10.8, w: 32.4, dx: 16.2, station: 64.9 },
  ];
  const weeks = [16.2, 32.4, 48.6, 64.9, 81.1];
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="plan">
    <div class="grid">
      {#each weeks as x (x)}
        <i class="wk" style:--x={x}></i>
      {/each}
      <i class="today"><b class="tag"></b></i>
    </div>
    {#each lanes as l, i (i)}
      <div class="lane">
        <b class="no">M{i + 1}</b>
        <div class="rail">
          <span class="sec" class:alt={l.alt} class:stretch={l.d} class:drag={l.dx} style:--x={l.x} style:--w={l.w} style:--d={l.d ?? 0} style:--dx={l.dx ?? 0}>
            <i class="body"></i>
            <i class="cap"></i>
            <i class="cap end">
              {#if l.d}<b class="spark"></b>{/if}
            </i>
          </span>
          {#if l.station}
            <i class="station" style:--x={l.station}></i>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .viz {
    --h: 9px;
    --gap: 14px;
    --no: 18px;
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 18px 26px 2px 20px;
  }
  .plan {
    position: relative;
    flex: 1;
    min-width: 0;
    display: grid;
    gap: var(--gap);
  }
  .lane {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .no {
    flex: none;
    width: var(--no);
    font: 600 9.5px / 1 var(--ewo-mono);
    letter-spacing: 0.02em;
    color: var(--ewo-fg-3);
  }
  /* The line itself, with the sections on it; its width is what the percentages measure. */
  .rail {
    position: relative;
    flex: 1;
    height: var(--h);
    container-type: inline-size;
  }
  .rail::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1.5px;
    margin-top: -0.75px;
    background: var(--ewo-line-strong);
  }

  /* The weeks and today, over the lines' width only (the badges keep their column). */
  .grid {
    position: absolute;
    left: calc(var(--no) + 10px);
    right: 0;
    top: -12px;
    bottom: -6px;
  }
  .wk,
  .today {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--x) * 1%);
  }
  .wk {
    border-left: 1px dashed var(--ewo-line);
  }
  .today {
    --x: 52.7;
    width: 1.5px;
    margin-left: -0.75px;
    background: var(--ewo-accent);
  }
  .tag {
    position: absolute;
    left: 50%;
    top: 0;
    width: 16px;
    height: 7px;
    margin-left: -8px;
    border-radius: 4px;
    background: var(--ewo-accent);
  }

  /* A section: the body between the stops' centres and a round end at each, so stretching scales
     only the body and moves the end. */
  .sec {
    position: absolute;
    top: 0;
    left: calc(var(--x) * 1%);
    width: calc(var(--w) * 1%);
    height: var(--h);
    color: var(--ewo-fg);
  }
  .alt {
    color: var(--ewo-accent-2);
  }
  .body {
    position: absolute;
    inset: 0;
    background: currentColor;
    transform-origin: left;
  }
  .cap {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--h);
    height: var(--h);
    margin-left: calc(var(--h) / -2);
    border-radius: 50%;
    background: currentColor;
  }
  .end {
    left: 100%;
  }
  /* The stop, a dot of the tile's ground in the round end. */
  .cap::after {
    content: '';
    position: absolute;
    inset: calc(var(--h) / 3);
    border-radius: 50%;
    background: var(--ewo-panel);
  }
  .station {
    position: absolute;
    top: 50%;
    left: calc(var(--x) * 1%);
    width: calc(var(--h) + 3px);
    height: calc(var(--h) + 3px);
    translate: -50% -50%;
    border: 2.5px solid var(--ewo-fg);
    border-radius: 50%;
    background: var(--ewo-panel);
  }
  .spark {
    position: absolute;
    inset: 1px;
    z-index: 1;
    border-radius: 50%;
    background: var(--ewo-accent);
    scale: 0;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .stretch .body,
  .awake .stretch .body {
    scale: calc((var(--w) + var(--d)) / var(--w)) 1;
    transition: scale 0.7s var(--ewo-ease-spring);
  }
  :global(.tile:hover) .stretch .end,
  .awake .stretch .end {
    translate: calc(var(--d) * 1cqw) 0;
    transition: translate 0.7s var(--ewo-ease-spring);
  }
  :global(.tile:hover) .drag,
  .awake .drag {
    translate: calc(var(--dx) * 1cqw) 0;
    transition: translate 0.7s var(--ewo-ease-spring) 0.12s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.5;
    transition: scale 0.5s var(--ewo-ease-spring) 0.55s;
  }
  @media (max-width: 720px) {
    .viz {
      --h: 12px;
      --gap: 34px;
      padding: 30px 26px 6px 20px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .stretch .body,
    :global(.tile:hover) .stretch .end,
    :global(.tile:hover) .drag,
    .awake .stretch .body,
    .awake .stretch .end,
    .awake .drag {
      transition: none;
    }
  }
</style>
