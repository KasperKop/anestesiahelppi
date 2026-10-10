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
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={ui.page}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Text accessibilityRole="header" style={ui.label}>
              ANESTESIAHELPPI
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Elvytys: avaa ikäryhmittäiset ohjeet"
              onPress={() => router.push('/resuscitation')}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderColor: '#B42318',
                backgroundColor: pressed ? '#FDECEB' : '#FFFFFF',
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 14,
              })}
            >
              <Text
                style={{ color: '#B42318', fontWeight: '700', fontSize: 16 }}
              >
                ♡ Elvytys
              </Text>
            </Pressable>
          </View>
          <View style={{ gap: 12 }}>
            <Text style={[ui.small, { textAlign: 'center' }]}>
              Valitse paino
            </Text>
            <WeightSelector
              onConfirm={(weight) =>
                router.push({ pathname: '/weight-card', params: { weight } })
              }
            />
          </View>
          <ChatPanel />
          <PrototypeNotice />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
