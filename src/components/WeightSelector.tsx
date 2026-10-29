import { weightAgeLabel } from '../data/weightAges';
import { WeightRange } from './WeightRange';
import { Icon } from '../ui/Icon';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '@/src/theme/tokens';

export const MIN_WEIGHT = 3;
export const MAX_WEIGHT = 30;
export const DEFAULT_WEIGHT = 15;

type WeightSelectorProps = {
  onConfirm: (weight: number) => void;
};

const clampWeight = (weight: number) =>
  Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, weight));

export function WeightSelector({ onConfirm }: WeightSelectorProps) {
  const [weight, setWeight] = useState(DEFAULT_WEIGHT);

  const changeWeight = (nextWeight: number) => {
    setWeight(clampWeight(Math.round(nextWeight)));
  };

  return (
    <View style={styles.container}>
      <View
        accessible
        accessibilityLabel={`Valittu paino ${weight} kilogrammaa, painoa vastaava ikäarvio ${weightAgeLabel(weight)}`}
      >
        <Text style={styles.value}>
          {weight}
          <Text style={styles.unit}> kg</Text>
        </Text>
        <Text style={styles.age}>{weightAgeLabel(weight)}</Text>
      </View>

      <View>
        <View style={styles.controls}>
          <Pressable
            accessibilityLabel="Vähennä painoa 1 kg"
            accessibilityRole="button"
            disabled={weight === MIN_WEIGHT}
            onPress={() => changeWeight(weight - 1)}
            style={({ pressed }) => [
              styles.stepButton,
              pressed && styles.stepButtonPressed,
              weight === MIN_WEIGHT && styles.disabled,
            ]}
          >
            <Icon
              name="minus"
              color={weight === MIN_WEIGHT ? '#85847E' : '#136489'}
            />
          </Pressable>

          <View style={{ flex: 1, minWidth: 0 }}>
            <WeightRange value={weight} onChange={changeWeight} />
          </View>

          <Pressable
            accessibilityLabel="Lisää painoa 1 kg"
            accessibilityRole="button"
            disabled={weight === MAX_WEIGHT}
            onPress={() => changeWeight(weight + 1)}
            style={({ pressed }) => [
              styles.stepButton,
              pressed && styles.stepButtonPressed,
              weight === MAX_WEIGHT && styles.disabled,
            ]}
          >
            <Icon
              name="plus"
              color={weight === MAX_WEIGHT ? '#85847E' : '#136489'}
            />
          </Pressable>
        </View>
        <View style={styles.limits}>
          <Text style={styles.limit}>3 kg</Text>
          <Text style={styles.limit}>30 kg</Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel="Näytä painokortti"
        accessibilityHint="Avaa valittua painoa vastaavan tietokortin"
        accessibilityRole="button"
        onPress={() => onConfirm(weight)}
        style={({ pressed }) => [
          styles.confirmButton,
          pressed && styles.confirmButtonPressed,
        ]}
      >
        <Text style={styles.confirmText}>Näytä painokortti</Text>
        <Icon name="right" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // The 16 px age line uses the space released by two gaps (16 → 8 px).
  container: { gap: spacing.sm, width: '100%' },
  age: { fontSize: 14, lineHeight: 16, textAlign: 'center', color: '#454B52' },
  value: {
    color: colors.textPrimary,
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -2,
    textAlign: 'center',
  },
  unit: { fontSize: 18, fontWeight: '600', letterSpacing: 0 },
  controls: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  limits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 48 + spacing.sm,
    marginTop: spacing.xs,
  },
  stepButton: {
    alignItems: 'center',
    borderColor: '#136489',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.md,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  stepButtonPressed: { backgroundColor: colors.supportingSurface },
  disabled: { backgroundColor: '#EEECE7', borderColor: '#D1CFC9' },
  stepSymbol: {
    color: colors.interactivePressed,
    fontSize: 26,
    lineHeight: 28,
  },
  limit: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },
  slider: { flex: 1, height: 48 },
  confirmButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.supportingSurface,
    borderColor: '#83B9CC',
    borderWidth: 1,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  confirmButtonPressed: { backgroundColor: '#C5E6F3' },
  confirmText: { color: '#136489', fontSize: 17, fontWeight: '700' },
  arrow: { color: colors.surface, fontSize: 23, lineHeight: 24 },
});
