<script lang="ts">
  import { go } from '../lib/route.svelte';
  import { i18n, t } from '../lib/i18n.svelte';
  import { morph } from '../lib/transition';
  import { tintField } from '../lib/field';
  import type { App, CantinaTile } from '../lib/types';
  import Viz from './Viz.svelte';

  let { app }: { app: App } = $props();

  /** The slugs the wall's grid has a place for; anything else flows in after them. */
  const PLACED = new Set(['clinch', 'planum', 'pulse', 'cantina', 'axioma', 'fermata', 'aale-spiele', 'tcgsl', 'schaetzle', 'vollmond', 'verso', 'census', 'folio']);

  let tile: HTMLElement;
  let spot: HTMLElement;
  let box: DOMRect | null = null;

  /** Cantina's Open goes straight to the outlet and day the tile shows. */
  const openUrl = $derived(app.slug === 'cantina' && app.tile && app.url ? new URL((app.tile as CantinaTile).path, app.url).href : app.url);

  function open(event: MouseEvent) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    morph(
      tile,
      () => {
        go(app.slug);
        scrollTo(0, 0);
      },
      () => document.querySelector('[data-stage]'),
    );
  }

  function enter() {
    box = tile.getBoundingClientRect();
    tintField(getComputedStyle(tile).getPropertyValue('--ewo-accent').trim() || null);
  }
  function move(event: PointerEvent) {
    if (box) spot.style.transform = `translate3d(${event.clientX - box.left}px, ${event.clientY - box.top}px, 0)`;
  }
  function leave() {
    box = null;
    tintField(null);
  }
</script>

<article
  class="tile"
  bind:this={tile}
  data-slug={app.slug}
  data-ewo-project={app.slug}
  style:--area={PLACED.has(app.slug) ? app.slug : null}
  onpointerenter={enter}
  onpointermove={move}
  onpointerleave={leave}
>
  <div class="glow" aria-hidden="true"></div>
  <div class="spot" bind:this={spot} aria-hidden="true"></div>
  <div class="slot">
    <Viz {app} />
  </div>
  <footer class="meta">
    <img class="ico" src="/apps/{app.slug}.svg" alt="" width="38" height="38" />
    <span class="txt">
      <a class="name" href="/{app.slug}" onclick={open}>{app.name}</a>
      <span class="line">{app.text[i18n.lang].line}</span>
    </span>
    <span class="end">
      {#if openUrl}
        <span class="host"><i class="dot" data-state={app.status?.state ?? 'unknown'}></i>{app.host}</span>
        <a class="go" href={openUrl} target="_blank" rel="noopener">{t('open')} <span aria-hidden="true">↗</span></a>
      {:else}
        <span class="tag">{t('notLive')}</span>
      {/if}
    </span>
  </footer>
</article>

<style>
  .tile {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-radius: var(--tile-r);
    background: var(--ewo-panel);
    border: 1px solid var(--ewo-line-2);
    box-shadow: var(--ewo-highlight);
    container-type: inline-size;
  }
  /* Transitions live in :hover only, so leaving is instant (nothing animates as tiles scroll by). */
  .tile:hover {
    transform: translateY(-3px);
    transition: transform 0.35s var(--ewo-ease);
  }
  .tile:has(.name:focus-visible) {
    outline: var(--ewo-focus);
    outline-offset: 3px;
  }

  .glow {
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0.5;
    pointer-events: none;
    background:
      radial-gradient(110% 90% at 100% 0%, color-mix(in oklab, var(--ewo-accent) 24%, transparent), transparent 58%),
      radial-gradient(80% 70% at 0% 100%, color-mix(in oklab, var(--ewo-accent-2) 11%, transparent), transparent 62%);
  }
  .tile:hover .glow {
    opacity: 1;
    transition: opacity 0.4s;
  }
  .spot {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 560px;
    height: 560px;
    margin: -280px 0 0 -280px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    will-change: transform;
    background: radial-gradient(closest-side, light-dark(rgb(255 255 255 / 0.75), rgb(255 255 255 / 0.06)), transparent);
  }
  .tile:hover .spot {
    opacity: 1;
  }

  .slot {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px 16px;
  }
  .ico {
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px var(--ewo-line-2);
  }
  .txt {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .name {
    font-weight: 600;
    font-size: 15px;
    letter-spacing: -0.01em;
    text-decoration: none;
    outline: none;
  }
  /* The whole tile is the link to the app's page; the controls inside sit above it. */
  .name::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    cursor: pointer;
  }
  .line {
    font-size: var(--ewo-text-sm);
    color: var(--ewo-fg-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .end {
    position: relative;
    z-index: 2;
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
  }
  .host {
    display: flex;
    align-items: center;
    gap: 7px;
    font: 11px/1 var(--ewo-mono);
    color: var(--ewo-fg-3);
  }
  .go,
  .tag {
    padding: 7px 11px;
    border-radius: var(--ewo-r-pill);
    font: 500 12px/1 var(--ewo-sans);
    white-space: nowrap;
  }
  .go {
    background: var(--ewo-invert);
    color: var(--ewo-invert-ink);
    text-decoration: none;
    opacity: 0;
    transform: translateX(-4px);
  }
  .tile:hover .go,
  .go:focus-visible {
    opacity: 1;
    transform: none;
    transition:
      opacity 0.25s,
      transform 0.25s var(--ewo-ease);
  }
  .tag {
    color: var(--ewo-fg-2);
    border: 1px solid var(--ewo-line);
  }
  @media (hover: none) {
    .go {
      opacity: 1;
      transform: none;
    }
  }
  @container (max-width: 470px) {
    .host {
      display: none;
    }
  }
</style>
