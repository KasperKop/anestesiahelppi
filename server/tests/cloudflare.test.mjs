import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest, reserveQuota } from '../../cloudflare/handler.mjs';
const env = {
  CHAT_ENABLED: 'true',
  GROQ_API_KEY: 'test-only',
  ALLOWED_ORIGINS: 'https://kasperkop.github.io',
};
const request = (body, origin = 'https://kasperkop.github.io') =>
  new Request('https://example.org/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  });
const options = { corpus: {}, reserve: async () => ({ allowed: true }) };
test('disabled deployment fails closed without reserving quota', async () => {
  let called = false;
  const response = await handleRequest(
    request({ question: 'test' }),
    { ...env, CHAT_ENABLED: 'false' },
    {
      ...options,
      reserve: () => {
        called = true;
      },
    },
  );
  assert.equal(response.status, 503);
  assert.equal(called, false);
});
test('origin, payload context and streaming size are checked', async () => {
  assert.equal(
    (
      await handleRequest(
        request({ question: 'test' }, 'https://evil.example'),
        env,
        options,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleRequest(
        request({ question: 'test', weight: 15 }),
        env,
        options,
      )
    ).status,
    400,
  );
  assert.equal(
    (await handleRequest(request({ question: 'a'.repeat(9000) }), env, options))
      .status,
    413,
  );
});
test('empty corpus abstains and keeps allowed CORS headers', async () => {
  const response = await handleRequest(
    request({ question: 'test' }),
    env,
    options,
  );
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get('Access-Control-Allow-Origin'),
    env.ALLOWED_ORIGINS,
  );
  assert.equal((await response.json()).status, 'not_found');
});
test('quota failure is not bypassed by inference', async () => {
  const response = await handleRequest(request({ question: 'test' }), env, {
    ...options,
    reserve: async () => ({ allowed: false, retryAfter: 30 }),
    answer: () => {
      throw Error('Must not call');
    },
  });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '30');
});
test('quota storage survives wrapper restarts and resets at UTC midnight', async () => {
  const data = new Map();
  const storage = () => ({
    transaction: async (fn) =>
      fn({
        get: async (k) => data.get(k),
        put: async (k, v) => data.set(k, v),
      }),
  });
  const start = Date.parse('2026-09-19T10:00:00Z');
  assert.equal((await reserveQuota(storage(), start)).allowed, true);
  assert.equal((await reserveQuota(storage(), start + 1)).allowed, false);
  for (let i = 1; i < 50; i++)
    assert.equal(
      (await reserveQuota(storage(), start + i * 60000)).allowed,
      true,
    );
  assert.equal(
    (await reserveQuota(storage(), start + 50 * 60000)).allowed,
    false,
  );
  assert.equal(
    (await reserveQuota(storage(), Date.parse('2026-09-20T00:00:00Z'))).allowed,
    true,
  );
});
