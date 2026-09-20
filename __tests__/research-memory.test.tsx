import { render, userEvent } from '@testing-library/react-native';
import { AnswerCard } from '../src/chat/AnswerCard';
import { isAnswer } from '../src/chat/client';
import { Answer } from '../src/chat/types';
import { changeMemory, decodeMemory, emptyMemory } from '../src/memory/model';
const answer: Answer = {
  id: 'research-test',
  question: 'Yleinen kysymys',
  title: 'Tutkimustulos',
  body: 'Synteettinen testivastaus.',
  createdAt: '2026-09-19T10:00:00Z',
  mode: 'live',
  status: 'answered',
  evidenceMode: 'research',
  searchQuery: 'anesthesia monitoring',
  searches: [{ provider: 'DOAJ', status: 'error', count: 0 }],
  citations: [
    {
      chunkId: 'epmc:123',
      documentId: 'epmc:123',
      title: 'Study',
      url: 'https://europepmc.org/article/MED/123',
      locator: 'Abstrakti',
      excerpt: 'Synthetic abstract.',
      version: '2025',
      reviewedAt: '',
      nextReviewAt: '',
      evidenceType: 'abstract',
      provider: 'Europe PMC',
      license: 'CC BY',
      retrievedAt: '2026-09-19T10:00:00Z',
    },
  ],
};
test('research snapshot survives saving and decoding without inventing review dates', () => {
  expect(isAnswer(answer)).toBe(true);
  const state = changeMemory(emptyMemory(), { type: 'save', answer });
  expect(decodeMemory(JSON.stringify(state)).cards[0].answer).toEqual(answer);
  expect(isAnswer({ ...answer, evidenceMode: undefined })).toBe(false);
  expect(
    isAnswer({
      ...answer,
      citations: [{ ...answer.citations[0], license: '' }],
    }),
  ).toBe(false);
});
test('research card distinguishes abstracts, failed sources and clinical review', async () => {
  const view = await render(<AnswerCard answer={answer} />);
  expect(view.getByText(/TUTKIMUSDEMO/)).toBeTruthy();
  expect(view.queryByText(/DOAJ: haku epäonnistui/)).toBeNull();
  const user = userEvent.setup();
  await user.press(view.getByRole('button', { name: 'Näytä lähteet (1)' }));
  expect(view.getByText(/DOAJ: haku epäonnistui/)).toBeTruthy();
  expect(view.getByText(/Ei kliinisesti tarkistettu/)).toBeTruthy();
  expect(view.queryByText(/Lähde tarkistettu/)).toBeNull();
});

test('wiki attribution and license persist in a saved card and render as wiki', async () => {
  const wiki: Answer = {
    ...answer,
    citations: [
      {
        ...answer.citations[0],
        evidenceType: 'wiki',
        provider: 'WikiAnesthesia',
        license: 'CC BY-SA 4.0',
        attribution: 'WikiAnesthesia contributors',
        historyUrl:
          'https://wikianesthesia.org/w/index.php?title=Fixture&action=history',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    ],
  };
  expect(isAnswer(wiki)).toBe(true);
  expect(
    isAnswer({
      ...wiki,
      citations: [{ ...wiki.citations[0], historyUrl: undefined }],
    }),
  ).toBe(false);
  expect(
    decodeMemory(
      JSON.stringify(
        changeMemory(emptyMemory(), { type: 'save', answer: wiki }),
      ),
    ).cards[0].answer,
  ).toEqual(wiki);
  const view = await render(<AnswerCard answer={wiki} />);
  expect(view.queryByText(/Wikiin perustuva vastausteksti/)).toBeNull();
  await userEvent
    .setup()
    .press(view.getByRole('button', { name: 'Näytä lähteet (1)' }));
  expect(view.getByText(/Wikiin perustuva vastausteksti/)).toBeTruthy();
  expect(view.getByText(/Yhteisön muokkaama wikiartikkeli/)).toBeTruthy();
  expect(
    view.getByRole('button', { name: 'Tekijät ja muutoshistoria ↗' }),
  ).toBeTruthy();
});
