import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '@/src/theme/tokens';

export function PrototypeNotice() {
  return (
    <View accessibilityRole="summary" style={styles.container}>
      <Text style={styles.title}>Portfolio-prototyyppi</Text>
      <Text style={styles.body}>
        Ei kliiniseen käyttöön. Sisältö on tässä vaiheessa vain käyttöliittymän
        testaamista varten.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.supportingSurface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
