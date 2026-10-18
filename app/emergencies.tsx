import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { emergencyCards } from '@/src/emergencies/cards';
import { colors } from '@/src/theme/tokens';

export const referenceUrl =
  'https://anaesthetists.org/Guidelines-and-publications/Quick-reference-handbook/PDF-version';

export default function EmergenciesScreen() {
  const [index, setIndex] = useState(0);
  const [panel, setPanel] = useState<'list' | 'details' | null>(null);
  const [linkError, setLinkError] = useState(false);
  const { height, width } = useWindowDimensions();
  const [pageWidth, setPageWidth] = useState(Math.min(width, 620) - 28);
  const pager = useRef<ScrollView>(null);
  const selectedIndex = useRef(0);
  const compact = height < 900;
  const card = emergencyCards[index];
  const count = emergencyCards.length;
  useEffect(() => {
    pager.current?.scrollTo({
      x: selectedIndex.current * pageWidth,
      animated: false,
    });
  }, [pageWidth]);
  function select(next: number) {
    const target = Math.max(0, Math.min(count - 1, next));
    selectedIndex.current = target;
    setIndex(target);
    setPanel(null);
    setLinkError(false);
    pager.current?.scrollTo({ x: target * pageWidth, animated: true });
  }
  async function openReference() {
    try {
      await Linking.openURL(referenceUrl);
      setLinkError(false);
    } catch {
      setLinkError(true);
    }
  }
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Takaisin etusivulle"
            onPress={() => router.replace('/')}
            style={s.button}
          >
            <Text style={s.link}>‹ Etusivu</Text>
          </Pressable>
          <Text style={s.brand}>ANESTESIAHELPPI</Text>
        </View>
        <View style={s.toolbar}>
          <Text accessibilityRole="header" style={s.heading}>
            Hätätilannekortit
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Näytä kaikki 12 korttia"
            onPress={() => setPanel('list')}
            style={s.outline}
          >
            <Text style={s.link}>Kaikki {count}</Text>
          </Pressable>
        </View>
        <Text style={s.notice}>
          Oppimisdemo · Ei potilastyöhön. Käytä paikallista ohjetta.
        </Text>
        <ScrollView
          ref={pager}
          testID="emergency-pager"
          horizontal
          pagingEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
          onScroll={(event) => {
            const { contentOffset, layoutMeasurement } = event.nativeEvent;
            if (!layoutMeasurement.width) return;
            const next = Math.max(
              0,
              Math.min(
                count - 1,
                Math.round(contentOffset.x / layoutMeasurement.width),
              ),
            );
            selectedIndex.current = next;
            setIndex(next);
          }}
          style={s.scroll}
        >
          {emergencyCards.map((pageCard, pageIndex) => (
            <ScrollView
              key={pageCard.id}
              style={{ width: pageWidth }}
              contentContainerStyle={s.scrollContent}
              nestedScrollEnabled
              directionalLockEnabled
              aria-hidden={pageIndex !== index}
              accessibilityElementsHidden={pageIndex !== index}
              importantForAccessibility={
                pageIndex === index ? 'auto' : 'no-hide-descendants'
              }
            >
              <View
                testID={pageIndex === index ? 'emergency-card' : undefined}
                style={[s.card, compact && s.compactCard]}
              >
                <View style={s.meta}>
                  <Text style={s.caption}>
                    TOIMINTAKORTTI {String(pageIndex + 1).padStart(2, '0')} /{' '}
                    {count}
                  </Text>
                  <Text style={s.badge}>DEMO</Text>
                </View>
                <Text
                  accessibilityRole="header"
                  accessibilityLiveRegion="polite"
                  style={[s.title, compact && s.compactTitle]}
                >
                  {pageCard.title}
                </Text>
                <Text style={[s.subtitle, compact && s.compactSubtitle]}>
                  {pageCard.subtitle}
                </Text>
                <View style={[s.steps, compact && s.compactSteps]}>
                  {pageCard.steps.map((step, stepIndex) => (
                    <View
                      key={step.title}
                      style={[
                        s.step,
                        stepIndex === 0 && s.alert,
                        compact && s.compactStep,
                      ]}
                    >
                      <View
                        style={[s.number, stepIndex === 0 && s.alertNumber]}
                      >
                        <Text
                          style={[s.numberText, stepIndex === 0 && s.alertText]}
                        >
                          {stepIndex + 1}
                        </Text>
                      </View>
                      <View style={s.stepCopy}>
                        <Text style={s.stepTitle}>{step.title}</Text>
                        <Text style={s.stepText}>{step.text}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Lisätiedot ja lähteet: ${pageCard.title}`}
                  onPress={() => {
                    setLinkError(false);
                    setPanel('details');
                  }}
                  style={s.detailsButton}
                >
                  <Text style={s.link}>Lisätiedot ja lähteet ↗</Text>
                </Pressable>
              </View>
            </ScrollView>
          ))}
        </ScrollView>
        <View style={s.navigation}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edellinen kortti"
            accessibilityState={{ disabled: index === 0 }}
            disabled={index === 0}
            onPress={() => select(index - 1)}
            style={[s.arrow, index === 0 && s.disabled]}
          >
            <Text style={s.link}>‹ Edellinen</Text>
          </Pressable>
          <Text style={s.position}>
            {index + 1} / {count}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Seuraava kortti"
            accessibilityState={{ disabled: index === count - 1 }}
            disabled={index === count - 1}
            onPress={() => select(index + 1)}
            style={[s.arrow, index === count - 1 && s.disabled]}
          >
            <Text style={s.link}>Seuraava ›</Text>
          </Pressable>
        </View>
        <Text style={s.hint}>Pyyhkäise korttia tai käytä nuolia</Text>
      </View>
      <Modal
        visible={panel !== null}
        animationType="slide"
        onRequestClose={() => setPanel(null)}
      >
        <SafeAreaView style={s.safe}>
          <View style={s.container}>
            <View style={s.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Takaisin korttiin"
                onPress={() => setPanel(null)}
                style={s.button}
              >
                <Text style={s.link}>‹ Takaisin korttiin</Text>
              </Pressable>
            </View>
            <ScrollView
              key={`${panel}-${card.id}`}
              contentContainerStyle={s.panelContent}
            >
              {panel === 'list' ? (
                <>
                  <Text accessibilityRole="header" style={s.title}>
                    Kaikki kortit
                  </Text>
                  <Text style={s.subtitle}>Valitse tilanne suoraan.</Text>
                  {emergencyCards.map((item, itemIndex) => (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${itemIndex + 1}. ${item.title}`}
                      accessibilityState={{ selected: itemIndex === index }}
                      onPress={() => select(itemIndex)}
                      style={[s.listItem, itemIndex === index && s.selected]}
                    >
                      <Text style={s.numberText}>
                        {String(itemIndex + 1).padStart(2, '0')}
                      </Text>
                      <View style={s.stepCopy}>
                        <Text style={s.stepTitle}>{item.title}</Text>
                        <Text style={s.caption}>{item.subtitle}</Text>
                      </View>
                      <Text style={s.link}>›</Text>
                    </Pressable>
                  ))}
                </>
              ) : panel === 'details' ? (
                <>
                  <Text style={s.caption}>
                    LISÄTIEDOT · KORTTI {card.sourceNumber}
                  </Text>
                  <Text accessibilityRole="header" style={s.title}>
                    {card.title}
                  </Text>
                  <Text style={s.notice}>
                    Oppimistiivistelmä, ei täydellinen hoito-ohje. Ei validoitu
                    potilastyöhön. Akuutissa tilanteessa kutsu apua ja toimi
                    paikallisen protokollan mukaan.
                  </Text>
                  {card.details.map((detail) => (
                    <View key={detail.title} style={s.detailSection}>
                      <Text accessibilityRole="header" style={s.stepTitle}>
                        {detail.title}
                      </Text>
                      <Text style={s.body}>{detail.text}</Text>
                    </View>
                  ))}
                  <View style={s.detailSection}>
                    <Pressable
                      accessibilityRole="link"
                      onPress={openReference}
                      style={s.detailsButton}
                    >
                      <Text style={s.link}>
                        Association of Anaesthetists: QRH ↗
                      </Text>
                    </Pressable>
                    {linkError && (
                      <Text accessibilityRole="alert" style={s.error}>
                        Lähde ei avautunut. Tarkista verkkoyhteys ja yritä
                        uudelleen.
                      </Text>
                    )}
                  </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  button: { minHeight: 44, justifyContent: 'center', paddingRight: 12 },
  brand: {
    fontSize: 12,
    letterSpacing: 1.3,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  heading: { fontSize: 21, color: colors.textPrimary, fontWeight: '700' },
  outline: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  link: { fontSize: 15, color: '#126A90', fontWeight: '700' },
  notice: { fontSize: 12, lineHeight: 17, color: '#8B332A', marginBottom: 8 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    flexGrow: 1,
  },
  compactCard: { padding: 12 },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  caption: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B332A',
    backgroundColor: '#FFF0ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
  },
  compactTitle: { fontSize: 22, lineHeight: 26, marginTop: 4 },
  compactSubtitle: { marginTop: 2, marginBottom: 6 },
  subtitle: {
    fontSize: 14,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  steps: { gap: 9, flexGrow: 1, justifyContent: 'center' },
  compactSteps: { gap: 4 },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 9,
    backgroundColor: '#F1F8FC',
    borderRadius: 14,
  },
  compactStep: { paddingVertical: 5, paddingHorizontal: 7 },
  alert: { backgroundColor: '#FFF0ED' },
  number: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: '#DCEFF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertNumber: { backgroundColor: '#FAD5D0' },
  numberText: { fontSize: 14, color: '#126A90', fontWeight: '800' },
  alertText: { color: '#A62A20' },
  stepCopy: { flex: 1 },
  stepTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepText: { fontSize: 14, lineHeight: 19, color: '#424B56' },
  detailsButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.supportingSurface,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    gap: 4,
  },
  arrow: { minHeight: 44, paddingHorizontal: 8, justifyContent: 'center' },
  disabled: { opacity: 0.35 },
  position: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  panelContent: { paddingBottom: 24, gap: 12 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.supportingSurface,
    borderColor: '#126A90',
  },
  detailSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  body: { fontSize: 16, lineHeight: 24, color: colors.textPrimary },
  error: { color: '#B42318', fontSize: 14 },
});
