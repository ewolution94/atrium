<script lang="ts">
  import { onMount } from 'svelte';
  import { go, route } from '../lib/route.svelte';
  import { prefs, setLayout, type Layout } from '../lib/prefs.svelte';
  import { t } from '../lib/i18n.svelte';

  let { onsearch, wall }: { onsearch: () => void; wall: boolean } = $props();

  let scrolled = $state(false);
  onMount(() => {
    const check = () => (scrolled = scrollY > 8);
    check();
    addEventListener('scroll', check, { passive: true });
    return () => removeEventListener('scroll', check);
  });

  function home(event: MouseEvent) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    if (route.slug) go(null);
    else scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
</script>

<header class="bar" class:scrolled>
  <a class="mark" href="/" onclick={home} aria-label="ewolution apps">
    <span class="e">e</span>wolution<span class="slash">/</span><span class="apps">apps</span>
  </a>

  <div class="tools">
    {#if wall}
      <ewo-segmented
        size="sm"
        label={t('layout')}
        value={prefs.layout}
        options={[
          { value: 'wall', label: t('wall') },
          { value: 'icons', label: t('icons') },
        ]}
        onchange={(e) => setLayout(e.detail.value as Layout)}
      ></ewo-segmented>
    {/if}
    <button class="search" onclick={onsearch} aria-label={t('search')}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" /></svg>
      <span class="label">{t('search')}</span>
      <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
    </button>
    <ewo-theme-toggle label-light={t('toLight')} label-dark={t('toDark')}></ewo-theme-toggle>
  </div>
</header>

<style>
  .bar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 16px;
    height: var(--bar-h);
    padding: 0 var(--gutter);
    background: color-mix(in oklab, var(--ewo-bg) 92%, transparent);
    border-bottom: 1px solid transparent;
  }
  .bar.scrolled {
    border-bottom-color: var(--ewo-line-2);
  }

  .mark {
    display: flex;
    align-items: baseline;
    font: 500 17px/1 var(--ewo-sans);
    letter-spacing: -0.01em;
    text-decoration: none;
    white-space: nowrap;
  }
  .e {
    font: italic 500 21px/1 var(--ewo-serif);
    /* Fraunces ships upright only (as on the landing); its italic is the browser's slant. */
    font-synthesis: style;
    margin-right: 1px;
  }
  .slash {
    color: var(--ewo-fg-4);
    margin: 0 7px;
    font-weight: 300;
  }
  .apps {
    color: var(--ewo-fg-2);
  }

  .tools {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }

  .search {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 7px 0 11px;
    border: 1px solid var(--ewo-line);
    border-radius: var(--ewo-r-sm);
    background: var(--ewo-fill);
    color: var(--ewo-fg-2);
    font-size: var(--ewo-text-sm);
  }
  .search:hover {
    color: var(--ewo-fg);
  }
  svg {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  @media (max-width: 640px) {
    .search {
      width: 34px;
      padding: 0;
      justify-content: center;
    }
    .label,
    kbd {
      display: none;
    }
  }
</style>
