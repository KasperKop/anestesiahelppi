import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemory } from '@/src/memory/context';
import { MemoryAction } from '@/src/memory/model';
import { AnswerCard } from '@/src/chat/AnswerCard';
import { Button, Input, Panel, ui } from '@/src/ui/primitives';
export default function SavedScreen() {
  const { state, ready, busy, error, act, retry } = useMemory();
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [rename, setRename] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [localError, setLocalError] = useState('');
  const stack = state.stacks.find((s) => s.id === selected);
  const cards = state.cards
    .filter((c) => c.stackId === selected)
    .sort((a, b) => a.position - b.position);
  const opened = state.cards.find((c) => c.id === openId);
  async function perform(action: MemoryAction, done?: () => void) {
    setLocalError('');
    try {
      await act(action);
      setConfirm(null);
      done?.();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Muutos epäonnistui.');
    }
  }
  const disabled = busy || !ready;
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
          <Text style={ui.label}>OMA TIETOPANKKI</Text>
          <Text accessibilityRole="header" style={ui.heading}>
            Omat pinot
          </Text>
          <Text style={ui.small}>
            Tallennetut vastaukset tällä laitteella.{' '}
            {Platform.OS === 'web'
              ? 'Selaintietojen poistaminen poistaa myös kortit.'
              : 'Sovelluksen poistaminen poistaa myös paikalliset kortit.'}
          </Text>
          {!!(localError || error) && (
            <Text accessibilityRole="alert" style={ui.body}>
              {localError || error}
            </Text>
          )}
          {!ready && (
            <Button
              label={
                error
                  ? 'Yritä avata tietopankki uudelleen'
                  : 'Avataan tietopankkia…'
              }
              disabled={!error}
              onPress={retry}
            />
          )}
          {opened ? (
            <Panel>
              <Button
                label="← Takaisin kortteihin"
                onPress={() => {
                  setOpenId(null);
                  setConfirm(null);
                }}
              />
              <Text style={ui.small}>KYSYMYS</Text>
              <Text style={ui.body}>{opened.answer.question}</Text>
              <AnswerCard answer={opened.answer} />
              <Text style={ui.small}>
                Tallennettu {new Date(opened.savedAt).toLocaleString('fi-FI')}
              </Text>
              <Text style={ui.title}>Siirrä pinoon</Text>
              <View style={ui.row}>
                <Button
                  label="Järjestämättömät"
                  disabled={disabled || opened.stackId === null}
                  onPress={() => {
                    void perform(
                      { type: 'move', id: opened.id, stackId: null },
                      () => setSelected(null),
                    );
                  }}
                />
                {state.stacks.map((s) => (
                  <Button
                    key={s.id}
                    label={s.name}
                    disabled={disabled || opened.stackId === s.id}
                    onPress={() => {
                      void perform(
                        { type: 'move', id: opened.id, stackId: s.id },
                        () => setSelected(s.id),
                      );
                    }}
                  />
                ))}
              </View>
              {state.stacks.length === 0 && (
                <Text style={ui.small}>
                  Palaa kortteihin ja luo ensin oma pino.
                </Text>
              )}
              {confirm === opened.id ? (
                <View style={{ gap: 12 }}>
                  <Text style={ui.body}>Poistetaanko tallennettu kortti?</Text>
                  <View style={ui.row}>
                    <Button
                      label="Poista kortti pysyvästi"
                      disabled={disabled}
                      onPress={() => {
                        void perform({ type: 'remove', id: opened.id }, () =>
                          setOpenId(null),
                        );
                      }}
                    />
                    <Button label="Peruuta" onPress={() => setConfirm(null)} />
                  </View>
                </View>
              ) : (
                <Button
                  label="Poista kortti"
                  disabled={disabled}
                  onPress={() => setConfirm(opened.id)}
                />
              )}
            </Panel>
          ) : (
            <>
              <View style={ui.row}>
                <Button
                  label={`Järjestämättömät (${state.cards.filter((c) => c.stackId === null).length})`}
                  primary={selected === null}
                  onPress={() => {
                    setSelected(null);
                    setRenaming(false);
                    setConfirm(null);
                  }}
                />
                {state.stacks.map((s) => (
                  <Button
                    key={s.id}
                    label={`${s.name} (${state.cards.filter((c) => c.stackId === s.id).length})`}
                    primary={selected === s.id}
                    onPress={() => {
                      setSelected(s.id);
                      setRenaming(false);
                      setConfirm(null);
                    }}
                  />
                ))}
              </View>
              <Panel>
                <Text style={ui.title}>Uusi pino</Text>
                <Input label="Pinon nimi" value={name} onChangeText={setName} />
                <Button
                  label="Luo pino +"
                  disabled={disabled || !name.trim()}
                  onPress={() => {
                    void perform({ type: 'createStack', name }, () =>
                      setName(''),
                    );
                  }}
                />
              </Panel>
              <View style={ui.row}>
                <Text style={ui.title}>
                  {stack?.name ?? 'Järjestämättömät'}
                </Text>
                <Text style={ui.small}>{cards.length} korttia</Text>
              </View>
              {stack && (
                <Panel>
                  {renaming ? (
                    <>
                      <Input
                        label="Pinon uusi nimi"
                        value={rename}
                        onChangeText={setRename}
                      />
                      <View style={ui.row}>
                        <Button
                          label="Tallenna nimi"
                          disabled={disabled}
                          onPress={() => {
                            void perform(
                              {
                                type: 'renameStack',
                                id: stack.id,
                                name: rename,
                              },
                              () => setRenaming(false),
                            );
                          }}
                        />
                        <Button
                          label="Peruuta nimeäminen"
                          onPress={() => setRenaming(false)}
                        />
                      </View>
                    </>
                  ) : (
                    <Button
                      label="Nimeä pino uudelleen"
                      disabled={disabled}
                      onPress={() => {
                        setRename(stack.name);
                        setRenaming(true);
                      }}
                    />
                  )}
                  {confirm === stack.id ? (
                    <>
                      <Text style={ui.body}>
                        Poistetaanko pino? Kortit siirtyvät Järjestämättömiin.
                      </Text>
                      <View style={ui.row}>
                        <Button
                          label="Poista pino ja säilytä kortit"
                          disabled={disabled}
                          onPress={() => {
                            void perform(
                              { type: 'deleteStack', id: stack.id },
                              () => setSelected(null),
                            );
                          }}
                        />
                        <Button
                          label="Peruuta poisto"
                          onPress={() => setConfirm(null)}
                        />
                      </View>
                    </>
                  ) : (
                    <Button
                      label="Poista pino"
                      disabled={disabled}
                      onPress={() => setConfirm(stack.id)}
                    />
                  )}
                </Panel>
              )}
              {cards.length === 0 && (
                <Panel>
                  <Text style={ui.title}>Tilaa tärkeille vastauksille</Text>
                  <Text style={ui.body}>
                    Tallenna etusivun chat-vastaus sydämellä. Avaa kortti
                    siirtääksesi sen omaan pinoon.
                  </Text>
                </Panel>
              )}
              {cards.map((card, index) => (
                <Panel key={card.id}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Avaa kortti: ${card.answer.title}`}
                    onPress={() => {
                      setOpenId(card.id);
                      setConfirm(null);
                    }}
                    style={{ gap: 8, minHeight: 80 }}
                  >
                    <Text style={ui.small}>
                      {card.answer.mode === 'demo'
                        ? 'VALMIS ESIMERKKI'
                        : 'AI-TIIVISTELMÄ'}
                    </Text>
                    <Text style={ui.title}>{card.answer.title}</Text>
                    <Text numberOfLines={2} style={ui.small}>
                      {card.answer.question}
                    </Text>
                    <Text numberOfLines={3} style={ui.body}>
                      {card.answer.body}
                    </Text>
                    <Text style={ui.small}>Avaa vastaus ja järjestä →</Text>
                  </Pressable>
                  <View style={ui.row}>
                    <Button
                      label="Siirrä ylemmäs ↑"
                      disabled={disabled || index === 0}
                      onPress={() => {
                        void perform({
                          type: 'reorder',
                          id: card.id,
                          direction: -1,
                        });
                      }}
                    />
                    <Button
                      label="Siirrä alemmas ↓"
                      disabled={disabled || index === cards.length - 1}
                      onPress={() => {
                        void perform({
                          type: 'reorder',
                          id: card.id,
                          direction: 1,
                        });
                      }}
                    />
                  </View>
                </Panel>
              ))}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
