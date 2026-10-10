import { useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/tokens';

type Section = {
  title: string;
  lines: string[];
  tone?: 'blue' | 'red' | 'green';
};
type Guide = {
  label: string;
  title: string;
  scope: string;
  start: Section;
  branches?: Section[];
  cycle?: string;
  sections: Section[];
  source: string;
};
export const guides: Guide[] = [
  {
    label: 'Vastasyntynyt',
    title: 'Vastasyntyneen elvytys',
    scope:
      'Syntymän yhteydessä • Hengityksen käynnistäminen ja verenkierron tuki',
    start: {
      title: 'Valmistaudu ja arvioi',
      lines: [
        'Kutsu tarvittava apu. Käynnistä kello syntymästä ja pidä lapsi lämpimänä.',
        'Arvioi hengitys ja syke. Kuivaa, stimuloi hellästi, peittele ja laita päähine. Viivästetty napanuoran sulku tilanteen mukaan.',
      ],
      tone: 'blue',
    },
    sections: [
      {
        title: '1 · Avaa hengitystie ja tue hengitystä',
        lines: [
          'Jos hengitys puuttuu tai on haukkovaa: 5 alkupuhallusta.',
          'Vähintään 32 raskausviikkoa: aloituspaine 30 cmH₂O, PEEP 6 cmH₂O, happi 21 %.',
          'Alle 32 raskausviikkoa: aloituspaine 25 cmH₂O, PEEP 6 cmH₂O, happi vähintään 30 %. Hengittävälle CPAP 6 cmH₂O.',
          'Alle 32-viikkoinen kuivamatta muovipussiin, päähine ja ulkoinen lämmönlähde. Harkitse oikean käden SpO₂-seurantaa ja EKG:tä.',
        ],
      },
      {
        title: '2 · Liikkuuko rintakehä, nouseeko syke?',
        lines: [
          'Jos rintakehä ei liiku: korjaa maskin tiiviys ja pään asento, kohota leukaa. Kokeile muita hengitystien avaamiskeinoja ja tarvittaessa suurempaa painetta.',
          'Toista 5 alkupuhallusta ja arvioi uudelleen.',
          'Kun rintakehä liikkuu: jatka tehokasta ylipaineventilaatiota ja arvioi syke 30 sekunnin kuluttua.',
        ],
        tone: 'blue',
      },
      {
        title: '3 · Syke edelleen alle 60/min',
        lines: [
          'Varmista ensin vähintään 30 sekuntia tehokasta ventilaatiota. Jos syke nousee, harkitse vielä 30 sekuntia ventilaatiota.',
          'Aloita painelu ja ventilaatio suhteessa 3:1, happi 100 %. Harkitse supraglottista hengitystievälinettä tai intubaatiota.',
          'Arvioi syke 30 sekunnin välein. Lopeta painelu sykkeen noustessa yli 60/min ja verenkierron parantuessa; jatka tarvittavaa hengitystukea.',
        ],
        tone: 'red',
      },
      {
        title: '4 · Syke alle 60/min tehokkaasta elvytyksestä huolimatta',
        lines: [
          'Napalaskimoyhteys (UVC) tai luuydinyhteys (IO). Harkitse lääkkeitä ja nestettä.',
          'Adrenaliini 10–30 µg/kg UVC/IO, tarvittaessa 4 minuutin välein.',
          'Harkitse verivolyymin korjausta 10 ml/kg, jos epäilet verenhukkaa tai hypovolemiaa.',
          'Jos verensokeri on matala: 10 % glukoosi 2 ml/kg.',
          'Arvioi ilmarinta, hypovolemia, synnynnäinen poikkeavuus ja välinevika.',
        ],
      },
      {
        title: 'Hapetus ja jatkohoito',
        lines: [
          'Oikean käden SpO₂-tavoite: 3 min 70–75 %, 5 min 80–85 %, 10 min 85–95 %.',
          'Säädä happea tavoitteen mukaan. Ylläpidä normaalia lämpötilaa, seuraa hengitystä, sykettä ja glukoosia.',
          'Kerro tilanteesta vanhemmille ja käy tapahtuma läpi tiimin kanssa.',
        ],
        tone: 'green',
      },
    ],
    source: 'https://www.erc.edu/media/rgrn0faa/gl2025-08-nls-e.pdf',
  },
  {
    label: 'Lapset',
    title: 'Lasten hoitoelvytys',
    scope:
      'Imeväiset, lapset ja nuoret • Ei vastasyntyneen elvytystä syntymässä',
    start: {
      title: 'Tunnista ja aloita',
      lines: [
        'Ei elonmerkkejä tai syke alle 60/min ja heikko verenkierto riittävästä hengityksen tuesta huolimatta.',
        'Kutsu elvytysryhmä. 5 alkupuhallusta, sitten painelu-puhalluselvytys 15:2.',
        'Kytke defibrillaattori / monitori.',
      ],
      tone: 'blue',
    },
    branches: [
      {
        title: 'Defibrilloitava',
        lines: [
          'Kammiovärinä / sykkeetön kammiotakykardia (VF/pVT).',
          '1 isku · 4 J/kg (enintään laitteen aikuisten energia 120–200 J).',
          'Jatka heti elvytystä 2 min.',
          '3. iskun jälkeen adrenaliini ja amiodaroni. 5. iskun jälkeen molemmat uudelleen.',
        ],
        tone: 'red',
      },
      {
        title: 'Ei-defibrilloitava',
        lines: [
          'Asystole / sykkeetön sähköinen toiminta (PEA) / bradykardia ja heikko verenkierto.',
          'Adrenaliini IV/IO mahdollisimman pian.',
          'Jatka elvytystä 2 min.',
        ],
        tone: 'blue',
      },
    ],
    cycle:
      '2 min elvytystä → arvioi rytmi uudelleen. Jos verenkierto palautuu, siirry jatkohoitoon.',
    sections: [
      {
        title: 'Lääkkeet · IV/IO',
        lines: [
          'Adrenaliini 10 µg/kg (enintään 1 mg), toista 4 min välein.',
          'Amiodaroni 5 mg/kg: 3. iskun jälkeen enintään 300 mg; 5. iskun jälkeen enintään 150 mg.',
          'Pitkittyvä VF/pVT: harkitse iskuenergian nostamista asteittain enintään 8 J/kg (enintään 360 J), kun tarvitaan yli 5 iskua.',
        ],
      },
      {
        title: 'Elvytyksen aikana',
        lines: [
          'Laadukas painelu, mahdollisimman lyhyet tauot. Vaihda painelijaa 2 min välein.',
          'Palje-maskiventilaatio 100 % hapella, kahden henkilön tekniikka.',
          'Kun hengitystie on varmistettu: jatkuva painelu ja ikäkohtainen ventilaatio alkuperäisen ohjeen mukaan.',
          'Etsi ja hoida korjattavat syyt.',
        ],
      },
      {
        title: 'Verenkierron palauduttua',
        lines: [
          'ABCDE-arvio. SpO₂ 94–98 %, PaCO₂ 4,6–6 kPa.',
          'Systolinen ja keskiverenpaine yli iän 10. persentiilin.',
          'Vältä kuumetta, tarkista glukoosi ja hoida elvytykseen johtanut syy.',
        ],
        tone: 'green',
      },
    ],
    source: 'https://www.erc.edu/media/03xnpjmj/gl2025-09-pls-e.pdf',
  },
  {
    label: 'Aikuiset',
    title: 'Aikuisen hoitoelvytys',
    scope: 'Aikuisen sydänpysähdys • Hoitoelvytyksen pääkohdat',
    start: {
      title: 'Tunnista ja aloita',
      lines: [
        'Ei reagoi eikä hengitä normaalisti.',
        'Kutsu elvytysryhmä. Aloita painelu-puhalluselvytys 30:2.',
        'Kytke defibrillaattori / monitori.',
      ],
      tone: 'blue',
    },
    branches: [
      {
        title: 'Defibrilloitava',
        lines: [
          'Kammiovärinä / sykkeetön kammiotakykardia (VF/pVT).',
          '1 isku laitteen ja paikallisen ohjeen mukaisella energialla.',
          'Jatka heti painelua ja ventilaatiota 2 min.',
          '3. iskun jälkeen adrenaliini ja amiodaroni.',
        ],
        tone: 'red',
      },
      {
        title: 'Ei-defibrilloitava',
        lines: [
          'Sykkeetön sähköinen toiminta (PEA) / asystole.',
          'Adrenaliini mahdollisimman pian, sitten 3–5 min välein.',
          'Jatka heti painelua ja ventilaatiota 2 min.',
        ],
        tone: 'blue',
      },
    ],
    cycle:
      '2 min elvytystä → arvioi rytmi uudelleen. Jos verenkierto palautuu, siirry jatkohoitoon.',
    sections: [
      {
        title: 'Lääkkeet ja suoniyhteys',
        lines: [
          'Adrenaliini 1 mg, toista 3–5 min välein. Defibrilloitavassa rytmissä ensimmäinen annos 3. iskun jälkeen.',
          'Amiodaroni 300 mg 3. iskun jälkeen ja 150 mg 5. iskun jälkeen.',
          'Laskimoyhteys (IV) varhain; luuydinyhteys (IO), jos IV ei onnistu.',
        ],
      },
      {
        title: 'Elvytyksen aikana',
        lines: [
          'Laadukas painelu ja ventilaatio, mahdollisimman lyhyet tauot.',
          'Anna happea, varmista elektrodien sijoittelu ja käytä käyräkapnografiaa.',
          'Kun intubaatioputki tai supraglottinen hengitystieväline on paikallaan: jatkuva painelu.',
          'Etsi ja hoida korjattavat syyt. Harkitse elektrodien siirtoa etu-takasijoitteluun 3 iskun jälkeen.',
        ],
      },
      {
        title: 'Verenkierron palauduttua',
        lines: [
          'ABCDE-arvio. SpO₂ 94–98 % ja normaali PaCO₂.',
          'Systolisen verenpaineen tavoite yli 100 mmHg.',
          '12-kytkentäinen EKG, syyn tunnistaminen ja hoito, lämpötilan hallinta.',
        ],
        tone: 'green',
      },
    ],
    source:
      'https://www.erc.edu/umbraco/api/download-page/download/d01b6e5a-0de7-4b07-913a-58445e8630fc',
  },
];
const causes = [
  'Hypoksia · hypovolemia',
  'Kalium-, kalsium-, magnesium- ja muut aineenvaihduntahäiriöt, hypoglykemia',
  'Hypotermia / hypertermia · myrkyt',
  'Sydäntamponaatio · paineilmarinta',
  'Sepelvaltimo- tai keuhkovaltimotukos',
];
function Card({ section }: { section: Section }) {
  return (
    <View
      style={[
        s.card,
        section.tone === 'blue' && s.blue,
        section.tone === 'red' && s.red,
        section.tone === 'green' && s.green,
      ]}
    >
      <Text accessibilityRole="header" style={s.cardTitle}>
        {section.title}
      </Text>
      {section.lines.map((line) => (
        <Text key={line} style={s.body}>
          • {line}
        </Text>
      ))}
    </View>
  );
}
export default function ResuscitationScreen() {
  const [selected, setSelected] = useState(1);
  const [showSources, setShowSources] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const guide = guides[selected];
  async function openSource(url: string) {
    try {
      await Linking.openURL(url);
      setLinkError(false);
    } catch {
      setLinkError(true);
    }
  }
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Takaisin etusivulle"
          onPress={() => router.replace('/')}
          style={s.back}
        >
          <Text style={s.link}>‹ Etusivu</Text>
        </Pressable>
        <Text style={s.headerTitle}>Elvytys</Text>
        <Text style={s.badge}>ERC 2025</Text>
      </View>
      <View style={s.tabs}>
        {guides.map((item, index) => (
          <Pressable
            key={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: selected === index }}
            onPress={() => {
              setSelected(index);
              setShowSources(false);
              setLinkError(false);
              scroll.current?.scrollTo({ y: 0, animated: false });
            }}
            style={[s.tab, selected === index && s.active]}
          >
            <Text style={[s.tabText, selected === index && s.activeText]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView ref={scroll} contentContainerStyle={s.content}>
        <Text accessibilityRole="header" style={s.title}>
          {guide.title}
        </Text>
        <Text style={s.muted}>{guide.scope}</Text>
        <Text style={s.notice}>
          Portfoliodemo · Epävirallinen suomennos ja tiivistelmä. Ei validoitu
          potilastyöhön. Akuutissa tilanteessa kutsu apua ja toimi paikallisen
          protokollan mukaan.
        </Text>
        <Card section={guide.start} />
        {guide.branches && (
          <>
            <Text accessibilityRole="header" style={s.rhythm}>
              ↓ Arvioi rytmi
            </Text>
            <View style={[s.branches, width >= 700 && s.row]}>
              {guide.branches.map((section) => (
                <View key={section.title} style={s.branch}>
                  <Card section={section} />
                </View>
              ))}
            </View>
            <View style={s.cycle}>
              <Text style={s.cycleText}>{guide.cycle}</Text>
            </View>
          </>
        )}
        {guide.sections.map((section) => (
          <Card key={section.title} section={section} />
        ))}
        {selected !== 0 && (
          <Card section={{ title: 'Korjattavat syyt', lines: causes }} />
        )}
        <Text style={s.muted}>
          Lääkkeet lääkemääräyksen ja paikallisen elvytysohjeen mukaan. Tarkista
          annokset paikallisesta ohjeesta. IV = laskimoon, IO = luuytimeen.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: showSources }}
          onPress={() => setShowSources(!showSources)}
          style={s.sourceButton}
        >
          <Text style={s.link}>
            {showSources
              ? 'Piilota lähteet'
              : 'Näytä alkuperäinen ohje ja lähteet'}{' '}
            {showSources ? '−' : '+'}
          </Text>
        </Pressable>
        {showSources && (
          <View style={s.card}>
            <Text style={s.cardTitle}>
              European Resuscitation Council · 2025
            </Text>
            <Text style={s.body}>
              Pohjana ERC:n vuoden 2025 taskukaaviot ja täydentävät
              hoitoelvytysohjeet. Suomennos ja valikoitu tiivistelmä:
              AnestesiaHelppi. Ei ERC:n hyväksymä käännös. Sisältö tarkistettu
              lähteisiin 10.10.2026; ei riippumatonta kliinistä validointia.
            </Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => openSource(guide.source)}
              style={s.sourceButton}
            >
              <Text style={s.link}>Avaa tämän ikäryhmän ERC-ohje (PDF) ↗</Text>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              onPress={() => openSource('https://www.erc.edu/download-centre')}
              style={s.sourceButton}
            >
              <Text style={s.link}>
                Alkuperäiset taskukaaviot ERC:n sivulla ↗
              </Text>
            </Pressable>
            <Text style={s.muted}>
              © European Resuscitation Council. Opetuskäyttö; ei kaupalliseen
              käyttöön. Alkuperäislähteet avautuvat verkosta.
            </Text>
            {linkError && (
              <Text accessibilityRole="alert" style={s.error}>
                Linkin avaaminen epäonnistui. Yritä uudelleen verkkoyhteydellä.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  header: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  back: { paddingVertical: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  badge: {
    backgroundColor: colors.supportingSurface,
    padding: 10,
    borderRadius: 12,
    color: '#155E80',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignSelf: 'center',
    width: '92%',
    maxWidth: 920,
    backgroundColor: colors.supportingSurface,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
    justifyContent: 'center',
  },
  active: { backgroundColor: '#137CA9' },
  tabText: { textAlign: 'center', fontSize: 15, color: colors.textPrimary },
  activeText: { color: 'white', fontWeight: '700' },
  content: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 48,
    gap: 14,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  muted: { fontSize: 14, lineHeight: 21, color: '#515967' },
  notice: {
    fontSize: 13,
    lineHeight: 19,
    color: '#695340',
    backgroundColor: '#F1E9DC',
    padding: 12,
    borderRadius: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    gap: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 19, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 16, lineHeight: 25, color: colors.textPrimary },
  blue: { backgroundColor: '#EAF6FC' },
  red: { backgroundColor: '#FDECEB', borderColor: '#F5CFCA' },
  green: { backgroundColor: '#EDF8F2' },
  rhythm: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#155E80',
    padding: 8,
  },
  branches: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  branch: { flex: 1 },
  cycle: { backgroundColor: '#137CA9', borderRadius: 16, padding: 18 },
  cycleText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 26,
  },
  link: { color: '#126D94', fontSize: 16, fontWeight: '600' },
  sourceButton: { paddingVertical: 14, minHeight: 48 },
  error: { color: colors.critical, fontSize: 15 },
});
