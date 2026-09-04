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
    urlVolontari: z.string().default(''),
    runts: z.string(),
  }),
});

export const collections = { campagne, numeri, post, impostazioni };
