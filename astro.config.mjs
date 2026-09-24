import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Demo pubblicata su GitHub Pages: https://gattcocco.github.io/vic-demo/
// `site` + `base` servono a canonical, sitemap, Open Graph e a tutti i link interni (vedi src/lib/url.ts).

/**
 * Marcatore dell'area riservata ai volontari. Ogni pagina il cui indirizzo lo contiene
 * viene tenuta fuori dalla sitemap: la sitemap è pubblica e pubblicherebbe proprio
 * l'indirizzo che deve restare non indovinabile.
 *
 * La protezione è per oscurità, non crittografica: vale finché l'indirizzo non circola.
 * La pagina deve inoltre passare `noindex` a Base.astro, e NON va mai citata in
 * robots.txt (che è pubblico: elencarla equivale a pubblicarla).
 */
const AREA_RISERVATA = '/riservato-';

export default defineConfig({
  site: 'https://gattcocco.github.io',
  base: '/vic-demo',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (pagina) => !pagina.includes(AREA_RISERVATA) })],
  build: { format: 'directory' },
});
