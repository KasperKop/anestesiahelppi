# Roadmap

The roadmap is outcome-based. Dates are intentionally omitted until discovery has produced enough evidence for realistic estimates.

## Foundation

- Define product intent, exclusions and audience.
- Record clinical safety and content governance principles.
- Maintain a prioritized GitHub issue backlog.
- Document decisions before selecting the application stack.

**Status:** complete. Expo with React Native and TypeScript is recorded in [ADR 0001](decisions/0001-expo-react-native.md).

## v0.1 — Cross-platform interface prototype

- Create the Expo and TypeScript application scaffold.
- Establish formatting, linting, type checking, tests and continuous integration.
- Build mobile navigation and checklist interactions with placeholder content.
- Verify the core screen on Android and iOS; provide a web preview where practical.
- Run an accessibility and responsive-layout review.

**Exit criteria:** the prototype can be reviewed on both mobile platforms, core interactions are tested and no content is presented as approved clinical guidance.

## v0.2 — Content model

- Define checklist, item, source, version and review metadata.
- Add a small set of explicitly reviewed example content.
- Add content validation and visible review-state indicators.
- Establish local persistence for the personal memory bank.

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

## v1.0 — Native mobile release candidate

- Produce signed iOS and Android release candidates.
- Complete usability, accessibility, security and content-governance reviews.
- Validate offline behavior and update handling on both platforms.
- Publish limitations, test evidence and a versioned release.

Public App Store or Google Play distribution is a separate decision requiring developer accounts, store review and explicit release approval.
