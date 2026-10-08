<script lang="ts">
  // CDNMS's board in miniature, after the landing's motif: a typed clue above five by three cards,
  // one already Violet's, the assassin crossed in the stamp's red, a paper clip on a chosen card.
  // Hovering plays a turn: Green's cards turn over one by one in the Grünstift ink and the pointer
  // (the spark) swells. The app's page plays that once on arrival. Drawn, not data. Only transforms
  // and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const GREEN = '#2e7a56';
  const VIOLET = '#6a3fa6';
  const STAMP = '#c8322b';
  const PAPER = '#fbf7ec';
  const W = 34;
  const H = 22;
  const GAP = 6;
  const X0 = 46;
  const Y0 = 34;
  const cards = Array.from({ length: 15 }, (_, i) => ({ i, x: X0 + (i % 5) * (W + GAP), y: Y0 + Math.floor(i / 5) * (H + GAP) }));
  /** The cards Green turns over on hover, in order. */
  const TURN = [1, 7, 13];
  const VIOLET_CARD = 4;
  const ASSASSIN = 9;
  const CLIP = 3;
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="40 0 210 116" preserveAspectRatio="xMidYMax meet">
    <text class="clue" x="145" y="22" text-anchor="middle">MUSIK 3</text>
    {#each cards as card (card.i)}
      <g class="card" class:turn={TURN.includes(card.i)} style:--n={TURN.indexOf(card.i)}>
        <rect x={card.x} y={card.y} width={W} height={H} rx="2" fill={card.i === VIOLET_CARD ? VIOLET : card.i === ASSASSIN ? '#22201c' : PAPER} class="edge" />
        {#if TURN.includes(card.i)}
          <rect class="ink" x={card.x} y={card.y} width={W} height={H} rx="2" fill={GREEN} />
        {/if}
        {#if card.i !== VIOLET_CARD && card.i !== ASSASSIN}
          <path class="word" d="M{card.x + 8} {card.y + H / 2}H{card.x + W - 8}" />
        {/if}
      </g>
    {/each}
    <path d="M{cards[ASSASSIN].x + 12} {cards[ASSASSIN].y + 6}L{cards[ASSASSIN].x + 22} {cards[ASSASSIN].y + 16}M{cards[ASSASSIN].x + 22} {cards[ASSASSIN].y + 6}L{cards[ASSASSIN].x + 12} {cards[ASSASSIN].y + 16}" stroke={STAMP} stroke-width="2.4" stroke-linecap="round" />
    <path class="clip" d="M{cards[CLIP].x + 15} {cards[CLIP].y + 7}V{cards[CLIP].y - 5}a3 3 0 0 1 6 0V{cards[CLIP].y + 9}a1.8 1.8 0 0 1 -3.6 0V{cards[CLIP].y - 2}" />
    <circle class="spark" cx={cards[13].x + W - 3} cy={cards[13].y + 3} r="4" fill={STAMP} />
  </svg>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    align-items: flex-end;
    min-width: 0;
    padding: 0 22px 12px;
  }
  svg {
    width: 100%;
    max-height: 100%;
    overflow: visible;
  }
  .clue {
    fill: var(--ewo-fg);
    font: 600 11px/1 var(--ewo-mono);
    letter-spacing: 0.14em;
  }
  .edge {
    stroke: var(--ewo-fg);
    stroke-width: 1.2;
    stroke-opacity: 0.55;
  }
  .word {
    stroke: var(--ewo-fg);
    stroke-width: 2.2;
    stroke-linecap: round;
    opacity: 0.35;
  }
  .clip {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1.3;
    opacity: 0.6;
  }
  .ink {
    transform-box: fill-box;
    transform-origin: center;
    transform: scaleY(0);
    opacity: 0;
  }
  .spark {
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.7);
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .ink,
  .awake .ink {
    transform: none;
    opacity: 1;
    transition:
      transform 0.35s var(--ewo-ease-spring) calc(0.2s + var(--n) * 220ms),
      opacity 0.15s calc(0.2s + var(--n) * 220ms);
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    transform: scale(1.3);
    transition: transform 0.5s var(--ewo-ease-spring) 0.9s;
  }
</style>
