# VIC — demo del nuovo sito

Demo pubblica del rifacimento del sito di **VIC — Volontari In Carcere OdV** (Roma).
Online su <https://gattcocco.github.io/vic-demo/>.

La specifica vincolante è in [`docs/vic-demo-spec.md`](docs/vic-demo-spec.md); i volantini originali da cui vengono soglie e testi sono in [`docs/materiali-originali/`](docs/materiali-originali/).

## 1. Cosa è questa demo, e cosa non è

**È** un artefatto di vendita: tre pagine (home, *I numeri 2024*, *Vesti un detenuto povero*) più una sezione Notizie minima, costruite per essere mostrate al direttivo dell'associazione e per essere credibili come sito vero. Dimostra il sistema visivo derivato dal logo, la pagina dei dati con i grafici accessibili, il flusso di donazione e l'aggiornabilità dei contenuti dal pannello `/admin/`.

**Non è** la migrazione del sito attuale (`vic-odv.org`, Joomla): non ci sono le pagine delle attività, *Chi siamo*, *Trasparenza*, *Contatti*, le altre campagne; i redirect dai vecchi URL sono scritti ma non attivi (vedi sotto).

**Stack:** Astro 5, output statico, zero librerie di interfaccia (niente framework CSS, charting o icon pack: i grafici sono SVG scritti a mano), font self-hostati, Content Collections con schema Zod, Sveltia CMS su `/admin/` con backend GitHub.

**Hosting: GitHub Pages invece di Cloudflare Pages.** La specifica prevedeva Cloudflare Pages; la demo è pubblicata su GitHub Pages (repo `gattcocco/vic-demo`, base path `/vic-demo/`). Differenze pratiche:

| Punto | Cloudflare Pages (spec) | GitHub Pages (demo) |
|---|---|---|
| Redirect 301 (`public/_redirects`) | Letti e applicati dalla piattaforma | **Ignorati.** Il file è nel repo per dimostrare il metodo e funziona così com'è quando il sito andrà su Cloudflare Pages |
| Accesso a Sveltia CMS | Serve comunque un servizio OAuth | Serve il **Sveltia CMS Authenticator** su Cloudflare Workers (gratuito); nel frattempo si entra con un token personale GitHub (sezione 6) |
| Cloudflare Web Analytics | Snippet cookieless attivabile dal pannello | **Non configurato:** richiede il token del sito che si ottiene solo registrando il dominio su Cloudflare |
| `robots.txt` | Alla radice del dominio | Vive in `/vic-demo/robots.txt`, che i motori non leggono; l'area riservata è comunque `noindex` |

## 2. Dati che restano da confermare con il cliente

**Definizioni delle cifre** — in `src/content/numeri/2024.json` tutte e dieci le voci portano la dicitura *«(Definizione da confermare con il VIC.)»*, compilata con una formulazione plausibile perché la pagina non resti vuota (spec §5.1). Vanno confermate una per una: volontari operativi (48), colloqui con persone detenute (7.000), persone incontrate (6.000), colloqui con familiari (1.500), persone seguite in modo continuativo (1.340), persone ospitate nella Casa del VIC (250: 180 detenute, 65 familiari, 5 libere), notti di ospitalità (2.021), pacchi vestiario (1.082: 510 uomini, 572 donne), istituti superiori (10), parrocchie (8).

**Il refuso «7.0000»** — il sito attuale scrive «7.0000 colloqui»; nella demo è corretto in **7.000**. Confermare che sia il numero giusto.

