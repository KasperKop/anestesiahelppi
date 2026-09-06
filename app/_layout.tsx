import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/src/theme/tokens';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.canvas },
          headerShown: false,
        }}
      />
      <StatusBar style="dark" />
    </>
  );
}

