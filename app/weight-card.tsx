import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { weightCards } from '@/src/data/weightCards';
import { colors, radii } from '@/src/theme/tokens';

type DataRowProps = {
  compact?: boolean;
  inverted?: boolean;
  label: string;
  unit?: string;
  value: string;
};

const medicineRows = Array.from(
  { length: 7 },
  (_, index) => `Lääke ${index + 1}`,
);
const emergencyRows = Array.from(
  { length: 6 },
  (_, index) => `Hätälääke ${index + 1}`,
);

function DataRow({ compact, inverted, label, unit, value }: DataRowProps) {
  return (
    <View
      style={[
        styles.dataRow,
        compact && styles.compactDataRow,
        inverted && styles.invertedDataRow,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[styles.dataLabel, inverted && styles.invertedText]}
      >
        {label}
      </Text>
      <Text style={[styles.dataValue, inverted && styles.invertedText]}>
        {value}
        {unit ? <Text style={styles.dataUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

function EmptyRow({ inverted, label }: { inverted?: boolean; label: string }) {
  return (
    <View style={[styles.emptyRow, inverted && styles.invertedEmptyRow]}>
      <Text style={[styles.emptyLabel, inverted && styles.invertedMutedText]}>
        {label}
      </Text>
      <Text style={[styles.emptyValue, inverted && styles.invertedMutedText]}>
        —
      </Text>
    </View>
  );
}

export default function WeightCardScreen() {
  const params = useLocalSearchParams<{ weight?: string }>();
  const requestedWeight = Math.round(Number(params.weight));
  const card = weightCards[requestedWeight];

  if (!card) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.missingContainer}>
          <Text style={styles.missingWeight}>{requestedWeight || 3} kg</Text>
          <Text style={styles.missingTitle}>Lähdetiedot puuttuvat</Text>
          <Text style={styles.missingText}>
            Painotaulukossa on tällä hetkellä tiedot vain painoille 3–10 kg.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.missingButton}
          >
            <Text style={styles.missingButtonText}>Palaa painon valintaan</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroRow}>
          <Pressable
            accessibilityLabel="Palaa painon valintaan"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <View style={styles.hero}>
            <Text accessibilityRole="header" style={styles.weightValue}>
              {card.weight}
              <Text style={styles.weightUnit}> kg</Text>
            </Text>
            <Text style={styles.eyebrow}>VALITTU PAINO</Text>
          </View>
          <View style={styles.heroSpacer} />
        </View>

        <View style={styles.quickFacts}>
          <View style={styles.quickFact}>
            <Text style={styles.quickLabel}>SYKE</Text>
            <Text style={styles.quickValue}>{card.heartRate}</Text>
            <Text style={styles.quickUnit}>/min</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickFact}>
            <Text style={styles.quickLabel}>RR SYS</Text>
            <Text style={styles.quickValue}>{card.systolicBloodPressure}</Text>
            <Text style={styles.quickUnit}>mmHg</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickFact}>
            <Text style={styles.quickLabel}>VERIVOLYYMI</Text>
            <Text style={styles.quickValue}>{card.bloodVolume}</Text>
            <Text style={styles.quickUnit}>ml</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.column}>
            <View style={[styles.sectionCard, styles.clinicalCard]}>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionIcon}>
                  <Text style={styles.sectionIconText}>A</Text>
                </View>
                <View style={styles.headingCopy}>
                  <Text style={styles.sectionEyebrow}>VÄLINEET</Text>
                  <Text style={styles.sectionTitle}>Ilmatie</Text>
                </View>
              </View>
              <DataRow
                compact
                label="Laryngoskooppi"
                value={card.laryngoscopeBlade}
              />
              <DataRow
                compact
                label="Intubaatioputki"
                unit="mm"
                value={card.endotrachealTube}
              />
            </View>

            <View style={[styles.sectionCard, styles.placeholderCard]}>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionIcon}>
                  <Text style={styles.sectionIconText}>Rx</Text>
                </View>
                <View style={styles.headingCopy}>
                  <Text style={styles.sectionEyebrow}>ANESTESIA</Text>
                  <Text style={styles.sectionTitle}>Lääkitys</Text>
                </View>
              </View>
              {medicineRows.map((label) => (
                <EmptyRow key={label} label={label} />
              ))}
              <Text style={styles.pendingText}>Täydennetään myöhemmin</Text>
            </View>
          </View>

          <View style={styles.column}>
            <View style={[styles.sectionCard, styles.clinicalCard]}>
              <View style={styles.sectionHeadingRow}>
                <View style={[styles.sectionIcon, styles.ventilationIcon]}>
                  <Text style={styles.sectionIconText}>V</Text>
                </View>
                <View style={styles.headingCopy}>
                  <Text style={styles.sectionEyebrow}>HENGITYS</Text>
                  <Text style={styles.sectionTitle}>Ventilaatio</Text>
                </View>
              </View>
              <DataRow
                compact
                label="Hengitystaajuus"
                unit="/min"
                value={card.respiratoryRate}
              />
              <DataRow
                compact
                label="Kertahengitystilavuus"
                unit="ml"
                value={card.tidalVolume}
              />
            </View>

            <View style={[styles.sectionCard, styles.emergencyCard]}>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.emergencyIcon}>
                  <Text style={styles.emergencyIconText}>!</Text>
                </View>
                <View style={styles.headingCopy}>
                  <Text style={styles.emergencyEyebrow}>HÄTÄTILANNE</Text>
                  <Text style={styles.emergencyTitle}>Lääkitys</Text>
                </View>
              </View>
              {emergencyRows.map((label) => (
                <EmptyRow inverted key={label} label={label} />
              ))}
              <Text style={styles.emergencyPending}>
                Täydennetään myöhemmin
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.prototypeText}>
          PORTFOLIOPROTOTYYPPI · EI KLIINISEEN KÄYTTÖÖN
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  container: { gap: 12, padding: 16, paddingBottom: 22 },
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  backButtonPressed: { backgroundColor: colors.supportingSurface },
  backIcon: {
    color: colors.interactivePressed,
    fontSize: 32,
    lineHeight: 34,
    marginTop: -2,
  },
  hero: { alignItems: 'center' },
  heroSpacer: { width: 42 },
  weightValue: {
    color: colors.textPrimary,
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -3,
    lineHeight: 60,
  },
  weightUnit: { fontSize: 16, fontWeight: '800', letterSpacing: 0 },
  eyebrow: {
    color: colors.interactivePressed,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  quickFacts: {
    backgroundColor: colors.supportingSurface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  quickFact: { alignItems: 'center', flex: 1, gap: 1 },
  quickDivider: { backgroundColor: colors.border, width: 1 },
  quickLabel: {
    color: colors.interactivePressed,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  quickValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '900' },
  quickUnit: { color: colors.textSecondary, fontSize: 10, fontWeight: '700' },
  grid: { flexDirection: 'row', gap: 10 },
  column: { flex: 1, gap: 10 },
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 12,
  },
  clinicalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    minHeight: 186,
  },
  placeholderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    minHeight: 334,
  },
  emergencyCard: {
    backgroundColor: colors.critical,
    borderColor: colors.critical,
    minHeight: 334,
  },
  sectionHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    marginBottom: 8,
  },
  headingCopy: { flex: 1 },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: colors.interactive,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  ventilationIcon: { backgroundColor: colors.interactivePressed },
  sectionIconText: { color: colors.surface, fontSize: 14, fontWeight: '900' },
  sectionEyebrow: {
    color: colors.interactivePressed,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '900' },
  emergencyIcon: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  emergencyIconText: {
    color: colors.critical,
    fontSize: 22,
    fontWeight: '900',
  },
  emergencyEyebrow: {
    color: colors.surface,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  emergencyTitle: { color: colors.surface, fontSize: 17, fontWeight: '900' },
  dataRow: {
    alignItems: 'center',
    backgroundColor: '#F3F6F7',
    borderRadius: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
    paddingHorizontal: 7,
  },
  compactDataRow: { minHeight: 48 },
  invertedDataRow: { backgroundColor: 'rgba(255,255,255,0.13)' },
  dataLabel: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
  },
  dataValue: { color: colors.textPrimary, fontSize: 15, fontWeight: '900' },
  dataUnit: { color: colors.textSecondary, fontSize: 9, fontWeight: '700' },
  invertedText: { color: colors.surface },
  emptyRow: {
    alignItems: 'center',
    borderBottomColor: '#E6EBED',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 34,
    paddingHorizontal: 4,
  },
  invertedEmptyRow: { borderBottomColor: 'rgba(255,255,255,0.2)' },
  emptyLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '600' },
  emptyValue: { color: colors.textSecondary, fontSize: 13 },
  invertedMutedText: { color: 'rgba(255,255,255,0.75)' },
  pendingText: {
    color: colors.interactivePressed,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  emergencyPending: {
    color: colors.surface,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
  prototypeText: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    textAlign: 'center',
  },
  missingContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 28,
  },
  missingWeight: {
    color: colors.interactivePressed,
    fontSize: 20,
    fontWeight: '900',
  },
  missingTitle: { color: colors.textPrimary, fontSize: 26, fontWeight: '900' },
  missingText: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  missingButton: {
    backgroundColor: colors.interactive,
    borderRadius: radii.pill,
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 15,
  },
  missingButtonText: { color: colors.surface, fontSize: 15, fontWeight: '800' },
});
