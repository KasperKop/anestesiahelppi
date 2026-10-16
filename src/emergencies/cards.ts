export type EmergencyCard = {
  id: string;
  title: string;
  subtitle: string;
  sourceNumber: number;
  sourceDate: string;
  steps: { title: string; text: string }[];
  details: { title: string; text: string }[];
};

const team = {
  title: 'Hälytä tiimi',
  text: 'Kutsu apua. Sovi johtaja ja tehtävät.',
};
const date = '14.02.2023';

// Hand-authored learning summaries. Never generate these cards with the chat model.
// No dose tables, local contact details or equipment locations are published.
export const emergencyCards: EmergencyCard[] = [
  {
    id: 'anaphylaxis',
    title: 'Anafylaksia',
    subtitle:
      'Äkillinen hengityksen tai verenkierron häiriö altistuksen jälkeen',
    sourceNumber: 1,
    sourceDate: date,
    steps: [
      team,
      { title: 'Keskeytä altistus', text: 'Lopeta epäillyn aiheuttajan anto.' },
      {
        title: 'Tue hapetusta',
        text: 'Avaa hengitystie. Happi 100 %, avusta hengitystä.',
      },
      {
        title: 'Adrenaliini viipymättä',
        text: 'Valmistele ja anna lääkärin määräyksen mukaan.',
      },
      {
        title: 'Tue verenkiertoa',
        text: 'Varmista suoniyhteys. Nestehoito lääkärin ohjeella.',
      },
      {
        title: 'Arvioi vaste',
        text: 'Seuraa hengitystä, painetta ja rytmiä. Eloton → elvytys.',
      },
    ],
    details: [
      {
        title: 'Tunnistaminen',
        text: 'Hypotensio, bronkospasmi, nousevat hengitystiepaineet, turvotus ja iho-oireet voivat liittyä reaktioon. Iho-oireiden puuttuminen ei sulje anafylaksiaa pois.',
      },
      {
        title: 'Lääkitys',
        text: 'Adrenaliini on keskeinen hoito. Antoreitin, annoksen ja toistamisen määrää tilannetta johtava lääkäri. Antihistamiini tai kortikosteroidi ei korvaa adrenaliinia eikä saa viivästyttää sitä. Annoksia ei esitetä tässä demossa.',
      },
      {
        title: 'Tilanteen jälkeen',
        text: 'Kirjaa altisteet, oireiden alku ja hoitovaste. Järjestä seuranta, tryptaasinäytteet ja allergologinen jatkoselvittely paikallisen ohjeen mukaan.',
      },
    ],
  },
  {
    id: 'last',
    title: 'Puudutusainemyrkytys',
    subtitle:
      'Neurologisia tai verenkierron oireita puudutteen annon yhteydessä',
    sourceNumber: 2,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Lopeta puudute',
        text: 'Keskeytä puudutteen anto välittömästi.',
      },
      {
        title: 'Tue hengitystä',
        text: 'Avaa hengitystie. Happi 100 %, varmista ventilaatio.',
      },
      {
        title: 'Hoida kouristus',
        text: 'Valmistele kouristuslääke lääkärin määräyksellä.',
      },
      {
        title: 'Valmistele lipidihoito',
        text: 'Hae 20 % lipidiemulsio. Käytä LAST-erityisohjetta.',
      },
      {
        title: 'Varaudu elvytykseen',
        text: 'Defibrillaattori valmiiksi. LAST muuttaa lääkehoitoa.',
      },
    ],
    details: [
      {
        title: 'Oireet',
        text: 'Huulten tai kielen puutuminen, metallin maku, korvien soiminen, lihasnykäykset ja tajunnantason muutos voivat edeltää kouristusta tai verenkierron romahtamista. Oireiden järjestys ei ole luotettava.',
      },
      {
        title: 'Erityinen elvytysohje',
        text: 'Puudutusainemyrkytys (LAST) poikkeaa tavallisesta elvytyksestä: erityisesti adrenaliinin annostus ja vältettävät lääkkeet on tarkistettava erillisestä LAST-ohjeesta. Valmistele lipidihoito varhain. Annos, antonopeus ja kokonaismäärä tarkistetaan ajantasaisesta ohjeesta.',
      },
      {
        title: 'Jatkohoito',
        text: 'Varaudu pitkittyvään elvytykseen ja tehohoidon konsultaatioon. Neurologiset ja verenkierto-oireet edellyttävät jatkoseurantaa myös tilanteen korjauduttua.',
      },
    ],
  },
  {
    id: 'mh',
    title: 'Maligni hypertermia',
    subtitle: 'Selittämätön EtCO₂-nousu, takykardia tai lihasjäykkyys',
    sourceNumber: 3,
    sourceDate: '06.11.2024',
    steps: [
      team,
      {
        title: 'Keskeytä laukaisijat',
        text: 'Lopeta höyrystyvä anesteetti. Ei suksametonia.',
      },
      {
        title: 'Hapeta ja ventiloi',
        text: 'Happi 100 %, suuri virtaus. Siirry IV-anestesiaan.',
      },
      {
        title: 'Dantroleeni kiireesti',
        text: 'Nimeä valmistelija. Anna lääkärin määräyksellä.',
      },
      {
        title: 'Seuraa ja korjaa',
        text: 'EtCO₂, ydinlämpö, rytmi, kalium ja verikaasut.',
      },
      {
        title: 'Jäähdytys ja jatkohoito',
        text: 'Hoida hypertermia. Valmistele tehohoitosiirto.',
      },
    ],
    details: [
      {
        title: 'Älä odota kuumetta',
        text: 'EtCO₂:n selittämätön nousu voi olla varhainen löydös. Lämpötilan nousu voi tulla myöhemmin. Arvioi myös lihasjäykkyys, rytmihäiriöt, asidoosi ja hyperkalemia.',
      },
      {
        title: 'Laitteisto ja lääkkeet',
        text: 'Poista höyrystyvän anesteetin lähde ja noudata anestesiakoneen MH-ohjetta. Laitteiston käsittely ei saa viivästyttää hapetusta tai dantroleenia. Valmistele dantroleeni käytössä olevan valmisteen ohjeella; eri valmisteiden laimennukset eroavat toisistaan.',
      },
      {
        title: 'Seuranta',
        text: 'Sovi kirurgin kanssa toimenpiteen keskeyttämisestä. Seuraa ydinlämpöä ja vasteita, korjaa aineenvaihdunnan häiriöitä lääkärin ohjeella ja järjestä tehohoito uusiutumisen varalta.',
      },
    ],
  },
  {
    id: 'airway',
    title: 'Vaikea hengitystie',
    subtitle: 'Intubaatio ei onnistu ja maskiventilaatio vaikeutuu',
    sourceNumber: 4,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Hapetus ensin',
        text: 'Happi 100 %. Kahden henkilön maskiventilaatio.',
      },
      {
        title: 'Optimoi olosuhteet',
        text: 'Asento, apuvälineet, anestesia ja relaksaatio.',
      },
      {
        title: 'Vaihda suunnitelmaa',
        text: 'Kokenut apu, videolaryngoskooppi. Rajaa yritykset.',
      },
      {
        title: 'Supraglottinen väline',
        text: 'Jos hapetus onnistuu, pysähdy ja sovi jatko.',
      },
      {
        title: 'Hapetus ei onnistu',
        text: 'Ilmoita CICO. Valmistele hätäilmatie viipymättä.',
      },
    ],
    details: [
      {
        title: 'Hapetus on ensisijainen',
        text: 'Tarkista maskin tiiviys, pään asento, nielu- tai nenänielutuubin tarve, relaksaatio ja ventilaatiovälineistö. Älä jatka samanlaisia epäonnistuvia intubaatioyrityksiä hapetuksen kustannuksella.',
      },
      {
        title: 'Vaihtoehtoinen hengitystie',
        text: 'Valmistele supraglottinen hengitystieväline. Jos hapetus onnistuu, lääkäri arvioi herättämisen tai muun hengitystiesuunnitelman. Käytä potilaan ikäryhmälle soveltuvaa vaikean hengitystien ohjetta.',
      },
      {
        title: 'CICO',
        text: 'CICO tarkoittaa tilannetta, jossa intubaatio eikä hapetus onnistu. Tilanne ilmoitetaan ääneen ja siirrytään viipymättä paikalliseen hätäilmatieprotokollaan. Menetelmä ja välineistö riippuvat muun muassa potilaan iästä ja osaamisesta; tämä kortti ei opeta toimenpidettä.',
      },
    ],
  },
  {
    id: 'fire',
    title: 'Tulipalo leikkaussalissa',
    subtitle: 'Liekki, savu tai palon haju potilaassa tai ympäristössä',
    sourceNumber: 5,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Keskeytä sytytyslähde',
        text: 'Ilmoita palo. Keskeytä toimenpide.',
      },
      {
        title: 'Hengitystiepalo',
        text: 'Katkaise kaasut. Poista palava putki ja materiaali.',
      },
      {
        title: 'Muu potilaspalo',
        text: 'Poista palavat peitteet. Keskeytä hapettava kaasu.',
      },
      {
        title: 'Sammuta ja suojaa',
        text: 'Noudata palo-ohjetta. Ei nesteitä sähkölaitteisiin.',
      },
      {
        title: 'Arvioi potilas',
        text: 'Palauta hengitystuki palon sammuttua. Evakuoi tarvittaessa.',
      },
    ],
    details: [
      {
        title: 'Hengitystiepalo',
        text: 'Toimi tiiminä samanaikaisesti: keskeytä kaasuvirtaus, poista palava hengitystieväline ja sammuta palo. Alkuperäinen kortti kuvaa keittosuolan käytön hengitystiepaloon. Palon sammuttua varmista hengitystie ja arvioi vauriot sekä vierasmateriaali; valmistele bronkoskopia.',
      },
      {
        title: 'Potilas- ja laitepalo',
        text: 'Poista palava materiaali potilaan päältä ja sammuta soveltuvalla menetelmällä. Älä käytä alkoholiliuoksia tai kaada nestettä sähköiseen laitteistoon. Jos palo ei sammu, hälytä, evakuoi ja toimi yksikön pelastussuunnitelman mukaan.',
      },
      {
        title: 'Tilanteen jälkeen',
        text: 'Varmista, ettei paloa jää peitteisiin tai leikkausalueelle. Arvioi hengitystie- ja palovammat. Ota laitteet ja materiaalit talteen selvittelyä varten.',
      },
    ],
  },
  {
    id: 'hypoxia',
    title: 'Hypoksia',
    subtitle: 'Odottamaton SpO₂-lasku yleisanestesian aikana',
    sourceNumber: 6,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Varmista hapentarjonta',
        text: 'Tarkista SpO₂-signaali. Nosta FiO₂ ja tuorekaasuvirtaus.',
      },
      {
        title: 'Tarkista hengitystie',
        text: 'Putken sijainti, CO₂-käyrä, hengitysäänet ja eritteet.',
      },
      {
        title: 'Tarkista laitteisto',
        text: 'Kierto, liitokset ja suodatin. Tarvittaessa erillinen palje.',
      },
      {
        title: 'Arvioi potilas',
        text: 'Ventilaatio, anestesia, relaksaatio, paine ja rytmi.',
      },
      {
        title: 'Jos hypoksia jatkuu',
        text: 'Pyydä tauko toimenpiteeseen. Selvitä ja hoida syy.',
      },
    ],
    details: [
      {
        title: 'Hengitystie ja ventilaatio',
        text: 'Arvioi rintakehän liike ja molemminpuoliset hengitysäänet. Tarkista intubaatioputken tai supraglottisen välineen sijainti, tiiviys ja avoimuus. Poista eritteet tarvittaessa. Arvioi uloshengityksen hiilidioksidikäyrä, ilmavuoto ja hengitystiepaineet.',
      },
      {
        title: 'Laitteisto ja verenkierto',
        text: 'Tarkista hengityskierto, suodatin, liitokset ja koneen säädöt. Tarvittaessa erillinen käsiventilaatiopalje auttaa arvioimaan laitevian mahdollisuutta. Tarkista verenpaine, rytmi ja perfuusio. Valmistele verikaasunäyte lääkärin harkinnan mukaan.',
      },
      {
        title: 'Erotusdiagnostiikka',
        text: 'Mahdollisia syitä ovat putken virheasento tai tukos, bronko- tai laryngospasmi, aspiraatio, atelektaasi, ilmarinta, keuhkopöhö, embolia ja laitevika. Pitkittyessä sovi toimenpiteen tauottamisesta ja syyn kohdennetusta hoidosta.',
      },
    ],
  },
  {
    id: 'aspiration',
    title: 'Aspiraatio',
    subtitle: 'Mahan sisältöä tai muuta ainesta hengitysteissä',
    sourceNumber: 7,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Rajoita lisäaspiraatio',
        text: 'Asento tilanteen mukaan. Imu heti valmiiksi.',
      },
      {
        title: 'Puhdista hengitystie',
        text: 'Ime näkyvä sisältö. Varmista hapetus, happi 100 %.',
      },
      {
        title: 'Varmista hengitystie',
        text: 'Valmistele intubaatio ja hengitystieimu.',
      },
      {
        title: 'Valmistele tutkimukset',
        text: 'Bronkoskopia tarpeen mukaan. Seuraa verikaasuja.',
      },
      {
        title: 'Sovi jatkohoito',
        text: 'Arvioi toimenpiteen jatko ja valvonnan tarve.',
      },
    ],
    details: [
      {
        title: 'Alkuvaihe',
        text: 'Potilaan asento valitaan tilanteen sallimissa rajoissa lisäaspiraation vähentämiseksi. Puhdista nielu ja hengitystie imulla. Valmistele tarvittava hengitystien varmistaminen ja avusta lääkäriä.',
      },
      {
        title: 'Lisäarvio',
        text: 'Arvioi bronkoskopian ja näytteiden tarve. Seuraa hapetusta, hengitystiepaineita ja verikaasuja. Keuhkokuva ja jatkoseuranta suunnitellaan oireiden ja tilanteen perusteella.',
      },
      {
        title: 'Huomioitavaa',
        text: 'Antibioottia tai kortikosteroidia ei aloiteta pelkän aspiraation vuoksi rutiinisti akuutissa vaiheessa. Erotusdiagnostiikassa huomioidaan bronko- ja laryngospasmi, putken tukos, keuhkopöhö ja embolia.',
      },
    ],
  },
  {
    id: 'bronchospasm',
    title: 'Bronkospasmi',
    subtitle: 'Uloshengitys vaikeutuu, hengitystiepaine nousee',
    sourceNumber: 8,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Hapeta ja arvioi',
        text: 'Happi 100 %. Tarkista putki, laitteisto ja hengitysäänet.',
      },
      {
        title: 'Minimoi ärsykkeet',
        text: 'Valmistele anestesian syventäminen lääkärin ohjeella.',
      },
      {
        title: 'Valmistele avaava lääke',
        text: 'Anna bronkodilataattori lääkärin määräyksellä.',
      },
      {
        title: 'Varmista uloshengitys',
        text: 'Riittävä uloshengitysaika. Huomioi ansailma.',
      },
      {
        title: 'Arvioi vaste ja syy',
        text: 'Seuraa SpO₂, CO₂ ja paineet. Huomioi anafylaksia.',
      },
    ],
    details: [
      {
        title: 'Sulje pois muut syyt',
        text: 'Tarkista putken tai supraglottisen välineen virheasento ja tukos sekä laitteiston toiminta. Anafylaksia, aspiraatio, laryngospasmi, ilmarinta ja keuhkopöhö voivat aiheuttaa samantapaisen tilanteen.',
      },
      {
        title: 'Ventilaation arvio',
        text: 'Seuraa uloshengityksen riittävyyttä, hiilidioksidikäyrää, hengitystiepaineita ja verenkiertoa. Riittävä uloshengitysaika on tärkeä ansailman välttämiseksi. Vaikeassa tilanteessa hengitysäänet voivat olla hiljaiset.',
      },
      {
        title: 'Hoito ja jatko',
        text: 'Lääkäri päättää anestesian syventämisestä, bronkodilataattoreista ja lisälääkityksestä. Valmistele lääke ja sen antolaite. Arvioi verikaasujen, kuvantamisen ja jatkovalvonnan tarve.',
      },
    ],
  },
  {
    id: 'laryngospasm',
    title: 'Laryngospasmi',
    subtitle: 'Kurkunpään sulkeutuminen: hengitys estyy',
    sourceNumber: 9,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Poista ärsyke',
        text: 'Lopeta stimulaatio. Poista eritteet tarvittaessa imulla.',
      },
      {
        title: 'Avaa hengitystie',
        text: 'Leuan nosto ja tiivis maski, happi 100 %.',
      },
      {
        title: 'Tue hapetusta',
        text: 'CPAP lääkärin ohjeella. Vältä voimakasta puhallusta.',
      },
      {
        title: 'Valmistele lääkitys',
        text: 'Anestesian syventäminen ja relaksaatio lääkärin ohjeella.',
      },
      {
        title: 'Jos ei korjaannu',
        text: 'Valmistele intubaatio. Seuraa rytmiä ja hapetusta.',
      },
    ],
    details: [
      {
        title: 'Ensitoimet',
        text: 'Minimoi hengitystien ärsytys, avaa hengitystie ja varmista maskin tiiviys. Arvioi myös ylempänä oleva hengitystie-este. Voimakas ventilaatio voi täyttää mahalaukkua.',
      },
      {
        title: 'Tilanteen pitkittyessä',
        text: 'Lääkäri arvioi anestesian syventämisen, relaksantin ja intubaation tarpeen. Seuraa erityisesti hypoksiaa ja bradykardiaa. Lääkevalinta ja annos riippuvat potilaasta; niitä ei määritellä tässä demossa.',
      },
      {
        title: 'Tilanteen jälkeen',
        text: 'Arvioi aspiraatio ja negatiivisen paineen aiheuttama keuhkopöhö. Suunnittele turvallinen ekstubaatio, avun saatavuus ja jatkoseuranta. Huomioi muut ylähengitystien tukoksen syyt.',
      },
    ],
  },
  {
    id: 'embolism',
    title: 'Keuhkoembolia',
    subtitle: 'Äkillinen hapetuksen ja verenkierron heikkeneminen',
    sourceNumber: 10,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Tue hapetusta',
        text: 'Varmista hengitystie. Happi 100 %, lopeta ilokaasu.',
      },
      {
        title: 'Tue verenkiertoa',
        text: 'Valmistele verenkierron tuki lääkärin määräyksellä.',
      },
      {
        title: 'Selvitä syy',
        text: 'EtCO₂, verikaasut, sydämen ultraääni ja kuvantaminen.',
      },
      {
        title: 'Valmistele kohdennettu hoito',
        text: 'Huomioi trombi-, ilma-, rasva- ja muut emboliat.',
      },
      {
        title: 'Sovi jatkohoito',
        text: 'Arvioi leikkauksen keskeytys. Eloton → elvytys.',
      },
    ],
    details: [
      {
        title: 'Tunnistaminen',
        text: 'EtCO₂:n lasku, hypoksemia, hypotensio ja takykardia voivat herättää epäilyn. Arvioi tapahtuman yhteys toimenpiteeseen. Verikaasut, sydämen ultraääni ja TT-angiografia valitaan potilaan tilan mukaan.',
      },
      {
        title: 'Aiheuttaja vaikuttaa hoitoon',
        text: 'Tromboembolia, ilmaembolia, lapsivesiembolia, rasvaembolia ja sementtiin liittyvä tapahtuma eivät ole sama hoitotilanne. Lääkäri ratkaisee kohdennetun hoidon ja konsultaatiot. Ilmaemboliassa estetään lisäilman pääsy verenkiertoon.',
      },
      {
        title: 'Jatkohoito',
        text: 'Seuraa hapetusta ja verenkiertoa, valmistele lisätutkimukset ja tehohoito. Älä tulkitse tätä korttia yleiseksi liuotushoito-ohjeeksi. Sydänpysähdyksessä toimitaan elvytysohjeen ja syykohtaisen protokollan mukaan.',
      },
    ],
  },
  {
    id: 'bradycardia',
    title: 'Bradykardia',
    subtitle: 'Aikuiset · Hidas syke ja verenkiertovajauksen merkit',
    sourceNumber: 11,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Arvioi verenkierto',
        text: 'Tajunta, verenpaine, pulssi ja rytmi.',
      },
      {
        title: 'Korjaa mahdollinen syy',
        text: 'Hapetus, vagusärsyke, lääkkeet ja puudutuksen taso.',
      },
      {
        title: 'Valmistele lääkehoito',
        text: 'Anna lääkkeet lääkärin ja ajantasaisen ohjeen mukaan.',
      },
      {
        title: 'Varaudu tahdistukseen',
        text: 'Defibrillaattori ja elektrodit. Varmista mekaaninen vaste.',
      },
      {
        title: 'Seuraa ja arvioi',
        text: 'Eloton → elvytys. Muutoin sovi jatkovalvonta.',
      },
    ],
    details: [
      {
        title: 'Rajaus',
        text: 'Tämä kortti koskee aikuista, jolla hidas rytmi aiheuttaa verenkiertovajauksen merkkejä. Se ei ole lasten bradykardian hoito-ohje. Arvioi pulssi, tajunta, verenpaine ja hypoksian mahdollisuus.',
      },
      {
        title: 'Mahdolliset syyt',
        text: 'Hypoksia, vagusheijaste, lääkkeet, korkea spinaalipuudutus, sydänlihasiskemia, johtumishäiriö, elektrolyyttihäiriö ja hypotermia ovat huomioitavia syitä.',
      },
      {
        title: 'Tahdistuksen valmistelu',
        text: 'Lääkäri arvioi lääkehoidon ja tahdistuksen tarpeen. Noudata käytössä olevan laitteen ohjetta. Pelkkä EKG:n tahdistuspiikki ei osoita tehokasta verenkiertoa: tarkista pulssi ja verenpaine. Huomioi hereillä olevan potilaan kivunhoito ja sedaatio.',
      },
    ],
  },
  {
    id: 'tachycardia',
    title: 'Takykardia',
    subtitle: 'Aikuiset · Nopea syke, pulssi tuntuu',
    sourceNumber: 12,
    sourceDate: date,
    steps: [
      team,
      {
        title: 'Arvioi epävakaus',
        text: 'Hypotensio, tajunnan lasku, iskemia tai sokki.',
      },
      {
        title: 'Varmista hapetus',
        text: 'Hengitystie, SpO₂ ja hengitys. Monitori ja suoniyhteys.',
      },
      {
        title: 'Epävakaa rytmihäiriö',
        text: 'Valmistele synkronoitu kardioversio viipymättä.',
      },
      {
        title: 'Selvitä rytmi ja syy',
        text: 'Sinustakykardiassa hoida syytä, älä vain sykettä.',
      },
      {
        title: 'Arvioi vaste',
        text: 'Seuraa painetta ja rytmiä. Eloton → elvytys.',
      },
    ],
    details: [
      {
        title: 'Rajaus ja kiireellisyys',
        text: 'Kortti koskee aikuista, jolla on pulssi. Verenkiertoa heikentävä rytmihäiriö edellyttää kiireellistä lääkärin arviota ja usein synkronoitua kardioversiota. Tajuisen potilaan sedaatio huomioidaan tilanteen sallimissa rajoissa.',
      },
      {
        title: 'Rytmi ratkaisee',
        text: 'Arvioi rytmin säännöllisyys ja QRS-leveys. Rytmikohtainen lääkehoito ja kardioversion energia valitaan ajantasaisen ohjeen mukaan. Varmista synkronointi ennen synkronoitua iskua. Tämä demo ei sisällä lääkeannoksia tai rytmikohtaisia energiataulukoita.',
      },
      {
        title: 'Sinustakykardian syyt',
        text: 'Kipu, pinnallinen anestesia, hypovolemia, anemia, hypoksia, hyperkapnia, kuume, sepsis, anafylaksia ja maligni hypertermia voivat aiheuttaa takykardian. Nopeutunut syke voi olla kompensatorinen; pelkkä hidastaminen ei korjaa syytä.',
      },
    ],
  },
];
