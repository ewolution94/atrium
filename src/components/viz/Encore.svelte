<script lang="ts">
  // Encore's check view in miniature, its look's own strip: a set as one bar cut into its tracks,
  // longer tracks deeper in the accent, and the first rows of its tracklist numbered in the accent
  // like a record sleeve's back. Drawn, not data: the sets are one person's own. Hovering cuts the
  // strip into its tracks one after another, as publishing does; its page does it once on arrival.
  let { awake = false }: { awake?: boolean } = $props();

  const cuts = [57, 70, 55, 35, 64, 52, 54, 31, 83, 31, 139, 103, 90];
  const total = cuts.reduce((a, b) => a + b, 0);
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="strip">
    {#each cuts as length, i (i)}
      <i style:--w={length / total} style:--depth={`${Math.min(85, 20 + length / 2)}%`} style:--i={i}></i>
    {/each}
  </div>
  <div class="rows">
    {#each [0.74, 0.58, 0.66] as width, row (row)}
      <div class="row">
        <b>{row + 1}</b>
        <span class="time"></span>
        <span class="title" style:--w={width}></span>
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
    flex-direction: column;
    justify-content: center;
    gap: 14px;
    padding: 6px 22px 12px 18px;
  }
  .strip {
    display: flex;
    gap: 2px;
    height: 9px;
  }
  .strip i {
    display: block;
    flex: var(--w) 1 0;
    background: color-mix(in oklab, var(--ewo-accent) var(--depth), transparent);
    transform-origin: left center;
  }
  .rows {
    display: grid;
    gap: 9px;
  }
  .row {
    display: grid;
    grid-template-columns: 14px 26px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
  }
  .row b {
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
    color: var(--ewo-accent);
    text-align: right;
  }
  .time {
    height: 3px;
    border-radius: 2px;
    background: var(--ewo-fg-4);
  }
  .title {
    width: calc(var(--w) * 100%);
    height: 4px;
    border-radius: 2px;
    background: var(--ewo-fg-3);
  }

  .awake .strip i {
    animation: cut 360ms var(--ewo-ease) both;
    animation-delay: calc(var(--i) * 45ms);
  }
  @keyframes cut {
    from {
      transform: scaleX(0.2);
      opacity: 0.3;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .awake .strip i {
      animation: none;
    }
  }
</style>
