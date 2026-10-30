import { Answer, newId } from '../chat/types';
import { isAnswer } from '../chat/client';
export const OWNER_ID = 'local-owner';
export type PersonalNote = Omit<Answer, 'mode'> & { mode: 'note' };
export const NOTES_STACK_NAME = 'Omat muistiinpanot';
export type SavedCard = {
  id: string;
  ownerId: string;
  answer: Answer | PersonalNote;
  stackId: string | null;
  savedAt: string;
  updatedAt?: string;
  position: number;
};
export type MemoryStack = {
  purpose?: 'personal-notes';
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
  | { type: 'editNote'; id: string; text: string }
  | { type: 'saveNote'; id: string; text: string }
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
        !(
          isAnswer(x.answer) ||
          (x.answer?.mode === 'note' && isAnswer({ ...x.answer, mode: 'demo' }))
        ) ||
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
  if (action.type === 'editNote') {
    const text = action.text.trim();
    if (!text || text.length > 10000)
      throw new Error('Kirjoita 1–10 000 merkin muistiinpano.');
    const card = state.cards.find((c) => c.id === action.id);
    if (!card || card.answer.mode !== 'note')
      throw new Error('Vain omaa muistiinpanoa voi muokata.');
    return {
      ...state,
      cards: state.cards.map((c) =>
        c.id === card.id
          ? {
              ...c,
              updatedAt: now,
              answer: {
                ...c.answer,
                title: text.split('\n')[0].slice(0, 80),
                body: text,
              },
            }
          : c,
      ),
    };
  }
  if (action.type === 'saveNote') {
    const text = action.text.trim();
    if (!text || text.length > 10000)
      throw new Error('Kirjoita 1–10 000 merkin muistiinpano.');
    if (state.cards.some((c) => c.answer.id === action.id)) return state;
    const existing =
      state.stacks.find((s) => s.purpose === 'personal-notes') ??
      state.stacks.find(
        (s) =>
          s.name.toLocaleLowerCase('fi') ===
          NOTES_STACK_NAME.toLocaleLowerCase('fi'),
      );
    const stack: MemoryStack = existing
      ? { ...existing, purpose: 'personal-notes' }
      : {
          id: newId(),
          ownerId: OWNER_ID,
          name: NOTES_STACK_NAME,
          purpose: 'personal-notes',
          createdAt: now,
          updatedAt: now,
          position: state.stacks.length,
        };
    return {
      ...state,
      stacks: existing
        ? state.stacks.map((s) => (s.id === stack.id ? stack : s))
        : [...state.stacks, stack],
      cards: [
        ...state.cards,
        {
          id: newId(),
          ownerId: OWNER_ID,
          stackId: stack.id,
          savedAt: now,
          position: Math.max(-1, ...state.cards.map((c) => c.position)) + 1,
          answer: {
            id: action.id,
            mode: 'note',
            status: 'answered',
            question: '',
            title: text.split('\n')[0].slice(0, 80),
            body: text,
            citations: [],
            createdAt: now,
          },
        },
      ],
    };
  }
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
