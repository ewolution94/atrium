<script lang="ts">
  import { data } from '../lib/data.svelte';
  import { t } from '../lib/i18n.svelte';
</script>

<footer class="foot">
  <a href="https://ewolution.cloud/">ewolution.cloud</a>
  <a href="https://pulse.ewolution.cloud/">{t('statusFrom')}</a>
  <span class="end">
    {#if data.doc?.viewer}
      <!-- Plain links, so full navigations: the server answers /login and /logout, not the app. -->
      <a href="/logout">{t('signOut')}</a>
    {:else if data.doc?.login}
      <a href="/login">{t('signIn')}</a>
    {/if}
  </span>
</footer>

<style>
  .foot {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 24px;
    max-width: var(--page);
    margin: 0 auto;
    padding: 20px var(--gutter) 40px;
    font: 500 var(--ewo-text-2xs) / 1.4 var(--ewo-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
  a {
    text-decoration: none;
  }
  a:hover {
    color: var(--ewo-fg);
  }
  .end {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-left: auto;
  }
</style>
