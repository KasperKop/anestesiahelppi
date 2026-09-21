# Chatin kehittäminen

Nykyinen selainversio käyttää Cloudflare Workersissa toimivaa lähdehakua. Erillinen Node.js-palvelin on paikallista kehitystä varten. Oma tarkistettu lähdekorpus on edelleen tyhjä; julkisten lähteiden haku toimii siitä erillään.

## Esittelytila ilman avainta

```sh
npm ci
npm run web
```

Jätä `EXPO_PUBLIC_CHAT_API_URL` asettamatta. Esittelytilan valmiit vastaukset kertovat sovelluksesta, eivät lääketieteestä. Niillä voi kokeilla sydäntallennusta, pinoja ja kortin uudelleenavaamista.

## Paikallinen lähdehaku

Käytä Node.js 24:ää. Kopioi `server/.env.example` tiedostoksi `server/.env`. Lisää Groq-avain muuttujaan `GROQ_API_KEY` paikallisessa editorissa ja aseta `RESEARCH_ENABLED=true`, jos haluat käyttää nykyistä julkisten lähteiden hakua.

```sh
npm run server
```

Kopioi juuren `.env.example` tiedostoksi `.env` ja aseta `EXPO_PUBLIC_CHAT_API_URL=http://localhost:8787/chat`. Käynnistä Expo uudelleen. Avainta ei saa laittaa `EXPO_PUBLIC_`-muuttujaan, GitHubiin tai keskusteluun. Oikeat ympäristötiedostot on jätetty gitin ulkopuolelle.

Palvelin kuuntelee oletuksena osoitteessa `127.0.0.1:8787`. Fyysisessä puhelimessa localhost tarkoittaa puhelinta: käytä kehityspalvelimen saavutettavaa osoitetta ja muuta `HOST`- sekä `ALLOWED_ORIGINS`-asetuksia vain tarvittavilta osin.

`POST /chat` hyväksyy JSON-olion, jossa on `question` (1–1000 merkkiä). Painoa, kortteja tai pinoja ei lähetetä palvelimelle. `RESEARCH_ENABLED=false` käyttää omaa korpusta; nykyinen tyhjä korpus palauttaa tiedon puuttumisesta ilman mallikutsua.

## Oman tarkistetun aineiston lisääminen myöhemmin

Alla on tietomallin esimerkki, ei hyväksyttyä sisältöä. Esimerkin tarkistajatietoja ei pidä kopioida oikeaksi hyväksynnäksi.

```json
{
  "version": 1,
  "sources": [
    {
      "id": "source-id",
      "name": "Publisher",
      "type": "manual",
      "active": true,
      "usageRights": "Recorded permission or applicable license"
    }
  ],
  "documents": [
    {
      "id": "document-version-id",
      "sourceId": "source-id",
      "title": "Document title",
      "url": "https://example.org/document",
      "version": "1",
      "status": "reviewed",
      "reviewer": "Actual reviewer",
      "reviewedAt": "2026-09-13T00:00:00Z",
      "nextReviewAt": "2027-09-13T00:00:00Z"
    }
  ],
  "chunks": [
    {
      "id": "unique-chunk-id",
      "documentId": "document-version-id",
      "locator": "Page / heading",
      "text": "Approved passage, maximum 4000 characters",
      "keywords": ["Finnish term", "English equivalent"]
    }
  ]
}
```

Käytä yksilöllisiä katkelmatunnisteita ja muuttumattomia dokumenttiversioita. Säilytä versiohistoria gitissä. Kirjaa aineiston todelliset käyttöoikeudet ja tarkistus; julkinen saatavuus ei yksin tarkoita vapaata uudelleenkäyttöä. Älä lisää mallin tuottamaa tekstiä hyväksytyksi lähdeaineistoksi. Käynnistä paikallinen palvelin uudelleen korpuksen muuttuessa; Worker tarvitsee uuden julkaisun.

## Tarkistus ja julkaisu

[Kehitysohje](development.md) listaa komennot. [Cloudflare-ohje](cloudflare-deployment.md) kertoo julkaistun palvelimen asetukset. [Arviointisuunnitelma](chat-evaluation.md) erottaa toiminnallisen testauksen mallivastausten laadun arvioinnista.
