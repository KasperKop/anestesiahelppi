# Omat pinot ja muistiinpanojen muokkaus

Uuden pinon voi luoda Omat pinot -alkunäkymän tummasta **Luo pino**
-painikkeesta. Nimi annetaan erillisessä ikkunassa. Avatussa pinossa ei ole
luontilomaketta; **Kaikki pinot** palauttaa alkunäkymään. Pinon nimeämisen ja
poistamisen painikkeet ovat vierekkäin. Pinon poisto säilyttää kortit ja siirtää
ne Järjestämättömiin.

Korttilista näyttää vain korttien esikatselut. Kortin avaamisen jälkeen sitä voi
siirtää ylemmäs tai alemmas nykyisessä pinossa tai siirtää toiseen pinoon.
Ensimmäistä korttia ei voi siirtää ylemmäs eikä viimeistä alemmas.

Oman muistiinpanon voi avata ja valita **Muokkaa tekstiä**. **Tallenna muutokset**
korvaa saman kortin tekstin; **Peruuta** jättää tallennetun tekstin ennalleen.
Otsikko muodostuu tekstin ensimmäisestä rivistä kuten uuden muistiinpanon
luonnissa. Kortin ja muistiinpanon tunnisteet, pino, järjestys ja alkuperäinen
tallennusaika säilyvät. Erillinen muokkausaika näkyy avatulla kortilla.
AI-vastauksia ei voi tällä toiminnolla muokata.

Muokkauksen aikana järjestely, siirto ja poisto on estetty. Tyhjää tai yli
10 000 merkin tekstiä ei tallenneta. Tallennusvirheessä alkuperäinen kortti
säilyy ja kirjoitettu luonnos jää näkyviin uudelleenyritystä varten. Teksti
säilytetään vain käytössä olevan laitteen paikallisessa tietopankissa.

Toteutus käyttää samaa `MemoryProvider`-tallennusta kuin muut korttitoiminnot.
`editNote` päivittää kortin tunnisteen perusteella. Tallennusversion vaihto tai
vanhojen korttien migraatio ei ole tarpeen: `updatedAt` on vapaaehtoinen kenttä.
Testeissä tarkistetaan muokkaus, peruutus, virheellinen syöte, tallennusvirhe,
järjestely ja muokatun kortin uudelleenavaaminen.
