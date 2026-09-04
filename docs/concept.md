# Product concept

## Problem

Anesthesia nursing involves recurring preparation and handover workflows where information must be easy to scan under time pressure. General note-taking tools do not provide the structure, review status or provenance expected from a healthcare-oriented reference tool.

## Proposed product

AnestesiaHelppi is a mobile-first checklist and reference application. It aims to make reviewed, versioned content quick to find without presenting itself as an authority for clinical decisions.

## Initial users

- Anesthesia nurses exploring a structured preparation aid
- Students practising workflow sequencing in a clearly marked educational context
- Portfolio reviewers evaluating the product and engineering process

These are hypotheses to validate through interviews and usability testing; they are not yet confirmed user requirements.

## MVP boundaries

The first usable prototype will include navigation, a checklist interaction model, completion progress and content provenance. It will not store patient data, calculate medication doses, recommend treatment, replace local guidelines or provide autonomous clinical decisions.

The initial interaction flows are documented in [MVP user journeys](user-journeys.md). Their visual and accessibility constraints are recorded in [UI and interaction guidelines](ui-guidelines.md).

## Design principles

1. **Calm under pressure:** important actions are visually obvious and screens remain uncluttered.
2. **Source before confidence:** every clinical statement can expose its source, version and review state.
3. **Safe by default:** no patient identifiers and no hidden inference about patient care.
4. **Accessible by design:** keyboard support, readable contrast, large touch targets and plain Finnish.
5. **Progressive complexity:** the checklist works before search, offline mode or assistant features are added.

## Success signals

- A first-time user understands the prototype without instruction.
- A checklist can be completed on a phone-sized screen without accidental actions.
- Users can identify whether content is draft, reviewed or outdated.
- Automated checks protect core interactions and accessibility expectations.
- Repository history shows why major product and technical decisions were made.
