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
import { askLive, chatEndpoint } from './client';
import { demoAnswer, examples } from './demo';
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
    mode: 'demo' | 'live';
    error: string;
  } | null>(null);
  const [tab, setTab] = useState<'chat' | 'note'>('chat');
  const [mode, setMode] = useState<'demo' | 'live'>(
    chatEndpoint ? 'live' : 'demo',
  );
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const sending = useRef(false);
  const [error, setError] = useState('');
  const memory = useMemory();
  async function send(value = question, requestMode = mode, retry = false) {
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
      const answer = requestMode === 'demo' ? demoAnswer(q) : await askLive(q);
      setAnswers((previous) => [...previous, answer]);
    } catch (e) {
      setFailed({
        question: q,
        mode: requestMode,
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
      style={[ui.panel, { height, padding: 0, gap: 0, overflow: 'hidden' }]}
    >
      <View
        accessibilityRole="tablist"
        style={{ flexDirection: 'row', gap: 8, padding: 12, flexShrink: 0 }}
      >
        {(
          [
            { id: 'chat', label: 'Kysy lähteistä', icon: '?' },
            { id: 'note', label: 'Luo muistiinpano', icon: '✎' },
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
              { flex: 1, paddingHorizontal: 8, alignItems: 'center', gap: 4 },
              tab === item.id && ui.primary,
            ]}
          >
            <Text
              style={[
                ui.buttonText,
                { textAlign: 'center' },
                tab === item.id && { color: '#FFFFFF' },
              ]}
            >
              {item.icon} {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View
        style={[
          conversationStyles.fill,
          { display: tab === 'note' ? 'flex' : 'none' },
        ]}
      >
        <NoteComposer compact={height < 400} />
      </View>
      <View
        style={[
          conversationStyles.fill,
          { display: tab === 'chat' ? 'flex' : 'none' },
        ]}
      >
        <ConversationPane
          label="chat"
          request={request}
          revision={answers.length + (failed ? 1 : 0)}
          composer={
            <>
              <TextInput
                accessibilityLabel="Kysymys chatille"
                placeholder={
                  mode === 'demo'
                    ? 'Kokeile esimerkkikysymystä…'
                    : 'Kysy yleinen oppimiskysymys…'
                }
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
                label="Lähetä kysymys ↑"
                primary
                disabled={loading || !question.trim()}
                onPress={() => {
                  void send();
                }}
              />
            </>
          }
        >
          <Text style={ui.small}>
            {mode === 'demo'
              ? 'Esittelytila · Kokeile chatia ja sydäntallennusta valmiilla esimerkeillä.'
              : 'Tutkimushakudemo · WikiAnesthesia, PubMed, Europe PMC ja DOAJ. Kysymys käsitellään Groq-palvelussa ja englanninkieliset hakusanat lähetetään lähdepalveluihin. Älä kirjoita potilastietoja.'}
          </Text>
          {!!chatEndpoint && (
            <View style={ui.row}>
              <Button
                label="Tutkimushaku"
                primary={mode === 'live'}
                disabled={loading}
                onPress={() => setMode('live')}
              />
              <Button
                label="Esittelytila"
                primary={mode === 'demo'}
                disabled={loading}
                onPress={() => setMode('demo')}
              />
            </View>
          )}
          {mode === 'demo' &&
            answers.length === 0 &&
            !loading &&
            !failed &&
            examples.map((e) => (
              <Button
                key={e.question}
                label={e.question}
                disabled={loading}
                onPress={() => {
                  void send(e.question);
                }}
              />
            ))}
          {mode === 'live' && answers.length === 0 && (
            <Button
              label="Mitä tutkimuksissa kerrotaan anestesiasyvyyden seurannasta?"
              disabled={loading}
              onPress={() => {
                void send(
                  'Mitä tutkimuksissa kerrotaan anestesiasyvyyden seurannasta?',
                );
              }}
            />
          )}
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
                  label={saved ? '♥ Tallennettu' : '♡ Tallenna vastaus'}
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
                  void send(failed.question, failed.mode, true);
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
