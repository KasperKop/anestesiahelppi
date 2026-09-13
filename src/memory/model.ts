import { Answer, newId } from '../chat/types';
import { isAnswer } from '../chat/client';
export const OWNER_ID = 'local-owner';
export type SavedCard = {
  id: string;
  ownerId: string;
  answer: Answer;
  stackId: string | null;
  savedAt: string;
  position: number;
};
export type MemoryStack = {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  position: number;
};
export type MemoryState = {
  version: 1;
  cards: SavedCard[];
  stacks: MemoryStack[];
};
export const emptyMemory = (): MemoryState => ({
  version: 1,
  cards: [],
  stacks: [],
});
export type MemoryAction =
  | { type: 'save'; answer: Answer }
  | { type: 'remove'; id: string }
  | { type: 'createStack'; name: string }
  | { type: 'renameStack'; id: string; name: string }
  | { type: 'deleteStack'; id: string }
  | { type: 'move'; id: string; stackId: string | null }
  | { type: 'reorder'; id: string; direction: -1 | 1 };
export function decodeMemory(raw: string | null): MemoryState {
  if (!raw) return emptyMemory();
  const s = JSON.parse(raw) as MemoryState;
  if (
    s.version !== 1 ||
    !Array.isArray(s.cards) ||
    !Array.isArray(s.stacks) ||
    s.stacks.some(
      (x) =>
        !x ||
        typeof x.id !== 'string' ||
        typeof x.name !== 'string' ||
        x.ownerId !== OWNER_ID ||
        !Number.isFinite(x.position),
    ) ||
    s.cards.some(
      (x) =>
        !x ||
        typeof x.id !== 'string' ||
        x.ownerId !== OWNER_ID ||
        !isAnswer(x.answer) ||
        typeof x.savedAt !== 'string' ||
        !Number.isFinite(x.position) ||
        (x.stackId !== null && !s.stacks.some((p) => p.id === x.stackId)),
    )
  ) {
    throw new Error(
      'Tallennettua tietopankkia ei voitu lukea. Tietoja ei ylikirjoitettu.',
    );
  }
  return s;
}
export function changeMemory(
  state: MemoryState,
  action: MemoryAction,
): MemoryState {
  const now = new Date().toISOString();
  if (action.type === 'save') {
    if (state.cards.some((c) => c.answer.id === action.answer.id)) return state;
    return {
      ...state,
      cards: [
        ...state.cards,
        {
          id: newId(),
          ownerId: OWNER_ID,
          answer: action.answer,
          stackId: null,
          savedAt: now,
          position: Math.max(-1, ...state.cards.map((c) => c.position)) + 1,
        },
      ],
    };
  }
  if (action.type === 'remove')
    return { ...state, cards: state.cards.filter((c) => c.id !== action.id) };
  if (action.type === 'createStack' || action.type === 'renameStack') {
    const name = action.name.trim();
    if (!name || name.length > 60)
      throw new Error('Anna pinolle 1–60 merkin nimi.');
    if (
      state.stacks.some(
        (s) =>
          s.name.toLocaleLowerCase('fi') === name.toLocaleLowerCase('fi') &&
          (action.type === 'createStack' || s.id !== action.id),
      )
    )
      throw new Error('Samanniminen pino on jo olemassa.');
    if (action.type === 'createStack')
      return {
        ...state,
        stacks: [
          ...state.stacks,
          {
            id: newId(),
            ownerId: OWNER_ID,
            name,
            createdAt: now,
            updatedAt: now,
            position: state.stacks.length,
          },
        ],
      };
    return {
      ...state,
      stacks: state.stacks.map((s) =>
        s.id === action.id ? { ...s, name, updatedAt: now } : s,
      ),
    };
  }
  if (action.type === 'deleteStack')
    return {
      ...state,
      stacks: state.stacks.filter((s) => s.id !== action.id),
      cards: state.cards.map((c) =>
        c.stackId === action.id ? { ...c, stackId: null } : c,
      ),
    };
  if (action.type === 'move') {
    if (
      action.stackId !== null &&
      !state.stacks.some((s) => s.id === action.stackId)
    )
      throw new Error('Pinoa ei löytynyt.');
    return {
      ...state,
      cards: state.cards.map((c) =>
        c.id === action.id
          ? {
              ...c,
              stackId: action.stackId,
              position: Math.max(-1, ...state.cards.map((x) => x.position)) + 1,
            }
          : c,
      ),
    };
  }
  const card = state.cards.find((c) => c.id === action.id);
  if (!card) return state;
  const siblings = state.cards
    .filter((c) => c.stackId === card.stackId)
    .sort((a, b) => a.position - b.position);
  const index = siblings.findIndex((c) => c.id === card.id);
  const target = siblings[index + action.direction];
  if (!target) return state;
  return {
    ...state,
    cards: state.cards.map((c) =>
      c.id === card.id
        ? { ...c, position: target.position }
        : c.id === target.id
          ? { ...c, position: card.position }
          : c,
    ),
  };
}
