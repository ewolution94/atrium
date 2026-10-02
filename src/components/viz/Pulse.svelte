<script lang="ts">
  // 90 days of every app together (each day takes the worst any app had), and how many are up.
  import { t } from '../../lib/i18n.svelte';
  import type { PulseTile } from '../../lib/types';

  let { tile, awake = false }: { tile: PulseTile | null; awake?: boolean } = $props();

  const states = $derived((tile?.ticks ?? Array(90).fill('none')).join(' '));
</script>

<div class="viz" class:awake>
  <ewo-ticks class="ticks" states={states} label={t('uptime')} start={t('daysAgo')} end={t('today')}></ewo-ticks>
  <div class="num" data-state={tile?.overall ?? 'unknown'} aria-label={tile ? t('upOf', { up: tile.up, of: tile.of }) : undefined}>
    <span class="count">{#if tile}{tile.up}<span>/{tile.of}</span>{:else}—{/if}</span>
    <small>{tile ? t('up') : ''}</small>
  </div>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 22px;
    min-width: 0;
    padding: 18px 22px 0;
  }
  .ticks {
    flex: 1;
    min-width: 0;
    --ewo-ticks-h: 30px;
  }
  /* On the wall it's a picture; the app's own page has the pointable version. */
  :global(.tile) .ticks {
    pointer-events: none;
  }
  .num {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font: 500 26px/1 var(--ewo-mono);
    letter-spacing: -0.03em;
    white-space: nowrap;
  }
  .count span {
    color: var(--ewo-fg-3);
  }
  small {
    margin-top: 6px;
    font-size: var(--ewo-text-2xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ewo-ok);
  }
  .num[data-state='degraded'] small {
    color: var(--ewo-warn);
  }
  .num[data-state='down'] small {
    color: var(--ewo-bad);
  }
  .awake {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 40px;
  }
  .awake .num {
    align-items: flex-start;
    order: -1;
    font-size: 56px;
  }
</style>
