<script lang="ts">
  // Würfle's table in miniature, after the landing's motif: the rail at the back with one die kept on
  // it in its gold ring, and the dice thrown in front of it. Hovering tumbles the last die in, in the
  // glass dice's cobalt, and its middle pip, the spark, pops. The app's page plays that once on
  // arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const S = 30;
  /** A die centred on (x, y), turned r degrees. */
  const at = (x: number, y: number, r: number) => ({ x: x - S / 2, y: y - S / 2, r, cx: x, cy: y });
  const KEPT = at(132, 26, 0);
  const LOOSE = [at(92, 66, -12), at(176, 70, 9)];
  const LAST = at(232, 58, -18);
  /** Pips of a face, in die units (0 to 1). */
  const PIPS: Record<number, [number, number][]> = {
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  };
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="40 0 240 92" preserveAspectRatio="xMidYMax meet">
    <path class="rail" d="M56 44H264" />
    <ellipse class="ring" cx={KEPT.cx} cy={KEPT.cy + 12} rx="22" ry="8" />
    {#snippet die(d: ReturnType<typeof at>, face: number, cls = 'die')}
      <g transform="rotate({d.r} {d.cx} {d.cy})">
        <rect class={cls} x={d.x} y={d.y} width={S} height={S} rx="7" />
        {#each PIPS[face] as [px, py], k (k)}<circle class="pip" cx={d.x + px * S} cy={d.y + py * S} r="2.6" />{/each}
      </g>
    {/snippet}
    {@render die(KEPT, 5)}
    {@render die(LOOSE[0], 3)}
    {@render die(LOOSE[1], 2)}
    <g class="last">
      {@render die(LAST, 5, 'glass')}
      <!-- At the die's centre, so it needs no turn (a turn attribute and fill-box would move it). -->
      <circle class="spark" cx={LAST.cx} cy={LAST.cy} r="3.4" />
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
  .rail {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1.2;
    stroke-opacity: 0.3;
  }
  .ring {
    fill: none;
    stroke: var(--ewo-accent-2);
    stroke-width: 1.6;
  }
  .die {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1;
    stroke-opacity: 0.55;
  }
  .pip {
    fill: var(--ewo-fg);
    fill-opacity: 0.55;
  }
  /* The glass die: the cobalt, its pips white. */
  .glass {
    fill: var(--ewo-accent);
  }
  .last .pip {
    fill: #ffffff;
    fill-opacity: 1;
  }
  .spark {
    fill: var(--ewo-accent-2);
    transform-box: fill-box;
    transform-origin: center;
    scale: 0.7;
  }
  .last {
    transform-box: fill-box;
    transform-origin: center;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .last,
  .awake .last {
    transform: translate(-6%, -10%) rotate(90deg);
    transition: transform 0.5s var(--ewo-ease-spring) 0.1s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.4;
    transition: scale 0.5s var(--ewo-ease-spring) 0.55s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .last,
    .awake .last {
      transform: none;
    }
  }
</style>
