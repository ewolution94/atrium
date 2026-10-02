<script lang="ts">
  import { onMount } from 'svelte';
  import { data, start } from './lib/data.svelte';
  import { route } from './lib/route.svelte';
  import { prefs } from './lib/prefs.svelte';
  import { loadCensus } from './lib/census';
  import Field from './components/Field.svelte';
  import Bar from './components/Bar.svelte';
  import Intro from './components/Intro.svelte';
  import Wall from './components/Wall.svelte';
  import Icons from './components/Icons.svelte';
  import AppPage from './components/AppPage.svelte';
  import Palette from './components/Palette.svelte';
  import Footer from './components/Footer.svelte';

  let palette: ReturnType<typeof Palette> | undefined = $state();

  const apps = $derived(data.doc?.apps ?? []);
  const current = $derived(route.slug ? (apps.find((a) => a.slug === route.slug) ?? null) : null);

  $effect(() => {
    document.title = current ? `${current.name} · Atrium` : 'Atrium';
  });

  onMount(() => {
    start();
    loadCensus();
  });
</script>

<Field />
<Bar onsearch={() => palette?.open()} wall={!current} />

<main>
  {#if current}
    {#key current.slug}
      <AppPage app={current} />
    {/key}
  {:else if !route.slug || data.doc}
    <Intro {apps} />
    {#if prefs.layout === 'icons'}
      <Icons {apps} />
    {:else}
      <Wall {apps} />
    {/if}
  {/if}
</main>

<Footer />
<Palette bind:this={palette} {apps} />
