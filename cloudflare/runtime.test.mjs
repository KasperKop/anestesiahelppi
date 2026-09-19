import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

// Exercise real workerd fetch validation, streams and AbortSignal. Node mocks do
// not detect workerd's unsupported redirect:'error' RequestInit value.
async function runtime(t, upstream) {
  const result = await build({
    stdin: {
      contents: `import {planQuery} from './server/research.mjs';
      export default { async fetch() { try { return Response.json(await planQuery('Yleinen tutkimuskysymys', {apiKey:'test-only'})); }
      catch(e) {return Response.json({error:e.message}, {status:502});} } };`,
      resolveDir: new URL('..', import.meta.url).pathname,
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    external: ['node:crypto'],
  });
  const mf = new Miniflare(
    convertV4MiniflareOptions({
      host: '127.0.0.1',
      port: 0,
      modules: true,
      compatibilityDate: '2026-09-19',
      compatibilityFlags: ['nodejs_compat'],
      script: result.outputFiles[0].text,
      outboundService: upstream,
    }),
  );
  t.after(() => mf.dispose());
  return mf;
}
test('query planning runs in workerd with a bounded response stream', async (t) => {
  let calls = 0;
  const mf = await runtime(t, async (req) => {
    calls++;
    assert.equal(new URL(req.url).hostname, 'api.groq.com');
    const body = await req.json();
    assert.equal(body.response_format.json_schema.name, 'research_query');
    return Response.json({
      choices: [
        {
          finish_reason: 'stop',
          message: {
            content: JSON.stringify({
              allowed: true,
              query: 'anesthesia monitoring',
            }),
          },
        },
      ],
    });
  });
  const response = await mf.dispatchFetch('http://localhost/');
  assert.equal(response.status, 200, await response.clone().text());
  assert.equal(await response.json(), 'anesthesia monitoring');
  assert.equal(calls, 1);
});
test('workerd rejects redirects without forwarding the authorization header', async (t) => {
  const visited = [];
  const mf = await runtime(t, async (req) => {
    visited.push(new URL(req.url).hostname);
    return new Response(null, {
      status: 302,
      headers: { Location: 'https://untrusted.example/' },
    });
  });
  const response = await mf.dispatchFetch('http://localhost/');
  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /HTTP 302/);
  assert.deepEqual(visited, ['api.groq.com']);
});
