# ADR 0002: Source-grounded chat and a local memory bank

- Status: Accepted direction; live model evaluation pending
- Date: 2026-09-13
- Scope: Educational portfolio prototype

## Decision

Keep Expo, React Native, TypeScript and Expo Router. Add a left-hand Saved tab and place chat below the existing weight selector. Use Groq's free tier with `openai/gpt-oss-120b` as the initial provider candidate. Keep provider calls in a separate Node 24 service, never in the mobile bundle. Do not enable billing or automatically switch to paid inference.

The default app works without credentials using three clearly labeled, nonclinical, prewritten examples. These are never presented as generated or clinically reviewed answers. Configuring `EXPO_PUBLIC_CHAT_API_URL` enables a separate live mode.

## Source and answer boundary

The uploaded source reference is a catalog of possible integrations, not an approved clinical corpus. Therefore `server/data/corpus.json` intentionally contains no documents. No-source requests return an explicit abstention before calling a model. Real clinical questions will not receive invented demonstration answers.

Versioned sources, documents and text chunks are separate records. Only active sources with recorded usage rights, a reviewed document, named reviewer, recorded version and unexpired review date are eligible. The initial retrieval is conservative keyword overlap, including manually supplied Finnish/English keywords. It is not semantic retrieval and may miss inflections and synonyms. Connectors and embeddings can later replace retrieval without changing answer cards.

The model sees at most three bounded source chunks and cannot initiate web searches. It returns JSON with status, title, body and chunk IDs. The server rejects missing or invented IDs and reconstructs citations using its own corpus. Schema and citation validity do **not** prove factual entailment. Human evaluation with approved content remains required; generated summaries are labeled as not individually reviewed.

Weight is not sent to the chat service. No dose calculation or patient-specific instruction is introduced by the chat feature. Existing weight-card content is outside this change.

## Persistence

Native platforms use Expo SQLite. Version 1 stores an atomic JSON state snapshot in one SQLite row, retaining separate typed stack/card records inside it. This keeps writes atomic and migrations explicit for a small personal portfolio dataset. A future larger dataset can migrate to normalized tables without changing the UI service boundary.

Web uses a platform-specific localStorage adapter because Expo SQLite's web support requires WASM and cross-origin isolation headers unavailable in the existing basic GitHub Pages setup. Both adapters retain the same versioned state format. Browser clearing or app uninstall removes local data. Multi-tab concurrent editing and cross-device sync are not supported in this milestone.

Cards record ID, local owner ID, question, immutable answer snapshot, citations, generation time, save time, stack ID and order. Stacks record ID, local owner ID, name, order and timestamps. The local owner is a future migration field, **not authentication**. Cloud use must introduce real identity and authorization.

Deleting a stack unfiles its cards. Deleting a card requires explicit UI confirmation. Hearts are idempotent for each answer ID and change only after a successful write. Failed reads disable writes rather than replacing existing data. Saved answers do not change when weight or source data changes; review deadlines are displayed but there is no live source-revocation synchronization yet.

## Free-tier operation

The server permits one in-flight request, at most one request every 30 seconds and 50 requests per UTC day across the demo. Counters are process-local and reset on restart. This is suitable for a single-process private demonstration, not a distributed public quota enforcement system. Provider limits are still authoritative; HTTP 429 is surfaced without a paid fallback. Public deployment requires a persistent rate limiter/access controls at the chosen hosting layer. CORS is an origin restriction, not authentication.

Groq credentials are server-side environment variables. Input and output are not logged by this server. Configure Groq Zero Data Retention when creating the project. Hosting and credentials have not been provisioned by this change.

## Alternatives

- OpenRouter free models: useful for evaluation, but small shared daily allowance and changing availability make it a secondary option.
- Gemini free tier: Google's current terms require Paid Services for apps offered to EEA users; not selected for this zero-budget Finland-based demo.
- Self-hosting: avoids a hosted inference bill but adds hardware and maintenance requirements; deferred.

## Verification and remaining gates

Automated tests cover save failure, snapshot reload, stack deletion preserving cards, duplicate saves, ordering, invalid state, the chat-to-stack UI flow, source eligibility, abstention, forged citation IDs, upstream failures and HTTP validation/rate limits. TypeScript, lint, formatting and static web build are required checks.

Live Groq inference, Finnish answer quality and clinical source-grounding evaluation have not been run: there is no API key or approved corpus. Browser visual inspection could not run because the supplied browser blocked the local preview URL. iOS/Android device and actual SQLite runtime checks remain required before device distribution.

## References checked 2026-09-13

- [Groq free-tier limits](https://console.groq.com/docs/rate-limits)
- [Groq GPT-OSS 120B](https://console.groq.com/docs/model/openai/gpt-oss-120b)
- [Groq structured outputs](https://console.groq.com/docs/structured-outputs)
- [Groq data controls](https://console.groq.com/docs/your-data)
- [Gemini terms](https://ai.google.dev/gemini-api/terms)
- [OpenRouter pricing](https://openrouter.ai/pricing)
- [Expo SQLite and web requirements](https://docs.expo.dev/versions/latest/sdk/sqlite/)
