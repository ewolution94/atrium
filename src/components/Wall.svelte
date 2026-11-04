<script lang="ts">
  import { t } from '../lib/i18n.svelte';
  import type { App, WallLayout } from '../lib/types';
  import { BUILT_IN, GROUP, inOrder, placeOf } from '../lib/wall';
  import Tile from './Tile.svelte';

  // The layout is data (server/wall.json, or Dashboard's): each tile gets its spot per width, and
  // each group is in the phone's order, which only one column shows.
  let { apps, layout }: { apps: App[]; layout?: WallLayout } = $props();

  const wall = $derived(layout ?? BUILT_IN);
  const group = (audience: App['audience']) => inOrder(apps.filter((a) => a.audience === audience), wall.narrow.order?.[GROUP[audience]]);
  const publicApps = $derived(group('public'));
  const privateApps = $derived(group('private'));
  const ownerApps = $derived(group('owner'));
</script>

<div class="wall web">
  {#each publicApps as app (app.slug)}
    <Tile {app} place={placeOf(wall, app)} />
  {/each}
</div>

{#if privateApps.length}
  <h2 class="group">{t('private')} <span>{privateApps.length}</span></h2>
  <div class="wall private">
    {#each privateApps as app (app.slug)}
      <Tile {app} place={placeOf(wall, app)} />
    {/each}
  </div>
{/if}

{#if ownerApps.length}
  <h2 class="group">{t('yours')} <span>{ownerApps.length}</span></h2>
  <div class="wall owner">
    {#each ownerApps as app (app.slug)}
      <Tile {app} place={placeOf(wall, app)} />
    {/each}
  </div>
{/if}

<style>
  /* The bento, placed by the layout: Clinch large, the rest around it. An app it doesn't name yet
     flows in after the others, half a row wide like the newest ones (a full row at mid width). */
  .wall {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: 152px;
  }
  .wall > :global([data-slug]) {
    grid-area: var(--area-wide, auto / auto / auto / span 6);
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
    .wall > :global([data-slug]) {
      grid-area: var(--area-mid, auto / auto / auto / span 6);
    }
  }

  @media (max-width: 720px) {
    .wall {
      grid-template-columns: minmax(0, 1fr);
      grid-auto-rows: auto;
    }
    .wall > :global([data-slug]) {
      grid-area: auto;
      min-height: var(--min-narrow, 290px);
    }
  }
</style>
