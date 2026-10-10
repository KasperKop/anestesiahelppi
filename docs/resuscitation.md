# Elvytysnäkymä

Lisäsin etusivulle Elvytys-painikkeen ja sen taakse kolme suomenkielistä tiivistelmää: vastasyntynyt syntymän yhteydessä, lapset ja aikuiset. Sisältö on kiinteä osa sovellusta, eikä sen avaaminen käytä kielimallia tai API-kiintiötä. Ensimmäinen sivulataus ja ulkoisten lähteiden avaaminen tarvitsevat verkkoyhteyden; tämä ei ole offline-PWA-lupaus.

Kyseessä on portfolio- ja oppimisprototyyppi, ei kliinisesti validoitu ohje. Suomennos ei ole ERC:n hyväksymä. Annoksia ei lasketa painovalitsimesta. Välilehteä vaihdettaessa näkymä palaa alkuun ja lähdealue sulkeutuu.

## Lähteet ja rajaus

Sisältö verrattu 10.10.2026 käyttäjän toimittamiin ERC Guidelines 2025 -taskukortteihin (Paediatric Advanced Life Support, Adult Advanced Life Support ja Neonatal Life Support) sekä täydentäviin alkuperäisohjeisiin:

- [Lasten hoitoelvytys](https://www.erc.edu/media/03xnpjmj/gl2025-09-pls-e.pdf)
- [Vastasyntyneen elvytys](https://www.erc.edu/media/rgrn0faa/gl2025-08-nls-e.pdf)
- [Aikuisen hoitoelvytys](https://www.erc.edu/umbraco/api/download-page/download/d01b6e5a-0de7-4b07-913a-58445e8630fc)
- [Alkuperäiset taskukaaviot ja käyttöehdot](https://www.erc.edu/download-centre)

Tiivistelmät eivät sisällä kaikkia erityistilanteita, poikkeuksia tai toimenpidetekniikoita. Vastasyntyneen näkymä ei koske kaikkia alle kuukauden ikäisen elvytystilanteita, vaan syntymän aikaista siirtymävaihetta. Lasten adrenaliinin ensimmäinen annos defibrilloitavassa rytmissä on täsmennetty täydestä ohjeesta 3. iskun jälkeiseksi (taskukortissa noin 4 minuutin kohdalla). Vastasyntyneen painelua edeltävä tehokas ventilaatio ja sykkeen nousutrendi on täsmennetty täydestä ohjeesta.

© European Resuscitation Council. ERC sallii aineistojen maksuttoman opetuskäytön; kaupallinen käyttö tarvitsee erillisen sopimuksen. Tässä on itsenäisesti jäsennelty, lähteistetty oppimistiivistelmä. ERC:n logoja tai alkuperäisiä PDF-tiedostoja ei julkaista uudelleen repossa eikä ERC:n hyväksyntää väitetä. Ennen mahdollista kliinistä tai kaupallista jatkokäyttöä tarvitaan sisällön ja käyttöoikeuksien erillinen arviointi.

## Tarkistukset

Automaattitestit tarkistavat ikäryhmien vaihdon, sisältöjen erottumisen, lähteiden sulkeutumisen, oikean lähdelinkin avaamisen ja paluun etusivulle. Tyypitys ja web-vienti tarkistetaan lisäksi. Nämä ovat ohjelmistotestejä, eivät kliininen validointi. Alkuperäisohjeiden päivittyminen ei päivitä sovelluksen tekstiä automaattisesti.
