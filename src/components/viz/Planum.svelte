<script lang="ts">
  // A floor plan with a sloped ceiling. On hover it tips into 3D and the walls rise: Planum's
  // two views in one gesture. The wall layers are stacked copies lifted along Z.
  let { awake = false }: { awake?: boolean } = $props();
  const WALLS = 'M10 10H310V200H10ZM170 10V120M170 150V200M10 110H90M125 110H170';
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="mode"><span>2D</span><span>3D</span></div>
  <div class="plan">
    <svg viewBox="0 0 320 210">
      <rect class="slope" x="10" y="10" width="300" height="46" />
      <path
        class="hatch"
        d="M10 50L50 10M34 56L80 10M58 56L104 10M82 56L128 10M106 56L152 10M130 56L176 10M154 56L200 10M178 56L224 10M202 56L248 10M226 56L272 10M250 56L296 10M274 56L310 20M298 56L310 44"
      />
      <path class="edge" d="M10 56H310" />
      <path class="thin" d="M125 110V75M90 110A35 35 0 0 1 125 75M170 150H205M170 150A35 35 0 0 1 205 185M60 200H130M235 200H285" />
      <text class="label acc" x="18" y="36">1,20 m</text>
      <text class="label" x="22" y="100">11,8 m²</text>
      <text class="label" x="22" y="188">14,2 m²</text>
      <text class="label" x="222" y="128">26,4 m²</text>
    </svg>
    {#each [1, 2, 3] as z (z)}
      <svg class="walls z{z}" viewBox="0 0 320 210"><path d={WALLS} /></svg>
    {/each}
  </div>
</div>

<style>
  .viz {
    position: relative;
    flex: 1;
    display: grid;
    place-items: center;
    padding: 18px 24px 0;
    perspective: 1100px;
    container-type: size;
  }
  .mode {
    position: absolute;
    top: 18px;
    right: 20px;
    display: grid;
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.08em;
    color: var(--ewo-fg-3);
  }
  .mode span {
    grid-area: 1 / 1;
    transition: opacity 0.4s;
  }
  .mode span:last-child,
  :global(.tile:hover) .mode span:first-child,
  .awake .mode span:first-child {
    opacity: 0;
  }
  :global(.tile:hover) .mode span:last-child,
  .awake .mode span:last-child {
    opacity: 1;
    color: var(--ewo-accent);
  }

  .plan {
    position: relative;
    width: min(100cqw - 56px, (100cqh - 34px) * 1.52, 440px);
    aspect-ratio: 320 / 210;
    transform-style: preserve-3d;
    transition: transform 0.9s var(--ewo-ease);
  }
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    transition: transform 0.9s var(--ewo-ease);
  }
  :global(.tile:hover) .plan,
  .awake .plan {
    transform: rotateX(56deg) rotateZ(-34deg) scale(0.9);
  }
  :global(.tile:hover) .z1,
  .awake .z1 {
    transform: translateZ(10px);
  }
  :global(.tile:hover) .z2,
  .awake .z2 {
    transform: translateZ(20px);
  }
  :global(.tile:hover) .z3,
  .awake .z3 {
    transform: translateZ(30px);
  }

  .walls path {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 5;
    stroke-linecap: square;
  }
  .z1 path,
  .z2 path {
    opacity: 0.35;
  }
  .slope {
    fill: color-mix(in oklab, var(--ewo-accent) 16%, transparent);
  }
  .hatch {
    fill: none;
    stroke: var(--ewo-accent);
    stroke-width: 1.2;
    opacity: 0.7;
  }
  .edge {
    fill: none;
    stroke: var(--ewo-accent);
    stroke-width: 1.5;
    stroke-dasharray: 5 5;
  }
  .thin {
    fill: none;
    stroke: var(--ewo-fg-3);
    stroke-width: 1.2;
  }
  .label {
    font: 500 9.5px var(--ewo-mono);
    fill: var(--ewo-fg-2);
    letter-spacing: 0.04em;
  }
  .acc {
    fill: var(--ewo-accent);
  }
</style>
