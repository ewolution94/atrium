<script lang="ts">
  // An app's own page (/clinch): its tile grown into a stage, what it is, how it's doing, and the
  // way in. A page rather than an overlay, so it scrolls, shares and goes Back like any page.
  import { onMount } from 'svelte';
  import { go, wallPosition } from '../lib/route.svelte';
  import { i18n, t } from '../lib/i18n.svelte';
  import { morph } from '../lib/transition';
  import { prefs } from '../lib/prefs.svelte';
  import type { App, CantinaTile } from '../lib/types';
  import Viz from './Viz.svelte';
  import Uptime from './Uptime.svelte';

  let { app }: { app: App } = $props();

  let stage: HTMLElement;
  let icon: HTMLElement;

  const text = $derived(app.text[i18n.lang]);
  const openUrl = $derived(app.slug === 'cantina' && app.tile && app.url ? new URL((app.tile as CantinaTile).path, app.url).href : app.url);

  function back(event?: Event) {
    if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)) return;
    event?.preventDefault();
    const icons = prefs.layout === 'icons';
    morph(
      icons ? icon : stage,
      () => {
        go(null);
        scrollTo(0, wallPosition());
      },
      () => document.querySelector(icons ? `.app[href="/${app.slug}"] .ico` : `.tile[data-slug="${app.slug}"]`),
    );
  }

  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) back();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });
</script>

<article class="page" data-ewo-project={app.slug}>
  <a class="back" href="/" onclick={back}>
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" /></svg>
    {t('allApps')}
  </a>

  <div class="layout">
    <div class="stage" bind:this={stage} data-stage>
      <div class="glow" aria-hidden="true"></div>
      <Viz {app} awake />
    </div>

    <div class="body">
      <p class="kind">
        <img class="ico" bind:this={icon} data-stage-icon src="/apps/{app.slug}.svg" alt="" width="44" height="44" />
        {t('webApp')} · {app.since}
      </p>
      <h1 class="name">{app.name}</h1>
      <p class="line">{text.line}</p>

      <div class="actions">
        {#if openUrl}
          <a class="btn primary" href={openUrl} target="_blank" rel="noopener">{t('open')} {app.host} <span aria-hidden="true">↗</span></a>
        {:else}
          <span class="btn quiet">{t('notLive')}</span>
        {/if}
        {#if app.writeup}
          <a class="btn" href={app.writeup} target="_blank" rel="noopener">{t('howItWorks')} <span aria-hidden="true">↗</span></a>
        {/if}
        {#if app.repo}
          <a class="btn" href={app.repo} target="_blank" rel="noopener">{t('source')} <span aria-hidden="true">↗</span></a>
        {/if}
      </div>

      <p class="desc">{text.desc}</p>

      {#if app.status?.days}
        <Uptime days={app.status.days} uptime={app.status.uptime} />
      {/if}

      <dl class="facts">
        <dt>{t('kind')}</dt>
        <dd>{t('webApp')}</dd>
        <dt>{t('stack')}</dt>
        <dd>{app.stack}</dd>
        <dt>{t('since')}</dt>
        <dd>{app.since}</dd>
        <dt>{t('address')}</dt>
        <dd>
          {#if app.status}<i class="dot" data-state={app.status.state}></i>{/if}
          {app.host}
        </dd>
      </dl>
    </div>
  </div>
</article>

<style>
  .page {
    padding: 28px 0 24px;
  }
  .back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding: 8px 12px 8px 10px;
    border-radius: var(--ewo-r-pill);
    font-size: var(--ewo-text-sm);
    color: var(--ewo-fg-2);
    text-decoration: none;
  }
  .back:hover {
    color: var(--ewo-fg);
    background: var(--ewo-fill-2);
  }
  .back svg {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
  }
  .stage {
    position: sticky;
    top: calc(var(--bar-h) + 20px);
    isolation: isolate;
    overflow: hidden;
    display: flex;
    min-height: min(560px, calc(100dvh - var(--bar-h) - 60px));
    border-radius: var(--ewo-r-xl);
    background: var(--ewo-panel);
    border: 1px solid var(--ewo-line-2);
    box-shadow: var(--ewo-highlight);
    container-type: inline-size;
  }
  .glow {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(110% 90% at 100% 0%, color-mix(in oklab, var(--ewo-accent) 28%, transparent), transparent 58%),
      radial-gradient(80% 70% at 0% 100%, color-mix(in oklab, var(--ewo-accent-2) 13%, transparent), transparent 62%);
  }
  .stage :global(.viz) {
    padding: 32px;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 12px;
  }
  .kind {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0;
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
  .ico {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    box-shadow: 0 0 0 1px var(--ewo-line-2);
  }
  .name {
    margin: 0;
    font: 380 clamp(52px, 6vw, 76px) / 0.9 var(--ewo-serif);
    letter-spacing: -0.04em;
    font-variation-settings: 'opsz' 144;
  }
  .line {
    margin: 0;
    font-size: 19px;
    line-height: 1.4;
    color: var(--ewo-fg-2);
    text-wrap: pretty;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 16px;
    border-radius: var(--ewo-r-pill);
    border: 1px solid var(--ewo-line);
    background: var(--ewo-fill);
    font: 500 14px/1 var(--ewo-sans);
    text-decoration: none;
  }
  .btn:hover {
    background: var(--ewo-fill-3);
  }
  .primary {
    border-color: transparent;
    background: var(--ewo-invert);
    color: var(--ewo-invert-ink);
  }
  .primary:hover {
    background: var(--ewo-invert);
    opacity: 0.88;
  }
  .quiet {
    color: var(--ewo-fg-3);
  }
  .desc {
    margin: 0;
    max-width: 62ch;
    font-size: 15px;
    line-height: 1.65;
    color: var(--ewo-fg-2);
    text-wrap: pretty;
  }
  .facts {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px 28px;
    margin: 0;
    padding-top: 18px;
    border-top: 1px solid var(--ewo-line-2);
    font-size: 14px;
  }
  dt {
    font: 500 var(--ewo-text-2xs) / 20px var(--ewo-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
  dd {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
    .stage {
      position: relative;
      top: 0;
      min-height: 340px;
    }
    .stage :global(.viz) {
      padding: 22px;
    }
    .body {
      padding-top: 0;
    }
  }
</style>
