<script lang="ts">
  // Stichle's table in miniature, after the landing's motif: a trick on the pile, the Wizard on top
  // in the baize green with its gold rule, a hand fanned below. Hovering plays a card: the middle one
  // flicks up from the hand onto the pile and the gold dot (the spark, the bid met) pops. The app's page
  // plays that once on arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const PAPER = '#f8f6f1';
  const W = 30;
  const H = 42;
  /** The trick: two cards under the Wizard, each nudged towards the seat that played it. */
  const PILE = [
    { x: 104, y: 22, r: -15 },
    { x: 128, y: 18, r: 11 },
  ];
  const HAND = [-2, -1, 0, 1, 2].map((t) => ({ t, x: 130 + t * 24 - W / 2, y: 84 + t * t * 2.5, r: t * 9 }));
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="40 6 180 124" preserveAspectRatio="xMidYMax meet">
    {#each PILE as card, i (i)}
      <rect class="edge" x={card.x} y={card.y} width={W} height={H} rx="3.5" fill={PAPER} transform="rotate({card.r} {card.x + W / 2} {card.y + H / 2})" />
    {/each}
    <g transform="rotate(-3 130 52)">
      <rect class="wizard" x={115} y={31} width={W} height={H} rx="3.5" />
      <rect class="rule" x={119} y={35} width={W - 8} height={H - 8} rx="2" />
      <text class="z" x="130" y="57" text-anchor="middle">Z</text>
    </g>
    {#each HAND as card (card.t)}
      <g class="held" class:flick={card.t === 0}>
        <rect class="edge" x={card.x} y={card.y} width={W} height={H} rx="3.5" fill={PAPER} transform="rotate({card.r} {card.x + W / 2} {card.y + H / 2})" />
      </g>
    {/each}
    <circle class="spark" cx="146" cy="31" r="4.5" />
  </svg>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    align-items: flex-end;
    min-width: 0;
    padding: 0 22px 0;
  }
  svg {
    width: 100%;
    max-height: 100%;
    overflow: visible;
  }
  .edge {
    stroke: var(--ewo-fg);
    stroke-width: 1.2;
    stroke-opacity: 0.55;
  }
  .wizard {
    fill: var(--ewo-accent);
  }
  .rule {
    fill: none;
    stroke: var(--ewo-accent-2);
    stroke-width: 1.4;
  }
  .z {
    fill: var(--ewo-accent-2);
    font: 700 15px/1 var(--ewo-serif, Georgia, serif);
  }
  .spark {
    fill: var(--ewo-accent-2);
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.7);
  }
  /* The card's own box: percentages below are of its size (30 × 42), the same in every browser. */
  .flick {
    transform-box: fill-box;
    transform-origin: center;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .flick,
  .awake .flick {
    transform: translate(62%, -108%) rotate(16deg);
    transition: transform 0.45s var(--ewo-ease-spring) 0.15s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    transform: scale(1.35);
    transition: transform 0.5s var(--ewo-ease-spring) 0.7s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .flick,
    .awake .flick {
      transform: none;
    }
  }
</style>
