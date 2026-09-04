# Development approach

## Portfolio workflow

Work is split into small issues and focused commits. Pull requests should explain the problem, chosen approach, alternatives, tests and screenshots when the interface changes.

## Branches and commits

- Keep `main` in a reviewable state.
- Use short-lived feature branches once application development starts.
- Prefer conventional commit prefixes such as `docs:`, `feat:`, `fix:`, `test:` and `chore:`.
- Keep unrelated changes in separate commits.

## Definition of done

A change is done when its acceptance criteria are met, relevant automated checks pass, documentation is updated and safety or accessibility implications have been considered.

## Decision records

Material choices — application stack, content storage, offline update model and assistant architecture — should be recorded as short architecture decision records under `docs/decisions/`.

## Proposed quality gates

- Formatting and linting
- Unit and component tests
- Accessibility checks for core flows
- Responsive smoke tests
- Dependency and secret scanning
- Content-schema validation once clinical content is introduced

## Content contributions

Clinical content changes require traceable sources and review metadata. A software review alone does not make content clinically approved.
