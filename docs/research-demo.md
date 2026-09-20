# Research abstract demo

This is a separate evidence mode from the reviewed local corpus. The user approved testing PubMed, Europe PMC and DOAJ on 2026-09-19. Research results are not marked as reviewed clinical guidance. No patient data or dosing questions belong in this demo.

## Retrieval and rights

1. Groq `openai/gpt-oss-120b` translates an eligible general question into bounded English search terms. Ineligible questions abstain before literature API calls. Only terms are sent to literature services; the original question is sent to Groq.
2. PubMed ESearch + ESummary discover up to four titles/PMIDs/DOIs. PubMed abstract text is not copied into the model context.
3. Europe PMC core search returns up to six OA records. Only explicit CC BY or CC0 licenses qualify an abstract for synthesis. OA alone, missing licenses and NC/ND variants do not qualify.
4. DOAJ searches up to six articles. Abstract metadata falls under DOAJ's CC0 metadata waiver; this does not license the linked publisher full text.
5. PMID/DOI duplicates are combined. Explicit retraction, withdrawal, expression-of-concern and preprint flags found in returned metadata exclude synthesis. These services do not guarantee complete or current retraction coverage.
6. At most three complete abstracts (120–6000 characters each) are used. Titles without usable abstracts remain discovery links, not evidence. No full text is downloaded in this version.
7. The existing source-bound summarizer produces Finnish text and returns passage IDs. The server verifies IDs and builds all citations from retrieved records. Missing support abstains; all-provider failure is an error; partial failures are visible beside the answer.

Snapshots include abstract text, license, provider, retrieval time, article identifiers, query and per-provider status. They are saved with the existing heart/stack flow. They do not acquire reviewer names, review dates or automatic updates.

## Limits and operation

Workers use the existing persistent global quota: 50 accepted requests per UTC day, at least 60 seconds apart. A request uses at most two Groq calls (query planning and summary). Empty/blocked searches use only the planning call. Translation is bounded to 10 seconds, each source request to 12 seconds, and summarization to 20 seconds. PubMed makes two sequential calls; the client allows 65 seconds. Provider bodies are bounded to 600 KB and redirects are refused. Arbitrary publisher links are never fetched. No questions or responses are logged by application code; source platforms receive search terms.

Cloudflare activation: `CHAT_ENABLED=true` and `RESEARCH_ENABLED=true`. `CHAT_ENABLED=false` disables chat. `RESEARCH_ENABLED=false` restores the reviewed local-corpus path (currently empty). Local Node development uses `RESEARCH_ENABLED=true` in `server/.env`.

GitHub Pages uses the verified Worker `/chat` endpoint as the public workflow default. Native builds still require `EXPO_PUBLIC_CHAT_API_URL`. The UI retains the prewritten demo toggle.

## Verification status

- Deterministic tests exercise query rejection, license filtering, deduplication, API outages, response-size limits, title-only abstention, source attribution, and persistent saved research cards.
- A real source-only query `anesthesia depth monitoring` returned results from all three providers and three eligible abstracts. This proves retrieval connectivity, not answer quality.
- Live Groq/Cloudflare acceptance results are recorded separately after deployment. This research demo has not undergone clinical validation. The reviewed-corpus evaluation in `chat-evaluation.md` remains a separate, unfinished gate for that mode.

Official references:
- https://www.ncbi.nlm.nih.gov/books/NBK25497/
- https://www.ncbi.nlm.nih.gov/About/disclaimer.html
- https://europepmc.org/RestfulWebService
- https://doaj.org/docs/faq/
- https://console.groq.com/docs/structured-outputs

## Live acceptance, 2026-09-19

A deployed browser query about anesthesia depth monitoring completed through the user's Groq secret, with 4 PubMed, 6 Europe PMC and 6 DOAJ discovery records and 3 eligible Europe PMC abstracts cited. The answer's numerical accuracy claim was present in its cited abstract. Opening citations showed full used abstracts, licenses and retrieval dates. Saving the answer with the heart and reopening it after a page reload preserved the answer and its research metadata.

The first wording overgeneralized the small evidence sample. The research prompt was tightened to attribute findings to individual studies, mention study limitations, and include sample size when reporting accuracy. PubMed discovery now excludes animal-only MeSH records. Neither change is a guarantee of clinical accuracy or exhaustive relevance.

A production-only failure was reproduced in workerd: `redirect: 'error'` raises a TypeError in the installed runtime. All upstream calls now use `manual`, reject non-success responses, and never follow redirect locations. Two real workerd tests cover successful query planning and rejecting a redirect without forwarding credentials. CI installs the Worker dependencies before linting those tests.

A no-evidence browser query for a deliberately fictitious monitor name (`Zyxqvorn`) returned zero results from all three providers and the fixed Finnish no-source answer, with no citations. It did not invent a device description.

## WikiAnesthesia (20.9.2026)

The live educational search also queries WikiAnesthesia's public MediaWiki API.
It searches main-namespace pages, skips empty placeholders, retrieves at most
three text extracts and includes up to two opening excerpts (whole paragraphs,
maximum 5,500 characters each). Bibliographies are excluded. This is a bounded
online search, not a full-site import or a complete evidence review. A source
failure is displayed and does not prevent the other sources from answering.

Wiki evidence is explicitly typed `wiki`; it is not labelled a research abstract
or clinically reviewed content. The prompt distinguishes wiki explanations from
individual study findings. Existing patient-specific and medication-dose
restrictions remain in place. Each citation preserves its revision permalink,
revision timestamp, contributors/history link, retrieval date and license.
These fields survive saving/reloading a card. No new API key is needed.

The site's copyright section specifies CC BY-SA 4.0:
https://wikianesthesia.org/wiki/WikiAnesthesia:General_disclaimer
Its surrounding terms also contain generic personal-use wording; this integration
relies on the explicit text copyright license, attributes the contributors and
marks wiki-derived answer text as an AI-translated/shortened CC BY-SA 4.0
adaptation. This notice does not license the application's code or separately
attributed research abstracts under CC BY-SA. Images, logos, calculators and
linked third-party publications are not imported. The API's `rightsinfo` is
empty, so it is not used to invent a license. Review the source's terms again
before any commercial reuse.

Tests cover empty-page exclusion, bibliography exclusion, fixed API host,
revision/attribution preservation, wiki-only synthesis with other sources offline,
and saved-card license display/validation. API checks confirmed the search and
plain-text extracts for combined spinal-epidural anesthesia.
