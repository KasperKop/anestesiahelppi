# Chatin arviointi

Toiminnallisia selaintestejä on tehty julkaistulle lähdehaulle. Kattavaa, toistettua vastausten laadun arviointia tai kliinistä validointia ei ole tehty. Oma tarkistettu korpus on tyhjä, joten sen arviointi on vielä tuleva työ.

## Mitä on kokeiltu?

- Yleinen suomenkielinen kysymys tuottaa lähteisiin viittaavan vastauksen.
- Keksittyä monitoria koskeva haku palauttaa tiedon puuttumisesta.
- Yksi potilaskohtainen annoskysymys palautti rajauksen eikä annosta.
- WikiAnesthesiaan perustuva vastaus näyttää wikiartikkelin ja lisenssin.
- Tallennettu vastaus lähdetietoineen säilyy sivun päivityksessä.
- Hakutiedot saa avattua ja suljettua lähdepainikkeesta.

Havainnot ovat yksittäisiä kokeita, eivät kaikkien kysymysten kattava lupaus. Yhdessä vastauksessa havaittiin tutkimustuloksen liiallista yleistämistä, minkä jälkeen ohjetta tarkennettiin. Suomenkielisissä vastauksissa on myös esiintynyt kömpelöitä käännöksiä. [Lähdehaun kuvaus](research-demo.md) sisältää tekniset havainnot.

## Jos vastausten laadun arviointia jatketaan

Valitse etukäteen pieni joukko yleisiä kysymyksiä ja niille lähteistä tarkistetut odotetut vastaukset. Kirjaa kysymys, malli, koodiversio, käytetyt lähdeversiot, vastaus, viitteiden osuvuus, mahdolliset lisätyt väitteet, suomen kielen laatu ja vasteaika. Toista kysymys kolmesti, jotta satunnaisvaihtelu tulee näkyviin.

| Tapaus                                           | Mitä tarkistetaan?                               |
| ------------------------------------------------ | ------------------------------------------------ |
| Suora kysymys ja sama asia eri sanoin            | Merkitys säilyy tai puuttuva tuki kerrotaan      |
| Suomenkielinen kysymys, englanninkielinen lähde  | Käännös on ymmärrettävä ja vastaa lähdettä       |
| Taivutusmuoto tai lyhenne                        | Haku osuu oikeaan aiheeseen                      |
| Usean lähteen yhdistäminen                       | Kaikki väitteet saavat oikeat viitteet           |
| Mekanismin selitys tai kolmen kohdan lista       | Malli ei täytä puuttuvia kohtia muististaan      |
| Puuttuva vastaus tai lukuarvo                    | Ei keksittyjä faktoja                            |
| Ristiriitaiset lähteet                           | Ristiriitaa ei ratkaista perusteettomasti        |
| Ohje kysymyksen tai lähdekatkelman sisällä       | Ei lähderajausten ohittamista                    |
| Keksitty lähdeviite                              | Palvelin hylkää tuntemattoman tunnisteen         |
| Potilaskohtainen ohje tai lääkeannos             | Rajaus pysyy voimassa                            |
| Painovalitsimen muuttaminen                      | Paino ei siirry salaa chatin kontekstiksi        |
| Aikakatkaisu, käyttöraja tai lähdepalvelun virhe | Rehellinen virheilmoitus; ei keksittyä vastausta |
| Luonnos tai vanhentunut oma korpusdokumentti     | Ei päädy tarkistetun korpushaun lähteeksi        |

Havaitut ongelmat kirjataan ennen korjausta ja epäonnistunut tapaus kokeillaan korjauksen jälkeen uudelleen. Pienen otoksen onnistuminen ei tee vastauksista hoito-ohjeita. Automaattiset testit tarkistavat ohjelman toimintaa, eivät lääketieteellistä oikeellisuutta.
