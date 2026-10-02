<script lang="ts">
  // An app's last 90 days from Pulse, on Folio's <ewo-ticks>: point at a day (or drag across on
  // a phone, or use the arrow keys) to read it.
  import { dayMonth, percent, t } from '../lib/i18n.svelte';
  import type { Day } from '../lib/types';

  let { days, uptime }: { days: Day[]; uptime: number | null } = $props();

  const ticks = $derived(
    days.map(([date, state, pct, ms]) => ({
      label: dayMonth(date),
      state,
      detail: pct === null ? '—' : `${percent(pct)}${ms ? ` · ${ms} ms` : ''}`,
    })),
  );
</script>

<section class="uptime">
  <h2>
    <span>{t('uptime')} · {t('days90')}</span>
    {#if uptime !== null}<b>{percent(uptime)}</b>{/if}
  </h2>
  <ewo-ticks {ticks} label={t('uptime')} start={t('daysAgo')} end={t('today')}></ewo-ticks>
</section>

<style>
  .uptime {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  h2 {
    display: flex;
    justify-content: space-between;
    margin: 0;
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
  b {
    font-weight: 500;
    color: var(--ewo-fg);
  }
  ewo-ticks {
    --ewo-ticks-h: 28px;
  }
</style>
