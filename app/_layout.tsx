import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MemoryProvider } from '@/src/memory/context';

import { colors } from '@/src/theme/tokens';

export default function RootLayout() {
  return (
    <MemoryProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.canvas },
          headerShown: false,
        }}
      />
      <StatusBar style="dark" />
    </MemoryProvider>
  );
}
