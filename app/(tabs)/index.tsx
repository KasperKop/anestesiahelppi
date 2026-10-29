import { useSettings } from '@/src/settings/context';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrototypeNotice } from '@/src/components/PrototypeNotice';
import { WeightSelector } from '@/src/components/WeightSelector';
import { ChatPanel } from '@/src/chat/ChatPanel';
import { ui } from '@/src/ui/primitives';
import { Icon } from '@/src/ui/Icon';
import { useKeyboardVisible } from '@/src/ui/useKeyboardVisible';
export default function HomeScreen() {
  const keyboard = useKeyboardVisible();
  const { weight, setWeight } = useSettings();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            ui.page,
            { padding: 16, gap: 16, paddingBottom: 24 },
          ]}
        >
          <View style={{ gap: 16, display: keyboard ? 'none' : 'flex' }}>
            <Text accessibilityRole="header" style={ui.label}>
              ANESTESIAHELPPI
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {(
                [
                  {
                    title: 'Elvytys',
                    icon: 'activity',
                    path: '/resuscitation',
                  },
                  {
                    title: 'Hätätilanteet',
                    icon: 'alert',
                    path: '/emergencies',
                  },
                ] as const
              ).map((item) => (
                <Pressable
                  key={item.path}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  onPress={() => router.push(item.path)}
                  style={({ pressed }) => ({
                    flex: 1,
                    minWidth: 136,
                    minHeight: 44,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: pressed ? '#8F1C13' : '#B42318',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  })}
                >
                  <Icon name={item.icon} size={20} color="#FFFFFF" />
                  <Text
                    style={{
                      flexShrink: 1,
                      color: '#FFFFFF',
                      fontWeight: '700',
                      fontSize: 14,
                    }}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#454B52',
                  fontSize: 17,
                  fontWeight: '600',
                }}
              >
                Valitse paino
              </Text>
              <WeightSelector
                selectedWeight={weight}
                onWeightChange={setWeight}
                onConfirm={(weight) =>
                  router.push({ pathname: '/weight-card', params: { weight } })
                }
              />
            </View>
          </View>
          <ChatPanel />
          {!keyboard && <PrototypeNotice />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
