import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Demo pubblicata su GitHub Pages: https://gattcocco.github.io/vic-demo/
// `site` + `base` servono a canonical, sitemap, Open Graph e a tutti i link interni (vedi src/lib/url.ts).

const BASE = '/vic-demo';

/**
 * I link interni scritti nei testi Markdown (src/content) sono assoluti rispetto alla radice del
 * sito, per esempio [cookie](/cookie/): questo passaggio vi antepone il percorso di base, come fa
 * href() nei template. Cosi' i testi restano validi anche quando il sito passera' sul dominio
 * proprio, dove BASE diventa '' e non va toccato nient'altro.
 */
function rehypeBase() {
  const prefisso = BASE.replace(/\/$/, '');
  const visita = (nodo) => {
    const url = nodo.type === 'element' && nodo.tagName === 'a' ? nodo.properties?.href : undefined;
    if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(prefisso + '/')) {
      nodo.properties.href = prefisso + url;
    }
    nodo.children?.forEach(visita);
  };
  return (albero) => visita(albero);
}

export default defineConfig({
  site: 'https://gattcocco.github.io',
  base: BASE,
  markdown: { rehypePlugins: [rehypeBase] },
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
