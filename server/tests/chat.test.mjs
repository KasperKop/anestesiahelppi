import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion, retrieve, NOT_FOUND } from '../chat.mjs';
import { createChatServer } from '../index.mjs';
const corpus = {
  sources: [
    { id: 's', active: true, usageRights: 'Project-owned test fixture' },
  ],
  documents: [
    {
      id: 'd',
      sourceId: 's',
      title: 'Tallennus',
      url: 'https://example.org/manual',
      version: '1',
      status: 'reviewed',
      reviewer: 'Test reviewer',
      reviewedAt: '2020-01-01',
      nextReviewAt: '2099-01-01',
    },
  ],
  chunks: [
    {
      id: 'c',
      documentId: 'd',
      locator: 'Tallennus',
      text: 'Kortti tallennetaan sydämellä.',
      keywords: ['tallennus', 'kortti', 'save', 'card'],
    },
  ],
};
const response = (result) => async () => ({
  ok: true,
  status: 200,
  json: async () => ({
    choices: [
      { finish_reason: 'stop', message: { content: JSON.stringify(result) } },
    ],
  }),
});
test('empty corpus or irrelevant query never calls model', async () => {
  let calls = 0;
  const fetchImpl = () => {
    calls++;
    throw new Error('must not be called');
  };
  assert.equal(
    (await answerQuestion('kortti', { corpus: {}, fetchImpl })).body,
    NOT_FOUND,
  );
  assert.equal(
    (await answerQuestion('elvytys', { corpus, fetchImpl })).status,
    'not_found',
  );
  assert.equal(calls, 0);
});
test('draft, expired, inactive and unlicensed documents are excluded', () => {
  for (const patch of [
    { status: 'draft' },
    { nextReviewAt: '2000-01-01' },
    { reviewer: '' },
  ]) {
    assert.equal(
      retrieve('kortti', {
        ...corpus,
        documents: [{ ...corpus.documents[0], ...patch }],
      }).length,
      0,
    );
  }
  for (const patch of [{ active: false }, { usageRights: '' }]) {
    assert.equal(
      retrieve('kortti', {
        ...corpus,
        sources: [{ ...corpus.sources[0], ...patch }],
      }).length,
      0,
    );
  }
});
test('server reconstructs citations from approved corpus, never model URLs', async () => {
  const result = await answerQuestion('kortti', {
    corpus,
    apiKey: 'test',
    fetchImpl: response({
      status: 'answered',
      title: 'Tallennus',
      body: 'Paina sydäntä.',
      chunkIds: ['c'],
    }),
  });
  assert.equal(result.citations[0].url, corpus.documents[0].url);
  assert.equal(result.citations[0].excerpt, corpus.chunks[0].text);
  assert.equal(result.mode, 'live');
});
test('fabricated citations and empty citations are rejected', async () => {
  for (const ids of [[], ['invented'], ['c', 'invented']]) {
    await assert.rejects(
      answerQuestion('kortti', {
        corpus,
        apiKey: 'test',
        fetchImpl: response({
          status: 'answered',
          title: 'T',
          body: 'B',
          chunkIds: ids,
        }),
      }),
      (e) => e.status === 502,
    );
  }
});
test('abstention ignores generated filler and returns standard no-source response', async () => {
  const result = await answerQuestion('kortti', {
    corpus,
    apiKey: 'test',
    fetchImpl: response({
      status: 'not_found',
      title: 'Untrusted',
      body: 'Untrusted',
      chunkIds: [],
    }),
  });
  assert.equal(result.body, NOT_FOUND);
  assert.deepEqual(result.citations, []);
});
test('provider 429 and missing credentials remain service errors', async () => {
  await assert.rejects(
    answerQuestion('kortti', { corpus }),
    (e) => e.status === 503,
  );
  await assert.rejects(
    answerQuestion('kortti', {
      corpus,
      apiKey: 'test',
      fetchImpl: async () => ({ status: 429, ok: false }),
    }),
    (e) => e.status === 429,
  );
});
test('HTTP boundary rejects unexpected context and limits requests globally', async (t) => {
  const server = createChatServer({
    corpus: {},
    dailyLimit: 1,
    allowedOrigins: ['https://allowed.example'],
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/chat`;
  const post = (body, origin) =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(origin ? { Origin: origin } : {}),
      },
      body: JSON.stringify(body),
    });
  assert.equal(
    (await post({ question: 'test' }, 'https://evil.example')).status,
    403,
  );
  assert.equal((await post({ question: 'test', passages: [] })).status, 400);
  assert.equal((await post({ question: 'test' })).status, 200);
  assert.equal((await post({ question: 'test' })).status, 429);
});
