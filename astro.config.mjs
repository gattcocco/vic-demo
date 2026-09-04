import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Demo pubblicata su GitHub Pages: https://gattcocco.github.io/vic-demo/
// `site` + `base` servono a canonical, sitemap, Open Graph e a tutti i link interni (vedi src/lib/url.ts).
export default defineConfig({
  site: 'https://gattcocco.github.io',
  base: '/vic-demo',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
