import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SettingsProvider } from '@/src/settings/context';

import { MemoryProvider } from '@/src/memory/context';

import { colors } from '@/src/theme/tokens';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <MemoryProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.canvas },
            headerShown: false,
          }}
        />
        <StatusBar style="dark" />
      </MemoryProvider>
    </SettingsProvider>
  );
}
