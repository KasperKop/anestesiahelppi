import { act, fireEvent, render, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ConversationPane } from '../src/chat/ConversationPane';
import { ChatPanel } from '../src/chat/ChatPanel';
import { MemoryProvider } from '../src/memory/context';
import { askLive } from '../src/chat/client';
import { demoAnswer } from '../src/chat/demo';
jest.mock('../src/chat/client', () => ({
  ...jest.requireActual('../src/chat/client'),
  chatEndpoint: 'https://example.test/chat',
  askLive: jest.fn(),
}));
jest.mock('../src/memory/storage', () => ({
  readMemory: jest.fn(async () => ({ version: 1, cards: [], stacks: [] })),
  writeMemory: jest.fn(async () => undefined),
}));

test('empty home chat has one mode row and no reserved message space', async () => {
  const screen = await render(
    <MemoryProvider>
      <ChatPanel />
    </MemoryProvider>,
  );
  expect(screen.getAllByRole('tab')).toHaveLength(2);
  expect(screen.getByRole('tab', { name: 'Tutkimushaku' })).toBeOnTheScreen();
  expect(screen.queryByText('Esittelytila')).toBeNull();
  expect(screen.queryByTestId('chat-log')).toBeNull();
  expect(screen.getByTestId('chat-composer')).toBeOnTheScreen();
  expect(screen.getByText('Älä kirjoita potilastietoja.')).toBeOnTheScreen();
});

test('composer stays outside log and new content does not steal the reading position', async () => {
  const pane = (revision: number) => (
    <ConversationPane
      label="chat"
      request={0}
      revision={revision}
      composer={<Text>Syöttöalue</Text>}
    >
      <Text>Viestit {revision}</Text>
    </ConversationPane>
  );
  const screen = await render(pane(0));
  expect(
    within(screen.getByTestId('chat-log')).queryByText('Syöttöalue'),
  ).toBeNull();
  expect(
    within(screen.getByTestId('chat-composer')).getByText('Syöttöalue'),
  ).toBeOnTheScreen();
  await fireEvent.scroll(screen.getByTestId('chat-log'), {
    nativeEvent: {
      contentSize: { height: 1600 },
      contentOffset: { y: 100 },
      layoutMeasurement: { height: 400 },
    },
  });
  await screen.rerender(pane(1));
  await fireEvent.press(screen.getByRole('button', { name: 'Uusi vastaus' }));
  expect(screen.queryByRole('button', { name: 'Uusi vastaus' })).toBeNull();
  await screen.rerender(pane(2));
  expect(screen.queryByRole('button', { name: 'Uusi vastaus' })).toBeNull();
});

test('pending question appears immediately, retry keeps the next draft and avoids duplicate turns', async () => {
  let reject!: (error: Error) => void;
  (askLive as jest.Mock).mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  const screen = await render(
    <MemoryProvider>
      <ChatPanel />
    </MemoryProvider>,
  );
  await fireEvent.changeText(
    screen.getByLabelText('Kysymys chatille'),
    'Ensimmäinen kysymys',
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Lähetä kysymys' }));
  expect(
    within(screen.getByTestId('chat-log')).getByText('Ensimmäinen kysymys'),
  ).toBeOnTheScreen();
  expect(screen.getByLabelText('Kysymys chatille')).toHaveDisplayValue('');
  await fireEvent.changeText(
    screen.getByLabelText('Kysymys chatille'),
    'Seuraava luonnos',
  );
  await act(async () => reject(new Error('Yhteys katkesi')));
  expect(screen.getByRole('alert')).toHaveTextContent('Yhteys katkesi');
  (askLive as jest.Mock).mockResolvedValueOnce(
    demoAnswer('Ensimmäinen kysymys'),
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Yritä uudelleen' }),
  );
  expect(askLive).toHaveBeenCalledTimes(2);
  expect(screen.getByLabelText('Kysymys chatille')).toHaveDisplayValue(
    'Seuraava luonnos',
  );
  expect(
    within(screen.getByTestId('chat-log')).getAllByText('Ensimmäinen kysymys'),
  ).toHaveLength(1);
});
