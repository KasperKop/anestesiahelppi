import { useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/tokens';
import { Icon, type IconName } from '@/src/ui/Icon';
import data from '@/src/resuscitation/guides.json';
type Section = {
  title: string;
  id?: string;
  tone?: string;
  lines?: string[];
  grid?: string[];
  ventilation?: string[][];
  extra?: string;
  subtitle?: string;
  action?: { label: string; value: string };
  doses?: string[][];
  continuation?: string;
};
export const guides = data;
function Heading({ text, icon }: { text: string; icon?: IconName }) {
  return (
    <View style={s.heading}>
      {icon && <Icon name={icon} size={20} />}
      <Text accessibilityRole="header" style={s.h2}>
        {text}
      </Text>
    </View>
  );
}
function Lines({ lines }: { lines?: string[] }) {
  return (
    <>
      {lines?.map((line) => (
        <Text key={line} style={s.body}>
          • {line}
        </Text>
      ))}
    </>
  );
}
function Card({
  section: b,
  branch = false,
}: {
  section: Section;
  branch?: boolean;
}) {
  const tone =
    b.tone === 'red'
      ? s.red
      : b.tone === 'blue'
        ? s.blue
        : b.tone === 'green'
          ? s.green
          : b.tone === 'gold'
            ? s.gold
            : null;
  return (
    <View style={[s.card, tone, branch && s.branchCard]}>
      {branch ? (
        <>
          <Icon name={b.tone === 'red' ? 'zap' : 'zapOff'} size={20} />
          <Text accessibilityRole="header" style={s.h2}>
            {b.title}
          </Text>
        </>
      ) : (
        <Heading
          text={b.title}
          icon={
            b.tone === 'green'
              ? 'circleCheck'
              : b.title === 'Elvytyksen aikana'
                ? 'alert'
                : undefined
          }
        />
      )}
      {b.subtitle && <Text style={s.small}>{b.subtitle}</Text>}
      {b.action && (
        <View
          style={[
            s.action,
            { backgroundColor: b.tone === 'red' ? '#B32017' : '#12668A' },
          ]}
        >
          <Text style={s.actionLabel}>{b.action.label}</Text>
          <Text style={[s.actionValue, b.tone === 'red' && s.energy]}>
            {b.action.value}
          </Text>
        </View>
      )}
      <Lines lines={b.lines} />
      {b.doses && (
        <>
          <Text style={s.label}>Lääkkeet IV/IO</Text>
          {b.doses.map(([name, timing]) => (
            <View key={timing} style={s.dose}>
              <Text style={s.doseName}>{name}</Text>
              <Text style={s.small}>{timing}</Text>
            </View>
          ))}
        </>
      )}
      {b.continuation && (
        <>
          <Text style={s.label}>Jatkossa</Text>
          <Text style={s.body}>{b.continuation}</Text>
        </>
      )}
      {b.ventilation && (
        <View style={s.vent}>
          {b.ventilation.map(([age, rate]) => (
            <View key={age} style={s.ventCell}>
              <Text style={s.small}>{age}</Text>
              <Text style={s.doseName}>{rate}</Text>
            </View>
          ))}
        </View>
      )}
      {b.grid && (
        <View style={s.grid}>
          {b.grid.map((t) => (
            <View key={t} style={s.cause}>
              <Text style={s.body}>{t}</Text>
            </View>
          ))}
        </View>
      )}
      {b.extra && <Text style={s.small}>{b.extra}</Text>}
    </View>
  );
}
export default function ResuscitationScreen() {
  const [selected, setSelected] = useState(1),
    [sources, setSources] = useState(false),
    [error, setError] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const roscY = useRef(0);
  const g = guides[selected];
  const child = selected === 1;
  async function open() {
    try {
      await Linking.openURL(g.source);
      setError(false);
    } catch {
      setError(true);
    }
  }
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView ref={scroll} contentContainerStyle={s.content}>
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Takaisin etusivulle"
            style={s.button}
            onPress={() => router.replace('/')}
          >
            <Icon name="left" size={20} />
            <Text style={s.link}>Etusivu</Text>
          </Pressable>
          <Text style={s.h2}>Elvytys</Text>
          <Text style={s.chip}>ERC 2025</Text>
        </View>
        <View style={s.tabs}>
          {guides.map((a, i) => (
            <Pressable
              key={a.label}
              accessibilityRole="tab"
              accessibilityLabel={a.label}
              accessibilityState={{ selected: i === selected }}
              style={[s.tab, i === selected && s.active]}
              onPress={() => {
                setSelected(i);
                setSources(false);
                setError(false);
                scroll.current?.scrollTo({ y: 0, animated: false });
              }}
            >
              <Text style={[s.tabText, i === selected && s.white]}>
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text accessibilityRole="header" style={s.title}>
          {g.title}
        </Text>
        <Text style={s.small}>{g.scope}</Text>
        {child ? (
          <View style={[s.card, s.blue]}>
            <Heading text={g.start.title} />
            <Text style={s.small}>{g.start.lines[0]}</Text>
            {g.start.lines.slice(1).map((l, i) => (
              <Text key={l} style={s.step}>
                {i + 1}. {l}
              </Text>
            ))}
          </View>
        ) : (
          <Card section={g.start} />
        )}
        {g.branches && (
          <View style={s.flow}>
            <View
              accessible
              accessibilityRole="image"
              accessibilityLabel="Palaa rytmin arviointiin"
              style={s.loop}
            >
              <View style={s.arrow} />
            </View>
            <View style={s.bar}>
              <Icon name="activity" color="white" size={20} />
              <Text accessibilityRole="header" style={s.barTitle}>
                Arvioi rytmi
              </Text>
            </View>
            <View style={s.branches}>
              <View style={s.column}>
                <Card section={g.branches[0]} branch />
              </View>
              <View style={s.column}>
                <Card section={g.branches[1]} branch />
                {child && (
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="ROSC – Verenkierto palautui. Siirry jatkohoitoon"
                    style={s.roscLink}
                    onPress={() =>
                      scroll.current?.scrollTo({
                        y: roscY.current,
                        animated: true,
                      })
                    }
                  >
                    <Icon name="circleCheck" color="#195d34" size={20} />
                    <Text style={s.step}>ROSC</Text>
                    <Text style={s.small}>Verenkierto palautui</Text>
                    <Icon name="down" size={16} />
                  </Pressable>
                )}
              </View>
            </View>
            <View style={s.bar}>
              <Icon name="alert" color="white" size={20} />
              <View style={s.flex}>
                <Text style={s.barTitle}>
                  {child ? 'Elvytä heti 2 min' : g.cycle}
                </Text>
                {child && (
                  <Text style={s.white}>Sitten arvioi rytmi uudelleen ↺</Text>
                )}
              </View>
            </View>
          </View>
        )}
        {g.sections.map((b, i) => (
          <View
            key={b.title}
            onLayout={(e) => {
              if (b.id === 'rosc') roscY.current = e.nativeEvent.layout.y;
            }}
          >
            <Card section={b} />
          </View>
        ))}
        <Text style={s.small}>
          Lähde: ERC Guidelines 2025 · {g.label}. Portfoliodemo, ei kliiniseen
          käyttöön.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: sources }}
          style={s.button}
          onPress={() => setSources(!sources)}
        >
          <Text style={s.link}>
            {sources
              ? 'Piilota lähteet'
              : 'Näytä alkuperäinen kaavio ja lähteet'}
          </Text>
        </Pressable>
        {sources && (
          <View style={s.card}>
            <Text style={s.small}>
              IV = laskimoon, IO = luuytimeen. Epävirallinen suomennos. Ei ERC:n
              hyväksymä käännös. Lääkkeet lääkemääräyksen ja paikallisen ohjeen
              mukaan. Tarkista annokset paikallisesta ohjeesta.
            </Text>
            <Pressable accessibilityRole="link" style={s.button} onPress={open}>
              <Text style={s.link}>Avaa tämän ikäryhmän ERC-ohje (PDF)</Text>
            </Pressable>
            {error && (
              <Text accessibilityRole="alert">
                Linkin avaaminen epäonnistui. Yritä uudelleen.
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
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    padding: 12,
    paddingBottom: 32,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  chip: {
    backgroundColor: colors.supportingSurface,
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
    color: '#12668A',
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: colors.supportingSurface,
    padding: 4,
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    color: '#12668A',
    textAlign: 'center',
    fontWeight: '600',
  },
  active: { backgroundColor: '#12668A' },
  white: { color: 'white' },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  h2: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  small: { fontSize: 13, lineHeight: 19, color: '#454c55' },
  body: { fontSize: 14, lineHeight: 21, color: colors.textPrimary },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  blue: { backgroundColor: '#EAF6FC' },
  red: { backgroundColor: '#FDECEB', borderColor: '#efb6b0' },
  green: { backgroundColor: '#E6F4EC', borderColor: '#9ccdb0' },
  gold: { backgroundColor: '#f3e9c9', borderColor: '#bc9b38' },
  step: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  flow: { paddingLeft: 16, gap: 12 },
  loop: {
    position: 'absolute',
    left: 0,
    top: 24,
    bottom: 30,
    width: 16,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#12668A',
    borderBottomLeftRadius: 8,
  },
  arrow: {
    position: 'absolute',
    right: 0,
    top: -5,
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#12668A',
    transform: [{ rotate: '45deg' }],
  },
  bar: {
    backgroundColor: '#12668A',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barTitle: { color: 'white', fontSize: 18, fontWeight: '700', flexShrink: 1 },
  flex: { flex: 1 },
  branches: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
  column: { flex: 1, minWidth: 0, gap: 12 },
  branchCard: { padding: 8 },
  action: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  actionLabel: { color: 'white', textAlign: 'center', fontSize: 13 },
  actionValue: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 17,
  },
  energy: { fontSize: 26 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  dose: { backgroundColor: 'white', padding: 8, borderRadius: 8, gap: 4 },
  doseName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  roscLink: {
    marginTop: 'auto',
    backgroundColor: '#E6F4EC',
    borderColor: '#9ccdb0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    minHeight: 88,
    alignItems: 'center',
    gap: 4,
  },
  vent: { flexDirection: 'row', gap: 4 },
  ventCell: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#EAF6FC',
    paddingVertical: 8,
    alignItems: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cause: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
  link: { color: '#12668A', fontSize: 15, fontWeight: '600' },
});
