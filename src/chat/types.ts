export type Citation = {
  chunkId: string;
  documentId: string;
  title: string;
  url: string;
  locator: string;
  excerpt: string;
  version: string;
  reviewedAt: string;
  nextReviewAt: string;
  evidenceType?: 'abstract';
  retrievedAt?: string;
  provider?: string;
  license?: string;
  doi?: string;
  pmid?: string;
};
export type Answer = {
  id: string;
  question: string;
  title: string;
  body: string;
  citations: Citation[];
  createdAt: string;
  status: 'answered' | 'not_found';
  mode: 'demo' | 'live';
  evidenceMode?: 'research';
  searchQuery?: string;
  searches?: { provider: string; status: 'ok' | 'error'; count: number }[];
  searchResults?: {
    id: string;
    title: string;
    url: string;
    providers: string[];
    abstractAvailable: boolean;
  }[];
};
export const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
