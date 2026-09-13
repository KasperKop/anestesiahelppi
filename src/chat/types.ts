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
};
export const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
