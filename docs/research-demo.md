# Chatin toiminta ja lähteet

Päivitetty 20.9.2026. Julkaistu chat on yleisten oppimiskysymysten hakudemo. Se käyttää julkisia lähdepalveluja, ei projektin omaa tarkistettua korpusta. Wikiartikkeleita ja tutkimusabstrakteja ei merkitä kliinisesti tarkistetuiksi.

## Kysymyksestä vastaukseen

1. Groqin `openai/gpt-oss-120b` muodostaa yleisestä kysymyksestä lyhyet englanninkieliset hakusanat. Potilaskohtaiset ohjeet ja lääkeannoskysymykset on rajattu pois.
2. Palvelin hakee neljästä ennalta valitusta palvelusta. Alkuperäinen kysymys menee Groqille; lähdepalveluille menevät hakusanat.
3. Käyttöehdoiltaan sopivat katkelmat annetaan mallille. Otsikko yksin ei kelpaa vastauksen perusteeksi.
4. Malli palauttaa suomenkielisen tiivistelmän ja katkelmatunnisteet. Palvelin tarkistaa tunnisteet ja rakentaa viitteet haetuista tiedoista.
5. Hakusanat, hakujen tilat, lähdekatkelmat ja lisenssit löytyvät **Näytä lähteet** -painikkeesta. Sydäntallennus säilyttää vastauksen ja sen metatiedot paikallisena kopiona.

Jos riittävää tukea ei löydy, vastaus kertoo tiedon puuttumisesta. Yhden lähdepalvelun virhe ei estä muiden käyttöä; virhe näkyy hakutiedoissa. Kaikkien lähteiden yhteysvirhe on palveluvirhe, ei väite tiedon puuttumisesta.

## Lähteiden erot

| Lähde          | Mitä haetaan ja käytetään?                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PubMed         | Enintään 4 artikkelin otsikko-, PMID- ja DOI-tiedot. PubMedin abstraktitekstiä ei kopioida mallille.                                                                     |
| Europe PMC     | Enintään 6 avointa hakutulosta. Vain selvästi CC BY- tai CC0-lisensoidut abstraktit kelpaavat tiivistelmään.                                                             |
| DOAJ           | Enintään 6 hakutulosta. Abstraktimetatietoja käytetään DOAJ:n CC0-ehtojen perusteella; tämä ei anna oikeutta kustantajan kokotekstiin.                                   |
| WikiAnesthesia | Enintään 3 wikiartikkelin tekstihaku. Mallille valitaan enintään 2 alkuosan katkelmaa, korkeintaan 5 500 merkkiä kumpikin. Tyhjät sivut ja lähdeluettelot jätetään pois. |

Tutkimuksista käytetään enintään kolmea kokonaista abstraktia, 120–6 000 merkkiä kutakin. PMID- ja DOI-tunnisteilla yhdistetään päällekkäisiä julkaisuja. Palautetuissa metatiedoissa näkyvä peruutus-, huolenilmaisu- tai preprint-merkintä sulkee tutkimuksen pois tiivistelmästä. Tämä ei takaa kaikkien tällaisten merkintöjen havaitsemista.

Haku ei lataa tutkimusten kokotekstejä eikä koko wikiä. WikiAnesthesian usean sivun kokotekstiotteet haetaan erikseen, koska sen TextExtracts-rajapinta palauttaa vain yhden kokonaisen otteen pyyntöä kohden. Kuvia, laskureita ja sivujen linkittämiä julkaisuja ei tuoda sovellukseen.

## WikiAnesthesian lisenssi ja tekijät

