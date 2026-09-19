import { Buffer } from 'node:buffer';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { answerResearch } from './research.mjs';
import { answerQuestion, ChatError } from './chat.mjs';

// One-process demo limits. No client-supplied identity can increase the budget.
export function createChatServer({
  corpus,
  apiKey,
  fetchImpl,
  allowedOrigins = [],
  dailyLimit = 50,
  researchEnabled = false,
} = {}) {
  let day = '',
    requests = 0,
    lastRequest = 0,
    inFlight = false;
  return createServer(async (req, res) => {
    const origin = req.headers.origin;
    const reply = (status, body) => {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(JSON.stringify(body));
    };
    if (origin && !allowedOrigins.includes(origin))
      return reply(403, { error: 'Origin not allowed' });
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    if (req.url !== '/chat') return reply(404, { error: 'Not found' });
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.writeHead(204);
      return res.end();
    }
    if (req.method !== 'POST')
      return reply(405, { error: 'Method not allowed' });
    if (!req.headers['content-type']?.startsWith('application/json'))
      return reply(415, { error: 'JSON required' });
    try {
      let size = 0;
      const buffers = [];
      for await (const buffer of req) {
        size += buffer.length;
        if (size > 8192) throw new ChatError(413, 'Kysymys on liian pitkä.');
        buffers.push(buffer);
      }
      let input;
      try {
        input = JSON.parse(Buffer.concat(buffers).toString('utf8'));
      } catch {
        throw new ChatError(400, 'Virheellinen kysymys.');
      }
      if (
        !input ||
        typeof input.question !== 'string' ||
        !input.question.trim() ||
        input.question.length > 1000 ||
        Object.keys(input).some((k) => k !== 'question')
      )
        throw new ChatError(400, 'Anna 1–1000 merkin kysymys.');
      const today = new Date().toISOString().slice(0, 10);
      if (day !== today) {
        day = today;
        requests = 0;
      }
      if (
        requests >= dailyLimit ||
        inFlight ||
        Date.now() - lastRequest < 60000
      ) {
        res.setHeader('Retry-After', requests >= dailyLimit ? '3600' : '60');
        return reply(429, {
          error: 'Demon käyttöraja täyttyi. Yritä myöhemmin.',
        });
      }
      requests++;
      lastRequest = Date.now();
      inFlight = true;
      try {
        reply(
          200,
          await (researchEnabled ? answerResearch : answerQuestion)(
            input.question.trim(),
            {
              corpus,
              apiKey,
              fetchImpl,
            },
          ),
        );
      } finally {
        inFlight = false;
      }
    } catch (error) {
      reply(error instanceof ChatError ? error.status : 502, {
        error:
          error instanceof ChatError
            ? error.message
            : 'Chat-palvelussa tapahtui virhe.',
      });
    }
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const corpus = JSON.parse(
    await readFile(new URL('./data/corpus.json', import.meta.url), 'utf8'),
  );
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ??
    'http://localhost:8081,http://localhost:19006'
  )
    .split(',')
    .map((s) => s.trim());
  const server = createChatServer({
    corpus,
    apiKey: process.env.GROQ_API_KEY,
    researchEnabled: process.env.RESEARCH_ENABLED === 'true',
    allowedOrigins,
  });
  server.requestTimeout = 10000;
  server.listen(
    Number(process.env.PORT ?? 8787),
    process.env.HOST ?? '127.0.0.1',
    () =>
      console.log(
        'AnestesiaHelppi chat server ready. No questions or answers are logged.',
      ),
  );
}
