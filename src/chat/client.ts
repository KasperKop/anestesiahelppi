import { Answer } from './types';

export const chatEndpoint = process.env.EXPO_PUBLIC_CHAT_API_URL?.trim() ?? '';
export function isAnswer(value: unknown): value is Answer {
  if (!value || typeof value !== 'object') return false;
  const a = value as Answer;
  return (
    typeof a.id === 'string' &&
    typeof a.question === 'string' &&
    typeof a.title === 'string' &&
    typeof a.body === 'string' &&
    typeof a.createdAt === 'string' &&
    Number.isFinite(Date.parse(a.createdAt)) &&
    ['answered', 'not_found'].includes(a.status) &&
    ['demo', 'live'].includes(a.mode) &&
    Array.isArray(a.citations) &&
    a.citations.every(
      (c) =>
        c &&
        [
          'chunkId',
          'documentId',
          'title',
          'url',
          'locator',
          'excerpt',
          'version',
          'reviewedAt',
          'nextReviewAt',
        ].every((key) => typeof c[key as keyof typeof c] === 'string') &&
        /^https:\/\//.test(c.url) &&
        Number.isFinite(Date.parse(c.nextReviewAt)),
    ) &&
    !(a.mode === 'live' && a.status === 'answered' && a.citations.length === 0)
  );
}
export async function askLive(question: string): Promise<Answer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(chatEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });
    if (response.status === 429)
      throw new Error('Chatin käyttöraja täyttyi. Yritä myöhemmin uudelleen.');
    if (response.status === 503)
      throw new Error(
        'Chat-palvelua ei ole vielä otettu käyttöön. Voit kokeilla esittelytilaa.',
      );
    if (!response.ok)
      throw new Error('Vastauksen hakeminen epäonnistui. Yritä uudelleen.');
    const answer: unknown = await response.json();
    if (
      !isAnswer(answer) ||
      answer.mode !== 'live' ||
      answer.question !== question
    )
      throw new Error('Chat-palvelu palautti virheellisen vastauksen.');
    return answer;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError')
      throw new Error('Vastaus viipyi liian kauan. Yritä uudelleen.');
    if (error instanceof TypeError)
      throw new Error(
        'Yhteys chat-palveluun ei onnistunut. Tarkista verkkoyhteys.',
      );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
