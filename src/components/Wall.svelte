<script lang="ts">
  import { t } from '../lib/i18n.svelte';
  import type { App } from '../lib/types';
  import Tile from './Tile.svelte';

  let { apps }: { apps: App[] } = $props();

  const publicApps = $derived(apps.filter((a) => a.audience === 'public'));
  const ownerApps = $derived(apps.filter((a) => a.audience === 'owner'));
</script>

<div class="wall web">
  {#each publicApps as app (app.slug)}
    <Tile {app} />
  {/each}
</div>

{#if ownerApps.length}
  <h2 class="group">{t('yours')} <span>{ownerApps.length}</span></h2>
  <div class="wall owner">
    {#each ownerApps as app (app.slug)}
      <Tile {app} />
    {/each}
  </div>
{/if}

<style>
  /* The bento: Clinch large, the rest around it. Apps the layout doesn't name flow in after. */
  .wall {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: 152px;
  }
  .web {
    grid-template-areas:
      'clinch clinch clinch clinch clinch clinch planum planum planum aale-spiele aale-spiele aale-spiele'
      'clinch clinch clinch clinch clinch clinch planum planum planum aale-spiele aale-spiele aale-spiele'
      'clinch clinch clinch clinch clinch clinch pulse pulse pulse pulse pulse pulse'
      'cantina cantina cantina axioma axioma axioma tcgsl tcgsl tcgsl fermata fermata fermata'
      'cantina cantina cantina axioma axioma axioma tcgsl tcgsl tcgsl fermata fermata fermata';
  }
  .owner {
    grid-template-areas:
      'census census census census census census folio folio folio folio folio folio'
      'census census census census census census folio folio folio folio folio folio';
  }
  .wall > :global([data-slug]) {
    grid-area: var(--area);
  }

  .group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 40px 0 14px;
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
  .group span {
    color: var(--ewo-fg-2);
  }
  .group::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--ewo-line-2);
  }

  @media (max-width: 1100px) {
    .wall {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
    .web {
      grid-template-areas:
        'clinch clinch clinch clinch clinch clinch'
        'clinch clinch clinch clinch clinch clinch'
        'clinch clinch clinch clinch clinch clinch'
        'planum planum planum axioma axioma axioma'
        'planum planum planum axioma axioma axioma'
        'pulse pulse pulse pulse pulse pulse'
        'cantina cantina cantina fermata fermata fermata'
        'cantina cantina cantina fermata fermata fermata'
        'aale-spiele aale-spiele aale-spiele tcgsl tcgsl tcgsl'
        'aale-spiele aale-spiele aale-spiele tcgsl tcgsl tcgsl';
    }
    .owner {
      grid-template-areas:
        'census census census folio folio folio'
        'census census census folio folio folio';
    }
  }

  @media (max-width: 720px) {
    .wall {
      grid-template-columns: minmax(0, 1fr);
      grid-auto-rows: auto;
    }
    .web,
    .owner {
      grid-template-areas: none;
    }
    .wall > :global([data-slug]) {
      grid-area: auto;
      min-height: 290px;
    }
    .wall > :global([data-slug='clinch']) {
      min-height: 470px;
    }
    .wall > :global([data-slug='pulse']) {
      min-height: 160px;
    }
  }
</style>
