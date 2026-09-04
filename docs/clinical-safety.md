# Clinical safety principles

## Current classification

AnestesiaHelppi is an educational portfolio prototype. It is not validated for clinical use and must not be relied on for patient care. Any future change in intended use requires a separate regulatory and clinical risk assessment.

## Non-negotiable boundaries

- Do not collect or store patient-identifiable information.
- Do not recommend diagnoses, treatments or patient-specific actions.
- Do not calculate or recommend medication doses in the portfolio prototype.
- Do not present draft content as clinically approved.
- Do not silently use generative output as source material.

## Content lifecycle

Clinical content should move through explicit states:

1. **Draft:** incomplete and not suitable for clinical use.
2. **In review:** awaiting named, competent review.
3. **Reviewed:** approved against recorded sources for the stated scope.
4. **Stale:** review date has passed or a source has changed.
5. **Retired:** intentionally unavailable in the product.

Each item should record its author, reviewer, source links, version, last review date and next review date. The interface must make the state visible.

## Engineering safeguards

- Keep clinical content separate from presentation code.
- Validate required provenance metadata automatically.
- Test safety notices, review-state indicators and stale-content behavior.
- Keep an auditable history of content changes.
- Treat offline content as versioned data and make update failures visible.

## Before any clinical pilot

A qualified clinical owner must approve the intended use, content sources, review process and risk controls. Privacy, security, accessibility and applicable medical-device regulation must be assessed for the actual deployment context.

## Incident handling

Safety concerns should be recorded as high-priority issues. Potentially unsafe content should be removed from the product view until reviewed, while its change history remains auditable.
