// @ts-check
import { defineConfig } from 'astro/config';
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** Nekoweb serves not_found.html for missing pages; Astro builds 404.html. */
function nekowebNotFound() {
  return {
    name: 'nekoweb-notfound',
    hooks: {
      /** @param {{ dir: URL }} options */
      'astro:build:done': async ({ dir }) => {
        await copyFile(fileURLToPath(new URL('404.html', dir)), fileURLToPath(new URL('not_found.html', dir)));
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  integrations: [nekowebNotFound()],
});
