<script lang="ts">
  // Wichtle's street, the landing's motif: paper-cut houses with stepped gables in gingerbread
  // brown under a few snowflakes, a window lit in some of them (who has joined). Hovering is the
  // live draw: the other windows light one by one, like the candles on the host's screen, then one
  // house's Advent door swings open and the red-sugar star pops above it, while the snow drifts. The
  // app's page plays that once on arrival. Drawn, not data: the street spreads across the tile and
  // drops houses where it's narrow. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  // h: the house's height on a street 64 units tall (48 at least, so the window clears the door);
  // lit: its window is lit already; pick: the house whose door opens. Each house is 36 units wide.
  // The street shows the first --n of them, so each width keeps a lit window and the picked house.
  const houses = [
    { h: 52, lit: true },
    { h: 60 },
    { h: 48 },
    { h: 56, pick: true },
    { h: 62, lit: true },
    { h: 50 },
    { h: 58 },
    { h: 48, lit: true },
    { h: 60 },
    { h: 52 },
    { h: 56, lit: true },
    { h: 49 },
    { h: 62 },
    { h: 54, lit: true },
    { h: 50 },
  ];
  // The windows still dark light in street order, after one another.
  let k = 0;
  const later = houses.map((h) => (h.lit ? 0 : k++));

  const gable = (h: number) => `M0 ${h}V16H6V8H12V0H24V8H30V16H36V${h}Z`;
  const door = (h: number) => `M13 ${h}V${h - 8}A5 5 0 0 1 23 ${h - 8}V${h}Z`;

  /** The app's star: eight points, as in its header and on its village. */
  const star = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 ? 4 : 10;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');

  // Snowflakes in the sky, as percentages of the tile's drawing.
  const flakes = [
    [6, 22],
    [17, 58],
    [24, 14],
    [33, 40],
    [41, 8],
    [52, 30],
    [61, 52],
    [68, 12],
    [77, 36],
    [86, 18],
    [93, 48],
    [12, 36],
    [47, 56],
    [82, 60],
  ];
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="sky">
    {#each flakes as [x, y], i (i)}
      <i class="flake" style:left="{x}%" style:top="{y}%"></i>
    {/each}
  </div>
  <div class="street">
    {#each houses as house, i (i)}
      <svg class="house" viewBox="0 0 36 64" style:--k={later[i]}>
        <g transform="translate(0 {64 - house.h})">
          <path class="wall" d={gable(house.h)} />
          <rect class="win" x="13" y="21" width="10" height="10" rx="2" />
          <rect class="glow" class:later={!house.lit} x="13" y="21" width="10" height="10" rx="2" />
          {#if house.pick}
            <path class="doorway" d={door(house.h)} />
            <path class="leaf" d={door(house.h)} />
            <polygon class="star" points={star} transform="translate(18 -15)" />
          {:else}
            <path class="door" d={door(house.h)} />
          {/if}
        </g>
      </svg>
    {/each}
  </div>
</div>

<style>
  .viz {
    --candle: #ffb84d;
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: flex-end;
    padding: 8px 20px 0;
    container-type: size;
  }
  .sky {
    position: absolute;
    inset: 6px 20px 30%;
  }
  .flake {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--ewo-fg-3);
    opacity: 0.45;
  }
  /* Fifteen houses on a wide wall, fewer where the tile is narrower. --span is the street's width
     in units (36 a house, 10 between), --u one unit: as large as the tile's height (the street and
     the star above it, 76 units) and width both allow. */
  .street {
    --n: 15;
    --span: calc(var(--n) * 46 - 10);
    --u: min(1.9px, calc(100cqh / 76), calc((100cqw - 40px) / var(--span)));
    position: relative;
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    gap: calc(10 * var(--u));
    border-bottom: 1.5px solid var(--ewo-line-strong);
  }
  @container (max-width: 1100px) {
    .street {
      --n: 11;
    }
    .house:nth-child(n + 12) {
      display: none;
    }
  }
  @container (max-width: 640px) {
    .street {
      --n: 7;
    }
    .house:nth-child(n + 8) {
      display: none;
    }
  }
  @container (max-width: 420px) {
    .street {
      --n: 5;
    }
    .house:nth-child(n + 6) {
      display: none;
    }
  }
  .house {
    flex: none;
    width: calc(36 * var(--u));
    height: calc(64 * var(--u));
    overflow: visible;
  }
  .wall {
    fill: var(--ewo-accent);
  }
  .win,
  .door {
    fill: color-mix(in oklab, var(--ewo-panel) 88%, var(--ewo-accent));
  }
  .glow {
    fill: var(--candle);
    filter: drop-shadow(0 0 2.5px color-mix(in oklab, var(--candle) 70%, transparent));
  }
  .later {
    opacity: 0;
  }
  .doorway {
    fill: var(--candle);
  }
  /* The Advent door, darker wood than the house in both themes. */
  .leaf {
    fill: color-mix(in oklab, var(--ewo-accent) 62%, black);
    transform-box: fill-box;
    transform-origin: left center;
  }
  .star {
    fill: var(--ewo-accent-2);
    transform-box: fill-box;
    transform-origin: center;
    scale: 0;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .later,
  .awake .later {
    opacity: 1;
    transition: opacity 0.25s var(--ewo-ease) calc(var(--k) * 80ms);
  }
  :global(.tile:hover) .leaf,
  .awake .leaf {
    scale: 0.12 1;
    transition: scale 0.5s var(--ewo-ease-spring) 0.8s;
  }
  :global(.tile:hover) .star,
  .awake .star {
    scale: 1;
    rotate: 45deg;
    transition:
      scale 0.5s var(--ewo-ease-spring) 1s,
      rotate 0.6s var(--ewo-ease) 1s;
  }
  :global(.tile:hover) .flake,
  .awake .flake {
    translate: 0 10px;
    transition: translate 2.4s linear;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .later,
    :global(.tile:hover) .leaf,
    :global(.tile:hover) .star,
    :global(.tile:hover) .flake,
    .awake .later,
    .awake .leaf,
    .awake .star,
    .awake .flake {
      transition: none;
    }
  }
</style>
