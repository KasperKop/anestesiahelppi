import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';
export function Button({
  label,
  onPress,
  disabled = false,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        primary && ui.primary,
        (pressed || disabled) && { opacity: 0.55 },
      ]}
    >
      <Text style={[ui.buttonText, primary && { color: colors.surface }]}>
        {label}
      </Text>
    </Pressable>
  );
}
export function Panel({ children }: PropsWithChildren) {
  return <View style={ui.panel}>{children}</View>;
}
export function Input({
  value,
  onChangeText,
  label,
  maxLength = 60,
}: {
  value: string;
  onChangeText: (v: string) => void;
  label: string;
  maxLength?: number;
}) {
  return (
    <TextInput
      accessibilityLabel={label}
      placeholder={label}
      placeholderTextColor={colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
      maxLength={maxLength}
      style={ui.input}
    />
  );
}
export const ui = StyleSheet.create({
  page: {
    padding: spacing.lg,
    gap: spacing.lg,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingBottom: 36,
  },
  panel: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderColor: colors.border,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  heading: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 16, lineHeight: 24, color: colors.textPrimary },
  small: { fontSize: 13, lineHeight: 20, color: colors.textSecondary },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#136489',
    letterSpacing: 1.2,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    backgroundColor: colors.supportingSurface,
  },
  buttonText: { fontSize: 14, color: '#136489', fontWeight: '600' },
  primary: { backgroundColor: '#136489', borderColor: '#136489' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    minHeight: 48,
    padding: 14,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
});
