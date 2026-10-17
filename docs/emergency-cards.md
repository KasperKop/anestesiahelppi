# Hätätilannekorttien kokeilu

Halusin kokeilla, miten hätätilanteiden pääkohdat voisi esittää puhelimella ilman pitkää sivua. Etusivulla Hätätilanteet ja Elvytys ovat rinnakkaiset painikkeet. Hätätilanteet avaa 12 kortin kokoelman.

## Käyttö

- Vaihda korttia vaakasuuntaisella pyyhkäisyllä tai Edellinen / Seuraava -painikkeilla. Ensimmäisestä tai viimeisestä kortista ei hypätä kokoelman toiseen päähän.
- Kaikki 12 avaa suoran korttivalinnan.
- Lisätiedot ja lähteet avaa erillisen, vieritettävän näkymän. Paluu säilyttää valitun kortin.
- Korttien sisältö toimitetaan sovelluksen mukana. Näkymä ei käytä kielimallia, API-avaimia tai chatin käyttökiintiötä. Ulkoinen lähdelinkki tarvitsee verkkoyhteyden.

Tavoitteena on yhden näytön pääkortti tavallisessa pystyasentoisessa mobiilinäkymässä. Pienessä vaakanäkymässä tai suurennetulla tekstillä vieritys on sallittu: mitään tekstiä ei leikata tai automaattisesti pienennetä piiloon. Pyyhkäisyn lisäksi on aina painikkeet näppäimistöä ja avustavia teknologioita varten.

## Sisältö ja rajaukset

Pohjana on projektiin toimitettu **Toimintakortit hätätilanteissa 2023**: kortit 1–12, päiväys 14.02.2023, paitsi maligni hypertermia 06.11.2024. Kirjoitin käyttöliittymää varten lyhyet oppimistiivistelmät tekoälyn avulla. Julkaistut tekstit eivät ole alkuperäisen PDF:n täydellinen toisinto.

Poistin paikalliset puhelinnumerot, hälytysnumerot ja lääke- sekä välinevarastojen sijainnit. Alkuperäistä PDF:ää, sairaalan logoja tai yhteystietoja ei lisätä repoon. Lääkeannokset, laimennokset, energiataulukot ja yksityiskohtaiset toimenpideohjeet eivät sisälly tähän kokeiluun. Lisätietonäkymä ei siten ole ”koko hoito-ohje”.

Julkaisussa ei väitetä, että sijaintitietojen poistaminen tekisi ohjeista yleispäteviä. Kortit eivät ole potilastyöhön validoituja, eikä niillä ole kliinistä hyväksyntää. Brady- ja takykardiakortit koskevat aikuisia; muutkaan kortit eivät korvaa lasten ikäkohtaisia ohjeita. Sisällön muokkauspäivä 16.10.2026 ei tarkoita kliinistä tarkistuspäivää.

Julkisena vertailu- ja jatkolukemislähteenä on [Association of Anaesthetistsin Quick Reference Handbook](https://anaesthetists.org/Guidelines-and-publications/Quick-reference-handbook/PDF-version). QRH on erillinen lähde, ei toimitetun suomalaisen PDF:n julkinen kopio. QRH:n oma sisältö on CC BY-NC-SA 4.0 -lisensoitu; sen alkuperäiset merkinnät ja käyttöehdot ovat lähdesivulla. Sovellus ei väitä olevansa järjestön hyväksymä käännös. QRH-linkkisivu tarkistettu 16.10.2026. [LAST-ohjeen päivitystiedote](https://anaesthetists.org/Guidelines-and-publications/Guidelines/Management-of-severe-local-anaesthetic-toxicity-2023) korostaa tavallisesta elvytyksestä poikkeavaa lääkehoitoa.

Ennen mahdollista kliinistä käyttöä tarvitaan sisällön ajantasaisuuden, käyttöoikeuksien, ikärajausten ja täydellisyyden arviointi, nimetty asiantuntijatarkistaja sekä yksikön hyväksyntä. Julkisen portfolioesittelyn tarkoitus on demonstroida käyttöliittymää, ei antaa hyväksyttyä hoitoprotokollaa.

## Toteutus ja testaus

- `src/emergencies/cards.ts`: tyypitetty sisältö, lähdekortin numero ja päiväys.
- `app/emergencies.tsx`: näkymä, pyyhkäisy, painikenavigointi, korttivalinta ja lisätiedot.
- `__tests__/emergencies.test.tsx`: etusivun reitit, kaikki 12 korttia, rajat, suora valinta, lisätietojen sulkeminen, lähdelinkki ja verkkovirhe.

Automaattiset testit eivät vahvista lääketieteellistä oikeellisuutta. Ne tarkistavat käyttöliittymän toimintaa ja estävät paikallisten yhteystietojen sekä annostaulukoiden tahattoman palauttamisen tähän sisältöön.

### Selaintarkistus 17.10.2026

Tarkistin kaikki 12 korttia Chromiumin mobiiliemuloinnissa koossa 390 × 844, 375 × 812 ja 360 × 800. Tiivistin mobiilin otsikkoaluetta ja korttien välejä; kaikissa näissä koossa pääkortin sisältö mahtui ilman pystysuuntaista vieritystä. Leipätekstin koko pysyi ennallaan.

Kosketustapahtumilla testattu pyyhkäisy toimi molempiin suuntiin. Etusivun Elvytys- ja Hätätilanteet-painikkeet olivat samalla rivillä. Lisätiedot ja paluu korttiin toimivat. Hypoksiakortin lisätietoihin pääsi myös 844 × 390 -vaakanäkymässä ja 150 prosenttiin suurennetulla tekstillä; vieritys säilytti sisällön saavutettavana. Selaimessa ei havaittu JavaScript-virheitä.

Tämä on selainemuloinnin tarkistus, ei testi fyysisellä puhelimella, iOS Safarilla tai natiivisovelluksella. Se ei ole sisällön kliininen tarkistus.
