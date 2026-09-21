# Sisällön rajat

AnestesiaHelppi on harrastus- ja portfolioprojekti. Sisältöä ei ole validoitu potilastyöhön. Tämän dokumentin tarkoitus on kuvata nykyiset rajat, ei antaa sertifiointia tai arviota sovelluksen sääntelyasemasta.

## Nykyinen sisältö

**Painokortit** näyttävät projektiin tuotuja taulukkoarvoja, myös lääkeannoksia. Ne eivät ole tarkistettuja hoito-ohjeita. Sovellus ei korvaa paikallisia ohjeita tai alkuperäislähteen tarkistamista.

**Chat** hakee yleistä oppimistietoa rajatuista tutkimusabstrakteista ja WikiAnesthesian katkelmista. Se ei saa painovalitsimen arvoa. Potilaskohtaiset ohjeet ja annoskysymykset on rajattu pois, mutta LLM:n rajaukset eivät takaa kaikkien virheiden tunnistamista. Lähdetunnisteen tekninen tarkistus ei todista väitteen oikeellisuutta.

**Tallennetut vastaukset** ovat paikallisia kopioita. Ne eivät päivity automaattisesti eikä tallentaminen tee niistä tarkistettuja.

Potilastietoja ei pidä syöttää chattiin. Kysymys välitetään Groq-palveluun ja hakusanat lähdepalveluihin. Lisätiedot ovat [palvelimen dokumentaatiossa](cloudflare-deployment.md).

## Mahdollinen tarkistettu sisältökokoelma

`server/data/corpus.json` on tyhjä. Jos omaa tarkistettua aineistoa lisätään myöhemmin, sille tarvitaan lähde, käyttöoikeus, versio, nimetty tarkistaja sekä tarkistus- ja vanhenemispäivä. Tämä on eri asia kuin nykyinen julkisten lähteiden hakudemo.

Sisällön tarkistuskäytäntö on avoin jatkoidea [tehtävässä #8](https://github.com/KasperKop/anestesiahelppi/issues/8). Potilastyöhön tähtäävä käyttötarkoitus vaatisi erillisen asiantuntija-arvioinnin ennen käyttöönottoa.
