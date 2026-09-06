import Slider from '@react-native-community/slider';
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
        accessibilityLabel={`Valittu paino ${weight} kilogrammaa`}
      >
        <Text style={styles.value}>
          {weight}
          <Text style={styles.unit}> kg</Text>
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          accessibilityLabel="Vähennä painoa yhdellä kilogrammalla"
          accessibilityRole="button"
          disabled={weight === MIN_WEIGHT}
          onPress={() => changeWeight(weight - 1)}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && styles.stepButtonPressed,
            weight === MIN_WEIGHT && styles.disabled,
          ]}
        >
          <Text style={styles.stepSymbol}>−</Text>
        </Pressable>

        <Text style={styles.limit}>{MIN_WEIGHT}</Text>
        <Slider
          accessibilityLabel="Potilaan paino kilogrammoina"
          accessibilityValue={{
            min: MIN_WEIGHT,
            max: MAX_WEIGHT,
            now: weight,
            text: `${weight} kilogrammaa`,
          }}
          maximumTrackTintColor="#DED9CE"
          maximumValue={MAX_WEIGHT}
          minimumTrackTintColor={colors.interactive}
          minimumValue={MIN_WEIGHT}
          onValueChange={changeWeight}
          step={1}
          style={styles.slider}
          thumbTintColor={colors.interactive}
          value={weight}
        />
        <Text style={styles.limit}>{MAX_WEIGHT}</Text>

        <Pressable
          accessibilityLabel="Lisää painoa yhdellä kilogrammalla"
          accessibilityRole="button"
          disabled={weight === MAX_WEIGHT}
          onPress={() => changeWeight(weight + 1)}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && styles.stepButtonPressed,
            weight === MAX_WEIGHT && styles.disabled,
          ]}
        >
          <Text style={styles.stepSymbol}>+</Text>
        </Pressable>
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
        <Text aria-hidden style={styles.arrow}>
          →
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl, width: '100%' },
  value: {
    color: colors.textPrimary,
    fontSize: 76,
    fontWeight: '700',
    letterSpacing: -3,
    textAlign: 'center',
  },
  unit: { fontSize: 18, fontWeight: '600', letterSpacing: 0 },
  controls: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  stepButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1.5,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  stepButtonPressed: { backgroundColor: colors.supportingSurface },
  disabled: { opacity: 0.35 },
  stepSymbol: {
    color: colors.interactivePressed,
    fontSize: 26,
    lineHeight: 28,
  },
  limit: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  slider: { flex: 1, height: 48 },
  confirmButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.interactive,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  confirmButtonPressed: { backgroundColor: colors.interactivePressed },
  confirmText: { color: colors.surface, fontSize: 17, fontWeight: '700' },
  arrow: { color: colors.surface, fontSize: 23, lineHeight: 24 },
});
