# VIC — Specifica del mini-sito dimostrativo

Brief operativo per la costruzione di una demo pubblica (3 pagine) del rifacimento del sito di VIC — Volontari In Carcere OdV, Roma.

---

## Vincoli non negoziabili

Da leggere prima di scrivere una riga di codice. Sono i punti su cui il resto della specifica non ammette interpretazione, e sono anche quelli che è più naturale violare senza accorgersene, perché ognuno di essi contraddice una scorciatoia ragionevole.

1. **Massimo due riempimenti per grafico.** La verifica di contrasto (2.4) dimostra che tre riempimenti categorici distinguibili non esistono dentro questa palette: i tre migliori candidati si fermano a 2,87 e 2,57, sotto la soglia di 3 richiesta fra aree adiacenti. Aggiungere un terzo colore "per chiarezza" produce un grafico meno leggibile, non più. Ogni distinzione oltre la seconda si fa con etichetta diretta o tratteggio.
2. **Nessun colore fuori dalle due tinte del marchio** (212° e 99°). Il sistema è derivato dal logo, non scelto. Non si aggiungono accenti, non si introducono colori semantici di stato, non si usa un rosso per gli errori.
3. **Nessun valore esadecimale dentro i componenti.** Solo i token semantici di 2.2. Se serve un colore che non esiste fra i token, la risposta è che non serve.
4. **Ogni grafico spedisce anche una `<table>`** con gli stessi dati, nel DOM. Non `aria-hidden`, non solo `alt`.
5. **Non inventare cifre.** In particolare il dato sulla popolazione detenuta a Rebibbia (5.2) va da fonte ufficiale citata con data, oppure resta un placeholder dichiarato.
6. **Non ridisegnare il logo.** Si usa il file originale a 2050 px. Vale anche per favicon e Open Graph.
7. **Raggio di curvatura 0 ovunque.** Lo detta il marchio, che è una vetrata di angoli retti.
8. **Un solo momento animato** in tutto il sito, il riempimento del waffle chart. Nessun fade-and-slide-up di sezione.
9. **Nessuna libreria aggiunta.** Niente framework di charting, niente icon pack, niente CSS framework.
10. **Nessuna immagine di sbarre, chiavi, manette, celle o silhouette in controluce.**

---

## 0. Contesto e obiettivo

Il VIC è un'organizzazione di volontariato attiva dal 1999 nei quattro istituti penitenziari di Rebibbia (Roma) e in una casa di accoglienza in città. Circa 48 volontari operativi, colloqui con persone detenute, pacchi vestiario, accoglienza di persone in permesso premio, interventi nelle scuole. È collegata a Caritas Roma ed è iscritta al RUNTS.

Il sito attuale (`vic-odv.org`) è un Joomla con template Helix Ultimate. Questa demo **non** è la migrazione: è un artefatto di vendita da mostrare al direttivo. Deve essere credibile come sito vero, non come mockup.

**Pubblico della demo:** direttivo dell'associazione, età media alta, non tecnico. Deve capire il valore in trenta secondi, su un telefono.

**Deliverable:** repo Git + deploy su Cloudflare Pages.

---

## 1. Stack

- **Astro 5**, output statico, zero framework UI. Componenti `.astro`. JavaScript solo dove serve un'interazione (carosello, riempimento grafici).
- **Cloudflare Pages** per il deploy.
- **Sveltia CMS** su `/admin`, backend GitHub, per dimostrare l'aggiornabilità.
- **Content Collections** di Astro con schema Zod per tutti i contenuti strutturati.
- **Font self-hostati** in woff2, subset latino. Nessuna chiamata a Google Fonts.
- **Nessuna dipendenza da librerie di charting.** I grafici sono SVG scritti a mano: sono tre, sono semplici, e una libreria costerebbe più peso del sito intero.
- **Cloudflare Web Analytics** (cookieless). Nessun cookie banner.

Budget di performance, da rispettare come vincolo non come aspirazione: Lighthouse ≥ 95 su tutte e quattro le voci, LCP < 1,5 s su 4G simulato, meno di 30 kB di JavaScript totale sull'intero sito.

---

