# Roadmap

The roadmap is outcome-based. Dates are intentionally omitted until discovery has produced enough evidence for realistic estimates.

## Foundation

- Define product intent, exclusions and audience.
- Record clinical safety and content governance principles.
- Maintain a prioritized GitHub issue backlog.
- Document decisions before selecting the application stack.

**Exit criteria:** the MVP boundary, safety constraints and first implementation issues are reviewable in the repository.

## v0.1 — Interface prototype

- Select and document the frontend stack.
- Establish formatting, linting, tests and continuous integration.
- Build mobile navigation and checklist interactions with placeholder content.
- Run an accessibility and responsive-layout review.

**Exit criteria:** the prototype runs locally, core interactions are tested and no content is presented as approved clinical guidance.

## v0.2 — Content model

- Define checklist, item, source, version and review metadata.
- Add a small set of explicitly reviewed example content.
- Add content validation and visible review-state indicators.

**Exit criteria:** every displayed clinical statement has ownership, provenance and status metadata.

## v0.3 — Reference library

- Add browsing and search.
- Support source citations and last-reviewed dates.
- Define an offline update and stale-content experience.

## v0.4 — Constrained assistant experiment

- Retrieve answers only from an approved corpus.
- Always show supporting sources and uncertainty.
- Evaluate refusal behavior and unsafe-query handling.

This phase proceeds only after a written risk review. The assistant will not provide patient-specific decisions or medication dosing.

## v1.0 — Installable PWA

- Add installation and offline support.
- Complete usability, accessibility, security and content-governance reviews.
- Publish limitations, test evidence and a versioned release.
