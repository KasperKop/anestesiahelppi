# Chat and saved cards: development

## Try the offline portfolio demonstration

```sh
npm ci
npm run web
```

Leave `EXPO_PUBLIC_CHAT_API_URL` unset. Under the weight selector, choose a prewritten example, save it with the heart and open the left-hand **Omat pinot** tab. Create a stack, open the card, move it and reload the application. All example content describes the app itself, not medical facts.

The existing weight-card route remains available. Navigation uses visible tabs; drag-and-drop and swipe gestures are deferred. All organization actions have touch/keyboard-operable buttons.

## Run the source-backed server locally

Requires Node 24. Copy `server/.env.example` to `server/.env` and add the Groq API key there using your local editor or secret manager. Never put the key in chat, GitHub, or an `EXPO_PUBLIC_` variable. Real `.env` files are ignored by git.

```sh
npm run server
```

Copy root `.env.example` to `.env`, set `EXPO_PUBLIC_CHAT_API_URL=http://localhost:8787/chat`, then restart Expo. For a physical phone, localhost points at the phone; use a reachable development server address, bind the backend to the intended interface, and allow only the required web origin. Use HTTPS and deployment-level access/rate controls before public exposure.

The server starts on loopback port 8787. Only `/chat` POST accepts a JSON object containing `question` (1–1000 characters). The mobile app never sends weight, saved cards or stacks. The empty corpus returns `not_found` without an API call. Model usage starts only when eligible source chunks are installed and matched.

No hosting account, billing or live inference is enabled by this commit. The GitHub Pages workflow builds only the frontend; a live chat needs a separately deployed backend. A Groq console free-tier account/key and reviewed source corpus are the remaining inputs.

## Add reviewed content

`server/data/corpus.json` has this shape (illustrative nonclinical metadata only; do not copy placeholder review credentials as approval):

```json
{
  "version": 1,
  "sources": [
    { "id": "source-id", "name": "Publisher", "type": "manual", "active": true, "usageRights": "Recorded permission or applicable license" }
  ],
  "documents": [
    {
      "id": "document-version-id", "sourceId": "source-id",
      "title": "Document title", "url": "https://example.org/document",
      "version": "1", "status": "reviewed", "reviewer": "Actual reviewer",
      "reviewedAt": "2026-09-13T00:00:00Z", "nextReviewAt": "2027-09-13T00:00:00Z"
    }
  ],
  "chunks": [
    {
      "id": "unique-chunk-id", "documentId": "document-version-id",
      "locator": "Page / heading", "text": "Approved passage, maximum 4000 characters",
      "keywords": ["Finnish term", "English equivalent"]
    }
  ]
}
```

Use globally unique chunk IDs and immutable document-version IDs. Preserve previous versions in git. Review actual document usage rights; public accessibility does not by itself authorize redistribution. Do not add generative output to the approved corpus. Restart the server after editing the corpus.

## Verification

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:server
npm run build:web
```

`docs/chat-evaluation.md` defines the pending live evaluation. Automated mock-provider tests establish protocol behavior, not model quality or clinical validity.

## Selected hosted deployment

See [Cloudflare deployment](cloudflare-deployment.md) for the prepared Workers adapter, persistent shared demo quota and secret setup. The local Node server remains available for development.
