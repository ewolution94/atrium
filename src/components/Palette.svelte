<script lang="ts">
  // ⌘K (or Ctrl K, or /): type a few letters, Enter opens the app, Shift+Enter its page here.
  // Anchored to the top, so the phone's keyboard never pushes the input away.
  import { onMount, tick } from 'svelte';
  import { go } from '../lib/route.svelte';
  import { i18n, t } from '../lib/i18n.svelte';
  import type { App } from '../lib/types';

  let { apps }: { apps: App[] } = $props();

  let dialog: HTMLDialogElement;
  let input: HTMLInputElement;
  let query = $state('');
  let selected = $state(0);

  const shown = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((a) => `${a.name} ${a.host} ${a.text[i18n.lang].line} ${a.stack}`.toLowerCase().includes(q));
  });

  export async function open() {
    if (dialog.open) return;
    query = '';
    selected = 0;
    dialog.showModal();
    await tick();
    input.focus();
  }

  function run(index: number, details = false) {
    const app = shown[index];
    if (!app) return;
    dialog.close();
    if (app.url && !details) window.open(app.url, '_blank', 'noopener');
    else {
      go(app.slug);
      scrollTo(0, 0);
    }
  }

  function onKey(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') selected = (selected + 1) % Math.max(1, shown.length);
    else if (event.key === 'ArrowUp') selected = (selected - 1 + shown.length) % Math.max(1, shown.length);
    else if (event.key === 'Enter') run(selected, event.shiftKey);
    else return;
    event.preventDefault();
  }

  onMount(() => {
    const onGlobal = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement)?.closest?.('input, textarea, [contenteditable]');
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        void open();
      } else if (event.key === '/' && !typing && !dialog.open) {
        event.preventDefault();
        void open();
      }
    };
    addEventListener('keydown', onGlobal);
    return () => removeEventListener('keydown', onGlobal);
  });
</script>

<dialog bind:this={dialog} aria-label={t('openApp')} onclick={(e) => e.target === dialog && dialog.close()}>
  <div class="panel">
    <div class="head">
      <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" /></svg>
      <input
        bind:this={input}
        bind:value={query}
        oninput={() => (selected = 0)}
        onkeydown={onKey}
        type="text"
        placeholder={`${t('openApp')} …`}
        autocomplete="off"
        spellcheck="false"
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-list"
        aria-activedescendant={shown[selected] ? `pal-${shown[selected].slug}` : undefined}
      />
      <button class="close" onclick={() => dialog.close()} aria-label={t('close')}>
        <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" /></svg>
      </button>
    </div>
    <ul id="palette-list" role="listbox">
      {#each shown as app, i (app.slug)}
        <!-- The keyboard drives the list from the input (arrows, Enter: aria-activedescendant). -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <li
          id="pal-{app.slug}"
          role="option"
          aria-selected={i === selected}
          class:sel={i === selected}
          onclick={() => run(i)}
          onpointermove={() => (selected = i)}
        >
          <img src="/apps/{app.slug}.svg" alt="" width="30" height="30" />
          <b>{app.name}</b>
          <span>{app.text[i18n.lang].line}</span>
        </li>
      {:else}
        <li class="none">{t('nothing')}</li>
      {/each}
    </ul>
    <footer><span>↑↓ {t('move')}</span><span>↵ {t('open')}</span><span>⇧↵ {t('details')}</span><span>esc</span></footer>
  </div>
</dialog>

<style>
  dialog {
    top: 12dvh;
    width: min(580px, calc(100vw - 32px));
    max-width: none;
    max-height: 76dvh;
    margin: 0 auto;
    padding: 0;
    border: 1px solid var(--ewo-line);
    border-radius: 18px;
    background: var(--ewo-bg-raised);
    color: var(--ewo-fg);
    box-shadow: var(--ewo-shadow);
    overflow: hidden;
  }
  dialog::backdrop {
    background: light-dark(rgb(245 244 241 / 0.7), rgb(5 5 7 / 0.72));
  }
  /* The panel doesn't scroll; the list inside it does. */
  .panel {
    display: flex;
    flex-direction: column;
    max-height: 76dvh;
    overflow: hidden;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px 0 18px;
    border-bottom: 1px solid var(--ewo-line-2);
  }
  .head > svg {
    flex: none;
    width: 17px;
    height: 17px;
    fill: none;
    stroke: var(--ewo-fg-3);
    stroke-width: 1.6;
    stroke-linecap: round;
  }
  input {
    flex: 1;
    min-width: 0;
    height: 58px;
    border: 0;
    background: none;
    outline: none;
    color: var(--ewo-fg);
    font: 17px var(--ewo-sans);
  }
  .close {
    display: grid;
    place-items: center;
    flex: none;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: var(--ewo-fill-2);
    color: var(--ewo-fg-2);
  }
  .close svg {
    width: 12px;
    height: 12px;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
  }
  ul {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin: 0;
    padding: 8px;
    list-style: none;
  }
  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 10px;
    border-radius: 11px;
    cursor: pointer;
  }
  li img {
    flex: none;
    border-radius: 8px;
  }
  li b {
    font-weight: 600;
    font-size: 14px;
  }
  li span {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: var(--ewo-fg-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sel {
    background: var(--ewo-fill-2);
  }
  .none {
    color: var(--ewo-fg-3);
    cursor: default;
  }
  footer {
    display: flex;
    gap: 16px;
    padding: 10px 18px;
    border-top: 1px solid var(--ewo-line-2);
    font: 500 11px/1 var(--ewo-mono);
    color: var(--ewo-fg-3);
  }
  @media (hover: none) {
    footer {
      display: none;
    }
  }
</style>
