<script lang="ts">
  // The current playoff picture: seeds one to seven per conference, the cut line, and the first
  // team out. Clinch's mark (two bracket arms closing on a point) sits between them.
  import { t } from '../../lib/i18n.svelte';
  import type { ClinchTile } from '../../lib/types';

  let { tile, awake = false }: { tile: ClinchTile | null; awake?: boolean } = $props();

  const EMPTY = Array.from({ length: 8 }, (_, i) => ({ seed: i + 1, abbr: '—', record: '' , status: '' }));
  const conferences = $derived(
    tile?.conferences.length
      ? tile.conferences
      : [
          { id: 'AFC', seeds: EMPTY },
          { id: 'NFC', seeds: EMPTY },
        ],
  );
  const label = $derived(!tile ? '' : tile.postseason ? t('playoffs') : tile.week ? t('week', { n: tile.week }) : '');
</script>

{#snippet conference(c: ClinchTile['conferences'][number])}
  <ol class="conf" aria-label={c.id}>
    <li class="cname" aria-hidden="true">{c.id}</li>
    {#each c.seeds as s (s.seed)}
      {#if s.seed === 8}<li class="cut" aria-hidden="true"></li>{/if}
      <li class:bye={s.seed === 1} class:out={s.seed === 8}>
        <span class="seed">{s.seed}</span><span class="team">{s.abbr}</span><span class="rec">{s.record}</span>
      </li>
    {/each}
  </ol>
{/snippet}

<div class="viz" class:awake class:empty={!tile}>
  <div class="vlabel">
    <span>{label}{#if tile?.live}<b class="live"> · {t('live')}</b>{/if}</span>
    <span>{t('playoffPicture')}</span>
  </div>
  <div class="cols">
    {@render conference(conferences[0])}
    <svg class="arms" viewBox="0 0 120 200" aria-hidden="true">
      <g class="l"><path d="M8 52 L40 100 L8 148" /></g>
      <g class="r"><path d="M112 52 L80 100 L112 148" /></g>
      <circle cx="60" cy="100" r="7" />
    </svg>
    {@render conference(conferences[1])}
  </div>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
    padding: 20px 22px 0;
  }
  .live {
    color: var(--ewo-accent);
    font-weight: 500;
  }
  .cols {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr);
    align-items: center;
    gap: 10px;
  }
  .conf {
    list-style: none;
    margin: 0;
    padding: 0;
    font: 13px/1 var(--ewo-mono);
  }
  li {
    display: grid;
    grid-template-columns: 22px 1fr auto;
    align-items: center;
    padding: 6px 8px;
    border-radius: 7px;
  }
  .cname {
    display: block;
    padding: 0 8px 8px;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--ewo-fg-3);
  }
  .seed {
    color: var(--ewo-fg-4);
  }
  .team {
    font-weight: 600;
  }
  .rec {
    color: var(--ewo-fg-2);
  }
  .bye {
    background: color-mix(in oklab, var(--ewo-accent) 13%, transparent);
  }
  .bye .seed {
    color: var(--ewo-accent);
  }
  .cut {
    display: block;
    height: 0;
    padding: 0;
    margin: 5px 4px;
    border-top: 1.5px dashed var(--ewo-accent);
  }
  .out {
    opacity: 0.42;
  }
  .empty .team {
    color: var(--ewo-fg-4);
  }

  .arms {
    width: 100%;
    max-height: 200px;
    overflow: visible;
  }
  .arms path {
    fill: none;
    stroke: var(--ewo-accent);
    stroke-width: 9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .arms circle {
    fill: var(--ewo-accent-2);
  }
  :global(.tile:hover) .l,
  .awake .l {
    transform: translateX(8px);
    transition: transform 0.6s var(--ewo-ease-spring);
  }
  :global(.tile:hover) .r,
  .awake .r {
    transform: translateX(-8px);
    transition: transform 0.6s var(--ewo-ease-spring);
  }

  @container (max-width: 560px) {
    .cols {
      grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr);
      gap: 4px;
    }
    li {
      padding: 6px 4px;
    }
  }
</style>
