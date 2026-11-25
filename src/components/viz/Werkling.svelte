<script lang="ts">
  // Werkling's Tower, its icon's building: the company as a tower with a floor per part of the work,
  // the lift shaft down its middle, among lower office buildings in pixel steps. The floors behind the
  // intern are lit and the lift car waits on the second. Hovering takes the car up floor by floor (in
  // steps, like the look's pixels), each floor lighting as it passes; at the top a flag pops up on the
  // crown, then the neighbours' windows light outward. The app's page plays that once on arrival.
  // Drawn, not data: nothing about the intern ever reaches the wall. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  // Units: a window is 6, a column of windows 10, a floor 12; every building stands on a street H tall.
  const H = 92;
  const STEP = 200; // ms per floor of the lift
  type Block = { c: number; f: number; cap?: boolean };
  // Eight on either side of the Tower; narrower tiles drop them from the ends (rank = distance).
  const left: Block[] = [
    { c: 3, f: 3, cap: true },
    { c: 2, f: 2 },
    { c: 3, f: 4 },
    { c: 2, f: 3, cap: true },
    { c: 3, f: 2 },
    { c: 2, f: 4 },
    { c: 3, f: 3, cap: true },
    { c: 2, f: 2 },
  ];
  const right: Block[] = [
    { c: 2, f: 4, cap: true },
    { c: 3, f: 3 },
    { c: 2, f: 2 },
    { c: 3, f: 4, cap: true },
    { c: 2, f: 3 },
    { c: 3, f: 2 },
    { c: 2, f: 4 },
    { c: 3, f: 3, cap: true },
  ];
  const width = (b: Block) => 4 + 10 * b.c;
  const neighbours = [
    ...left.map((b, i) => ({ ...b, rank: left.length - i })),
    ...right.map((b, i) => ({ ...b, rank: i + 1 })),
  ];

  /** The windows of a neighbour: lit already in a fixed scatter, the rest lighting after the lift. */
  const windows = (b: Block & { rank: number }, seed: number) => {
    const out: { x: number; y: number; lit: boolean; k: number }[] = [];
    let later = 0;
    for (let f = 0; f < b.f; f++)
      for (let c = 0; c < b.c; c++) {
        const lit = (seed * 5 + c * 3 + f * 7) % 4 === 0;
        out.push({ x: 4 + 10 * c, y: H - 12 * (f + 1) + 3, lit, k: lit ? 0 : later++ });
      }
    return out;
  };

  // The span of the street in units at each width (buildings plus 8 between), for --u.
  const TOWER = 54;
  const span = (maxRank: number) => {
    const shown = neighbours.filter((b) => b.rank <= maxRank);
    return shown.reduce((s, b) => s + width(b), TOWER) + 8 * shown.length;
  };

  const floors = [0, 1, 2, 3, 4, 5];
  const START = 1; // the car waits on the second floor
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="street" style:--s17={span(8)} style:--s11={span(5)} style:--s7={span(3)} style:--s5={span(2)}>
    {#each neighbours.slice(0, left.length) as b, i (i)}
      {@render block(b, i)}
    {/each}
    <svg class="tower" viewBox="0 0 {TOWER} {H}" style:--w={TOWER}>
      <rect class="body" x="0" y={H - 76} width={TOWER} height="76" />
      <rect class="body" x="16" y={H - 84} width="22" height="8" />
      <rect class="shaft" x="23" y={H - 71} width="8" height="70" />
      {#each floors as f (f)}
        {#each [4, 14, 34, 44] as x (x)}
          <rect class="win" x={x} y={H - 12 * (f + 1) + 3} width="6" height="6" />
          <rect
            class="lamp"
            class:later={f > START}
            style:--d="{(f - START) * STEP}ms"
            x={x}
            y={H - 12 * (f + 1) + 3}
            width="6"
            height="6"
          />
        {/each}
      {/each}
      <rect class="car" x="24" y={H - 12 * (START + 1) + 2} width="6" height="9" style:--rise="{-12 * (floors.length - 1 - START)}px" />
      <g class="flag">
        <rect x="26" y={H - 91} width="2" height="7" />
        <rect class="pennant" x="28" y={H - 91} width="6" height="4" />
      </g>
    </svg>
    {#each neighbours.slice(left.length) as b, i (i)}
      {@render block(b, left.length + i)}
    {/each}
  </div>
</div>

{#snippet block(b: Block & { rank: number }, seed: number)}
  {@const w = width(b)}
  {@const top = H - 12 * b.f - 4}
  <svg class="bldg r{b.rank}" viewBox="0 0 {w} {H}" style:--w={w}>
    <rect class="side" x="0" y={top} width={w} height={H - top} />
    {#if b.cap}<rect class="side" x="4" y={top - 4} width={w - 8} height="4" />{/if}
    {#each windows(b, seed) as win, j (j)}
      <rect class="win" x={win.x} y={win.y} width="6" height="6" />
      <rect class="lamp" class:later={!win.lit} style:--d="{1000 + b.rank * 90 + win.k * 60}ms" x={win.x} y={win.y} width="6" height="6" />
    {/each}
  </svg>
{/snippet}

<style>
  .viz {
    --lamp: light-dark(#ffcf5c, #fff0c4);
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: flex-end;
    padding: 8px 20px 0;
    container-type: size;
  }
  /* Seventeen buildings on a wide wall, fewer where the tile is narrower. --span is the street's
     width in units, --u one unit: as large as the tile's height (the street, 92 units) and width both
     allow. */
  .street {
    --span: var(--s17);
    --u: min(1.9px, calc(100cqh / 94), calc((100cqw - 40px) / var(--span)));
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    gap: calc(8 * var(--u));
    border-bottom: 1.5px solid var(--ewo-line-strong);
  }
  @container (max-width: 1100px) {
    .street {
      --span: var(--s11);
    }
    .r6,
    .r7,
    .r8 {
      display: none;
    }
  }
  @container (max-width: 640px) {
    .street {
      --span: var(--s7);
    }
    .r4,
    .r5 {
      display: none;
    }
  }
  @container (max-width: 420px) {
    .street {
      --span: var(--s5);
    }
    .r3 {
      display: none;
    }
  }
  .bldg,
  .tower {
    flex: none;
    width: calc(var(--w) * var(--u));
    height: calc(92 * var(--u));
    overflow: visible;
    shape-rendering: crispEdges;
  }
  /* The Tower in the brick orange, its neighbours paler, so it stands out in both themes. */
  .body {
    fill: var(--ewo-accent);
  }
  .side {
    fill: color-mix(in oklab, var(--ewo-accent) 45%, var(--ewo-panel));
  }
  .win {
    fill: color-mix(in oklab, var(--ewo-panel) 80%, var(--ewo-accent));
  }
  .bldg .win {
    fill: color-mix(in oklab, var(--ewo-panel) 88%, var(--ewo-accent));
  }
  /* The shaft is cut out of the Tower, as in the icon; the car is the one dark square in it. */
  .shaft {
    fill: var(--ewo-panel);
  }
  .car {
    fill: var(--ewo-fg);
  }
  .lamp {
    fill: var(--lamp);
  }
  .later {
    opacity: 0;
  }
  .flag {
    fill: var(--ewo-fg);
    transform-box: fill-box;
    transform-origin: left bottom;
    scale: 1 0;
  }
  .pennant {
    fill: var(--ewo-accent-2);
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .car,
  .awake .car {
    translate: 0 var(--rise);
    transition: translate 800ms steps(4, end);
  }
  :global(.tile:hover) .later,
  .awake .later {
    opacity: 1;
    transition: opacity 0.12s linear var(--d);
  }
  :global(.tile:hover) .flag,
  .awake .flag {
    scale: 1;
    transition: scale 0.3s var(--ewo-ease-spring) 0.88s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .car,
    :global(.tile:hover) .later,
    :global(.tile:hover) .flag,
    .awake .car,
    .awake .later,
    .awake .flag {
      transition: none;
    }
  }
</style>
