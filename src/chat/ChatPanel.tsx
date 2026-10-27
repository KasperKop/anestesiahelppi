import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NoteComposer } from '../memory/NoteComposer';
import { useMemory } from '../memory/context';
import { Button, ui } from '../ui/primitives';
import { ConversationPane, conversationStyles } from './ConversationPane';
import { useChatHeight } from './useChatHeight';
import { AnswerCard } from './AnswerCard';
import { askLive } from './client';
import { Icon } from '../ui/Icon';
import { Answer } from './types';
export function ChatPanel() {
  const height = useChatHeight();
  const panel = useRef<View>(null);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const element = panel.current as unknown as HTMLElement | null;
    if (!element?.contains(document.activeElement)) return;
    const frame = requestAnimationFrame(() =>
      element.scrollIntoView({ block: 'end' }),
    );
    return () => cancelAnimationFrame(frame);
  }, [height]);
  const [request, setRequest] = useState(0);
  const [pending, setPending] = useState('');
  const [failed, setFailed] = useState<{
    question: string;
    error: string;
  } | null>(null);
  const [tab, setTab] = useState<'chat' | 'note'>('chat');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const sending = useRef(false);
  const [error, setError] = useState('');
  const memory = useMemory();
  async function send(value = question, retry = false) {
    const q = value.trim();
    if (!q || sending.current) return;
    sending.current = true;
    setLoading(true);
    setError('');
    setPending(q);
    setFailed(null);
    setRequest((previous) => previous + 1);
    if (!retry) setQuestion('');
    try {
      const answer = await askLive(q);
      setAnswers((previous) => [...previous, answer]);
    } catch (e) {
      setFailed({
        question: q,
        error: e instanceof Error ? e.message : 'Haku epäonnistui.',
      });
    } finally {
      setPending('');
      sending.current = false;
      setLoading(false);
    }
  }
  return (
    <View
      ref={panel}
      testID="chat-panel"
      style={[ui.panel, { padding: 0, gap: 0, overflow: 'hidden' }]}
    >
      <View
        accessibilityRole="tablist"
        style={{ flexDirection: 'row', gap: 8, padding: 12, flexShrink: 0 }}
      >
        {(
          [
            { id: 'chat', label: 'Tutkimushaku', icon: 'search' },
            { id: 'note', label: 'Luo muistiinpano', icon: 'pencil' },
          ] as const
        ).map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: tab === item.id }}
            onPress={() => setTab(item.id)}
            style={[
              ui.button,
              {
                flex: 1,
                paddingHorizontal: 4,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              },
              tab === item.id && ui.primary,
            ]}
          >
            <Icon
              name={item.icon}
              size={20}
              color={tab === item.id ? '#FFFFFF' : '#136489'}
            />
            <Text
              style={[
                ui.buttonText,
                { textAlign: 'center', flexShrink: 1 },
                tab === item.id && { color: '#FFFFFF' },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: '#F3F8FA',
        }}
      >
        <Icon name="lock" size={16} color="#35434A" />
        <Text
          style={{
            flexShrink: 1,
            color: '#35434A',
            fontSize: 13,
            lineHeight: 20,
            fontWeight: '600',
          }}
        >
          Älä kirjoita potilastietoja.
        </Text>
      </View>
      <View
        style={[
          conversationStyles.fill,
          { display: tab === 'note' ? 'flex' : 'none' },
        ]}
      >
        <NoteComposer
          compact={height < 400}
          maxLogHeight={Math.max(100, height - 300)}
        />
      </View>
      <View
        style={[
          conversationStyles.fill,
          { display: tab === 'chat' ? 'flex' : 'none' },
        ]}
      >
        <ConversationPane
          label="chat"
          maxLogHeight={Math.max(100, height - 300)}
          empty={
            !answers.length && !loading && !failed && !error && !memory.error
          }
          request={request}
          revision={answers.length + (failed ? 1 : 0)}
          composer={
            <>
              <Text style={[ui.small, { color: '#45535B', fontWeight: '600' }]}>
                Kysymyksesi
              </Text>
              <TextInput
                accessibilityLabel="Kysymys chatille"
                placeholder="Kirjoita kysymys lähteistä…"
                onFocus={() => {
                  if (Platform.OS === 'web')
                    requestAnimationFrame(() =>
                      (
                        panel.current as unknown as HTMLElement | null
                      )?.scrollIntoView({ block: 'nearest' }),
                    );
                }}
                placeholderTextColor="#6B7280"
                multiline
                maxLength={1000}
                value={question}
                onChangeText={setQuestion}
                style={[
                  ui.input,
                  conversationStyles.input,
                  height < 400 && { maxHeight: 56 },
                ]}
              />
              <Button
                label="Lähetä kysymys"
                icon="send"
                primary
                disabled={loading || !question.trim()}
                onPress={() => {
                  void send();
                }}
              />
            </>
          }
        >
          {answers.map((answer) => {
            const saved = memory.state.cards.some(
              (c) => c.answer.id === answer.id,
            );
            return (
              <View
                key={answer.id}
                style={{
                  gap: 16,
                  borderTopWidth: 1,
                  borderColor: '#C8E8F7',
                  paddingTop: 20,
                }}
              >
                <Text style={ui.label}>SINÄ</Text>
                <Text selectable style={ui.body}>
                  {answer.question}
                </Text>
                <AnswerCard answer={answer} />
                <Button
                  label={saved ? 'Tallennettu' : 'Tallenna vastaus'}
                  icon="heart"
                  disabled={saved || !memory.ready || memory.busy}
                  onPress={() => {
                    void memory
                      .act({ type: 'save', answer })
                      .catch((e: Error) => setError(e.message));
                  }}
                />
              </View>
            );
          })}
          {loading && (
            <View accessibilityLiveRegion="polite" style={{ gap: 12 }}>
              <Text style={ui.label}>SINÄ</Text>
              <Text style={ui.body}>{pending}</Text>
              <View style={ui.row}>
                <ActivityIndicator />
                <Text style={ui.small}>Haetaan vastausta…</Text>
              </View>
            </View>
          )}
          {failed && (
            <View style={{ gap: 12 }}>
              <Text style={ui.label}>SINÄ</Text>
              <Text style={ui.body}>{failed.question}</Text>
              <Text accessibilityRole="alert" style={ui.body}>
                {failed.error}
              </Text>
              <Button
                label="Yritä uudelleen"
                disabled={loading}
                onPress={() => {
                  void send(failed.question, true);
                }}
              />
            </View>
          )}
          {!!(error || memory.error) && (
            <Text accessibilityRole="alert" style={ui.body}>
              {error || memory.error}
            </Text>
          )}
        </ConversationPane>
      </View>
    </View>
  );
}
