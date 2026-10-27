<script lang="ts">
  // Pitcher's deck in miniature, the landing's motif as one strip: the waveform's bars in the amber of
  // the mids, the kick in the blue of the lows every eight, under a fixed playhead, and below them the
  // tempo ruler with its needle on the source's 116. Hovering plays it: the bars run past the playhead
  // while the ruler slides to 128 under the needle and the spark pops; the app's page plays that once
  // on arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const bars = Array.from({ length: 220 }, (_, i) => {
    const kick = i % 8 === 0;
    const h = kick ? 1 : 0.32 + 0.3 * Math.abs(Math.sin(i * 0.9)) + ((i * 37) % 11) / 44;
    return { kick, h: Math.min(0.92, h) };
  });
  // 100 to 150 BPM, a tick every 5 px; the needle starts on 116 and ends on 128.
  const ticks = Array.from({ length: 51 }, (_, i) => 100 + i);
</script>

<div class="viz" class:awake aria-hidden="true">
  <div class="wave">
    <div class="bars">
      {#each bars as b, i (i)}<i class:kick={b.kick} style:--h={b.h}></i>{/each}
    </div>
    <span class="head"></span>
  </div>
  <div class="ruler">
    <div class="scale">
      {#each ticks as t (t)}<i class:five={t % 5 === 0} class:ten={t % 10 === 0}></i>{/each}
    </div>
    <span class="needle"></span>
    <b class="spark"></b>
  </div>
</div>

<style>
  .viz {
    flex: 1;
    display: grid;
    grid-template-rows: minmax(0, 1fr) 20px;
    gap: 8px;
    min-width: 0;
    overflow: hidden;
    padding: 10px 22px 6px;
  }
  .wave,
  .ruler {
    position: relative;
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 14%, #000 86%, transparent);
  }
  .bars {
    display: flex;
    align-items: center;
    gap: 3px;
    width: max-content;
    height: 100%;
  }
  .bars i {
    flex: none;
    width: 3px;
    height: calc(var(--h) * 100%);
    border-radius: 1px;
    background: var(--ewo-accent);
    opacity: 0.8;
  }
  .bars i.kick {
    background: var(--ewo-accent-2);
    opacity: 1;
  }
  .head {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    margin-left: -1px;
    background: var(--ewo-accent);
  }
  .scale {
    position: absolute;
    left: 50%;
    top: 4px;
    display: flex;
    align-items: flex-start;
    gap: 4px;
    translate: -80.5px 0;
  }
  .scale i {
    flex: none;
    width: 1px;
    height: 4px;
    background: var(--ewo-fg-4);
  }
  .scale i.five {
    height: 7px;
  }
  .scale i.ten {
    height: 10px;
    background: var(--ewo-fg-3);
  }
  .needle {
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 16px;
    margin-left: -1px;
    background: var(--ewo-accent);
  }
  .spark {
    position: absolute;
    left: 50%;
    top: 0;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    border-radius: 50%;
    background: var(--ewo-accent-2);
    scale: 0.8;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .bars,
  .awake .bars {
    translate: -144px 0;
    transition: translate 1.6s linear;
  }
  :global(.tile:hover) .scale,
  .awake .scale {
    translate: -140.5px 0;
    transition: translate 1s var(--ewo-ease-spring) 0.15s;
  }
  :global(.tile:hover) .spark,
  .awake .spark {
    scale: 1.5;
    transition: scale 0.5s var(--ewo-ease-spring) 0.9s;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tile:hover) .bars,
    .awake .bars {
      translate: none;
    }
    :global(.tile:hover) .scale,
    .awake .scale {
      transition: translate 0.2s ease;
    }
  }
</style>
