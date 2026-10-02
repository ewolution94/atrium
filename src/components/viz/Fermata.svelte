<script lang="ts">
  // The fermata over a waveform, and Fermata's own first step right in the tile: paste a link,
  // and it opens in Fermata (which takes ?url=, the same parameter its share target uses).
  import { t } from '../../lib/i18n.svelte';

  let { url, awake = false }: { url: string | null; awake?: boolean } = $props();

  const BARS = Array.from({ length: 34 }, (_, i) => ({
    h: Math.min(100, 22 + Math.abs(Math.sin(i * 0.55) * 60 + Math.sin(i * 1.7) * 18)),
    d: -i * 0.13,
  }));

  let link = $state('');

  function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!url) return;
    const target = new URL(url);
    if (link.trim()) target.searchParams.set('url', link.trim());
    window.open(target.href, '_blank', 'noopener');
    link = '';
  }
</script>

<div class="viz" class:awake>
  <svg class="arc" viewBox="10 20 44 22" aria-hidden="true">
    <path d="M13.6 40A18.4 16.6 0 0 1 50.4 40A18.4 11 0 0 0 13.6 40Z" /><circle cx="32" cy="37.4" r="3.7" />
  </svg>
  <div class="wave" aria-hidden="true">
    {#each BARS as bar, i (i)}<i style:height="{bar.h}%" style:animation-delay="{bar.d}s"></i>{/each}
  </div>
  {#if url}
    <form onsubmit={submit}>
      <input type="url" bind:value={link} placeholder={t('pasteLink')} aria-label={t('pasteLink')} autocomplete="off" />
      <button type="submit" aria-label={t('openInFermata')}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>
      </button>
    </form>
  {/if}
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-width: 0;
    padding: 20px 22px 6px;
  }
  .arc {
    width: 60px;
    fill: var(--ewo-fg);
  }
  .wave {
    display: flex;
    align-items: center;
    gap: 3px;
    width: 100%;
    max-width: 260px;
    height: 56px;
  }
  .wave i {
    flex: 1;
    border-radius: 2px;
    background: var(--ewo-fg-3);
    animation: wave 1.1s var(--ewo-ease-io) infinite alternate;
    animation-play-state: paused;
  }
  /* The waveform only moves while it's looked at: an idle page stays still. */
  :global(.tile:hover) .wave i,
  .awake .wave i {
    animation-play-state: running;
    background: var(--ewo-fg);
  }
  @keyframes wave {
    from {
      transform: scaleY(0.3);
    }
    to {
      transform: scaleY(1);
    }
  }
  form {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 300px;
    padding: 4px 4px 4px 14px;
    border: 1px solid var(--ewo-line);
    border-radius: var(--ewo-r-pill);
    background: var(--ewo-bg-raised);
  }
  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: none;
    outline: none;
    color: var(--ewo-fg);
    /* 16px: smaller makes iOS zoom the page on focus. */
    font: 16px var(--ewo-sans);
  }
  input::placeholder {
    color: var(--ewo-fg-3);
  }
  form:focus-within {
    border-color: var(--ewo-line-strong);
  }
  button {
    display: grid;
    place-items: center;
    flex: none;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 50%;
    background: var(--ewo-invert);
    color: var(--ewo-invert-ink);
  }
  button svg {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .awake .arc {
    width: 96px;
  }
  .awake .wave {
    max-width: 380px;
    height: 90px;
  }
</style>
