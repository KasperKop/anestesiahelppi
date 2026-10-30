import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
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
  stored = changeMemory(
    changeMemory(emptyMemory(), {
      type: 'saveNote',
      id: 'one',
      text: 'Ensimmäinen\nAlkuperäinen teksti',
    }),
    { type: 'saveNote', id: 'two', text: 'Toinen' },
  );
  jest
    .mocked(readMemory)
    .mockReset()
    .mockImplementation(async () => decodeMemory(JSON.stringify(stored)));
  jest
    .mocked(writeMemory)
    .mockReset()
    .mockImplementation(async (next) => {
      stored = decodeMemory(JSON.stringify(next));
    });
});
async function openFirst() {
  await fireEvent.press(
    await screen.findByRole('button', { name: 'Omat muistiinpanot (2)' }),
  );
  expect(screen.queryByRole('button', { name: 'Luo pino' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Siirrä ylemmäs' })).toBeNull();
  await fireEvent.press(
    screen.getByRole('button', { name: 'Avaa kortti: Ensimmäinen' }),
  );
}
it('edits the same note, preserves identity and order, and reloads the replacement', async () => {
  const before = stored.cards[0];
  const view = await render(
    <MemoryProvider>
      <SavedScreen />
    </MemoryProvider>,
  );
  await openFirst();
  expect(screen.getByRole('button', { name: 'Siirrä ylemmäs' })).toBeDisabled();
  await fireEvent.press(
    screen.getByRole('button', { name: 'Muokkaa tekstiä' }),
  );
  await fireEvent.changeText(
    screen.getByLabelText('Muistiinpanon teksti'),
    'Uusi otsikko\nMuokattu sisältö',
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Tallenna muutokset' }),
  );
  await waitFor(() =>
    expect(stored.cards[0].answer.body).toBe('Uusi otsikko\nMuokattu sisältö'),
  );
  expect(stored.cards).toHaveLength(2);
  expect(stored.cards[0]).toMatchObject({
    id: before.id,
    stackId: before.stackId,
    savedAt: before.savedAt,
    position: before.position,
    answer: {
      id: before.answer.id,
      createdAt: before.answer.createdAt,
      title: 'Uusi otsikko',
    },
  });
  expect(stored.cards[0].updatedAt).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Siirrä alemmas' }));
  expect(screen.getByRole('button', { name: 'Siirrä alemmas' })).toBeDisabled();
  expect(
    screen.getByRole('button', { name: 'Siirrä ylemmäs' }),
  ).not.toBeDisabled();
  await view.unmount();
  await render(
    <MemoryProvider>
      <SavedScreen />
    </MemoryProvider>,
  );
  await fireEvent.press(
    await screen.findByRole('button', { name: 'Omat muistiinpanot (2)' }),
  );
  expect(
    screen.getByRole('button', { name: 'Avaa kortti: Uusi otsikko' }),
  ).toBeTruthy();
});
it('cancel leaves the note untouched; empty input and failed writes do not overwrite it', async () => {
  const original = JSON.stringify(stored);
  await render(
    <MemoryProvider>
      <SavedScreen />
    </MemoryProvider>,
  );
  await openFirst();
  await fireEvent.press(
    screen.getByRole('button', { name: 'Muokkaa tekstiä' }),
  );
  await fireEvent.changeText(
    screen.getByLabelText('Muistiinpanon teksti'),
    'Peruttava',
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Peruuta' }));
  expect(JSON.stringify(stored)).toBe(original);
  await fireEvent.press(
    screen.getByRole('button', { name: 'Muokkaa tekstiä' }),
  );
  await fireEvent.changeText(
    screen.getByLabelText('Muistiinpanon teksti'),
    '   ',
  );
  expect(
    screen.getByRole('button', { name: 'Tallenna muutokset' }),
  ).toBeDisabled();
  await fireEvent.changeText(
    screen.getByLabelText('Muistiinpanon teksti'),
    'Yritä uudelleen',
  );
  jest
    .mocked(writeMemory)
    .mockRejectedValueOnce(new Error('Tallennustila täynnä'));
  await fireEvent.press(
    screen.getByRole('button', { name: 'Tallenna muutokset' }),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Tallennustila täynnä',
  );
  expect(screen.getByLabelText('Muistiinpanon teksti')).toHaveDisplayValue(
    'Yritä uudelleen',
  );
  expect(JSON.stringify(stored)).toBe(original);
});
it('rejects attempts to edit research answers or missing notes', () => {
  expect(() =>
    changeMemory(stored, { type: 'editNote', id: 'missing', text: 'Teksti' }),
  ).toThrow();
  const withAnswer: MemoryState = {
    ...stored,
    cards: [
      {
        ...stored.cards[0],
        answer: { ...stored.cards[0].answer, mode: 'demo' },
      },
    ],
  };
  expect(() =>
    changeMemory(withAnswer, {
      type: 'editNote',
      id: withAnswer.cards[0].id,
      text: 'Teksti',
    }),
  ).toThrow('Vain omaa muistiinpanoa');
});
