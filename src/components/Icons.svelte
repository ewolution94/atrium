<script lang="ts">
  // The other layout: just the apps' icons, like a home screen.
  import { go } from '../lib/route.svelte';
  import { t } from '../lib/i18n.svelte';
  import { morph } from '../lib/transition';
  import type { App } from '../lib/types';

  let { apps }: { apps: App[] } = $props();

  const groups = $derived([
    { label: null, apps: apps.filter((a) => a.audience === 'public') },
    { label: t('yours'), apps: apps.filter((a) => a.audience === 'owner') },
  ]);

  function open(event: MouseEvent, slug: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const icon = (event.currentTarget as HTMLElement).querySelector<HTMLElement>('.ico');
    morph(
      icon,
      () => {
        go(slug);
        scrollTo(0, 0);
      },
      () => document.querySelector('[data-stage-icon]'),
    );
  }
</script>

{#each groups as group (group.label)}
  {#if group.apps.length}
    {#if group.label}<h2 class="group">{group.label}</h2>{/if}
    <div class="board">
      {#each group.apps as app (app.slug)}
        <a class="app" href="/{app.slug}" data-ewo-project={app.slug} onclick={(e) => open(e, app.slug)}>
          <span class="halo" aria-hidden="true"></span>
          <img class="ico" src="/apps/{app.slug}.svg" alt="" width="108" height="108" />
          <span class="name">{app.name}</span>
          <small><i class="dot" data-state={app.status?.state ?? 'unknown'}></i>{app.host.split('.')[0]}</small>
        </a>
      {/each}
    </div>
  {/if}
{/each}

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 40px 16px;
    padding: 12px 0 32px;
  }
  .app {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 18px;
    text-decoration: none;
  }
  .ico {
    position: relative;
    width: 108px;
    height: 108px;
    border-radius: 28px;
    box-shadow:
      0 0 0 1px var(--ewo-line-2),
      var(--ewo-shadow);
  }
  .app:hover .ico {
    transform: translateY(-5px) scale(1.04);
    transition: transform 0.4s var(--ewo-ease-spring);
  }
  .halo {
    position: absolute;
    top: 4px;
    left: 50%;
    width: 170px;
    height: 130px;
    margin-left: -85px;
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, var(--ewo-accent) 40%, transparent), transparent);
    opacity: 0;
    pointer-events: none;
  }
  .app:hover .halo {
    opacity: 1;
    transition: opacity 0.4s;
  }
  .name {
    font-weight: 600;
    font-size: 14px;
  }
  small {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: -4px;
    font: 500 11px/1 var(--ewo-mono);
    color: var(--ewo-fg-3);
  }
  .group {
    margin: 32px 0 6px;
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
</style>
