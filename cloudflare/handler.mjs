import { answerResearch } from '../server/research.mjs';
import { answerQuestion, ChatError } from '../server/chat.mjs';

export async function reserveQuota(storage, now = Date.now()) {
  return storage.transaction(async (tx) => {
    const day = new Date(now).toISOString().slice(0, 10);
    const saved = await tx.get('quota');
    const count = saved?.day === day ? saved.count : 0;
    if (count >= 50)
      return {
        allowed: false,
        retryAfter: Math.ceil(
          (Date.parse(`${day}T00:00:00Z`) + 86400000 - now) / 1000,
        ),
      };
    if (saved && now < saved.nextAt)
      return {
        allowed: false,
        retryAfter: Math.ceil((saved.nextAt - now) / 1000),
      };
    await tx.put('quota', { day, count: count + 1, nextAt: now + 60000 });
    return { allowed: true };
  });
}
export async function handleRequest(request, env, { corpus, reserve, answer }) {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
  const reply = (status, body, extra = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, ...extra },
    });
  if (origin && !allowed.includes(origin))
    return reply(403, { error: 'Origin not allowed' });
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  const path = new URL(request.url).pathname;
  if (path === '/health' && request.method === 'GET')
    return reply(200, {
      status: 'ok',
      chatEnabled: env.CHAT_ENABLED === 'true',
      researchEnabled: env.RESEARCH_ENABLED === 'true',
    });
  if (path !== '/chat') return reply(404, { error: 'Not found' });
  if (request.method === 'OPTIONS')
    return new Response(null, {
      status: 204,
      headers: {
        ...headers,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  if (request.method !== 'POST')
    return reply(405, { error: 'Method not allowed' });
  if (env.CHAT_ENABLED !== 'true' || !env.GROQ_API_KEY)
    return reply(503, { error: 'Chat-palvelua ei ole vielä otettu käyttöön.' });
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    return reply(415, { error: 'JSON required' });
  try {
    // Bound the actual stream, not a client-supplied Content-Length header.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: 'Question required' });
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        return reply(413, { error: 'Question too large' });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    let input;
    try {
      input = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return reply(400, { error: 'Invalid JSON' });
    }
    if (
      !input ||
      typeof input.question !== 'string' ||
      !input.question.trim() ||
      input.question.length > 1000 ||
      Object.keys(input).some((k) => k !== 'question')
    )
      return reply(400, { error: 'Anna 1–1000 merkin kysymys.' });
    const quota = await reserve();
    if (!quota.allowed)
      return reply(
        429,
        { error: 'Demon käyttöraja täyttyi. Yritä myöhemmin.' },
        { 'Retry-After': String(quota.retryAfter) },
      );
    const result = await (
      answer ??
      (env.RESEARCH_ENABLED === 'true' ? answerResearch : answerQuestion)
    )(input.question.trim(), {
      corpus,
      apiKey: env.GROQ_API_KEY,
    });
    return reply(200, result);
  } catch (error) {
    return reply(error instanceof ChatError ? error.status : 502, {
      error:
        error instanceof ChatError
          ? error.message
          : 'Chat-palvelun yhteys epäonnistui.',
    });
  }
}
