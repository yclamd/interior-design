// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL || 'https://example.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  /**
   * Every page lives under its locale, including the default one, so that no route is
   * special and the switcher is the same swap on every page. The root is a redirect
   * rather than a copy of the English home page, because two URLs serving one page is
   * the thing hreflang and canonical exist to stop.
   */
  redirects: {
    '/': '/en/',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
