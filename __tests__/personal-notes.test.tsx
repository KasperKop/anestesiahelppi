import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ChatPanel } from '../src/chat/ChatPanel';
import SavedScreen from '../app/(tabs)/saved';
import { MemoryProvider } from '../src/memory/context';
import {
  changeMemory,
  decodeMemory,
  emptyMemory,
  MemoryState,
} from '../src/memory/model';
import { readMemory, writeMemory } from '../src/memory/storage';
jest.mock('../src/memory/storage', () => ({
  readMemory: jest.fn(),
  writeMemory: jest.fn(),
}));
let stored: MemoryState;
beforeEach(() => {
  stored = emptyMemory();
  (readMemory as jest.Mock).mockImplementation(async () =>
    decodeMemory(JSON.stringify(stored)),
  );
  (writeMemory as jest.Mock).mockImplementation(async (next: MemoryState) => {
    stored = next;
  });
});
test('draft survives mode switches and saved note reopens from its automatic stack', async () => {
  let screen = await render(
    <MemoryProvider>
      <ChatPanel />
    </MemoryProvider>,
  );
  await fireEvent.changeText(
    screen.getByLabelText('Kysymys chatille'),
    'Keskeneräinen kysymys',
  );
  await fireEvent.press(screen.getByRole('tab', { name: 'Luo muistiinpano' }));
  expect(
    screen.getByRole('button', { name: 'Tallenna muistiinpano' }),
  ).toBeDisabled();
  await fireEvent.changeText(
    screen.getByLabelText('Oma muistiinpano'),
    'Oma muistilista\nTarkista välineet.',
  );
  await fireEvent.press(screen.getByRole('tab', { name: 'Tutkimushaku' }));
  expect(screen.getByLabelText('Kysymys chatille')).toHaveDisplayValue(
    'Keskeneräinen kysymys',
  );
  await fireEvent.press(screen.getByRole('tab', { name: 'Luo muistiinpano' }));
  expect(screen.getByLabelText('Oma muistiinpano')).toHaveDisplayValue(
    'Oma muistilista\nTarkista välineet.',
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Tallenna muistiinpano' }),
  );
  await waitFor(() => expect(stored.cards).toHaveLength(1));
  expect(stored.stacks[0].name).toBe('Omat muistiinpanot');
  expect(stored.cards[0].stackId).toBe(stored.stacks[0].id);
  expect(screen.getByRole('button', { name: 'Tallennettu' })).toBeDisabled();
  await screen.unmount();
  screen = await render(
    <MemoryProvider>
      <SavedScreen />
    </MemoryProvider>,
  );
  await fireEvent.press(
    await screen.findByRole('button', { name: 'Omat muistiinpanot (1)' }),
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Avaa kortti: Oma muistilista' }),
  );
  expect(
    screen.getByText('Oma muistilista\nTarkista välineet.'),
  ).toBeOnTheScreen();
  expect(screen.getByText('OMA MUISTIINPANO')).toBeOnTheScreen();
  expect(screen.queryByText(/VALMIS ESIMERKKI/)).toBeNull();
  expect(screen.queryByText('KYSYMYS')).toBeNull();
});
test('failed save retains draft and retry creates only one note', async () => {
  (writeMemory as jest.Mock).mockRejectedValueOnce(
    new Error('Tallennustila täynnä'),
  );
  const screen = await render(
    <MemoryProvider>
      <ChatPanel />
    </MemoryProvider>,
  );
  await fireEvent.press(screen.getByRole('tab', { name: 'Luo muistiinpano' }));
  await fireEvent.changeText(
    screen.getByLabelText('Oma muistiinpano'),
    'Säilytä teksti',
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Tallenna muistiinpano' }),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Tallennustila täynnä',
  );
  expect(screen.getByLabelText('Oma muistiinpano')).toHaveDisplayValue(
    'Säilytä teksti',
  );
  expect(stored.cards).toHaveLength(0);
  await fireEvent.press(
    screen.getByRole('button', { name: 'Tallenna muistiinpano' }),
  );
  await waitFor(() => expect(stored.cards).toHaveLength(1));
});
test('notes reuse a renamed stack, recreate a deleted one, and round-trip with old data', () => {
  let state = changeMemory(emptyMemory(), {
    type: 'saveNote',
    id: 'one',
    text: 'Ensimmäinen',
  });
  state = changeMemory(state, {
    type: 'renameStack',
    id: state.stacks[0].id,
    name: 'Omat ideat',
  });
  state = changeMemory(state, { type: 'saveNote', id: 'two', text: 'Toinen' });
  expect(state.stacks).toHaveLength(1);
  expect(state.cards[1].stackId).toBe(state.cards[0].stackId);
  expect(
    changeMemory(state, { type: 'saveNote', id: 'two', text: 'Toinen' }),
  ).toBe(state);
  state = changeMemory(state, { type: 'deleteStack', id: state.stacks[0].id });
  state = changeMemory(state, {
    type: 'saveNote',
    id: 'three',
    text: 'Kolmas',
  });
  expect(state.cards[0].stackId).toBeNull();
  expect(state.stacks[0].name).toBe('Omat muistiinpanot');
  expect(decodeMemory(JSON.stringify(state))).toEqual(state);
  expect(decodeMemory(JSON.stringify(emptyMemory()))).toEqual(emptyMemory());
  expect(() =>
    changeMemory(state, { type: 'saveNote', id: 'blank', text: '  ' }),
  ).toThrow();
});
