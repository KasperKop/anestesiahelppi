import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrototypeNotice } from '@/src/components/PrototypeNotice';
import { colors, radii, spacing } from '@/src/theme/tokens';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headingGroup}>
          <Text accessibilityRole="header" style={styles.eyebrow}>
            ANESTESIAHELPPI
          </Text>
          <Text style={styles.title}>Ensimmäinen sovelluspohja</Text>
          <Text style={styles.lead}>
            Rauhallinen, mobiililähtöinen työtila tuleville checklisteille ja
            omalle muistipankille.
          </Text>
        </View>

        <PrototypeNotice />

        <View accessibilityLabel="Tulevat päätoiminnot" style={styles.card}>
          <Text style={styles.cardTitle}>v0.1-perusta on käynnissä</Text>
          <Text style={styles.cardBody}>
            Painovalitsin, valmistautumisnäkymä ja AI-avustaja lisätään omissa
            testatuissa kehitysvaiheissaan.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  container: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  headingGroup: { gap: spacing.sm },
  eyebrow: {
    color: colors.interactivePressed,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 42,
  },
  lead: { color: colors.textSecondary, fontSize: 18, lineHeight: 27 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  cardTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  cardBody: { color: colors.textSecondary, fontSize: 16, lineHeight: 24 },
});
