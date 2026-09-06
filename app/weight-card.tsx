import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrototypeNotice } from '@/src/components/PrototypeNotice';
import { MAX_WEIGHT, MIN_WEIGHT } from '@/src/components/WeightSelector';
import { colors, radii, spacing } from '@/src/theme/tokens';

export default function WeightCardScreen() {
  const params = useLocalSearchParams<{ weight?: string }>();
  const parsedWeight = Number(params.weight);
  const weight =
    Number.isFinite(parsedWeight) &&
    parsedWeight >= MIN_WEIGHT &&
    parsedWeight <= MAX_WEIGHT
      ? Math.round(parsedWeight)
      : MIN_WEIGHT;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable
          accessibilityLabel="Palaa painon valintaan"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backText}>← Muuta painoa</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>VALITTU PAINO</Text>
          <Text accessibilityRole="header" style={styles.value}>
            {weight}
            <Text style={styles.unit}> kg</Text>
          </Text>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Painokortin sisältö lisätään myöhemmin
          </Text>
          <Text style={styles.body}>
            Tähän näkymään tuodaan vain lähteistettyä ja tarkistettua yleistä
            tietoa. Paino ei yksin tuota lääkeannoksia tai hoito-ohjeita.
          </Text>
        </View>

        <PrototypeNotice />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  container: { flex: 1, gap: spacing.lg, padding: spacing.lg },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  backButtonPressed: { backgroundColor: colors.supportingSurface },
  backText: {
    color: colors.interactivePressed,
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  eyebrow: {
    color: colors.interactivePressed,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
  },
  unit: { fontSize: 18, fontWeight: '600', letterSpacing: 0 },
  divider: { backgroundColor: colors.border, height: 1 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  body: { color: colors.textSecondary, fontSize: 16, lineHeight: 24 },
});
