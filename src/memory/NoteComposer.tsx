import { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { newId } from '../chat/types';
import { Button, ui } from '../ui/primitives';
import { useMemory } from './context';

export function NoteComposer() {
  const memory = useMemory();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const id = useRef(newId());
  const locked = useRef(false);
  async function save() {
    if (locked.current || saved || !text.trim()) return;
    locked.current = true;
    setSaving(true);
    setError('');
    try {
      await memory.act({ type: 'saveNote', id: id.current, text });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tallennus epäonnistui.');
    } finally {
      locked.current = false;
      setSaving(false);
    }
  }
  return (
    <View style={{ gap: 16 }}>
      <Text style={ui.small}>
        Kirjoita oma muistilista tai huomio. Teksti tallennetaan vain tälle
        laitteelle, eikä sitä lähetetä tekoälylle. Älä kirjaa potilastietoja.
      </Text>
      <TextInput
        accessibilityLabel="Oma muistiinpano"
        placeholder="Kirjoita muistiinpano…"
        placeholderTextColor="#6B7280"
        multiline
        maxLength={10000}
        value={text}
        editable={!saving && !saved}
        onChangeText={setText}
        style={[ui.input, { minHeight: 200, textAlignVertical: 'top' }]}
      />
      {!!(error || memory.error) && (
        <Text accessibilityRole="alert" style={ui.body}>
          {error || memory.error}
        </Text>
      )}
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
      {saved ? (
        <>
          <Text accessibilityLiveRegion="polite" style={ui.small}>
            Muistiinpano löytyy Omat pinot -välilehdeltä.
          </Text>
          <Button
            label="Luo uusi muistiinpano"
            onPress={() => {
              id.current = newId();
              setText('');
              setSaved(false);
              setError('');
            }}
          />
        </>
      ) : (
        <Text style={ui.small}>
          Tallennetaan Omat muistiinpanot -pinoon. Tallenna ennen sivun
          sulkemista.
        </Text>
      )}
    </View>
  );
}
