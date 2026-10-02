<script lang="ts">
  import { data, isStale } from '../lib/data.svelte';
  import { clock, t } from '../lib/i18n.svelte';
  import type { App } from '../lib/types';

  let { apps }: { apps: App[] } = $props();

  /** One line for the whole wall, from the apps' own states. */
  const summary = $derived.by(() => {
    const states = apps.map((a) => a.status?.state).filter(Boolean);
    const down = states.filter((s) => s === 'down').length;
    const degraded = states.filter((s) => s === 'degraded').length;
    if (!data.doc || data.doc.status.overall === 'unknown') return { state: 'unknown', text: t('statusUnknown') };
    if (down) return { state: 'down', text: t('down', { n: down }) };
    if (degraded) return { state: 'degraded', text: t('degraded', { n: degraded }) };
    return { state: 'operational', text: t('allOperational') };
  });

  const checked = $derived(data.doc?.status.checkedAt ?? null);
</script>

<section class="intro">
  <h1 class="display">
    {#if apps.length}{apps.length}{/if}
    <em>{t('apps')}</em>
  </h1>
  {#if data.doc}
    <p class="facts">
      <span><i class="dot" data-state={summary.state}></i><b>{summary.text}</b></span>
      {#if isStale()}
        <span>{t('lastKnown', { time: clock(data.doc.generatedAt) })}</span>
      {:else if checked}
        <span>{t('checked', { time: clock(checked) })}</span>
      {/if}
    </p>
  {/if}
</section>

<style>
  .intro {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px 40px;
    padding: 64px 0 36px;
  }
  .display {
    margin: 0;
    font: 360 clamp(64px, 10vw, 140px) / 0.86 var(--ewo-serif);
    letter-spacing: -0.045em;
    font-variation-settings: 'opsz' 144;
  }
  em {
    font-style: italic;
    font-synthesis: style;
    color: var(--ewo-fg-3);
  }
  .facts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 22px;
    margin: 0 0 10px;
    font: 500 var(--ewo-text-2xs) / 1.4 var(--ewo-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ewo-fg-2);
  }
  .facts span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  b {
    font-weight: 500;
    color: var(--ewo-fg);
  }
  @media (max-width: 720px) {
    .intro {
      padding-top: 40px;
    }
  }
</style>
