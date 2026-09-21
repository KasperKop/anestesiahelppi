# Cloudflare-palvelin

Selaindemo julkaistaan GitHub Pagesissa ja chatin palvelin Cloudflare Workersissa. Worker käyttää samoja chat-moduuleja kuin paikallinen Node.js-palvelin. Wrangler pakkaa mahdollisen korpuksen koontiin; Worker ei käynnistä Node HTTP -palvelinta.

## Nykyinen julkaisu

- Palvelin: `https://anestesiahelppi-chat.koponenkasperi8.workers.dev`
- Tilatieto: `GET /health`; kysymykset: `POST /chat`.
- `CHAT_ENABLED=true` ja `RESEARCH_ENABLED=true` ottavat julkisten lähteiden hakudemon käyttöön.
- Groq-avain on Cloudflaren salaisuus `GROQ_API_KEY`.
- Cloudflare Builds seuraa haaraa `feat/cloudflare-chat`, juurihakemistoa `cloudflare`, koontikomentoa `npm ci` ja julkaisukomentoa `npm run deploy`.
- GitHub Pages seuraa `main`-haaraa. Sen työnkulussa on chatin julkinen osoite oletusarvona.

## Julkaisu komentoriviltä

Node.js 24 ja Cloudflare-tili:

```sh
cd cloudflare
npm ci
npx wrangler login
npm run check
npm run deploy
```

**Nykyinen asetustiedosto ottaa chatin käyttöön.** Jos julkaiset palvelimen ensin suljettuna, muuta `CHAT_ENABLED=false` ennen julkaisua. Julkaisukomento tulostaa palvelimen osoitteen. Tarkista `/health`-vastauksesta, että tila vastaa asetusta.

Avain lisätään Cloudflaren Worker-asetuksissa kohtaan **Variables and Secrets** salaisuutena tai komennolla `npm run secret:groq`. Sitä ei tallenneta `wrangler.jsonc`-tiedostoon, git-repoon tai selainmuuttujiin. Paikalliseen Worker-testiin voi kopioida `.dev.vars.example`-tiedoston `.dev.vars`-tiedostoksi.

## Chatin sulkeminen

Muuta `cloudflare/wrangler.jsonc`-tiedostossa `CHAT_ENABLED` arvoksi `false` ja julkaise uudelleen. `/health` näyttää silloin `chatEnabled: false`. Pelkkä sivun aukiolo ei tämän toteutuksen perusteella käynnistä mallikutsuja: kysymys lähetetään käyttäjän toiminnosta.

Jos myös selainversion halutaan pysyvän esittelytilassa, poista Pages-työnkulun chat-osoitteen oletusarvo ja mahdollinen GitHub-muuttuja `EXPO_PUBLIC_CHAT_API_URL`, ja kokoa selainversio uudelleen. Pelkkä GitHub-muuttujan tyhjentäminen ei poista työnkulun oletusarvoa.

`RESEARCH_ENABLED=false` vaihtaa omaan tarkistettuun korpukseen. Se on tällä hetkellä tyhjä, joten tämä asetus ei vastaa julkisten lähteiden hakua. Korpushaku tarvitsee aineiston ja oman [arvioinnin](chat-evaluation.md).

## Käyttörajat ja tietojen käsittely

Yksi Durable Object (`global-demo-v1`) säilyttää koko demon yhteisen käyttörajan: 50 hyväksyttyä pyyntöä UTC-vuorokaudessa, vähintään 60 sekunnin välein. Myös palveluvirheeseen päätyvä varattu pyyntö kuluttaa rajaa. Laskuri ei nollaudu Worker-prosessin uudelleenkäynnistyessä. Tallennettavia tietoja ovat päivämäärä, lukumäärä ja seuraava sallittu aika, eivät kysymykset tai vastaukset.

Rajapinta on julkinen: muutkin käyttäjät voivat kuluttaa kiintiön. CORS rajaa selainalkuperää, mutta ei tunnista käyttäjiä. Natiiviasiakkaille sallitaan puuttuva Origin-otsake. Käyttäjäkohtainen tunnistautuminen olisi erillinen jatkokehitystyö.

Kysymys lähetetään Groq-palveluun ja englanninkieliset hakusanat lähdepalveluihin. Sovelluskoodi ei kirjaa kysymyksiä lokiin, ja Workerin observability on pois käytöstä. Palveluntarjoajien oma käsittely koskee silti liikennettä. Groqin tietojen säilytysasetukset tarkistetaan tilin asetuksista; tässä dokumentaatiossa niiden tilaa ei oleteta vahvistetuksi.

## Varmennus

GitHub Actions tarkistaa palvelintestit, Worker-paketin ja kaksi workerd-ajonaikaista testiä. Julkaistulla chatilla on tehty myös selaintestejä; tulokset ja rajat ovat [lähdehaun kuvauksessa](research-demo.md). Laaja mallin laadun, kuormituksen tai kliinisen sisällön arviointi ei sisälly näihin tarkistuksiin.

Palveluntarjoajan ohjeet:

- [Workersin hinnoittelu](https://developers.cloudflare.com/workers/platform/pricing/)
- [Durable Objectsin käyttöönotto](https://developers.cloudflare.com/durable-objects/get-started/)
- [Workerin salaisuudet](https://developers.cloudflare.com/workers/configuration/secrets/)
