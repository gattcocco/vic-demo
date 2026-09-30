import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Campagne in evidenza (carosello in home). Un file .md per campagna.
const campagne = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/campagne' }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      descrizione: z.string(),
      immagine: image(),
      alt: z.string(),
      url: z.string(),
      ordine: z.number().int(),
      attiva: z.boolean().default(true),
    }),
});

// Una voce numerica porta con sé definizione e fonte (spec §5.1).
const voce = z.object({
  id: z.string(),
  valore: z.number(),
  etichetta: z.string(),
  definizione: z.string(),
  fonte: z.string(),
  dettaglio: z
    .array(z.object({ id: z.string(), etichetta: z.string(), valore: z.number() }))
    .optional(),
});

// I numeri di un anno: src/content/numeri/<anno>.json
const numeri = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/numeri' }),
  schema: z.object({
    anno: z.number().int(),
    aggiornato: z.string(),
    sezioni: z.array(z.object({ id: z.string(), titolo: z.string(), voci: z.array(voce) })),
    contesto: z.array(
      z.object({
        id: z.string(),
        valore: z.number().nullable(),
        etichetta: z.string(),
        fonte: z.string(),
        url: z.string(),
        rilevazione: z.string(),
        nota: z.string().optional(),
      }),
    ),
  }),
});

// Notizie: src/content/post/<slug>.md
const post = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/post' }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      data: z.coerce.date(),
      sommario: z.string(),
      immagine: image().optional(),
      alt: z.string().optional(),
      bozza: z.boolean().default(false),
    }),
});

// Impostazioni: singleton in src/data/impostazioni.json (id: "impostazioni")
const impostazioni = defineCollection({
  loader: glob({ pattern: 'impostazioni.json', base: './src/data' }),
  schema: z.object({
    nome: z.string(),
    nomeEsteso: z.string(),
    slogan: z.string(),
    codiceFiscale: z.string(),
    iban: z.string(),
    banca: z.string(),
    intestatario: z.string(),
    paypal: z.string(),
    telefoni: z.array(z.object({ etichetta: z.string(), numero: z.string() })),
    email: z.string(),
    indirizzo: z.object({ via: z.string(), cap: z.string(), citta: z.string() }),
    orari: z.string(),
    social: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      linkedin: z.string().optional(),
    }),
    sitoAttuale: z.string(),
    // Sede legale: la riporta l'informativa privacy del sito attuale. Non e' detto che coincida
    // con la sede operativa (indirizzo), che resta da confermare con il VIC.
    sedeLegale: z.string().default(''),
    bic: z.string().default(''),
    urlVolontari: z.string().default(''),
    runts: z.string(),
  }),
});

// Pagine di testo: src/content/pagine/<slug>.md, con sottocartelle per sezione
// (attivita/, istituzioni/). Il percorso del file decide l'indirizzo della pagina.
const pagine = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pagine' }),
  schema: z.object({
    titolo: z.string(),
    // Titolo della scheda del browser e dei risultati di ricerca; se manca si usa `titolo`.
    titoloSeo: z.string().optional(),
    descrizione: z.string(),
    // Frase d'apertura sotto il titolo, in corpo piu' grande.
    sommario: z.string().optional(),
    aggiornato: z.coerce.date(),
    // Testo non ancora approvato dal VIC: la pagina lo dichiara in un riquadro.
    daApprovare: z.boolean().default(false),
    // Solo per le schede delle istituzioni: gruppo in cui compaiono nell'indice.
    gruppo: z.enum(['garanti', 'esecuzione', 'territorio']).optional(),
    ordine: z.number().int().default(0),
    // Solo per le attivita': sezione di src/content/numeri/<anno>.json da mostrare in pagina.
    numeri: z.string().optional(),
  }),
});

export const collections = { campagne, numeri, post, impostazioni, pagine };