WikiAnesthesian [tekijänoikeusosio](https://wikianesthesia.org/wiki/WikiAnesthesia:General_disclaimer) ilmoittaa lisenssiksi CC BY-SA 4.0:n. Samalla sivulla on myös yleistä henkilökohtaiseen käyttöön viittaavaa sanamuotoa. Toteutus perustuu nimenomaiseen tekstin lisenssimerkintään: viitteessä säilytetään artikkelin versiolinkki, tekijähistoria, lisenssi ja hakupäivä. Wikiin perustuva vastausteksti merkitään tekoälyllä lyhennetyksi ja käännetyksi CC BY-SA 4.0 -tekstiksi.

Merkintä ei muuta sovelluskoodin tai erikseen lisensoitujen tutkimusabstraktien lisenssiä. Rajapinnan `rightsinfo` on tyhjä, joten sitä ei käytetä lisenssin päättelemiseen. Käyttöehdot on tarkistettava uudelleen, jos käyttöä laajennetaan esimerkiksi kaupalliseksi.

## Rajat

- Yhteinen 50 hyväksytyn pyynnön päiväkohtainen kiintiö, vähintään 60 sekuntia pyyntöjen välissä.
- Enintään kaksi Groq-kutsua kysymystä kohden: hakusanojen muodostus ja tiivistys. Tyhjä tai estetty haku ei tarvitse tiivistyskutsua.
- Hakusanojen muodostuksen aikaraja 10 s, yksittäisen lähdepyynnön 12 s, tiivistyksen 20 s ja asiakkaan kokonaisodotuksen 65 s.
- Lähdepalvelujen vastauskoko on rajattu 600 kilotavuun. Uudelleenohjauksia ei seurata eikä satunnaisia kustantajalinkkejä haeta.
- Tallennetut vastaukset eivät päivity lähteiden muuttuessa. Niille ei keksitä tarkistajaa tai kliinisiä tarkistuspäiviä.

[Cloudflare-ohje](cloudflare-deployment.md) kertoo käyttöönoton, sulkemisen ja tietojen käsittelyn.

## Tehdyt tarkistukset

19.9.2026 julkaistussa selaindemossa kysymys anestesiasyvyyden seurannasta palautti hakutuloksia kolmesta tutkimuspalvelusta ja viittasi kolmeen Europe PMC:n abstraktiin. Tallennus säilyi sivun päivityksessä. Keksitty monitorinimi `Zyxqvorn` palautti tyhjän haun eikä keksittyä laitekuvausta. Yksi potilaskohtainen annoskysymys palautti rajauksen.

Ensimmäinen tutkimustiivistelmä yleisti pienen tutkimusotoksen havaintoja. Mallin ohjetta muutettiin kuvaamaan yksittäisten tutkimusten tuloksia ja niiden rajoja. Tämä ei takaa kaikkien vastausten oikeellisuutta.

Cloudflaren workerd-ajoympäristössä havaittiin, ettei `redirect: 'error'` toiminut käytetyssä versiossa. Kutsut vaihdettiin `manual`-tilaan ja ei-onnistuneet vastaukset hylätään. Kaksi workerd-testiä varmistaa kyselyn ja uudelleenohjauksen hylkäyksen ilman tunnisteiden välittämistä eteenpäin.

20.9.2026 kysymys yhdistetystä spinaali-epiduraalipuudutuksesta palautti WikiAnesthesiaan perustuvan vastauksen. Viite, tekijähistoria ja lisenssi näkyivät, ja tallennettu kortti säilyi sivun päivityksessä. PubMed-haku epäonnistui tässä kokeessa ja virhe näkyi oikein muiden lähteiden tulosten rinnalla.

Automaattiset testit kattavat muun muassa käyttöoikeussuodatuksen, päällekkäiset tulokset, tyhjät sivut, lähdepalvelujen virheet, katkelmatunnisteet ja tallennuksen. [Laajempi vastausten laadun arviointi](chat-evaluation.md) on edelleen tekemättä.

## Rajapintojen ohjeet

- [PubMed E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25497/)
- [PubMedin käyttöehdot](https://www.ncbi.nlm.nih.gov/About/disclaimer.html)
- [Europe PMC](https://europepmc.org/RestfulWebService)
- [DOAJ:n käyttöehdot](https://doaj.org/docs/faq/)
- [Groqin rakenteinen vastaus](https://console.groq.com/docs/structured-outputs)
