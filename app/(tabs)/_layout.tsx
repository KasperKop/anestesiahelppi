import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/src/theme/tokens';
export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#136489',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface },
        sceneStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Omat pinot',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>♡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Etusivu',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>⌂</Text>
          ),
        }}
      />
    </Tabs>
  );
}
