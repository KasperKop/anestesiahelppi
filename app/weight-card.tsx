import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrototypeNotice } from '@/src/components/PrototypeNotice';
import { weightCards } from '@/src/data/weightCards';
import { colors, radii, spacing } from '@/src/theme/tokens';

type DataRowProps = { label: string; unit?: string; value: string };

function DataRow({ label, unit, value }: DataRowProps) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>
        {value}
        {unit ? <Text style={styles.dataUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

export default function WeightCardScreen() {
  const params = useLocalSearchParams<{ weight?: string }>();
  const requestedWeight = Math.round(Number(params.weight));
  const card = weightCards[requestedWeight] ?? weightCards[4];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navigation}>
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
          <Text style={styles.screenTitle}>Painokortti</Text>
          <View style={styles.navigationSpacer} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>VALITTU PAINO</Text>
          <Text accessibilityRole="header" style={styles.weightValue}>
            {card.weight}
            <Text style={styles.weightUnit}> kg</Text>
          </Text>
          <Text style={styles.heroHint}>
            Yleiset tiedot yhdellä silmäyksellä
          </Text>
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

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>A</Text>
            </View>
            <View>
              <Text style={styles.sectionEyebrow}>VÄLINEET</Text>
              <Text style={styles.sectionTitle}>Ilmatie</Text>
            </View>
          </View>
          <DataRow label="Laryngoskooppi" value={card.laryngoscopeBlade} />
          <DataRow
            label="Intubaatioputki"
            unit="mm"
            value={card.endotrachealTube}
          />
        </View>

        <View style={[styles.sectionCard, styles.ventilationCard]}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.sectionIcon, styles.ventilationIcon]}>
              <Text style={styles.sectionIconText}>V</Text>
            </View>
            <View>
              <Text style={styles.sectionEyebrow}>HENGITYS</Text>
              <Text style={styles.sectionTitle}>Ventilaatio</Text>
            </View>
          </View>
          <DataRow
            label="Hengitystaajuus"
            unit="/min"
            value={card.respiratoryRate}
          />
          <DataRow
            label="Kertahengitystilavuus"
            unit="ml"
            value={card.tidalVolume}
          />
        </View>

        <View style={styles.sourceCard}>
          <Text style={styles.sourceTitle}>Lähdeaineisto</Text>
          <Text style={styles.sourceText}>
            Arvot on siirretty projektin painotaulukon 4 kg -sarakkeesta.
            Sisältö odottaa kliinistä tarkistusta ja lähdeviitteitä.
          </Text>
        </View>

        <PrototypeNotice />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  container: { gap: 14, padding: 20, paddingBottom: spacing.xl },
  navigation: {
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
  screenTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  navigationSpacer: { width: 42 },
  hero: { alignItems: 'center', paddingBottom: 4, paddingTop: 6 },
  eyebrow: {
    color: colors.interactivePressed,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  weightValue: {
    color: colors.textPrimary,
    fontSize: 68,
    fontWeight: '700',
    letterSpacing: -3,
    lineHeight: 78,
  },
  weightUnit: { fontSize: 18, fontWeight: '700', letterSpacing: 0 },
  heroHint: { color: colors.textSecondary, fontSize: 14 },
  quickFacts: {
    backgroundColor: colors.supportingSurface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  quickFact: { alignItems: 'center', flex: 1, gap: 2 },
  quickDivider: { backgroundColor: colors.border, width: 1 },
  quickLabel: {
    color: colors.interactivePressed,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  quickValue: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  quickUnit: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 2,
    padding: 16,
    shadowColor: '#735F43',
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  ventilationCard: { backgroundColor: '#F8FCFE' },
  sectionHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: colors.interactive,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  ventilationIcon: { backgroundColor: colors.interactivePressed },
  sectionIconText: { color: colors.surface, fontSize: 17, fontWeight: '900' },
  sectionEyebrow: {
    color: colors.interactivePressed,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  dataRow: {
    alignItems: 'center',
    backgroundColor: '#F4F7F8',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dataLabel: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  dataValue: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  dataUnit: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  sourceCard: {
    backgroundColor: '#FFF8E8',
    borderColor: '#F0DCAC',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  sourceTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
  sourceText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
});