## 2. Sistema visivo

Il sistema **non si inventa: si deriva dal logo**. Il VIC non ha un manuale di identità e i materiali stampati sono incoerenti fra loro, ma il marchio è buono e va usato come unica fonte.

### 2.1 Cosa dice il logo

Il marchio è una vetrata: quattro pannelli sabbia dentro un'intelaiatura petrolio con piombature nere, una colomba bianca e un ramo d'ulivo. Estraendo i colori dal file e convertendoli in OKLCH:

| ruolo nel marchio | hex | OKLCH | superficie occupata |
|---|---|---|---|
| pannelli | `#D2C68F` | L .823 · C .073 · **H 97.3** | 24,7 % |
| intelaiatura | `#254E56` | L .398 · C .048 · **H 211.9** | 9,5 % |
| ramo d'ulivo | `#006979` | L .478 · C .084 · **H 212.8** | 2,6 % |
| colomba | `#ECEBE3` | L .939 · C .011 · **H 100.8** | 5,1 % |
| piombature | `#000101` | — | 9,7 % |

Petrolio e teal hanno la stessa tinta a due gradini di luminosità. Sabbia e bianco caldo hanno la stessa tinta a due gradini di luminosità. Sono **due assi cromatici a 113° di distanza**, non quattro colori messi insieme.

Il sistema del sito è l'estensione di quei due assi: si mantengono le tinte 212° e 99°, si variano luminosità e croma in OKLCH, si verifica ogni accostamento con un calcolo di contrasto. Nessun colore entra nel sistema se non sta su una delle due tinte.

**Il nero resta al marchio.** Le piombature sono nere, ma il testo del sito non lo è: il testo è petrolio scurissimo. Il nero pieno compare solo dentro il logo, così il marchio conserva la sua forza quando è circondato dalla pagina.

### 2.2 Token

```css
:root {
  /* --- primitive: le due tinte del marchio --- */
  --h-freddo: 212;   /* intelaiatura e ramo d'ulivo */
  --h-caldo:   99;   /* pannelli e colomba */

  /* --- semantici: usare SOLO questi nei componenti --- */
  --superficie:        #ECEBE3;  /* colomba — fondo pagina */
  --superficie-alt:    #D2C68F;  /* pannelli — fasce "sostienici" */
  --superficie-scura:  #254E56;  /* intelaiatura — fasce dati */
  --testo:             #012F37;  /* petrolio scurito, L .28 */
  --testo-debole:      #174149;  /* L .35 */
  --azione:            #00606E;  /* teal scurito, L .45 */
  --azione-testo:      #FFFFFF;
  --bordo:             #A9A06A;  /* sabbia scurita, L .70 */

  /* --- serie dati: solo due riempimenti, vedi 2.4 --- */
  --dato-1:            #254E56;
  --dato-2:            #D2C68F;
  --dato-bordo:        #254E56;
}
```

Le primitive esistono perché l'intero sistema si possa spostare cambiando due numeri. I componenti non toccano mai un valore esadecimale: usano i semantici.

### 2.3 Contrasti, verificati non stimati

| accostamento | rapporto | esito |
|---|---|---|
| testo su superficie | 12,0 | AAA |
| testo su superficie-alt | 8,35 | AAA |
| testo-debole su superficie | 9,3 | AAA |
| azione su superficie | 6,06 | AA |
| azione su superficie-alt | 4,21 | AA solo per testo grande |
| bianco su azione | 7,25 | AAA |
| bianco su superficie-scura | 9,12 | AAA |
| sabbia su superficie-scura | 5,3 | AA |
| bordo su superficie | 2,22 | solo bordi, mai testo |

Vincolo che ne discende: **un link o un'etichetta in `--azione` non va mai su `--superficie-alt`** a corpo testo. Sulle fasce sabbia gli elementi interattivi usano `--testo` con sottolineatura, oppure un pulsante pieno.

### 2.4 Regola sui grafici

La verifica dice che tre riempimenti categorici mutuamente distinguibili non esistono dentro questa palette: i migliori tre candidati si fermano a 2,87 e 2,57 di contrasto reciproco, sotto la soglia di 3 che serve fra aree adiacenti.

