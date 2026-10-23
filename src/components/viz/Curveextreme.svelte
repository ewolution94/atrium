<script lang="ts">
  // CurveExtreme's arena in miniature, after its icon: the field's edge, someone else's curve and
  // yours in Ultraviolet, each with a gap and square ends like the game's lines. Hovering swings your
  // curve on its tail as if steering, the other head bursts (it crashed), and your head, the spark,
  // pops. The app's page plays that once on arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="60 0 220 92" preserveAspectRatio="xMidYMax meet">
    <rect class="edge" x="92" y="6" width="156" height="82" rx="2" />
    <g class="theirs">
      <path class="line" d="M102 78 C126 78 134 60 150 50" />
      <path class="line" d="M156 46 C164 42 170 42 176 42" />
      <circle class="head" cx="179" cy="42" r="2.4" />
      <g class="burst">
        <circle cx="179" cy="42" r="4" />
        <circle cx="183" cy="38" r="3" />
        <circle cx="175" cy="38" r="3" />
        <circle cx="181" cy="47" r="3" />
      </g>
    </g>
    <g class="ours">
      <path class="line" d="M106 22 C132 22 150 30 166 50" />
      <path class="line" d="M172 58 C184 72 204 76 222 70" />
    </g>
    <circle class="spark" cx="226" cy="68.6" r="3.2" />
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
  .edge {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 1;
    stroke-opacity: 0.35;
  }
  .line {
    fill: none;
    stroke-width: 3;
    stroke-linecap: butt;
  }
  .theirs .line {
    stroke: var(--ewo-fg);
    stroke-opacity: 0.45;
  }
  .theirs .head {
    fill: var(--ewo-fg);
    fill-opacity: 0.45;
  }
  .burst circle {
    fill: var(--ewo-fg);
    fill-opacity: 0.35;
  }
  .burst {
    transform-box: view-box;
    transform-origin: 179px 42px;
    scale: 0.2;
    opacity: 0;
  }
  .ours .line {
    stroke: var(--ewo-accent);
  }
  .ours {
    transform-box: view-box;
    transform-origin: 106px 22px;
  }
  .spark {
    fill: var(--ewo-accent-2);
    transform-box: fill-box;
    transform-origin: center;
    scale: 0.8;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .ours,
  .awake .ours {
    animation: steer 1.1s ease-in-out;
  }
  :global(.tile:hover) .burst,
  .awake .burst {
    scale: 1.6;
    opacity: 1;
    transition:
      scale 0.6s cubic-bezier(0.2, 0.75, 0.2, 1) 0.35s,
      opacity 0.2s linear 0.35s;
  }
  :global(.tile:hover) .theirs .head,
  .awake .theirs .head {
    opacity: 0;
    transition: opacity 0.15s linear 0.35s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.5;
    transition: scale 0.5s var(--ewo-ease-spring) 0.9s;
  }
  @keyframes steer {
    30% {
      rotate: -5deg;
    }
    65% {
      rotate: 2deg;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .ours,
    .awake .ours {
      animation: none;
    }
  }
</style>