**Il dato di contesto su Rebibbia** — reperito da fonte ufficiale e inserito nel blocco `contesto` di `2024.json`: **2.293 persone presenti nei quattro istituti al 31 dicembre 2024** (Ministero della Giustizia, DAP — Sezione Statistica, *Detenuti italiani e stranieri presenti e capienze per istituto*, [aggiornamento al 31 dicembre 2024](https://www.giustizia.it/giustizia/it/mg_1_14_1.page?contentId=SST1437082)), somma di Nuovo Complesso 1.548, Femminile 378, Terza Casa 83, Casa di Reclusione 284; capienza regolamentare 2.059. Da chiarire con il VIC: il confronto mette accanto un dato di *flusso* (6.000 persone incontrate in un anno) e uno di *stock* (presenti in un giorno); la lettura corretta dipende dalla definizione di «persone incontrate».

**Contatti e recapiti** (`src/data/impostazioni.json`):
- **Indirizzo della sede:** non compare in nessuna pagina del sito attuale; `via` e `cap` sono vuoti e il piè di pagina non lo mostra.
- **Orari:** assenti sul sito; campo vuoto.
- **Telefoni:** +39 06 4062508 e +39 333 3967629 dal sito. Il link WhatsApp del sito attuale punta però a …396**7329**, che differisce di una cifra: chiedere quale sia corretto.
- **Email:** `info@vic-odv.org`; esiste anche `corsovic@vic-odv.org` per la mailing list del corso volontari (non è nello schema).
- **Social:** Facebook, Instagram e YouTube dal sito. LinkedIn non esiste (campo vuoto); esiste un profilo X/Twitter (`twitter.com/segreteriavic`) non previsto dallo schema.
- **Anno di nascita:** il brief dice 1999 e lo slogan nel piè di pagina lo ripete; la pagina *Chi siamo* del sito dice «costituita il 18 novembre 1994». Da chiarire.
- **RUNTS:** il piè di pagina del sito attuale riporta «Repertorio n. 98825 del 01.02.2023»; nella demo la riga è generica.

**Donazioni:**
- **PayPal:** il sito attuale ha tre pulsanti distinti (generale `JFZMSHC5GN5R6`, usato nella demo; *Vesti un detenuto povero* `EKNNJ5DPSPP7C`; *Casa del VIC* `2JQ2YZWNNK2J2`). Decidere se ogni campagna deve usare il proprio.
- **QR code:** quello stampato sui volantini è generato da PayPal; va fornito dal VIC o rigenerato dal loro account. Nella demo c'è un segnaposto dichiarato, non un QR finto.

**Partner:** Caritas Italiana, CESV, Fondazione Charlemagne e Arciconfraternita San Giovanni Decollato non sono citati sul sito attuale (compaiono solo nel brief): confermare che siano partner da mostrare. CESV e San Giovanni Decollato non hanno un URL affidabile. Servono i **loghi** in formato vettoriale o PNG ad alta risoluzione.

**Fotografie:** nessuna foto reale del VIC è disponibile; vedi i placeholder qui sotto.

**Incoerenze del sito attuale** da risolvere una volta per tutte nel JSON dei numeri: volontari «oltre 80» / «un centinaio» (home) contro 48 operativi (brief); pacchi «circa 100 a settimana» / «circa 150» / «1500 annui» contro 1.082 (brief).

**Nota di sicurezza:** durante la raccolta dei testi, l'HTML della home di `vic-odv.org` conteneva uno script iniettato (marcatore `joomlacreater_inline_run`) che contatta un dominio esterno e tenta di creare un utente amministratore Joomla. Il sito attuale sembra compromesso: va segnalato al VIC e bonificato, indipendentemente da questo progetto.

## 3. Placeholder in uso

- **Immagini delle campagne** (`src/assets/campagne/*.png`): generate da `scripts/segnaposto.sh`, quattro pannelli sabbia in un'intelaiatura petrolio, cioè la struttura del marchio senza il marchio, con la scritta «Segnaposto: foto … da inserire». Il campo `alt` di ogni campagna dichiara che è un segnaposto. **Mai foto stock di carceri o di persone**: vanno sostituite con fotografie del VIC (pacchi, volontari, la Casa), orizzontali, circa 1200×800.
- **Immagini Open Graph** (`src/assets/og/*.png`): generate dallo stesso script con il titolo della pagina; da sostituire con immagini dedicate quando ci saranno le foto.
- **Partner:** nomi in testo (con link dove l'URL è certo), in attesa dei loghi.
- **QR code** nella pagina *Vesti un detenuto povero*: riquadro dichiarato «QR code PayPal da inserire».
- **PayPal:** la demo usa il link pubblico generale dell'associazione. Se `paypal` in `impostazioni.json` viene svuotato, la pagina mostra un segnaposto dichiarato al posto del pulsante.
- **Notizia di esempio** (`src/content/post/2025-12-01-vesti-un-detenuto-povero-natale.md`): ricostruita dal volantino di Natale reale (kit da 5/10/20 €, bonifico con causale, 5x1000); non è una notizia pubblicata dal VIC.
- **Carattere tipografico:** il primo dei tre candidati, in attesa della prova di stampa (sezione 4).

## 4. Tipografia

In uso il **candidato 1**: *Source Serif 4* per i titoli e *Source Sans 3* per il testo, variabili, subset latino, self-hostati in `src/assets/fonts/` (copiati dai pacchetti `@fontsource-variable/*` nelle devDependencies). Nessuna chiamata a Google Fonts.

La scelta definitiva si fa con la **prova di stampa** descritta nella spec §2.5: stessi contenuti reali impaginati con i tre candidati (Source Serif 4 + Source Sans 3; Literata; Fira Sans), esportati in PDF, stampati su A4 e guardati accanto al logo stampato. Non si sceglie a schermo.

Per cambiare candidato:
1. mettere i file `.woff2` in `src/assets/fonts/` e dichiarare i `@font-face` in `src/styles/global.css` (dove stanno quelli attuali);
2. cambiare `--font-titoli` e `--font-testo` in `src/styles/tokens.css`; se la famiglia scelta è serif per il testo, alzare `--interlinea` di 0.05;
3. aggiornare i due `preload` in `src/layouts/Base.astro`, che puntano ai file dei font per nome.

## 5. Come si lancia in locale

Serve Node 22 (è la versione usata dal deploy).

```bash
npm install
npm run dev        # http://localhost:4321/vic-demo/  (il base path vale anche in locale)
npm run build      # genera dist/
npm run preview    # serve dist/ su http://localhost:4321/vic-demo/
```

Per rigenerare le immagini segnaposto (richiede ImageMagick 7, comando `magick`):

```bash
bash scripts/segnaposto.sh
```

## 6. Come si aggiorna un contenuto

Solo quattro cose sono contenuto; tutto il resto è codice.

### Via file (con un editor e un commit)

| Contenuto | Dove | Formato |
|---|---|---|
| Campagne in evidenza (carosello in home) | `src/content/campagne/<slug>.md` | Solo frontmatter: `titolo`, `descrizione`, `immagine` (percorso **relativo**, es. `../../assets/campagne/foto.jpg`), `alt`, `url` (pagina interna `/sostienici/...` o `https://...`), `ordine`, `attiva` |
| Numeri dell'anno | `src/content/numeri/<anno>.json` | Schema in `src/content.config.ts`: `anno`, `aggiornato`, `sezioni[].voci[]` (ogni voce con `valore`, `etichetta`, `definizione`, `fonte`, `dettaglio` facoltativo), `contesto[]`. Un nuovo file `2025.json` crea da solo la pagina `/numeri/2025` e accende l'anno nel selettore |
| Notizie | `src/content/post/AAAA-MM-GG-slug.md` | Frontmatter `titolo`, `data` (AAAA-MM-GG), `sommario`, `immagine`/`alt` facoltativi, `bozza`; poi il testo in Markdown. Con `bozza: true` la notizia non viene pubblicata |
| Impostazioni | `src/data/impostazioni.json` | Sigla e nome, slogan, codice fiscale, IBAN, banca, intestatario, link PayPal, telefoni, email, indirizzo, orari, social, sito attuale, pagina volontari, riga RUNTS |

Le immagini vanno in `src/assets/` (non in `public/`) e si riferiscono con percorso relativo al file di contenuto: così passano da `astro:assets` e vengono convertite in AVIF/WebP con larghezza e altezza dichiarate. Ogni push su `main` ricostruisce e pubblica il sito (sezione 7).

### Via pannello: `/admin/`

Il pannello è Sveltia CMS (`public/admin/index.html` + `public/admin/config.yml`), con le stesse quattro raccolte, etichette e suggerimenti in italiano. Scrive direttamente nel repository GitHub `gattcocco/vic-demo`, ramo `main`.

**Chi può entrare:** chi ha accesso in scrittura al repository su GitHub.

**Accesso rapido, senza nessun server (funziona oggi):** nella schermata di accesso scegliere *Sign in with Token* e incollare un token personale GitHub (fine-grained, con permessi *Contents* e *Pull requests* in lettura e scrittura sul repo). È il modo più semplice per la presentazione.

**Accesso con il pulsante GitHub (per l'uso quotidiano):** Sveltia non usa Netlify, quindi serve il **Sveltia CMS Authenticator**, un piccolo servizio OAuth su Cloudflare Workers (piano gratuito):
1. Pubblicare il worker da <https://github.com/sveltia/sveltia-cms-auth> (pulsante *Deploy to Cloudflare* oppure clone e `wrangler deploy`). Annotare l'URL, del tipo `https://sveltia-cms-auth.<sottodominio>.workers.dev`.
2. Creare una **GitHub OAuth App** su <https://github.com/settings/applications/new>: *Homepage URL* = `https://gattcocco.github.io/vic-demo/admin/`, *Authorization callback URL* = `<URL del worker>/callback`. Conservare *Client ID* e *Client Secret*.
3. Nel worker, *Settings → Variables*, impostare `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (cifrato) e `ALLOWED_DOMAINS` = `gattcocco.github.io` (in futuro anche `www.vic-odv.org`). Salvare e ridistribuire.
4. In `public/admin/config.yml` sostituire il valore segnaposto di `backend.base_url` con l'URL del worker; commit e push.

**Flusso editoriale:** `publish_mode: editorial_workflow` è supportato da Sveltia CMS con il backend GitHub ed è attivo. Ogni modifica nasce come bozza (una pull request sul repo) e passa per *Bozza → In revisione → Pronta*; il pulsante *Publish* la unisce su `main`, e da lì il deploy la porta online in un paio di minuti. Per la presentazione: aprire `/admin/`, *Notizie → Nuova*, compilare, pubblicare, attendere l'esecuzione dell'Action, aprire `/notizie/`.

**Nota sulla lingua:** l'interfaccia di Sveltia CMS non è ancora tradotta in italiano (il `locale: it` nel config non ha effetto e il pannello mostra i menu di sistema in inglese); etichette, descrizioni e suggerimenti delle quattro raccolte sono in italiano.

## 7. Deploy

`.github/workflows/deploy.yml`: **build Astro + deploy su GitHub Pages a ogni push su `main`** (o a mano da *Actions → Run workflow*). Il job installa Node 22, esegue `npm ci` e `npm run build`, carica `dist/` e lo pubblica con `actions/deploy-pages`. Nelle impostazioni del repo, *Pages → Source* deve essere *GitHub Actions*. `public/.nojekyll` evita che GitHub Pages ignori le cartelle che iniziano con `_`.

**Base path.** In `astro.config.mjs`: `site: 'https://gattcocco.github.io'` e `base: '/vic-demo'`. Da lì derivano canonical, sitemap, Open Graph e tutti i link interni, che nel codice passano sempre da `href()` di `src/lib/url.ts` (mai `/pagina` scritto a mano).

**Per un dominio proprio** (es. `https://www.vic-odv.org`):
1. `astro.config.mjs`: `site: 'https://www.vic-odv.org'`, `base: '/'`; i link interni si sistemano da soli;
2. `public/robots.txt`: aggiornare la riga `Sitemap:` e togliere il `Disallow: /vic-demo/admin/`;
3. `public/admin/config.yml`: `site_url`, `display_url`, `public_folder` globale (`/allegati`) e `ALLOWED_DOMAINS` sul worker;
4. su Cloudflare Pages il file `public/_redirects` diventa attivo senza modifiche e si può aggiungere Cloudflare Web Analytics.

## 8. Struttura del repo

```
├── .github/workflows/deploy.yml   build + deploy su GitHub Pages
├── astro.config.mjs               site, base (/vic-demo), sitemap
├── docs/
│   ├── vic-demo-spec.md           la specifica vincolante
│   └── materiali-originali/       i volantini reali (soglie, testi, QR)
├── public/
│   ├── admin/index.html           Sveltia CMS (da CDN), noindex
│   ├── admin/config.yml           backend GitHub, 4 raccolte, etichette in italiano
│   ├── _redirects                 301 dai vecchi URL (attivo su Cloudflare Pages)
│   ├── robots.txt                 tutto aperto tranne /admin/, Sitemap
│   └── .nojekyll
├── scripts/segnaposto.sh          genera immagini segnaposto e Open Graph (ImageMagick)
└── src/
    ├── assets/                    logo originale, font woff2, immagini campagne/og/post
    ├── components/                Hero, CaroselloCampagne, CardCampagna, GrigliaAttivita,
    │   │                          AnteprimaNumeri, BloccoSostegno, Partner
    │   ├── ui/                    Bottone, CopiaIban, ImportoSuggerito
    │   └── viz/                   WaffleVestiario, SettimanaTipo, NottiOspitalita,
    │                              ContestoRebibbia, TabellaDati
    ├── content.config.ts          schemi Zod delle 4 raccolte
    ├── content/
    │   ├── campagne/*.md          le tre card del carosello
    │   ├── numeri/2024.json       i numeri dell'anno, con definizioni e fonti
    │   └── post/*.md              le notizie
    ├── data/impostazioni.json     contatti, IBAN, codice fiscale, social
    ├── layouts/Base.astro         head SEO, testata, piè di pagina
    ├── lib/url.ts, formato.ts     href() con base path; numero(), euro(), perSettimana()
    ├── pages/
    │   ├── index.astro            home
    │   ├── numeri/[anno].astro    /numeri/2024
    │   ├── sostienici/vesti-un-detenuto-povero.astro
    │   └── notizie/index.astro, [slug].astro
    └── styles/tokens.css, global.css   token del sistema visivo (unico file con esadecimali), stili globali
```