Conseguenza operativa, non aggirabile: **massimo due riempimenti per grafico.** La coppia valida è petrolio + sabbia, che fra loro fanno 5,3. Qualsiasi terza distinzione si fa con etichetta diretta o tratteggio, mai con un terzo colore.

Secondo vincolo: la sabbia contro il fondo pagina fa 1,44, quindi ogni area sabbia in un grafico porta un bordo di 1px in `--dato-bordo`, altrimenti sparisce.

### 2.5 Tipografia

Nessuna scelta narrativa. I criteri sono questi e sono vincolanti:

- numerali tabulari, perché c'è una pagina intera di cifre incolonnate
- diacritici italiani completi e resa corretta in stampa, perché il VIC produce volantini
- almeno tre pesi disegnati, non sintetizzati
- licenza libera e self-hostabile: nessun budget, e il CDN di Google è un problema GDPR
- altezza x ampia e aperture aperte, perché il corpo base è 19px e il pubblico ha in media sessant'anni
- peso sufficiente da reggere accanto al marchio: la vetrata ha contorni neri spessi e campiture piatte, un display ad alto contrasto tipo Playfair o Instrument Serif accanto al logo sembrerebbe smagrito

**Tre candidati da testare, non una decisione già presa:**

1. **Source Serif 4 + Source Sans 3** — superfamiglia con metriche allineate, gamma di pesi completa, numerali tabulari in entrambe, progettata per schermo e stampa
2. **Literata** — serif variabile pensata per la lettura lunga, altezza x ampia, una sola famiglia per tutto
3. **Fira Sans** — umanista, altezza x fra le più generose disponibili, ottima a corpo alto

