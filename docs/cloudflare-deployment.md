# Cloudflare Workers deployment

The selected hosting for the Groq proxy is Cloudflare Workers, while GitHub Pages continues to host the Expo web demonstration. This package reuses `server/chat.mjs` and the reviewed corpus. It does not run a Node HTTP server or load files at runtime: Wrangler bundles the corpus at build time.

## Current status

Deployment package prepared; **no Cloudflare account connected and no cloud deployment performed**. No Groq key has been provided, and the approved corpus is still empty. `CHAT_ENABLED=false` is intentional. The existing frontend stays in its working offline demonstration until an explicit endpoint is configured.

## Deploy the inactive service

Use Node 24 and a Cloudflare account with the Workers Free plan. From the repository:

```sh
cd cloudflare
npm ci
npx wrangler login
npm run check
npm run deploy
```

The deploy command prints the actual `https://anestesiahelppi-chat.<account-subdomain>.workers.dev` URL. Do not guess the account subdomain. Open `/health` on that URL: it should report `status: ok` and `chatEnabled: false`. A deployment creates one SQLite-backed Durable Object namespace, available on the free plan, for persistent quota state.

Add the Groq key directly in Cloudflare: Workers & Pages → anestesiahelppi-chat → Settings → Variables and Secrets → add a **Secret** named `GROQ_API_KEY`. Alternatively run `npm run secret:groq` and supply it at the terminal's secret prompt. Do not place the value in `wrangler.jsonc`, git, frontend variables or chat. For local testing only, copy `.dev.vars.example` to `.dev.vars` inside this folder.

## Enable live chat only after validation

1. Install an approved, licensed, reviewed source corpus following `chat-development.md`.
2. Run the live evaluation in `chat-evaluation.md`. Confirm CPU usage fits the free-tier budget with the real corpus; the current empty corpus cannot establish that. Larger datasets should use an indexed store instead of scanning every passage.
3. Set `CHAT_ENABLED` to `true` in `wrangler.jsonc`, then redeploy. Keep configuration changes in git; dashboard edits to plain variables can be overwritten by the next deploy.
4. Check a source-backed answer, a no-source answer, quota errors and the allowed web origin.
5. Add a GitHub repository **variable**, not a secret, named `EXPO_PUBLIC_CHAT_API_URL` containing the verified Workers URL plus `/chat`. The Pages workflow uses that value at build time. Re-run the Pages workflow or publish the next approved commit. Native builds use the same public URL in the Expo environment.

Removing that frontend variable and rebuilding restores the offline demo. Set `CHAT_ENABLED=false` and redeploy to disable the backend. No provider billing or paid fallback is enabled by this implementation.

## Quotas and privacy

One named Durable Object (`global-demo-v1`) handles all quota reservations inside storage transactions. The limit is 50 accepted requests per UTC day, at least 30 seconds apart. Reservations are persisted before inference and are not refunded on provider errors, preventing retry storms and quota races. Failure to reach quota storage blocks inference. Only date, count and next-permitted time are stored; questions, answers and API keys are not stored in the object.

The HTTP handler validates origin, method, streamed body size and request shape before quota reservation. No client-supplied owner or ID can create another quota bucket. Missing Origin is accepted for native clients: CORS is not authentication. This is an intentionally public, globally limited portfolio endpoint; visitors can exhaust the shared allowance. Add real per-user authentication if broader use requires fair allocation. Never embed a shared backend password in a public app bundle.

Worker observability is disabled in configuration and the application logs no prompts. Cloudflare/Groq platform processing and metadata still apply. The account owner should enable Groq Zero Data Retention.

## Verification

```sh
# From repository root
npm run test:server
npm run lint
# From cloudflare
npm ci
npm run check
```

Handler tests cover disabled mode, CORS, body limits, rejected extra context, abstention, quota errors and persisted day/cooldown state. Cloudflare bundling is checked with Wrangler dry-run. These checks do not measure production latency/CPU or validate the real model. Cloud deployment, runtime integration and model evaluation remain account-dependent gates.

Official references:
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/durable-objects/get-started/
- https://developers.cloudflare.com/workers/configuration/secrets/
