<script lang="ts">
  // For an app on the wall before its own drawing exists: its icon, large, in a ring of its accent.
  let { slug, awake = false }: { slug: string; awake?: boolean } = $props();
</script>

<div class="viz" class:awake aria-hidden="true">
  <span class="ring">
    <img src="/apps/{slug}.svg" alt="" width="64" height="64" />
  </span>
</div>

<style>
  .viz {
    flex: 1;
    min-height: 0;
    display: grid;
    place-items: center;
    padding: 14px 26px 4px;
    container-type: size;
  }
  /* As tall as the drawing's room allows, up to 104 px: one row on a wide wall leaves it about 60. */
  .ring {
    display: grid;
    place-items: center;
    height: min(104px, 100cqh);
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid color-mix(in oklab, var(--ewo-accent, var(--ewo-fg-3)) 35%, transparent);
    box-shadow: 0 0 0 10px color-mix(in oklab, var(--ewo-accent, var(--ewo-fg-3)) 6%, transparent);
  }
  img {
    width: 62%;
    height: auto;
    border-radius: 25%;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  :global(.tile:hover) img,
  .awake img {
    transform: translateY(-3px);
  }
</style>
