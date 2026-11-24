<!--
  The banner over a draft's preview (?draft=<id>, opened from Dashboard's wall editor): what the wall
  below is, the draft or the live one, and the way out. The server decides which (api.mjs); the page
  only says it. Plain links, so full navigations: /login comes back to this preview.
-->
<script lang="ts">
  import { data, draftId } from '../lib/data.svelte';
  import { t } from '../lib/i18n.svelte';

  const state = $derived(data.doc?.draft?.state ?? null);
  const text = $derived(
    state === 'shown' ? t('draftShown') : state === 'missing' ? t('draftMissing') : data.doc?.login ? t('draftSignIn') : t('draftNoLogin'),
  );
</script>

{#if state}
  <aside class="preview" data-state={state} aria-live="polite">
    <p><i class="mark" aria-hidden="true"></i>{text}</p>
    <span class="acts">
      {#if state === 'sign-in' && data.doc?.login}
        <a href={`/login?draft=${encodeURIComponent(draftId ?? '')}`}>{t('signIn')}</a>
      {/if}
      <a href="/">{t('draftClose')}</a>
    </span>
  </aside>
{/if}

<style>
  .preview {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 18px;
    margin: 28px 0 0;
    padding: 12px 16px;
    background: var(--ewo-bg-raised);
    border: 1px solid var(--ewo-line-strong);
    border-radius: var(--ewo-r-sm);
    font: 500 var(--ewo-text-2xs) / 1.5 var(--ewo-mono);
    letter-spacing: 0.04em;
    color: var(--ewo-fg-2);
  }
  /* A draft on screen is marked in the page's accent; the live wall stays plain. */
  .preview[data-state='shown'] {
    border-color: color-mix(in oklab, var(--ewo-accent) 55%, var(--ewo-line-strong));
  }
  .mark {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin: 0 10px 1px 0;
    border-radius: 50%;
    background: var(--ewo-fg-3);
  }
  .preview[data-state='shown'] .mark {
    background: var(--ewo-accent);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--ewo-accent) 20%, transparent);
  }
  p {
    flex: 1 1 320px;
    min-width: 0;
    margin: 0;
    color: var(--ewo-fg);
  }
  .acts {
    display: flex;
    gap: 18px;
    margin-left: auto;
  }
  a {
    color: var(--ewo-fg);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
</style>
