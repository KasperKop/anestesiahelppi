import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
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
          <Text accessibilityRole="header" style={ui.label}>
            ANESTESIAHELPPI
          </Text>
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
