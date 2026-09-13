import { changeMemory, decodeMemory, emptyMemory } from '../src/memory/model';
import { demoAnswer, examples } from '../src/chat/demo';

test('saved snapshot survives serialization and duplicate hearts do not duplicate it', () => {
  const answer = demoAnswer(examples[0].question);
  const state = changeMemory(emptyMemory(), { type: 'save', answer });
  expect(changeMemory(state, { type: 'save', answer }).cards).toHaveLength(1);
  expect(decodeMemory(JSON.stringify(state))).toEqual(state);
});
test('deleting a stack preserves and unfiles its cards', () => {
  let state = changeMemory(emptyMemory(), {
    type: 'createStack',
    name: 'Omat aiheet',
  });
  state = changeMemory(state, {
    type: 'save',
    answer: demoAnswer(examples[0].question),
  });
  state = changeMemory(state, {
    type: 'move',
    id: state.cards[0].id,
    stackId: state.stacks[0].id,
  });
  const answer = state.cards[0].answer;
  state = changeMemory(state, { type: 'deleteStack', id: state.stacks[0].id });
  expect(state.stacks).toHaveLength(0);
  expect(state.cards[0].stackId).toBeNull();
  expect(state.cards[0].answer).toEqual(answer);
});
test('reorders only siblings and refuses missing destination', () => {
  let state = emptyMemory();
  for (const e of examples)
    state = changeMemory(state, {
      type: 'save',
      answer: demoAnswer(e.question),
    });
  const first = state.cards[0];
  state = changeMemory(state, { type: 'reorder', id: first.id, direction: 1 });
  expect(state.cards[0].position).toBe(1);
  expect(state.cards[1].position).toBe(0);
  expect(() =>
    changeMemory(state, { type: 'move', id: first.id, stackId: 'missing' }),
  ).toThrow();
});
test('corrupt or future state is not silently replaced', () => {
  expect(() => decodeMemory('{bad')).toThrow();
  expect(() => decodeMemory('{"version":2,"cards":[],"stacks":[]}')).toThrow();
});
test('stack names are trimmed, unique, and bounded', () => {
  const state = changeMemory(emptyMemory(), {
    type: 'createStack',
    name: ' Testi ',
  });
  expect(state.stacks[0].name).toBe('Testi');
  expect(() =>
    changeMemory(state, { type: 'createStack', name: 'testi' }),
  ).toThrow();
  expect(() =>
    changeMemory(state, {
      type: 'renameStack',
      id: state.stacks[0].id,
      name: '',
    }),
  ).toThrow();
});
