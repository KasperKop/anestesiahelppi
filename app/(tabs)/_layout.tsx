import { Tabs } from 'expo-router';
import { Platform, Pressable, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/src/ui/Icon';
import { useKeyboardVisible } from '@/src/ui/useKeyboardVisible';
import { colors } from '@/src/theme/tokens';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardVisible();
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.canvas },
      }}
      tabBar={({ state, navigation }) =>
        keyboard ? null : (
          <View
            accessibilityRole="tablist"
            style={[
              {
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderColor: '#C2D5DC',
                paddingBottom: insets.bottom,
              },
              Platform.OS === 'web' &&
                ({
                  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                } as unknown as ViewStyle),
            ]}
          >
            {state.routes.map((route, index) => {
              const active = state.index === index;
              const home = route.name === 'index';
              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="tab"
                  accessibilityLabel={home ? 'Etusivu' : 'Omat pinot'}
                  accessibilityState={{ selected: active }}
                  {...(Platform.OS === 'web' && active
                    ? { 'aria-current': 'page' as const }
                    : {})}
                  onPress={() => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!active && !event.defaultPrevented)
                      navigation.navigate(route.name);
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    minHeight: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    gap: 4,
                    backgroundColor: pressed ? '#EAF6FC' : '#FFFFFF',
                  })}
                >
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                      borderRadius: 24,
                      backgroundColor: active ? '#D9EFF8' : 'transparent',
                    }}
                  >
                    <Icon
                      name={home ? 'home' : 'heart'}
                      color={active ? '#136489' : '#505B64'}
                      filled={active}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      lineHeight: 20,
                      fontWeight: active ? '700' : '500',
                      color: active ? '#136489' : '#505B64',
                      textAlign: 'center',
                    }}
                  >
                    {home ? 'Etusivu' : 'Omat pinot'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )
      }
    >
      <Tabs.Screen name="saved" options={{ title: 'Omat pinot' }} />
      <Tabs.Screen name="index" options={{ title: 'Etusivu' }} />
    </Tabs>
  );
}
