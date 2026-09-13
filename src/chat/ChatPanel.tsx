import { useRef, useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { useMemory } from '../memory/context';
import { Button, Panel, ui } from '../ui/primitives';
import { AnswerCard } from './AnswerCard';
import { askLive, chatEndpoint } from './client';
import { demoAnswer, examples } from './demo';
import { Answer } from './types';
export function ChatPanel() {
  const [mode, setMode] = useState<'demo' | 'live'>(
    chatEndpoint ? 'live' : 'demo',
  );
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const sending = useRef(false);
  const [error, setError] = useState('');
  const memory = useMemory();
  async function send(value = question) {
    const q = value.trim();
    if (!q || sending.current) return;
    sending.current = true;
    setLoading(true);
    setError('');
    try {
      const answer = mode === 'demo' ? demoAnswer(q) : await askLive(q);
      setAnswers((previous) => [...previous, answer]);
      setQuestion('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Haku epäonnistui.');
    } finally {
      sending.current = false;
      setLoading(false);
    }
  }
  return (
    <Panel>
      <Text accessibilityRole="header" style={ui.title}>
        Kysy lähteistä
      </Text>
      <Text style={ui.small}>
        {mode === 'demo'
          ? 'Esittelytila · Kokeile chatia ja sydäntallennusta valmiilla esimerkeillä.'
          : 'Lähdehaku · Yleisiä oppimiskysymyksiä. Älä kirjoita potilastietoja.'}
      </Text>
      {!!chatEndpoint && (
        <View style={ui.row}>
          <Button
            label="Lähdehaku"
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
      {answers.map((answer) => {
        const saved = memory.state.cards.some((c) => c.answer.id === answer.id);
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
        <View accessibilityLiveRegion="polite" style={ui.row}>
          <ActivityIndicator />
          <Text style={ui.small}>Haetaan vastausta…</Text>
        </View>
      )}
      {!!(error || memory.error) && (
        <Text accessibilityRole="alert" style={ui.body}>
          {error || memory.error}
        </Text>
      )}
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
        editable={!loading}
        style={[ui.input, { minHeight: 84, textAlignVertical: 'top' }]}
      />
      <Button
        label="Lähetä kysymys ↑"
        primary
        disabled={loading || !question.trim()}
        onPress={() => {
          void send();
        }}
      />
    </Panel>
  );
}
