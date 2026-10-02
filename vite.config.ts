import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// @ts-expect-error plain ESM module shared with the production server
import { createApi, readConfig } from './server/api.mjs';
// @ts-expect-error plain ESM module shared with the production server
import { createCensus } from './server/census.mjs';

// Mount the same API the production server uses, so dev and prod behave identically.
function api(): Plugin {
  const handle = createApi(readConfig(process.env));
  const census = createCensus({ site: 'atrium' });
  const middleware = async (req: any, res: any, next: (error?: unknown) => void) => {
    try {
      if ((await census(req, res)) || (await handle(req, res))) return;
      next();
    } catch (error) {
      next(error);
    }
  };
  return {
    name: 'atrium-api',
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}

export default defineConfig({
  plugins: [svelte(), api()],
  server: { port: 5400, strictPort: true },
  preview: { port: 5401, strictPort: true },
  build: {
    target: 'es2022',
    // Browsers with native light-dark(): the default target makes Lightning CSS resolve the
    // tokens once at :root (Folio's finding), and the page relies on them following the theme.
    cssTarget: ['chrome123', 'safari17.5', 'firefox120'],
  },
});
