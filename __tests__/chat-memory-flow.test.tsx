import { render, userEvent } from '@testing-library/react-native';
import { ChatPanel } from '../src/chat/ChatPanel';
import SavedScreen from '../app/(tabs)/saved';
import { MemoryProvider } from '../src/memory/context';
import { emptyMemory, MemoryState } from '../src/memory/model';
import { readMemory, writeMemory } from '../src/memory/storage';
jest.mock('../src/memory/storage', () => ({
  readMemory: jest.fn(),
  writeMemory: jest.fn(),
}));
let stored: MemoryState;
beforeEach(() => {
  stored = emptyMemory();
  (readMemory as jest.Mock).mockImplementation(async () =>
    JSON.parse(JSON.stringify(stored)),
  );
  (writeMemory as jest.Mock).mockImplementation(async (s: MemoryState) => {
    stored = JSON.parse(JSON.stringify(s));
  });
});
test('demo answer can be saved, filed, reopened after reload, renamed and unfiled by deleting its stack', async () => {
  const user = userEvent.setup();
  let view = await render(
    <MemoryProvider>
      <ChatPanel />
      <SavedScreen />
    </MemoryProvider>,
  );
  await user.press(
    view.getByRole('button', { name: 'Miten tallennan vastauksen?' }),
  );
  await user.press(view.getByRole('button', { name: '♡ Tallenna vastaus' }));
  expect(view.getByRole('button', { name: '♥ Tallennettu' })).toBeDisabled();
  await user.type(view.getByLabelText('Pinon nimi'), 'Omat aiheet');
  await user.press(view.getByRole('button', { name: 'Luo pino +' }));
  await user.press(
    view.getByRole('button', { name: 'Avaa kortti: Oma tietopankki' }),
  );
  await user.press(view.getByRole('button', { name: 'Omat aiheet' }));
  expect(stored.cards[0].stackId).toBe(stored.stacks[0].id);
  const answer = stored.cards[0].answer;
  await view.unmount();
  view = await render(
    <MemoryProvider>
      <SavedScreen />
    </MemoryProvider>,
  );
  await user.press(view.getByRole('button', { name: 'Omat aiheet (1)' }));
  expect(
    view.getByRole('button', { name: 'Avaa kortti: Oma tietopankki' }),
  ).toBeTruthy();
  await user.press(view.getByRole('button', { name: 'Nimeä pino uudelleen' }));
  await user.clear(view.getByLabelText('Pinon uusi nimi'));
  await user.type(view.getByLabelText('Pinon uusi nimi'), 'Oppiminen');
  await user.press(view.getByRole('button', { name: 'Tallenna nimi' }));
  expect(stored.stacks[0].name).toBe('Oppiminen');
  await user.press(view.getByRole('button', { name: 'Poista pino' }));
  await user.press(
    view.getByRole('button', { name: 'Poista pino ja säilytä kortit' }),
  );
  expect(stored.cards[0].stackId).toBeNull();
  expect(stored.cards[0].answer).toEqual(answer);
});
