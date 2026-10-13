<script lang="ts">
  // Stammtisch's regulars' table in miniature, after the landing's motif: one long table with its four
  // games laid out on it, Mau-Mau's pile, a Doppelkopf trick, the Skat face down, a Durak attack
  // beaten. Hovering lifts the trick's winner in the card backs' bordeaux and the spark pops. The
  // app's page plays that once on arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const PAPER = '#f8f6f1';
  const W = 22;
  const H = 31;
  /** A card centred on (x, y), turned r degrees. */
  const at = (x: number, y: number, r: number) => ({ x: x - W / 2, y: y - H / 2, r, cx: x, cy: y });
  const PILE = [at(98, 46, -14), at(104, 44, 7), at(100, 45, -3)];
  const TRICK = [at(242, 30, -5), at(222, 46, -16), at(262, 46, 12)];
  const WIN = at(242, 54, 3);
  const SKAT = [at(370, 45, -8), at(392, 45, 6)];
  const ATTACK = at(508, 45, -6);
  const BEAT = at(518, 50, 24);
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="20 2 560 86" preserveAspectRatio="xMidYMax meet">
    <rect class="board" x="34" y="10" width="532" height="72" rx="36" />
    {#each PILE as c, i (i)}
      <rect class="edge" x={c.x} y={c.y} width={W} height={H} rx="2.6" fill={PAPER} transform="rotate({c.r} {c.cx} {c.cy})" />
    {/each}
    {#each TRICK as c, i (i)}
      <rect class="edge" x={c.x} y={c.y} width={W} height={H} rx="2.6" fill={PAPER} transform="rotate({c.r} {c.cx} {c.cy})" />
    {/each}
    <g class="win">
      <rect class="ober" x={WIN.x} y={WIN.y} width={W} height={H} rx="2.6" transform="rotate({WIN.r} {WIN.cx} {WIN.cy})" />
    </g>
    {#each SKAT as c, i (i)}
      <rect class="back" x={c.x} y={c.y} width={W} height={H} rx="2.6" transform="rotate({c.r} {c.cx} {c.cy})" />
    {/each}
    <rect class="edge" x={ATTACK.x} y={ATTACK.y} width={W} height={H} rx="2.6" fill={PAPER} transform="rotate({ATTACK.r} {ATTACK.cx} {ATTACK.cy})" />
    <rect class="edge" x={BEAT.x} y={BEAT.y} width={W} height={H} rx="2.6" fill={PAPER} transform="rotate({BEAT.r} {BEAT.cx} {BEAT.cy})" />
    <circle class="spark" cx="258" cy="36" r="3.6" />
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
  .board {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1.2;
    stroke-opacity: 0.22;
  }
  .edge {
    stroke: var(--ewo-fg);
    stroke-width: 1;
    stroke-opacity: 0.55;
  }
  .ober {
    fill: var(--ewo-accent);
  }
  /* The Skat, face down: the backs in the accent, a hairline round them. */
  .back {
    fill: var(--ewo-accent);
    fill-opacity: 0.55;
    stroke: var(--ewo-fg);
    stroke-width: 1;
    stroke-opacity: 0.4;
  }
  .spark {
    fill: var(--ewo-accent-2);
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.7);
  }
  .win {
    transform-box: fill-box;
    transform-origin: center;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .win,
  .awake .win {
    transform: translateY(-14%) scale(1.12);
    transition: transform 0.45s var(--ewo-ease-spring) 0.1s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    transform: scale(1.35);
    transition: transform 0.5s var(--ewo-ease-spring) 0.55s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .win,
    .awake .win {
      transform: none;
    }
  }
</style>
