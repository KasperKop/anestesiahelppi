# Lääkkeiden annosasetukset

Asetuksissa voi muuttaa painokortin anestesialääkkeiden annosta painokiloa kohti.
Muutokset tallentuvat vain käytössä olevaan selaimeen tai laitteeseen. Ne eivät
synkronoidu laitteiden välillä. Sovellus on portfolioprototyyppi, ei kliiniseen käyttöön.

## Käyttö

Avaa Asetukset alanavigaatiosta ja valitse lääke. Syötä annos, tai vaihteluvälin
ala- ja yläraja. Yksikköä ei voi vaihtaa. Esikatselu käyttää etusivulla valittua
painoa; painovalinta säilyy näkymien välillä saman käyttökerran ajan.

Luku voi sisältää pisteen tai pilkun ja enintään kaksi desimaalia. Tyhjää,
nollaa, negatiivista tai virheellistä vaihteluväliä ei voi tallentaa. Yli 50 %:n
poikkeama oletuksesta vaatii erillisen vahvistuksen. Tämä on vertailu alkuperäiseen
dataan, ei lääkkeen turvallisen annoksen tarkistus.

Muokattu annos näkyy kaikissa painokorteissa. Pieni kynäkuvake merkitsee
muokattua lääkeriviä; riviä napauttamalla näkee oletusannoksen erillisessä
ikkunassa. Yhteenvetopalkkia ei näytetä, ja rivien alkuperäinen korkeus sekä
tekstikoko säilyvät. Yksittäisen lääkkeen tai kaikkien lääkkeiden
palautus poistaa vain annosmuutokset; tallennetut vastaukset ja muistiinpanot säilyvät.

## Oletukset ja poikkeustapaukset

`src/data/weightCards.ts` säilyy muuttumattomana alkuperäisenä lähdetaulukkona.
Ilman muutoksia kortit näyttävät täsmälleen sen arvot. Hätätilannelääkkeet,
atropiinin vähimmäisannos, nestebolus ja DC-kardioversio eivät ole muokattavissa.

Propofolin oletus on painokohtainen taulukko, ei yksi annos/kg-vaihteluväli.
Siksi sen muokkauskentät ovat ensimmäisellä kerralla tyhjät ja vertailussa näkyy
valitun painon alkuperäinen annos. Tallennettu uusi ala–yläraja/kg koskee kaikkia
painoja. Palautus palauttaa alkuperäisen taulukon. Poikkeamavaroitus vertaa kumpaakin
rajaa kaikkien painojen alkuperäisiin vastaaviin rajoihin. Taulukon arvoja ei
korjata eikä approksimoida tässä ominaisuudessa.

## Uuden lääkkeen lisääminen

Lisää määrittely `src/settings/model.ts`-tiedoston `drugs`-listaan:

- pysyvä `id` (tallennuksen avain, ei näyttönimi)
- `name` ja `unit`
- `defaultDose: { dosePerKg }`, vaihteluvälille lisäksi `maxDosePerKg`
- `decimals` tuloksen pyöristystä varten
- tarvittaessa `minimumDose` kokonaisannoksen alarajaksi.

Uusi määrittely tulee automaattisesti asetuksiin ja painokorttiin. `calculateDose`
on yhteinen laskenta esikatselulle ja muokatuille annoksille. `resolveDrug` käyttää
muuttumattomia lähdearvoja vanhoille lääkkeille ja laskettua oletusta uudelle
lääkkeelle. Älä vaihda jo käytetyn tunnisteen yksikköä: se vaatii tallennusversion
migraation. Uusi annostustapa tai käyttötarkoitus tarvitsee oman tunnisteen ja
selkeän käyttötarkoituksen määrittelyn; nykydata ei erottele induktiota ja ylläpitoa.

Tarkista uuden lääkkeen annostus ja pyöristys erikseen. Lisää testit sen
poikkeussäännöille. Alkuperäinen pyöristys säilyy: ondansetronilla yksi desimaali,
muilla muokattavilla lääkkeillä enintään kaksi; kokonaisluvut näkyvät ilman
ylimääräisiä nollia. Pieni tulos voi pyöristyä nollaan, joten arvo on aina
arvioitava käytetyn näyttötarkkuuden suhteen.

## Tallennus

Web: localStorage-avain `anestesiahelppi.settings.v1`.
Natiivi: erillinen SQLite-tietokanta `anestesiahelppi-settings.db`.
Molemmat käyttävät samaa validoitua version 1 tietomallia:

```json
{
  "version": 1,
  "overrides": {
    "drug-id": {
      "dosePerKg": 1,
      "maxDosePerKg": 2,
      "modifiedAt": "2026-10-29T12:00:00.000Z"
    }
  }
}
```

`maxDosePerKg` tallennetaan vain vaihteluvälille. Valmiita kokonaisannoksia tai
yksiköitä ei tallenneta. Tuntemattomat lääketunnisteet ohitetaan. Rikkinäinen
tallennus palauttaa oletukset ja näyttää ilmoituksen. Muutos otetaan käyttöön
vasta tallennuksen onnistuttua. Tallennusvirhe palauttaa tämän käyttökerran
annokset oletuksiin ja ilmoittaa, että aiemmin tallennetut muutokset saattavat
palata seuraavalla avauskerralla. Eri selainvälilehdet eivät synkronoidu reaaliajassa.
