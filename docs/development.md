# Kehittäminen

Olen rakentanut sovellusta vaihe kerrallaan: ensin käyttöliittymä ja painokortit, sitten chat ja tallennetut vastaukset. Kokeilen muutoksia selaindemossa ja tarkennan toteutusta havaintojen perusteella. ChatGPT ja Codex ovat olleet apuna kehityksessä. Tähän olen koonnut käynnistysohjeet ja projektissa käytetyt tarkistukset.

## Paikallinen käynnistys

Käytä Node.js 24:ää. Riippuvuuksien versiot ovat `package.json`- ja lukitustiedostoissa.

```sh
npm ci
npm run web
```

Ilman chatin osoitetta sovellus käyttää esittelytilaa. [Chatin kehitysohje](chat-development.md) kertoo palvelimen asetukset.

## Tarkistukset

Aja repon juuresta:

```sh
npm ci --prefix cloudflare
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:server
npm run build:web
npm run check --prefix cloudflare
npm run test:runtime --prefix cloudflare
```

Cloudflaren riippuvuudet tarvitaan myös sen ajonaikaisten testien ja lint-tarkistuksen käyttöön. GitHub Actions suorittaa nämä tarkistukset PR:issä ja päähaaran muutoksissa. Automaattiset testit eivät arvioi lääketieteellistä oikeellisuutta tai korvaa laitetestausta.

## Muutosten tekeminen

Pyrin pitämään yhden PR:n yhdessä aiheessa ja kuvaamaan lyhyesti, mitä muuttui, miksi ja miten muutos tarkistettiin. Kirjoitan projektin kuvaukset suomeksi. Työkalujen nimet, koodin tunnisteet ja tekniset virheilmoitukset ovat tarvittaessa englanniksi. Aiemmat englanninkieliset PR:t ovat osa kehityshistoriaa.

Nykyinen Cloudflare Builds seuraa `feat/cloudflare-chat`-haaraa. Siihen viety muutos voi julkaista palvelimen jo ennen PR:n yhdistämistä. GitHub Pages julkaisee selainversion `main`-haarasta. Älä poista tai nimeä palvelinhaaraa uudelleen päivittämättä ensin Cloudflaren asetusta.

## Julkaisu ja tallennus

Selaindemo julkaistaan `.github/workflows/pages.yml`-työnkululla. `GITHUB_PAGES=true` lisää `/anestesiahelppi`-polun vain Pages-koontiin. Paikallinen ja natiivikehitys käyttävät tavallisia polkuja.

Selain tallentaa kortit localStorageen; natiivisovelluksen tallennus on toteutettu Expo SQLitellä. Natiiviversion toiminta on vielä varmistettava laitteilla. Sovelluskauppajulkaisua tai pilvisynkronointia ei ole.

Tekniset päätökset löytyvät [Expo-päätöksestä](decisions/0001-expo-react-native.md) ja [chatin päätöksestä](decisions/0002-source-chat-memory.md). Ne on säilytetty alkuperäisinä päivättyinä muistiinpanoina.
