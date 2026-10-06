<script lang="ts">
  // TCGSL's list in miniature, the landing's motif: three sets, newest first, each a logo, a name
  // and its best card, with the year scrubber at the edge. Drawn, not data: no set names that
  // would go stale when the next set comes out. Hovering fans the newest set's three best cards
  // out, as the app does on a wide screen; its page fans them once on arrival.
  let { awake = false }: { awake?: boolean } = $props();
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="list">
    {#each [0, 1, 2] as row (row)}
      <div class="row" class:first={row === 0}>
        <span class="date"><i></i><i></i></span>
        <span class="logo"></span>
        <span class="name"><i></i><i></i></span>
        <span class="peek">
          {#if row === 0}<b></b><b></b>{/if}<b></b>
        </span>
      </div>
    {/each}
  </div>
  <div class="rail"><i class="on"></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>

<style>
  .viz {
    position: relative;
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 6px 30px 10px 18px;
  }
  .list {
    flex: 1;
    display: grid;
    gap: 0;
  }
  .row {
    display: grid;
    grid-template-columns: 16px 58px minmax(0, 1fr) 46px;
    align-items: center;
    gap: 12px;
    height: 46px;
    border-bottom: 1px solid var(--ewo-line-2);
  }
  .row:last-child {
    border-bottom: 0;
  }
  .date,
  .name {
    display: grid;
    gap: 5px;
  }
  .date i,
  .name i {
    display: block;
    height: 3px;
    border-radius: 2px;
    background: var(--ewo-fg-4);
  }
  .date i:last-child {
    width: 70%;
  }
  .name i:first-child {
    width: 82%;
    background: var(--ewo-fg-3);
  }
  .name i:last-child {
    width: 50%;
  }
  .logo {
    height: 24px;
    border-radius: 7px;
    border: 1.5px solid var(--ewo-line-strong);
  }
  .first .logo {
    border-color: var(--ewo-accent);
    background: color-mix(in oklab, var(--ewo-accent) 14%, transparent);
  }
  .peek {
    position: relative;
    height: 32px;
  }
  .peek b {
    position: absolute;
    right: 0;
    top: 0;
    width: 23px;
    height: 32px;
    border-radius: 4px;
    border: 1.5px solid var(--ewo-line-strong);
    background: var(--ewo-bg-raised);
    transform-origin: 50% 100%;
  }
  .first .peek b {
    border-color: var(--ewo-accent);
  }
  .first .peek b:last-child {
    background: color-mix(in oklab, var(--ewo-accent) 30%, var(--ewo-bg-raised));
  }
  .first .peek b:nth-child(1) {
    opacity: 0.55;
  }
  .first .peek b:nth-child(2) {
    opacity: 0.8;
  }
  :global(.tile:hover) .first .peek b,
  .awake .first .peek b {
    transition: transform 0.6s var(--ewo-ease-spring);
  }
  :global(.tile:hover) .first .peek b:nth-child(1),
  .awake .first .peek b:nth-child(1) {
    transform: translateX(-20px) rotate(-12deg);
  }
  :global(.tile:hover) .first .peek b:nth-child(2),
  .awake .first .peek b:nth-child(2) {
    transform: translateX(-10px) rotate(-5deg);
  }
  .rail {
    position: absolute;
    right: 12px;
    top: 16px;
    bottom: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .rail i {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--ewo-fg-4);
  }
  .rail .on {
    width: 7px;
    height: 7px;
    background: var(--ewo-accent-2);
  }
  .awake {
    padding-inline: 12% 16%;
  }
  .awake .row {
    height: 64px;
  }
</style>
