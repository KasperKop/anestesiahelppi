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
    (a.evidenceMode === undefined || a.evidenceMode === 'research') &&
    (a.searchQuery === undefined || typeof a.searchQuery === 'string') &&
    (a.searches === undefined ||
      (Array.isArray(a.searches) &&
        a.searches.every(
          (s) =>
            s &&
            typeof s.provider === 'string' &&
            ['ok', 'error'].includes(s.status) &&
            Number.isInteger(s.count),
        ))) &&
    (a.searchResults === undefined ||
      (Array.isArray(a.searchResults) &&
        a.searchResults.every(
          (r) =>
            r &&
            typeof r.id === 'string' &&
            typeof r.title === 'string' &&
            typeof r.url === 'string' &&
            /^https:\/\//.test(r.url) &&
            Array.isArray(r.providers) &&
            r.providers.every((p) => typeof p === 'string') &&
            typeof r.abstractAvailable === 'boolean',
        ))) &&
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
        (c.evidenceType === 'abstract' || c.evidenceType === 'wiki'
          ? a.evidenceMode === 'research' &&
            typeof c.license === 'string' &&
            !!c.license &&
            (c.evidenceType !== 'wiki' ||
              (c.license === 'CC BY-SA 4.0' &&
                c.licenseUrl ===
                  'https://creativecommons.org/licenses/by-sa/4.0/' &&
                typeof c.attribution === 'string' &&
                !!c.attribution &&
                typeof c.historyUrl === 'string' &&
                c.historyUrl.startsWith(
                  'https://wikianesthesia.org/w/index.php?',
                ))) &&
            typeof c.provider === 'string' &&
            typeof c.retrievedAt === 'string' &&
            Number.isFinite(Date.parse(c.retrievedAt))
          : Number.isFinite(Date.parse(c.nextReviewAt))),
    ) &&
    !(a.mode === 'live' && a.status === 'answered' && a.citations.length === 0)
  );
}
export async function askLive(question: string): Promise<Answer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 65000);
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
    if (!response.ok) {
      const failure: unknown = await response.json().catch(() => null);
      const message =
        failure &&
        typeof failure === 'object' &&
        'error' in failure &&
        typeof failure.error === 'string' &&
        failure.error.length <= 300
          ? failure.error
          : `Vastauksen hakeminen epäonnistui (HTTP ${response.status}).`;
      throw new Error(message);
    }
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
