<script lang="ts">
  // Vollmond's village in miniature, after the landing's motif: a row of coats of arms in the cards'
  // two inks, the full moon low and pale above them. Hovering brings the night and the vote: the
  // moon rises in pink, three votes arc onto one coat of arms and strike it out. The app's page
  // plays that once on arrival. Drawn, not data. Only transforms and opacity move.
  let { awake = false }: { awake?: boolean } = $props();

  const INDIGO = '#1f2668';
  const PINK = '#ff4d9d';
  const CREAM = '#f1e8d4';
  /** A heater shield, 22 wide, its top edge at y. */
  const shield = (x: number, y: number) => `M${x - 11} ${y}H${x + 11}V${y + 12}C${x + 11} ${y + 21} ${x + 5} ${y + 26} ${x} ${y + 29}C${x - 5} ${y + 26} ${x - 11} ${y + 21} ${x - 11} ${y + 12}Z`;
  const Y = 74;
  const ARMS = [
    { x: 34, a: INDIGO, b: CREAM, split: 'pale' },
    { x: 80, a: PINK, b: INDIGO, split: 'fess' },
    { x: 126, a: CREAM, b: INDIGO, split: 'bend' },
    { x: 172, a: INDIGO, b: PINK, split: 'fess' },
    { x: 218, a: CREAM, b: PINK, split: 'pale' },
    { x: 264, a: INDIGO, b: INDIGO, split: 'none' },
  ];
  const TARGET = 172;
  const votes = [34, 126, 264].map((x, i) => {
    const sx = x, ex = TARGET + (x < TARGET ? -9 : 9);
    const top = Y - 22 - i * 4;
    return `M${sx} ${Y - 4}Q${(sx + ex) / 2} ${top - 18} ${ex} ${Y - 6}`;
  });
</script>

<div class="viz" class:awake aria-hidden="true">
  <svg viewBox="14 4 272 102" preserveAspectRatio="xMidYMax meet">
    <defs>
      {#each ARMS as arm, i (arm.x)}
        <clipPath id="vm-arms-{i}"><path d={shield(arm.x, Y)} /></clipPath>
      {/each}
    </defs>
    <g class="moon">
      <circle cx="236" cy="30" r="20" fill={PINK} />
      <circle cx="229" cy="25" r="4" fill="none" stroke={INDIGO} stroke-width="1.4" opacity="0.5" />
      <circle cx="243" cy="36" r="5.5" fill="none" stroke={INDIGO} stroke-width="1.4" opacity="0.5" />
    </g>
    {#each ARMS as arm, i (arm.x)}
      <g clip-path="url(#vm-arms-{i})">
        <rect x={arm.x - 12} y={Y} width="24" height="30" fill={arm.a} />
        {#if arm.split === 'pale'}<rect x={arm.x} y={Y} width="12" height="30" fill={arm.b} />{/if}
        {#if arm.split === 'fess'}<rect x={arm.x - 12} y={Y + 13} width="24" height="17" fill={arm.b} />{/if}
        {#if arm.split === 'bend'}<path d="M{arm.x - 12} {Y}H{arm.x + 12}L{arm.x - 12} {Y + 30}Z" fill={arm.b} />{/if}
      </g>
      <path d={shield(arm.x, Y)} class="rim" />
    {/each}
    {#each votes as d, i (d)}
      <path {d} class="vote" style:--i={i} />
    {/each}
    <path class="strike" d="M{TARGET - 7} {Y + 6}L{TARGET + 7} {Y + 22}M{TARGET + 7} {Y + 6}L{TARGET - 7} {Y + 22}" />
  </svg>
</div>

<style>
  .viz {
    flex: 1;
    display: flex;
    align-items: flex-end;
    min-width: 0;
    padding: 0 22px 12px;
  }
  svg {
    width: 100%;
    max-height: 100%;
    overflow: visible;
  }
  .rim {
    fill: none;
    stroke: var(--ewo-fg);
    stroke-width: 2.2;
    stroke-linejoin: round;
  }
  .moon {
    opacity: 0.3;
    transform: translateY(26px) scale(0.86);
    transform-box: fill-box;
    transform-origin: center;
  }
  .vote {
    fill: none;
    stroke: var(--ewo-accent);
    stroke-width: 2;
    stroke-linecap: round;
    opacity: 0;
  }
  .strike {
    fill: none;
    stroke: #ff4d9d;
    stroke-width: 3.4;
    stroke-linecap: round;
    opacity: 0;
  }

  /* Transitions live in the hover rules only, so leaving is instant (Tile.svelte). */
  :global(.tile:hover) .moon,
  .awake .moon {
    opacity: 1;
    transform: none;
    transition:
      transform 0.7s var(--ewo-ease-spring),
      opacity 0.4s;
  }
  :global(.tile:hover) .vote,
  .awake .vote {
    opacity: 1;
    transition: opacity 0.25s calc(0.35s + var(--i) * 90ms);
  }
  :global(.tile:hover) .strike,
  .awake .strike {
    opacity: 1;
    transition: opacity 0.2s 0.75s;
  }
</style>
