import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrototypeNotice } from '@/src/components/PrototypeNotice';
import { WeightSelector } from '@/src/components/WeightSelector';
import { colors, spacing } from '@/src/theme/tokens';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.eyebrow}>
          ANESTESIAHELPPI
        </Text>
        <View style={styles.selectorArea}>
          <Text style={styles.instruction}>Valitse paino</Text>
          <WeightSelector
            onConfirm={(weight) =>
              router.push({ pathname: '/weight-card', params: { weight } })
            }
          />
        </View>
        <PrototypeNotice />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  container: {
    flex: 1,
    gap: spacing.xl,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  eyebrow: {
    color: colors.interactivePressed,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  selectorArea: { flex: 1, gap: spacing.lg, justifyContent: 'center' },
  instruction: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
