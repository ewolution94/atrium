<script lang="ts">
  // Verso's playlist in miniature, its icon's motif: three tracks, a cover and a title each, read
  // top to bottom, and the full stop that turns the titles into a sentence. Drawn, not data: the
  // messages are people's own. Hovering writes the titles in one after another, as the app's
  // list fills while it searches; its page does it once on arrival.
  let { awake = false }: { awake?: boolean } = $props();
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="list">
    {#each [0.9, 0.62, 0.38] as width, row (row)}
      <div class="row" style:--i={row}>
        <span class="cover" class:first={row === 0}></span>
        <span class="text">
          <i class="title" style:--w={width}></i>
          <i class="artist"></i>
        </span>
        {#if row === 2}<b class="stop"></b>{/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .viz {
    position: relative;
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 6px 22px 10px 18px;
  }
  .list {
    flex: 1;
    display: grid;
  }
  .row {
    position: relative;
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    height: 44px;
  }
  .cover {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1.5px solid var(--ewo-line-strong);
  }
  .cover.first {
    border-color: var(--ewo-accent);
    background: color-mix(in oklab, var(--ewo-accent) 16%, transparent);
  }
  .text {
    position: relative;
    display: grid;
    gap: 6px;
  }
  .text i {
    display: block;
    height: 4px;
    border-radius: 2px;
    transform-origin: left center;
  }
  .title {
    width: calc(var(--w) * 100%);
    background: var(--ewo-fg-3);
  }
  .text .artist {
    width: 30%;
    height: 3px;
    background: var(--ewo-fg-4);
  }
  /* The full stop sits right after the last title. */
  .stop {
    position: absolute;
    left: calc(42px + (100% - 42px) * 0.38 + 8px);
    top: 13px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--ewo-accent);
  }

  .awake .title {
    animation: write 520ms var(--ewo-ease) both;
    animation-delay: calc(var(--i) * 140ms);
  }
  .awake .stop {
    animation: stop 360ms var(--ewo-ease-spring, var(--ewo-ease)) 560ms both;
  }
  @keyframes write {
    from {
      transform: scaleX(0.08);
      opacity: 0.4;
    }
  }
  @keyframes stop {
    from {
      transform: scale(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .awake .title,
    .awake .stop {
      animation: none;
    }
  }
</style>
