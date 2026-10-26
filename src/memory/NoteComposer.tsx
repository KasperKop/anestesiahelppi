import { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { newId } from '../chat/types';
import { Button, ui } from '../ui/primitives';
import { useMemory } from './context';
import { ConversationPane, conversationStyles } from '../chat/ConversationPane';

export function NoteComposer({ compact = false }: { compact?: boolean }) {
  const memory = useMemory();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const id = useRef(newId());
  const locked = useRef(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  async function save() {
    if (locked.current || saved || !text.trim()) return;
    locked.current = true;
    setSaving(true);
    setError('');
    try {
      await memory.act({ type: 'saveNote', id: id.current, text });
      setSaved(true);
      setSavedIds((previous) => [...previous, id.current]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tallennus epäonnistui.');
    } finally {
      locked.current = false;
      setSaving(false);
    }
  }
  return (
    <ConversationPane
      label="notes"
      revision={savedIds.length}
      request={savedIds.length}
      composer={
        <>
          <TextInput
            accessibilityLabel="Oma muistiinpano"
            placeholder="Kirjoita muistiinpano…"
            placeholderTextColor="#6B7280"
            multiline
            maxLength={10000}
            value={text}
            editable={!saving && !saved}
            onChangeText={setText}
            style={[
              ui.input,
              conversationStyles.input,
              compact && { maxHeight: 56 },
              saved && { display: 'none' },
            ]}
          />
          <Button
            label={saved ? '♥ Tallennettu' : '♡ Tallenna muistiinpano'}
            primary={!saved}
            disabled={
              saved || saving || !text.trim() || !memory.ready || memory.busy
            }
            onPress={() => {
              void save();
            }}
          />
          {saved && (
            <Button
              label="Luo uusi muistiinpano"
              onPress={() => {
                id.current = newId();
                setText('');
                setSaved(false);
                setError('');
              }}
            />
          )}
        </>
      }
    >
      <Text style={ui.small}>
        Kirjoita oma muistilista tai huomio. Teksti tallennetaan vain tälle
        laitteelle, eikä sitä lähetetä tekoälylle. Älä kirjaa potilastietoja.
      </Text>
      {memory.state.cards
        .filter((card) => savedIds.includes(card.answer.id))
        .map((card) => (
          <View
            key={card.id}
            style={{
              gap: 8,
              borderTopWidth: 1,
              borderColor: '#C8E8F7',
              paddingTop: 16,
            }}
          >
            <Text style={ui.label}>OMA MUISTIINPANO</Text>
            <Text selectable style={ui.body}>
              {card.answer.body}
            </Text>
            <Text style={ui.small}>
              ♥ Tallennettu · {new Date(card.savedAt).toLocaleString('fi-FI')}
            </Text>
          </View>
        ))}
      {!!(error || memory.error) && (
        <Text accessibilityRole="alert" style={ui.body}>
          {error || memory.error}
        </Text>
      )}
      {saved ? (
        <Text accessibilityLiveRegion="polite" style={ui.small}>
          Muistiinpano löytyy Omat pinot -välilehdeltä.
        </Text>
      ) : (
        <Text style={ui.small}>
          Tallennetaan Omat muistiinpanot -pinoon. Tallenna ennen sivun
          sulkemista.
        </Text>
      )}
    </ConversationPane>
  );
}
