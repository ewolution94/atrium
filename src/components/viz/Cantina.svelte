<script lang="ts">
  // Today's main dish at the canteen (or the next day it serves): the kitchen's photo on a plate,
  // its name, ratings and price. Without a photo, a dot plate like Cantina's own.
  import { i18n, price, t, weekday } from '../../lib/i18n.svelte';
  import type { CantinaTile } from '../../lib/types';

  let { tile, awake = false }: { tile: CantinaTile | null; awake?: boolean } = $props();

  /** A dot plate, spiralling out with the golden angle. */
  const FOOD = Array.from({ length: 46 }, (_, i) => {
    const r = 5 + Math.sqrt(i / 46) * 58;
    const a = i * 2.39996;
    return { x: 100 + Math.cos(a) * r, y: 100 + Math.sin(a) * r, r: 2 + 3.4 * (1 - r / 70) + (i % 3) * 0.5, k: i % 3 };
  });

  let photoFailed = $state(false);
  const day = $derived(!tile ? '' : tile.today ? t('today') : weekday(tile.date));
  const hours = $derived(tile?.hours.length ? tile.hours.map(([a, b]) => `${a}–${b}`).join(', ') : tile ? t('closed') : '');
  const diet = $derived(tile?.dish.diet === 'vegan' ? t('vegan') : tile?.dish.diet === 'vegetarian' ? t('vegetarian') : null);
</script>

<div class="viz" class:awake>
  <div class="vlabel">
    <span>{day}{tile ? ` · ${tile.outlet}` : ''}</span>
    <span>{hours}</span>
  </div>
  <div class="plate" aria-hidden="true">
    <svg viewBox="0 0 200 200">
      <circle class="rim" cx="100" cy="100" r="92" />
      <circle class="base" cx="100" cy="100" r="74" />
      {#if !tile?.dish.photo || photoFailed}
        {#each FOOD as f, i (i)}<circle class="f{f.k}" cx={f.x} cy={f.y} r={f.r} />{/each}
      {/if}
    </svg>
    {#if tile?.dish.photo && !photoFailed}
      <img src={tile.dish.photo} alt="" loading="lazy" decoding="async" onerror={() => (photoFailed = true)} />
    {/if}
  </div>
  <div class="info">
    {#if tile}
      <div class="dish">{tile.dish.name[i18n.lang] || tile.dish.name.de}</div>
      <div class="tags">
        {#if diet}<span>{diet}</span>{/if}
        {#if tile.dish.co2}<span>CO₂ {tile.dish.co2}</span>{/if}
      </div>
      <div class="price">{price(tile.dish.price)}</div>
    {/if}
  </div>
</div>

<style>
  .viz {
    flex: 1;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    gap: 14px 18px;
    min-width: 0;
    padding: 20px 22px 0;
  }
  .vlabel {
    grid-column: 1 / -1;
  }
  .plate {
    position: relative;
    align-self: center;
    width: 150px;
    aspect-ratio: 1;
  }
  :global(.tile:hover) .plate,
  .awake .plate {
    transform: rotate(24deg);
    transition: transform 1.2s var(--ewo-ease);
  }
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  img {
    position: absolute;
    inset: 13%;
    width: 74%;
    height: 74%;
    border-radius: 50%;
    object-fit: cover;
  }
  .rim {
    fill: none;
    stroke: var(--ewo-line-strong);
    stroke-width: 1.5;
  }
  .base {
    fill: var(--ewo-fill-2);
  }
  .f0 {
    fill: var(--ewo-fg);
  }
  .f1 {
    fill: var(--ewo-fg-3);
  }
  .f2 {
    fill: var(--ewo-fg-4);
  }
  .info {
    align-self: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }
  .dish {
    font-size: 17px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.01em;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-wrap: pretty;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font: 500 11px/1 var(--ewo-mono);
    color: var(--ewo-fg-2);
  }
  .tags span {
    padding: 4px 6px;
    border: 1px solid var(--ewo-line);
    border-radius: 5px;
  }
  .price {
    font: 500 26px/1 var(--ewo-mono);
    letter-spacing: -0.03em;
  }
  .awake .plate {
    width: 220px;
  }
  .awake .dish {
    font-size: 22px;
  }
  @container (max-width: 380px) {
    .plate {
      width: 108px;
    }
    .dish {
      font-size: 15px;
    }
  }
</style>
