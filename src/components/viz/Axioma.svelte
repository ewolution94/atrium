<script lang="ts">
  // Fanned cards over a rising price line: the landing's Axioma motif. No numbers: the
  // collection is private, so the tile shows the idea, not the data.
  let { awake = false }: { awake?: boolean } = $props();

  // A deterministic walk that ends higher than it starts.
  const points = (() => {
    let seed = 11;
    let v = 84;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: 31 }, (_, i) => {
      v = Math.max(10, Math.min(94, v + (rnd() - 0.6) * 14));
      return [i * 10, v] as const;
    });
  })();
  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y.toFixed(1)}`).join('');
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="cards"><span></span><span></span><span></span></div>
  <svg class="chart" viewBox="0 0 300 100" preserveAspectRatio="none">
    <path class="area" d="{line}L300 100L0 100Z" />
    <path class="ln" d={line} />
  </svg>
</div>

<style>
  .viz {
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  .cards {
    position: absolute;
    left: 50%;
    top: 26px;
    z-index: 1;
    width: 130px;
    height: 130px;
    margin-left: -65px;
  }
  .cards span {
    position: absolute;
    left: 26px;
    top: 0;
    width: 80px;
    height: 112px;
    border-radius: 9px;
    border: 1.5px solid var(--ewo-accent);
    background: var(--ewo-bg-raised);
    transform-origin: 50% 110%;
  }
  .cards span:nth-child(1) {
    transform: rotate(-14deg);
    opacity: 0.55;
  }
  .cards span:nth-child(2) {
    transform: rotate(-1deg);
    opacity: 0.85;
  }
  .cards span:nth-child(3) {
    transform: rotate(12deg);
    border-color: var(--ewo-accent-2);
  }
  .cards span:nth-child(3)::after {
    content: '';
    position: absolute;
    inset: 10px 10px 36px;
    border-radius: 5px;
    background: color-mix(in oklab, var(--ewo-accent-2) 16%, transparent);
  }
  :global(.tile:hover) .cards span,
  .awake .cards span {
    transition: transform 0.6s var(--ewo-ease-spring);
  }
  :global(.tile:hover) .cards span:nth-child(1),
  .awake .cards span:nth-child(1) {
    transform: rotate(-28deg) translateX(-8px);
  }
  :global(.tile:hover) .cards span:nth-child(3),
  .awake .cards span:nth-child(3) {
    transform: rotate(24deg) translateX(8px);
  }
  .chart {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 58%;
  }
  .ln {
    fill: none;
    stroke: var(--ewo-accent-2);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
  .area {
    fill: color-mix(in oklab, var(--ewo-accent) 14%, transparent);
  }
  .awake .cards {
    top: 22%;
    transform: scale(1.35);
  }
</style>
