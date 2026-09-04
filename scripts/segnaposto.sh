#!/usr/bin/env bash
# Genera le immagini segnaposto delle card campagna e le immagini Open Graph.
# Richiede ImageMagick 7 (`magick`). I colori sono gli stessi token di src/styles/tokens.css:
# qui gli esadecimali sono ammessi perché non è un componente del sito.
set -e
cd "$(dirname "$0")/.."
SABBIA="#D2C68F"; PETROLIO="#254E56"; TESTO="#012F37"; DEBOLE="#174149"
mkdir -p src/assets/campagne src/assets/og

# Card campagna (1200x800): quattro pannelli sabbia in un'intelaiatura petrolio,
# la struttura del marchio senza il marchio. Da sostituire con fotografie del VIC.
pannelli() {
  magick -size 1200x800 xc:"$PETROLIO" \
    \( -size 552x352 xc:"$SABBIA" \) -geometry +32+32 -composite \
    \( -size 552x352 xc:"$SABBIA" \) -geometry +616+32 -composite \
    \( -size 552x352 xc:"$SABBIA" \) -geometry +32+416 -composite \
    \( -size 552x352 xc:"$SABBIA" \) -geometry +616+416 -composite \
    -font Georgia -pointsize 26 -fill "$TESTO" -gravity SouthWest -annotate +64+56 "$2" \
    "$1"
}
pannelli src/assets/campagne/vesti-un-detenuto-povero.png "Segnaposto: foto dei pacchi vestiario da inserire"
pannelli src/assets/campagne/5x1000.png "Segnaposto: foto del VIC da inserire"
pannelli src/assets/campagne/casa-del-vic.png "Segnaposto: foto della Casa del VIC da inserire"

# Open Graph (1200x630): titolo della pagina su pannello sabbia dentro l'intelaiatura.
og() {
  magick -size 1200x630 xc:"$PETROLIO" \
    \( -size 1072x502 xc:"$SABBIA" \) -gravity center -composite \
    \( -size 960x300 -background "$SABBIA" -fill "$TESTO" -font Georgia-Bold -pointsize 62 -gravity NorthWest caption:"$2" \) -gravity NorthWest -geometry +120+116 -composite \
    \( -size 960x50 -background "$SABBIA" -fill "$DEBOLE" -font Georgia -pointsize 30 -gravity NorthWest label:"$3" \) -gravity NorthWest -geometry +120+460 -composite \
    "$1"
}
og src/assets/og/home.png "Ogni giorno entriamo nei quattro istituti di Rebibbia." "VIC - Volontari In Carcere OdV, Roma"
og src/assets/og/numeri-2024.png "I numeri del VIC nel 2024" "Colloqui, pacchi vestiario, notti di ospitalita: i dati dell'anno"
og src/assets/og/vesti-un-detenuto-povero.png "Vesti un detenuto povero" "Un pacco di vestiario per chi non ha nessuno che glielo porti"
echo "immagini generate:"; ls -la src/assets/campagne src/assets/og | awk '{print $5, $9}'