**Protocollo di scelta:** impaginare i tre candidati sullo stesso contenuto reale (il titolo dell'hero, un blocco delle attività, la tabella dei numeri con le cifre allineate), esportare in PDF, stampare su A4, guardarli accanto al logo stampato. La scelta si fa lì, non a schermo e non leggendo la storia del carattere.

Finché la scelta non è presa, `--font-testo` e `--font-titoli` restano variabili in `tokens.css` e la demo gira con il primo candidato.

**Scala tipografica.** Corpo 19px, interlinea 1.65, riga massima 68 caratteri. Display `clamp(2.5rem, 6vw, 4.5rem)`. Se la famiglia scelta è serif, aumentare l'interlinea di 0.05.

Da non fare, perché sono i segnali più riconoscibili di una pagina generata: evidenziare una singola parola del titolo in un colore diverso, etichette in maiuscoletto spaziato sopra ogni sezione, un monospace per le etichette dei dati, una freccia appesa al testo dei pulsanti.

### 2.6 Layout

Allineamento a sinistra ovunque, tranne le etichette interne ai grafici. Griglia a 12 colonne, testo di lettura su 7-8. Nessuna ombra: la separazione fra le sezioni la fa il cambio di superficie.

Il raggio di curvatura è **0 ovunque**, perché il marchio è una vetrata fatta di angoli retti e piombature. È l'unica indicazione formale che il logo detta oltre al colore, e vale la pena seguirla: pulsanti, immagini e riquadri squadrati.

Le fasce di sezione alternano `--superficie`, `--superficie-alt` e `--superficie-scura` seguendo la struttura del marchio: pannelli chiari dentro un'intelaiatura scura.

### 2.7 Immagini e movimento

Niente sbarre, chiavi, sbarre con fiore, manette, silhouette in controluce, mani che ne stringono altre. Il sito attuale usa proprio queste immagini ed è una delle ragioni per cui sembra vecchio.

Un solo momento animato in tutto il sito: il riempimento progressivo del grafico a quadratini nella pagina dei numeri, quando entra nel viewport. Nient'altro: nessun fade-and-slide-up sulle sezioni, nessuna transizione sulle card oltre al cambio di colore. Con `prefers-reduced-motion` attivo il grafico si presenta già riempito.

## 3. Struttura del repo

```
/
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── CaroselloCampagne.astro
│   │   ├── CardCampagna.astro
│   │   ├── GrigliaAttivita.astro
│   │   ├── AnteprimaNumeri.astro
│   │   ├── BloccoSostegno.astro
│   │   ├── Partner.astro
│   │   ├── viz/
│   │   │   ├── WaffleVestiario.astro
│   │   │   ├── SettimanaTipo.astro
│   │   │   ├── NottiOspitalita.astro
│   │   │   ├── ContestoRebibbia.astro
│   │   │   └── TabellaDati.astro
│   │   └── ui/
│   │       ├── Bottone.astro
│   │       ├── CopiaIban.astro
│   │       └── ImportoSuggerito.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── campagne/
│   │   ├── numeri/
│   │   │   └── 2024.json
│   │   └── post/
│   ├── data/
│   │   └── impostazioni.json
│   ├── layouts/
│   │   └── Base.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── numeri/[anno].astro
│   │   └── sostienici/vesti-un-detenuto-povero.astro
│   └── styles/
│       └── tokens.css
├── public/
│   ├── admin/config.yml
│   ├── fonts/
│   └── _redirects
└── astro.config.mjs
```

---

## 4. Pagina 1 — Home (`/`)

Sezioni nell'ordine di scorrimento.

### 4.1 Hero

Fondo `--superficie`. Nessuna immagine di sfondo, nessun overlay scuro su foto.

Contenuto: un titolo su due o tre righe in display, un paragrafo di due frasi, due pulsanti.

Copy da usare:

> **Ogni giorno entriamo nei quattro istituti di Rebibbia.**
>
> Il VIC accompagna le persone detenute durante la pena e nel passaggio verso il fuori: colloqui, vestiario, una casa dove vivere i primi permessi.

Pulsanti: `Sostieni il VIC` (primario) e `Diventa volontario` (secondario, contorno).

Il sito attuale apre con "Sei qui perché vuoi avvicinarti al mondo del carcere", che parla al visitatore invece di dire chi è il VIC. Il nuovo hero risponde alla domanda "chi siete e cosa fate", che è quella che si fa un donatore.

### 4.2 Carosello campagne

**Comportamento:** un solo componente, due comportamenti.
- Sopra 768px: griglia a tre colonne, tutte e tre le card visibili, nessun controllo.
- Sotto 768px: contenitore con `scroll-snap-type: x mandatory`, card a `85vw`, indicatori di posizione sotto.

Nessun autoplay, mai. Nessuna freccia su desktop, perché non c'è niente da scorrere.

**Contenuto delle card:** ricostruite in HTML, non immagini di volantini. Titolo, una riga di descrizione, immagine di supporto (fotografia, non poster scansionato), link.

| Titolo | Descrizione | Destinazione |
|---|---|---|
| Vesti un detenuto povero | Un pacco di vestiario per chi non ha nessuno che glielo porti | `/sostienici/vesti-un-detenuto-povero` |
| Dona il tuo 5x1000 | Non ti costa nulla: basta una firma e il codice fiscale | `https://www.vic-odv.org/index.php/mega/powerful-features/5x1000` |
| Sostieni la Casa del VIC | La casa dove si vivono i primi giorni fuori | `https://www.vic-odv.org/index.php/mega/altre-attivita/fundraising/sostieni-la-casa-del-vic` |

Nella demo la prima punta alla pagina interna ricostruita, le altre due al sito attuale, così la navigazione non finisce nel vuoto. Segnalarlo con un `rel="noopener"` e `target="_blank"` solo sui link esterni.

Ogni card è cliccabile per intero, ma con un vero `<a>` sul titolo per la navigazione da tastiera. Niente `onclick` sul contenitore.

### 4.3 Le attività

Sei blocchi in griglia (3×2 su desktop, 1 colonna su mobile): Ascolto, Accoglienza, Aiuto, Formazione nuovi volontari, Formazione permanente, Sensibilizzazione.

I testi si prendono dal sito attuale, accorciati a due frasi. Uniformare il linguaggio a *persona detenuta* invece di *detenuto* nei testi descrittivi. Il nome della campagna "Vesti un detenuto povero" resta com'è: ha vent'anni di riconoscibilità.

Nessuna icona generica. Se serve un segnale visivo, usare il numero della sezione solo se il contenuto è davvero una sequenza — non lo è, quindi niente numerazione.

### 4.4 Anteprima numeri

Fondo `--superficie-scura`, testo chiaro. Tre cifre soltanto, scelte perché raccontano tre cose diverse: le persone incontrate, i pacchi vestiario, le notti di ospitalità. Un link a `/numeri/2024`.

Le cifre si leggono da `src/content/numeri/2024.json`, non sono scritte a mano nel template.

### 4.5 Sostienici

Fondo `--superficie-alt`. Tre modalità (5x1000, bonifico, PayPal) con il codice fiscale in evidenza e copiabile.

### 4.6 Partner

Logo dei partner in scala di grigi, a colori in hover. Caritas Roma, Caritas Italiana, Antigone, CESV, Fondazione Charlemagne, Fondazione Rifugio, Arciconfraternita San Giovanni Decollato.

---

## 5. Pagina 2 — I numeri (`/numeri/2024`)

È la pagina che vende il progetto. Va costruita con più cura di tutte le altre.

### 5.1 Schema dati

`src/content/numeri/2024.json`. Ogni voce porta con sé la sua definizione e la sua fonte: serve a evitare il problema attuale, in cui la home e le pagine interne danno cifre incompatibili.

```json
{
  "anno": 2024,
  "aggiornato": "2026-09-01",
  "sezioni": [
    {
      "id": "ascolto",
      "titolo": "Ascolto",
      "voci": [
        {
          "id": "volontari-operativi",
          "valore": 48,
          "etichetta": "Volontari operativi",
          "definizione": "DA CONFERMARE CON IL VIC",
          "fonte": "Relazione annuale VIC 2024"
        }
      ]
    }
  ],
  "contesto": [
    {
      "id": "detenuti-rebibbia",
      "valore": null,
      "etichetta": "Persone detenute nei quattro istituti di Rebibbia",
      "fonte": "Ministero della Giustizia — Statistiche detenuti",
      "url": "",
      "rilevazione": ""
    }
  ]
}
```

I valori da riportare, presi dal sito attuale:

- **Ascolto:** 48 volontari operativi, 7.000 colloqui con persone detenute, 6.000 persone incontrate, 1.500 colloqui con familiari, 1.340 persone seguite in modo continuativo
- **Accoglienza:** 250 persone ospitate (180 detenute, 65 familiari, 5 libere), 2.021 notti di ospitalità
- **Aiuti:** 1.082 pacchi vestiario (510 uomini, 572 donne)
- **Sensibilizzazione:** 10 istituti superiori, 8 parrocchie

Il sito attuale scrive "7.0000": è un refuso, va corretto in 7.000. Il campo `definizione` resta a "DA CONFERMARE" finché non abbiamo l'incontro con loro: **nella demo va compilato con una formulazione plausibile, non lasciato vuoto a schermo.**

### 5.2 I quattro grafici

**Waffle dei pacchi vestiario.** 1.082 quadratini in SVG, disposti in blocchi da 100 con una separazione ogni riga di dieci, in `--dato-1` e `--dato-2`, ciascun quadratino con bordo 1px in `--dato-bordo`. Riempimento progressivo su `IntersectionObserver`, durata massima 1,2 s, saltato con `prefers-reduced-motion`. Sopra il grafico, la cifra grande. Sotto, una riga che spiega la lettura: "un quadratino è un pacco consegnato".

**La settimana tipo.** Valori annuali divisi per 52, arrotondati, presentati come una scena leggibile: quanti colloqui, quanti pacchi, quante notti in una settimana media. Etichettare esplicitamente come media, mai come dato rilevato. Nessun grafico: qui funziona meglio la tipografia.

**Le notti di ospitalità.** 2.021 notti su 250 persone: media di 8 notti a testa. Una barra orizzontale con la distribuzione, più una frase che spiega cos'è un permesso premio. È il dato che più si presta a essere frainteso, quindi il testo di accompagnamento conta più del grafico.

**Il contesto.** Confronto tra le persone incontrate dal VIC e la popolazione detenuta dei quattro istituti di Rebibbia. **Il valore va reperito da fonte ufficiale (Ministero della Giustizia, statistiche mensili, o rapporto Antigone) e citato con data di rilevazione e link.** Se non si trova un dato riferibile al 2024, il grafico va costruito ma lasciato con un placeholder esplicito: non inventare la cifra.

### 5.3 Accessibilità dei grafici

Vincolo non negoziabile. **Ogni grafico spedisce anche una `<table>` con gli stessi dati**, dentro un `<details>` con summary "Vedi i dati in tabella". Non `aria-hidden`, non solo `alt`: una tabella vera, nel DOM, indicizzabile.

Ogni SVG ha `role="img"` e un `<title>` + `<desc>` che descrivono cosa mostra il grafico e qual è la conclusione.

### 5.4 Archivio

Rotta dinamica `/numeri/[anno]`. Nella demo esiste solo il 2024, ma la struttura deve mostrare che gli anni si accumulano. Un selettore anno in cima, disabilitato sugli anni assenti.

---

## 6. Pagina 3 — Vesti un detenuto povero (`/sostienici/vesti-un-detenuto-povero`)

Dimostra il flusso di conversione. La pagina attuale ha il testo giusto ma il percorso di donazione rotto.

**Struttura:**

1. Titolo e una frase che dice cosa succede quando doni
2. Il racconto: il testo attuale della pagina, che è buono, accorciato del 30%
3. **Importi suggeriti** — tre pulsanti con l'equivalenza concreta. Le soglie non vanno inventate: il VIC le usa già sui propri volantini stampati.

   | importo | cosa copre | contenuto |
   |---|---|---|
   | 5 € | Kit igiene | sapone, shampoo, dentifricio, spazzolino |
   | 10 € | Kit biancheria | mutande, canottiere, reggiseno, asciugamani |
   | 20 € | Kit abbigliamento | tuta, felpa, scarpe da ginnastica |

   Ogni pulsante mostra l'importo e cosa produce, non solo la cifra. È la conversione più efficace che hanno già a disposizione e oggi vive solo su materiale cartaceo stagionale.
4. **Bonifico** — IBAN `IT77E0306909606100000114867`, Banca Intesa Sanpaolo, intestato a Volontari In Carcere OdV. Pulsante copia con conferma visibile ("Copiato"), non un toast che sparisce.
5. **PayPal** — pulsante funzionante. Nella demo può puntare al link PayPal pubblico dell'associazione; se non recuperabile, un placeholder chiaramente marcato.
6. **QR code** — per donare da telefono.
7. **Detraibilità** — una riga sul fatto che la donazione è detraibile, con il codice fiscale.
8. **Cosa hai reso possibile** — richiamo a due cifre della pagina numeri.

**Da non riprodurre:** il contatore "Visite: 1739" e il blocco "Ratings (0)" presenti oggi su questa pagina.

---

## 6-bis. Nota di perimetro — Casa del VIC

La campagna "Sostieni la Casa del VIC" ha una struttura identica e soglie proprie, anch'esse già in uso: **10 € una notte, 25 € tre notti, 50 € una settimana**. La pagina non rientra nelle tre della demo, ma il componente `ImportoSuggerito` va costruito parametrico fin da subito, perché servirà identico su almeno due campagne e probabilmente su tutte quelle future.

Il dato delle 2.021 notti di ospitalità nella pagina numeri e la soglia "10 € una notte" descrivono la stessa cosa: vanno collegati, sono lo stesso racconto visto dai due lati.

## 7. Content Collections e CMS

### 7.1 `src/content/config.ts`

Quattro collezioni con schema Zod:

- **`campagne`** — `titolo`, `descrizione`, `immagine`, `url`, `ordine` (number), `attiva` (boolean)
- **`numeri`** — JSON, schema come alla sezione 5.1
- **`post`** — `titolo`, `data`, `sommario`, `immagine` opzionale, `bozza` (boolean), corpo markdown
- **`impostazioni`** — singleton: telefoni, email, indirizzo, orari, IBAN, codice fiscale, link social

Nessun contenuto testuale hardcodato nei template se compare in una di queste collezioni.

### 7.2 Sveltia CMS

`public/admin/config.yml`, backend `github`, branch `main`, `publish_mode: editorial_workflow` così le modifiche passano da una bozza.

Etichette del pannello **in italiano e nel linguaggio del VIC**, non in quello del sistema: "Notizie" non "Posts", "Campagne in evidenza" non "Collection". Ogni campo ha un `hint` che spiega cosa fa in una riga.

Solo le quattro collezioni sopra sono editabili. Tutto il resto è codice.

Deploy dell'admin funzionante sulla demo: durante la presentazione si aggiunge una notizia dal vivo.

---

## 8. Migrazione e redirect

`public/_redirects` con la mappatura dei vecchi URL. Almeno queste, tutte 301:

```
/index.php/mega/altre-attivita/fundraising/vesti-un-detenuto-povero  /sostienici/vesti-un-detenuto-povero  301
/index.php/mega/powerful-features/5x1000                             /sostienici/5x1000                    301
/index.php/mega/altre-attivita/fundraising/sostieni-la-casa-del-vic  /sostienici/casa-del-vic              301
/index.php/mega/attivita-interne/ascolto                             /attivita/ascolto                     301
/index.php/mega/attivita-interne/accoglienza                         /attivita/accoglienza                 301
/index.php/mega/attivita-interne/aiuto                               /attivita/aiuto                       301
/index.php/chi-siamo                                                 /chi-siamo                            301
/index.php/*                                                         /                                     301
```

Nella demo i redirect vanno inseriti anche se le pagine di destinazione non esistono tutte: servono a dimostrare il metodo. Le rotte non ancora costruite possono puntare alla home.

Nuova struttura di URL, da usare come riferimento: `/attivita/{slug}`, `/sostienici/{slug}`, `/numeri/{anno}`, `/notizie/{slug}`, `/chi-siamo`, `/trasparenza`, `/contatti`.

---

## 9. Requisiti trasversali

**SEO**
- Un solo `<h1>` per pagina, gerarchia dei titoli corretta
- `<title>` e meta description scritte a mano per ognuna delle tre pagine, mai generate dal template
- Canonical assoluto e coerente con il dominio della demo
- JSON-LD: `NGO` sulla home (con `taxID`, indirizzo, telefoni, social), `Article` sulle pagine campagna, `Dataset` sulla pagina numeri
- Open Graph con immagini dedicate, non il logo
- `sitemap.xml` e `robots.txt`

**Accessibilità**
- Contrasto minimo 4.5:1 sul testo, verificato non stimato
- Focus visibile su ogni elemento interattivo, con un outline che non sia quello di default del browser ma che sia altrettanto evidente
- Il carosello mobile navigabile da tastiera e con `aria-live` sugli indicatori
- Nessuna informazione affidata al solo colore, nemmeno nei grafici
- Lingua dichiarata `it`

**Immagini**
- Tutte attraverso `astro:assets`, formato AVIF con fallback WebP
- `width` e `height` sempre dichiarati
- `alt` descrittivi e scritti, non riempiti con il nome del file
- Nelle immagini della demo, se non si hanno le foto reali del VIC, usare placeholder neutri e marcarli chiaramente nel README: **mai foto stock di carceri o di persone**

**README del repo**
Deve contenere: cosa è questa demo e cosa non è, i dati che restano da confermare con il cliente, i placeholder in uso, come si lancia in locale, come si aggiorna un contenuto.

---

## 10. Cosa non fare

- Non riprodurre l'immaginario del sito attuale: chiavi, sbarre, sbarre con fiore
- Non usare contatori animati che scorrono da zero al valore finale sulla home
- Non inventare cifre non presenti in questa specifica, in particolare per il grafico di contesto
- Non aggiungere una sezione testimonianze con citazioni inventate attribuite a persone detenute
- Non introdurre colori fuori dalle due tinte del marchio (212° e 99°), e in particolare non usare fondo crema con accento terracotta
- Non usare tre riempimenti in un grafico: la palette non li regge, vedi 2.4
- Non scegliere il carattere prima della prova di stampa descritta in 2.5
- Non aggiungere librerie: niente Tailwind se non serve, niente framework di charting, niente icon pack
