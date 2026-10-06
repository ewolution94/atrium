<script lang="ts">
  // What a tile shows above its name: a live glimpse where the app has data to give (Clinch,
  // Cantina, Pulse), its motif where it doesn't. `awake` plays the hover state for good, as on
  // the app's own page.
  import type { App, CantinaTile, ClinchTile, PulseTile } from '../lib/types';
  import Clinch from './viz/Clinch.svelte';
  import Planum from './viz/Planum.svelte';
  import Pulse from './viz/Pulse.svelte';
  import Cantina from './viz/Cantina.svelte';
  import Axioma from './viz/Axioma.svelte';
  import Fermata from './viz/Fermata.svelte';
  import AaleSpiele from './viz/AaleSpiele.svelte';
  import Census from './viz/Census.svelte';
  import Folio from './viz/Folio.svelte';

  let { app, awake = false }: { app: App; awake?: boolean } = $props();
</script>

{#if app.slug === 'clinch'}
  <Clinch tile={app.tile as ClinchTile | null} {awake} />
{:else if app.slug === 'planum'}
  <Planum {awake} />
{:else if app.slug === 'pulse'}
  <Pulse tile={app.tile as PulseTile | null} {awake} />
{:else if app.slug === 'cantina'}
  <Cantina tile={app.tile as CantinaTile | null} {awake} />
{:else if app.slug === 'axioma'}
  <Axioma {awake} />
{:else if app.slug === 'fermata'}
  <Fermata url={app.url} {awake} />
{:else if app.slug === 'aale-spiele'}
  <AaleSpiele {awake} />
{:else if app.slug === 'census'}
  <Census {awake} />
{:else if app.slug === 'folio'}
  <Folio {awake} />
{/if}
