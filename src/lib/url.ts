/**
 * Helper per i link interni: antepone il `base` di Astro (GitHub Pages serve la demo
 * da /vic-demo/) e normalizza lo slash finale (trailingSlash: 'always').
 * Usarlo per OGNI href interno, mai scrivere "/pagina" a mano.
 *
 *   href('/numeri/2024')      -> '/vic-demo/numeri/2024/'
 *   href('/#attivita')        -> '/vic-demo/#attivita'
 *   href('https://…')         -> invariato
 *   assoluto('/numeri/2024')  -> 'https://gattcocco.github.io/vic-demo/numeri/2024/'
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path: string): string {
  if (/^(https?:)?\/\//.test(path) || /^(mailto:|tel:|#)/.test(path)) return path;
  const [percorso, resto = ''] = path.split(/(?=[#?])/);
  let pulito = percorso.startsWith('/') ? percorso : `/${percorso}`;
  if (!/\.[a-z0-9]+$/i.test(pulito) && !pulito.endsWith('/')) pulito += '/';
  return base + pulito + resto;
}

export function assoluto(path: string): string {
  return new URL(href(path), import.meta.env.SITE).toString();
}

export function esterno(url: string): boolean {
  return /^https?:\/\//.test(url) && !url.startsWith(import.meta.env.SITE);
}
