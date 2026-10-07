<script lang="ts">
  // Kritzle's turn in miniature, after the landing's motif: a taped sheet with a doodled house, the
  // word's blanks above it, and the chat beside it. Hovering plays the turn: the house hops, the
  // guesses pop in one by one, the last one lit as the right one, and the pen's tip (the spark)
  // swells. The app's page plays that once on arrival. Drawn, not data. Only transforms and opacity
  // move.
  let { awake = false }: { awake?: boolean } = $props();

  const INK = '#2b2d33';
  const LIME = '#c8f53c';
  const CORAL = '#ff6f4f';
  const TEAL = '#4fc3b9';
  const bubbles = [
    { y: 34, w: 46 },
    { y: 56, w: 62 },
    { y: 78, w: 54, right: true },
  ];
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="14 4 272 102" preserveAspectRatio="xMidYMax meet">
    <g transform="translate(150 106) scale(0.8) translate(-150 -106)">
    <g transform="rotate(-4 92 64)">
      <rect class="sheet" x="34" y="26" width="116" height="78" rx="3" />
      <rect x="22" y="22" width="26" height="9" fill={TEAL} opacity="0.7" transform="rotate(-28 35 26)" />
      <rect x="136" y="22" width="26" height="9" fill={CORAL} opacity="0.55" transform="rotate(28 149 26)" />
      <g class="house">
        <path d="M66 96V70L92 50L118 70V96Z" class="ink" />
        <path d="M86 96V82H98V96" class="ink" />
        <path d="M108 61V52H114V66" class="ink" />
        <path d="M111 48C107 44 115 41 111 36C108 33 114 30 117 29" class="ink thin" />
      </g>
      <circle class="tip" cx="117" cy="29" r="4.5" fill={CORAL} />
    </g>
    <g class="blanks" stroke={INK}>
      <path d="M58 14H68M74 14H84M90 14H100M106 14H116" />
    </g>
    {#each bubbles as b, i (b.y)}
      <g class="bubble" style:--i={i}>
        <rect x="182" y={b.y} width={b.w} height="16" rx="8" fill={b.right ? LIME : '#ffffff'} stroke={INK} stroke-width="1.6" />
        <path d="M190 {b.y + 8}H{182 + b.w - 10}" stroke={INK} stroke-width="2.2" stroke-linecap="round" opacity={b.right ? 0.8 : 0.35} />
      </g>
    {/each}
    </g>
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
  .sheet {
    fill: #ffffff;
    stroke: var(--ewo-fg);
    stroke-width: 2;
  }
  .ink {
    fill: none;
    stroke: #4f6b05;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .ink.thin {
    stroke-width: 2;
  }
  .blanks {
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke: var(--ewo-fg);
    opacity: 0.5;
  }
  .house {
    transform-box: fill-box;
    transform-origin: 50% 100%;
  }
  .tip {
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.7);
  }
  .bubble {
    opacity: 0.22;
    transform: translateX(-6px);
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .house,
  .awake .house {
    animation: hop 0.6s var(--ewo-ease-spring);
  }
  :global(.tile:hover) .tip,
  .awake .tip {
    transform: scale(1.25);
    transition: transform 0.5s var(--ewo-ease-spring) 0.2s;
  }
  :global(.tile:hover) .bubble,
  .awake .bubble {
    opacity: 1;
    transform: none;
    transition:
      opacity 0.25s calc(0.25s + var(--i) * 160ms),
      transform 0.4s var(--ewo-ease-spring) calc(0.25s + var(--i) * 160ms);
  }
  @keyframes hop {
    40% {
      transform: translateY(-5px) rotate(-3deg);
    }
    75% {
      transform: translateY(0) rotate(1deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .house,
    .awake .house {
      animation: none;
    }
  }
</style>
