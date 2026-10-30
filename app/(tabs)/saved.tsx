import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemory } from '@/src/memory/context';
import { MemoryAction } from '@/src/memory/model';
import { AnswerCard } from '@/src/chat/AnswerCard';
import { Button, Input, Panel, ui } from '@/src/ui/primitives';
import { Icon } from '@/src/ui/Icon';
export default function SavedScreen() {
  const { state, ready, busy, error, act, retry } = useMemory();
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [rename, setRename] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const [localError, setLocalError] = useState('');
  const scroll = useRef<ScrollView>(null);
  const stack = state.stacks.find((s) => s.id === selected);
  const cards = state.cards
    .filter((c) => c.stackId === selected)
    .sort((a, b) => a.position - b.position);
  const opened = state.cards.find((c) => c.id === openId);
  const siblings = opened
    ? state.cards
        .filter((c) => c.stackId === opened.stackId)
        .sort((a, b) => a.position - b.position)
    : [];
  const index = siblings.findIndex((c) => c.id === opened?.id);
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
  function top() {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  function choose(id: string | null) {
    setSelected(id);
    setOpenId(null);
    setRenaming(false);
    setConfirm(null);
    setLocalError('');
    top();
  }
  const disabled = busy || !ready;
  const problem = localError || error;
  const storageNotice =
    Platform.OS === 'web'
      ? 'Selaintietojen poistaminen poistaa myös kortit.'
      : 'Sovelluksen poistaminen poistaa myös paikalliset kortit.';
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scroll}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={[ui.page, { padding: 16, gap: 16 }]}
        >
          {!!problem && !creating && (
            <Text accessibilityRole="alert" style={ui.body}>
              {problem}
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
            <>
              <Button
                label="Takaisin kortteihin"
                icon="left"
                disabled={busy || editing}
                onPress={() => {
                  setOpenId(null);
                  setConfirm(null);
                  top();
                }}
              />
              <Panel>
                {opened.answer.mode === 'note' ? (
                  <>
                    <Text style={ui.small}>OMA MUISTIINPANO</Text>
                    <Text accessibilityRole="header" style={ui.title}>
                      {opened.answer.title}
                    </Text>
                    {editing ? (
                      <>
                        <Text nativeID="note-edit-label" style={ui.body}>
                          Muistiinpanon teksti
                        </Text>
                        <TextInput
                          accessibilityLabel="Muistiinpanon teksti"
                          aria-labelledby="note-edit-label"
                          aria-describedby="note-edit-help"
                          multiline
                          textAlignVertical="top"
                          value={draft}
                          onChangeText={setDraft}
                          editable={!busy}
                          maxLength={10000}
                          style={[ui.input, { minHeight: 180, maxHeight: 300 }]}
                        />
                        <Text nativeID="note-edit-help" style={ui.small}>
                          Tallennus päivittää tämän muistiinpanon. Älä kirjoita
                          potilastietoja.
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <View style={{ flex: 1 }}>
                            <Button
                              label="Tallenna muutokset"
                              primary
                              disabled={disabled || !draft.trim()}
                              onPress={() => {
                                void perform(
                                  {
                                    type: 'editNote',
                                    id: opened.id,
                                    text: draft,
                                  },
                                  () => {
                                    setEditing(false);
                                    setDraft('');
                                  },
                                );
                              }}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Button
                              label="Peruuta"
                              disabled={busy}
                              onPress={() => {
                                setEditing(false);
                                setDraft('');
                                setLocalError('');
                              }}
                            />
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text selectable style={ui.body}>
                          {opened.answer.body}
                        </Text>
                        <Button
                          label="Muokkaa tekstiä"
                          icon="pencil"
                          disabled={disabled}
                          onPress={() => {
                            setDraft(opened.answer.body);
                            setEditing(true);
                            setConfirm(null);
                          }}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={ui.small}>KYSYMYS</Text>
                    <Text style={ui.body}>{opened.answer.question}</Text>
                    <AnswerCard answer={opened.answer} />
                  </>
                )}
                <Text style={ui.small}>
                  Tallennettu {new Date(opened.savedAt).toLocaleString('fi-FI')}
                  {opened.updatedAt
                    ? ` · Muokattu ${new Date(opened.updatedAt).toLocaleString('fi-FI')}`
                    : ''}
                </Text>
                <Text style={ui.title}>Kortin järjestys</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Button
                      label="Siirrä ylemmäs"
                      icon="up"
                      disabled={disabled || editing || index <= 0}
                      onPress={() => {
                        void perform({
                          type: 'reorder',
                          id: opened.id,
                          direction: -1,
                        });
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      label="Siirrä alemmas"
                      icon="down"
                      disabled={
                        disabled || editing || index === siblings.length - 1
                      }
                      onPress={() => {
                        void perform({
                          type: 'reorder',
                          id: opened.id,
                          direction: 1,
                        });
                      }}
                    />
                  </View>
                </View>
                <Text style={ui.title}>Siirrä pinoon</Text>
                <View style={ui.row}>
                  <Button
                    label="Järjestämättömät"
                    disabled={disabled || editing || opened.stackId === null}
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
                      disabled={disabled || editing || opened.stackId === s.id}
                      onPress={() => {
                        void perform(
                          { type: 'move', id: opened.id, stackId: s.id },
                          () => setSelected(s.id),
                        );
                      }}
                    />
                  ))}
                </View>
                {!state.stacks.length && (
                  <Text style={ui.small}>
                    Luo ensin oma pino pinojen alkunäkymässä.
                  </Text>
                )}
                {confirm === opened.id ? (
                  <>
                    <Text style={ui.body}>
                      Poistetaanko tallennettu kortti?
                    </Text>
                    <Button
                      label="Poista kortti pysyvästi"
                      disabled={disabled || editing}
                      onPress={() => {
                        void perform({ type: 'remove', id: opened.id }, () => {
                          setOpenId(null);
                          top();
                        });
                      }}
                    />
                    <Button
                      label="Peruuta"
                      disabled={busy}
                      onPress={() => setConfirm(null)}
                    />
                  </>
                ) : (
                  <Button
                    label="Poista kortti"
                    disabled={disabled || editing}
                    onPress={() => setConfirm(opened.id)}
                  />
                )}
              </Panel>
            </>
          ) : (
            <>
              {stack && (
                <Button
                  label="Kaikki pinot"
                  icon="left"
                  disabled={busy}
                  onPress={() => choose(null)}
                />
              )}
              <Text style={ui.label}>OMA TIETOPANKKI</Text>
              <Text accessibilityRole="header" style={ui.heading}>
                {stack?.name ?? 'Omat pinot'}
              </Text>
              {!stack ? (
                <>
                  <Text style={ui.small}>
                    Tallennetut vastaukset ja omat muistiinpanot tällä
                    laitteella.
                  </Text>
                  <View style={ui.row}>
                    <Button
                      label="Luo pino"
                      icon="plus"
                      primary
                      disabled={disabled}
                      onPress={() => {
                        setName('');
                        setLocalError('');
                        setCreating(true);
                      }}
                    />
                    <Button
                      label={`Järjestämättömät (${state.cards.filter((c) => c.stackId === null).length})`}
                      onPress={() => choose(null)}
                    />
                    {state.stacks.map((s) => (
                      <Button
                        key={s.id}
                        label={`${s.name} (${state.cards.filter((c) => c.stackId === s.id).length})`}
                        onPress={() => choose(s.id)}
                      />
                    ))}
                  </View>
                  <View style={ui.row}>
                    <Text style={ui.title}>Järjestämättömät</Text>
                    <Text style={ui.small}>{cards.length} korttia</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={ui.small}>{cards.length} korttia</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Nimeä pino uudelleen"
                        icon="pencil"
                        disabled={disabled}
                        onPress={() => {
                          setRename(stack.name);
                          setRenaming(true);
                          setConfirm(null);
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Poista pino"
                        icon="trash"
                        disabled={disabled}
                        onPress={() => {
                          setConfirm(stack.id);
                          setRenaming(false);
                        }}
                      />
                    </View>
                  </View>
                  {renaming && (
                    <Panel>
                      <Input
                        label="Pinon uusi nimi"
                        value={rename}
                        onChangeText={setRename}
                      />
                      <Button
                        label="Tallenna nimi"
                        primary
                        disabled={disabled || !rename.trim()}
                        onPress={() => {
                          void perform(
                            { type: 'renameStack', id: stack.id, name: rename },
                            () => setRenaming(false),
                          );
                        }}
                      />
                      <Button
                        label="Peruuta nimeäminen"
                        disabled={busy}
                        onPress={() => setRenaming(false)}
                      />
                    </Panel>
                  )}
                  {confirm === stack.id && (
                    <Panel>
                      <Text style={ui.body}>
                        Poistetaanko pino? Kortit siirtyvät Järjestämättömiin.
                      </Text>
                      <Button
                        label="Poista pino ja säilytä kortit"
                        disabled={disabled}
                        onPress={() => {
                          void perform(
                            { type: 'deleteStack', id: stack.id },
                            () => choose(null),
                          );
                        }}
                      />
                      <Button
                        label="Peruuta poisto"
                        disabled={busy}
                        onPress={() => setConfirm(null)}
                      />
                    </Panel>
                  )}
                </>
              )}
              {!cards.length && (
                <Panel>
                  <Text style={ui.title}>Tilaa omille korteille</Text>
                  <Text style={ui.body}>
                    Tallenna etusivun vastaus tai oma muistiinpano sydämellä.
                    Avaa kortti siirtääksesi sen omaan pinoon.
                  </Text>
                </Panel>
              )}
              {cards.map((card) => (
                <Panel key={card.id}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Avaa kortti: ${card.answer.title}`}
                    onPress={() => {
                      setOpenId(card.id);
                      setEditing(false);
                      setConfirm(null);
                      top();
                    }}
                    style={{ gap: 8, minHeight: 80 }}
                  >
                    <Text style={ui.small}>
                      {card.answer.mode === 'note'
                        ? 'OMA MUISTIINPANO'
                        : card.answer.mode === 'demo'
                          ? 'VALMIS ESIMERKKI'
                          : 'AI-TIIVISTELMÄ'}
                    </Text>
                    <Text style={ui.title}>{card.answer.title}</Text>
                    {!!card.answer.question && (
                      <Text numberOfLines={2} style={ui.small}>
                        {card.answer.question}
                      </Text>
                    )}
                    <Text numberOfLines={3} style={ui.body}>
                      {card.answer.body}
                    </Text>
                    <View style={ui.row}>
                      <Text style={ui.small}>Avaa kortti</Text>
                      <Icon name="right" size={16} />
                    </View>
                  </Pressable>
                </Panel>
              ))}
              <Text style={ui.small}>{storageNotice}</Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={creating}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!busy) setCreating(false);
        }}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 16,
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            <View
              accessibilityViewIsModal
              style={[
                ui.panel,
                { width: '100%', maxWidth: 440, alignSelf: 'center' },
              ]}
            >
              <Text accessibilityRole="header" style={ui.title}>
                Luo uusi pino
              </Text>
              <Text style={ui.body}>Pinon nimi</Text>
              <Input label="Pinon nimi" value={name} onChangeText={setName} />
              {!!problem && (
                <Text accessibilityRole="alert" style={ui.body}>
                  {problem}
                </Text>
              )}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Peruuta"
                    disabled={busy}
                    onPress={() => setCreating(false)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Luo uusi pino"
                    primary
                    disabled={disabled || !name.trim()}
                    onPress={() => {
                      void perform({ type: 'createStack', name }, () => {
                        setCreating(false);
                        setName('');
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
