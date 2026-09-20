import test from 'node:test';
import assert from 'node:assert/strict';
import {
  planQuery,
  searchEuropePmc,
  searchDoaj,
  searchWikiAnesthesia,
  deduplicate,
  retrieveResearch,
  answerResearch,
} from '../research.mjs';
const response = (body, status = 200) =>
  new Response(JSON.stringify(body), { status });
const abstract =
  'Project-owned fixture text describing a general research question and its limitations. This synthetic abstract exists only to test retrieval and attribution, not clinical claims.';
const epmc = (license = 'CC BY') => ({
  resultList: {
    result: [
      {
        id: '123',
        source: 'MED',
        title: 'Test study',
        doi: '10.1234/test',
        pubYear: '2025',
        license,
        abstractText: abstract,
      },
    ],
  },
});
const doaj = {
  results: [
    {
      id: 'abc123',
      bibjson: {
        title: 'Test study',
        identifier: [{ type: 'doi', id: '10.1234/TEST' }],
        abstract,
        year: '2025',
      },
    },
  ],
};
const model = (body) =>
  response({
    choices: [
      { finish_reason: 'stop', message: { content: JSON.stringify(body) } },
    ],
  });
function apiFetch(url) {
  const u = new URL(url);
  if (u.pathname.endsWith('esearch.fcgi'))
    return Promise.resolve(response({ esearchresult: { idlist: ['123'] } }));
  if (u.pathname.endsWith('esummary.fcgi'))
    return Promise.resolve(
      response({
        result: {
          123: {
            title: 'Test study',
            articleids: [{ idtype: 'doi', value: '10.1234/test' }],
            pubdate: '2025',
          },
        },
      }),
    );
  if (u.hostname === 'www.ebi.ac.uk') return Promise.resolve(response(epmc()));
  if (u.hostname === 'wikianesthesia.org')
    return Promise.resolve(response({ query: { search: [] } }));
  if (u.hostname === 'doaj.org') return Promise.resolve(response(doaj));
  throw Error('Unexpected host');
}
test('query planning rejects operators and abstains without external searches', async () => {
  for (const query of [
    'anesthesia OR cancer',
    'anesthesia:http',
    '123',
    'a'.repeat(121),
  ]) {
    await assert.rejects(
      planQuery('test', {
        apiKey: 'fixture',
        fetchImpl: async () => model({ allowed: true, query }),
      }),
    );
  }
  let calls = 0;
  const result = await answerResearch('patient question', {
    apiKey: 'fixture',
    fetchImpl: async (url) => {
      calls++;
      assert.equal(new URL(url).hostname, 'api.groq.com');
      return model({ allowed: false, query: '' });
    },
  });
  assert.equal(calls, 1);
  assert.equal(result.status, 'not_found');
});
test('Europe PMC needs an explicit reusable license; OA alone and NC/ND do not qualify', async () => {
  for (const license of [undefined, 'CC BY-NC', 'CC BY-ND', 'unknown']) {
    const data = epmc();
    data.resultList.result[0].license = license;
    const hits = await searchEuropePmc('anesthesia', async () =>
      response(data),
    );
    assert.equal(hits[0].text, '');
  }
  const hits = await searchEuropePmc('anesthesia', async () =>
    response(epmc('CC-BY-4.0')),
  );
  assert.equal(hits[0].text, abstract);
});
test('DOAJ uses CC0 metadata abstracts, never downloads publisher links', async () => {
  const calls = [];
  const result = await searchDoaj('anesthesia monitoring', async (url) => {
    calls.push(url);
    return response(doaj);
  });
  assert.equal(calls.length, 1);
  assert.match(calls[0], /^https:\/\/doaj.org\/api\/search\/articles\//);
  assert.equal(result[0].license, 'CC0 (DOAJ-metatiedot)');
  assert.equal(result[0].text, abstract);
});
test('PMID/DOI deduplication keeps reusable text and all discovery providers', async () => {
  const { hits, searches, searchResults } = await retrieveResearch(
    'anesthesia',
    { fetchImpl: apiFetch },
  );
  assert.equal(hits.length, 1);
  assert.equal(searchResults.length, 1);
  assert.deepEqual(searchResults[0].providers, [
    'PubMed',
    'Europe PMC',
    'DOAJ',
  ]);
  assert.equal(hits[0].document.reviewedAt, '');
  assert.equal(hits[0].document.research.evidenceType, 'abstract');
  assert.equal(hits[0].chunk.text, abstract);
  assert.equal(
    searches.every((s) => s.status === 'ok'),
    true,
  );
  assert.equal(
    deduplicate([
      { id: 'a', pmid: '1', title: 'A', text: '', provider: 'P' },
      { id: 'b', pmid: '1', title: 'B', text: abstract, provider: 'E' },
    ]).length,
    1,
  );
});
test('partial errors remain visible; total failure is not a no-results answer', async () => {
  const result = await retrieveResearch('anesthesia', {
    fetchImpl: async (url) => {
      if (new URL(url).hostname === 'doaj.org') return response(doaj);
      throw Error('Offline');
    },
  });
  assert.deepEqual(
    result.searches.map((s) => s.status),
    ['error', 'error', 'ok', 'error'],
  );
  assert.equal(result.hits.length, 1);
  await assert.rejects(
    retrieveResearch('anesthesia', {
      fetchImpl: async () => {
        throw Error('Offline');
      },
    }),
    (e) => e.status === 502,
  );
});
test('research pipeline uses complete abstracts and reconstructs citations', async () => {
  let modelCalls = 0;
  const result = await answerResearch('yleinen kysymys', {
    apiKey: 'fixture',
    fetchImpl: async (url, options) => {
      if (new URL(url).hostname !== 'api.groq.com') return apiFetch(url);
      modelCalls++;
      if (modelCalls === 1)
        return model({ allowed: true, query: 'anesthesia monitoring' });
      const request = JSON.parse(options.body);
      const passages = JSON.parse(request.messages[1].content).passages;
      assert.equal(passages.length, 1);
      assert.equal(passages[0].text, abstract);
      return model({
        status: 'answered',
        title: 'Test',
        body: 'Fixture summary',
        chunkIds: [passages[0].id],
      });
    },
  });
  assert.equal(modelCalls, 2);
  assert.equal(result.evidenceMode, 'research');
  assert.equal(result.citations[0].provider, 'Europe PMC');
  assert.equal(
    result.citations[0].url,
    'https://europepmc.org/article/MED/123',
  );
  assert.equal(result.citations[0].reviewedAt, '');
});
test('oversized source responses and title-only records are not used for synthesis', async () => {
  await assert.rejects(
    searchDoaj('anesthesia', async () =>
      response({ text: 'a'.repeat(600001) }),
    ),
  );
  let modelCalls = 0;
  const result = await answerResearch('test', {
    apiKey: 'fixture',
    fetchImpl: async (url) => {
      if (new URL(url).hostname === 'api.groq.com') {
        modelCalls++;
        return model({ allowed: true, query: 'anesthesia' });
      }
      if (url.includes('esearch'))
        return response({ esearchresult: { idlist: [] } });
      if (url.includes('europepmc')) return response(epmc('CC BY-NC'));
      return response({ results: [] });
    },
  });
  assert.equal(modelCalls, 1);
  assert.equal(result.status, 'not_found');
  assert.equal(result.searchResults.length, 1);
  assert.equal(result.citations.length, 0);
});

test('known retraction flags exclude duplicates across providers from synthesis', async () => {
  const result = await retrieveResearch('anesthesia', {
    fetchImpl: async (url) => {
      if (url.includes('europepmc')) {
        const data = epmc();
        data.resultList.result[0].pubTypeList = {
          pubType: ['Retracted Publication'],
        };
        return response(data);
      }
      return apiFetch(url);
    },
  });
  assert.equal(result.hits.length, 0);
});

const wikiFetch = async (url) => {
  const u = new URL(url);
  assert.equal(u.hostname, 'wikianesthesia.org');
  if (u.searchParams.has('list'))
    return response({
      query: {
        search: [
          { pageid: 1, wordcount: 0 },
          { pageid: 2, wordcount: 200 },
        ],
      },
    });
  assert.equal(u.searchParams.get('pageids'), '2');
  return response({
    query: {
      pages: [
        {
          pageid: 2,
          ns: 0,
          title: 'Fixture wiki',
          extract:
            '== Overview ==\n\n' +
            abstract +
            '\n\n== References ==\n\nDo not synthesize the reference list.',
          revisions: [{ revid: 42, timestamp: '2026-09-20T00:00:00Z' }],
        },
      ],
    },
  });
};
test('wiki retrieval excludes empty pages, preserves revision and attribution, excludes bibliography', async () => {
  const [r] = await searchWikiAnesthesia('anesthesia', wikiFetch);
  assert.equal(r.evidenceType, 'wiki');
  assert.equal(r.license, 'CC BY-SA 4.0');
  assert.match(r.url, /oldid=42$/);
  assert.match(r.historyUrl, /action=history/);
  assert.equal(r.attribution, 'WikiAnesthesia contributors');
  assert.match(r.text, /Project-owned fixture/);
  assert.doesNotMatch(r.text, /Do not synthesize/);
});
test('wiki-only evidence can answer with source type and attribution intact', async () => {
  let calls = 0;
  const result = await answerResearch('Yleinen kysymys', {
    apiKey: 'fixture',
    fetchImpl: async (url, options) => {
      if (new URL(url).hostname === 'wikianesthesia.org') return wikiFetch(url);
      if (new URL(url).hostname !== 'api.groq.com')
        throw Error('Other sources offline');
      if (++calls === 1) return model({ allowed: true, query: 'anesthesia' });
      const p = JSON.parse(JSON.parse(options.body).messages[1].content)
        .passages[0];
      assert.equal(p.evidenceType, 'wiki');
      return model({
        status: 'answered',
        title: 'Fixture',
        body: 'WikiAnesthesian mukaan testiteksti.',
        chunkIds: [p.id],
      });
    },
  });
  assert.equal(result.citations[0].evidenceType, 'wiki');
  assert.equal(
    result.citations[0].licenseUrl,
    'https://creativecommons.org/licenses/by-sa/4.0/',
  );
  assert.equal(result.citations[0].reviewedAt, '');
});
