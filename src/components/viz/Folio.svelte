<script lang="ts">
  // The shared tokens: every app's accent as a swatch, over the shapes of the shared elements
  // (a segmented control, a switch, the uptime ticks).
  let { awake = false }: { awake?: boolean } = $props();
  const PROJECTS = ['clinch', 'planum', 'axioma', 'pulse', 'harbor', 'mulpur', 'fermata'];
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="swatches">
    {#each PROJECTS as p, i (p)}<span data-ewo-project={p} style:--i={i}></span>{/each}
  </div>
  <div class="parts">
    <span class="seg"><b></b><i></i><i></i></span>
    <span class="switch"><b></b></span>
    <span class="ticks">{#each Array(16) as _, i (i)}<i></i>{/each}</span>
  </div>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 22px;
    padding: 22px 26px 0;
  }
  .swatches {
    display: flex;
    gap: 8px;
  }
  .swatches span {
    flex: 1;
    max-width: 54px;
    aspect-ratio: 1;
    border-radius: 12px;
    background: var(--ewo-accent);
    box-shadow: inset 0 0 0 1px var(--ewo-line);
  }
  :global(.tile:hover) .swatches span,
  .awake .swatches span {
    transform: translateY(-6px);
    transition: transform 0.5s var(--ewo-ease-spring) calc(var(--i) * 40ms);
  }
  .parts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
  }
  .seg {
    display: flex;
    gap: 3px;
    padding: 3px;
    border: 1px solid var(--ewo-line);
    border-radius: var(--ewo-r-pill);
    background: var(--ewo-fill);
  }
  .seg b,
  .seg i {
    width: 44px;
    height: 22px;
    border-radius: var(--ewo-r-pill);
  }
  .seg b {
    background: var(--ewo-invert);
  }
  .switch {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 46px;
    height: 26px;
    padding: 3px;
    border-radius: var(--ewo-r-pill);
    background: var(--ewo-ok);
  }
  .switch b {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
  }
  .ticks {
    display: flex;
    gap: 2px;
  }
  .ticks i {
    width: 5px;
    height: 24px;
    border-radius: 1.5px;
    background: var(--ewo-ok);
  }
  .ticks i:nth-child(11) {
    background: var(--ewo-warn);
  }
</style>
