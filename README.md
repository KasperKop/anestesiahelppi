# AnestesiaHelppi

Ensimmäinen harrastus- ja portfolioprojektini: anestesiahoitotyön aiheista syntynyt mobiilikäyttöön suunniteltu sovellus. Olen anestesiahoitaja, ja halusin kokeilla, miten työstä tuttuja tiedonhakuun ja käyttöliittymiin liittyviä ideoita voisi toteuttaa itse suunnitellussa sovelluksessa.

**[Kokeile selaindemoa](https://kasperkop.github.io/anestesiahelppi/)** · [Kehityksen tilanne](docs/roadmap.md) · [Paikallinen käynnistys](docs/development.md)

> Sovellus on oppimisprojekti, ei potilastyöhön tarkoitettu työkalu. Painokorttien sisältöä ja tekoälyn vastauksia ei ole validoitu kliiniseen käyttöön. Älä syötä potilastietoja.

## Mitä sovelluksella voi tehdä?

- Valita painon väliltä 3–30 kg ja avata siihen liittyvän painokortin.
- Kysyä yleisiä oppimiskysymyksiä chatilta, joka hakee lähteitä WikiAnesthesiasta, PubMedista, Europe PMC:stä ja DOAJ:sta.
- Avata vastauksen lähteet ja hakutiedot **Näytä lähteet** -painikkeesta.
- Tallentaa vastauksen sydämestä ja järjestää kortteja itse nimettyihin **Omat pinot** -kokoelmiin.
- Kokeilla valmiita esimerkkivastauksia **Esittelytilassa** ilman mallikutsuja.

Selainversio on julkaistu kokeiltavaksi. Sovellus on edelleen prototyyppi; erillisiä iOS- ja Android-julkaisuja ei ole tehty.

## Kokeile näin

1. Avaa demo ja kirjoita esimerkiksi: _Mitä tarkoittaa yhdistetty spinaali-epiduraalipuudutus?_
2. Avaa lähteet nähdäksesi, mihin vastaus perustuu.
3. Tallenna vastaus sydämestä ja siirry **Omat pinot** -välilehdelle.

Demon yhteinen käyttöraja on 50 pyyntöä vuorokaudessa ja vähintään minuutti pyyntöjen välillä. Esittelytila toimii myös ilman lähdehakua. Kortit tallentuvat paikallisesti: selaintietojen poistaminen poistaa myös kortit.

## Miksi tein tämän?

Halusin kokeilla, miten anestesiahoitajan työstä lähtenyt idea muuttuu toimivaksi sovellukseksi. Suunnittelin käyttötapaukset ja ulkoasun, kokeilin eri ratkaisuja ja muokkasin kokonaisuutta sen perusteella, mikä tuntui käytössä selkeältä. Toteutuksessa olen käyttänyt apuna ChatGPT:tä ja Codexia.

Tämä on ensimmäinen tällainen projektini, joten opettelen samalla GitHubin käyttöä ja sovelluskehityksen eri vaiheita. Olen pitänyt kehitysvaiheet ja korjaukset näkyvillä issueissa ja pull requesteissa, jotta projektin etenemistä voi seurata.

## Tekniikka

| Osa            | Toteutus                                                                |
| -------------- | ----------------------------------------------------------------------- |
| Käyttöliittymä | Expo, React Native, TypeScript ja Expo Router                           |
| Selaindemo     | GitHub Pages                                                            |
| Chat-palvelin  | Cloudflare Workers; paikalliseen kehitykseen myös Node.js-palvelin      |
| Kielimalli     | Groq, `openai/gpt-oss-120b`                                             |
| Tallennus      | Selaimessa localStorage, natiivisovelluksen toteutuksessa Expo SQLite   |
| Tarkistukset   | TypeScript, ESLint, Prettier, Jest ja palvelintestit GitHub Actionsissa |

Toteutus suosii ilmaisia palvelutasoja. API-avain on palvelimella, eikä sitä sisällytetä sovellukseen tai repoon.

## Käynnistys omalla koneella

Node.js 24:

```sh
npm ci
npm run web
```

Ilman `EXPO_PUBLIC_CHAT_API_URL`-asetusta käytössä ovat valmiit esimerkkivastaukset. Oikean lähdehaun asetukset löytyvät [chatin kehitysohjeesta](docs/chat-development.md).

## Lisätietoa

| Aihe                 | Ohjeet                                                                                                                                         |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Projektin eteneminen | [Tehdyt ominaisuudet ja jatkoideat](docs/roadmap.md)                                                                                           |
| Sovelluksen käyttö   | [Käyttöpolut](docs/user-journeys.md) · [Ulkoasun periaatteet](docs/ui-guidelines.md)                                                           |
| Kehittäminen         | [Käynnistys ja tarkistukset](docs/development.md) · [Chatin asetukset](docs/chat-development.md) · [Cloudflare](docs/cloudflare-deployment.md) |
| Lähteet ja rajat     | [Chatin toiminta](docs/research-demo.md) · [Vastausten arviointi](docs/chat-evaluation.md) · [Sisällön rajat](docs/clinical-safety.md)         |

## Lisenssit

Projektin omalle koodille ei ole vielä valittu avointa lisenssiä. Ulkopuolisilla lähdeteksteillä on omat käyttöehtonsa. WikiAnesthesiaan perustuvien tekstien CC BY-SA 4.0 -merkinnät ja tekijätiedot ovat vastauksen lähdetiedoissa. Tämä lisenssi ei koske koko sovelluksen koodia.
