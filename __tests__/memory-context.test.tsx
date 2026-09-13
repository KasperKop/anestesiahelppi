import { act, render, screen, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { MemoryProvider, useMemory } from '../src/memory/context';
import { readMemory, writeMemory } from '../src/memory/storage';
import { emptyMemory } from '../src/memory/model';
import { demoAnswer, examples } from '../src/chat/demo';
jest.mock('../src/memory/storage', () => ({
  readMemory: jest.fn(),
  writeMemory: jest.fn(),
}));
let memory: ReturnType<typeof useMemory>;
function Probe() {
  const value = useMemory();
  useEffect(() => {
    memory = value;
  }, [value]);
  return <Text>{value.state.cards.length}</Text>;
}
beforeEach(() => {
  jest.clearAllMocks();
  (readMemory as jest.Mock).mockResolvedValue(emptyMemory());
});
test('failed write does not show a saved heart or lose existing state', async () => {
  (writeMemory as jest.Mock).mockRejectedValue(new Error('Storage full'));
  await render(
    <MemoryProvider>
      <Probe />
    </MemoryProvider>,
  );
  await waitFor(() => expect(memory.ready).toBe(true));
  await act(async () => {
    await expect(
      memory.act({ type: 'save', answer: demoAnswer(examples[0].question) }),
    ).rejects.toThrow('Storage full');
  });
  expect(screen.getByText('0')).toBeTruthy();
  expect(memory.error).toBe('Storage full');
});
