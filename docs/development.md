# Development approach

## Portfolio workflow

Work is split into small issues and focused commits. Pull requests should explain the problem, chosen approach, alternatives, tests and screenshots when the interface changes.

The project owner directs product decisions and reviews visible outcomes. The implementation agent is responsible for code, tests and technical documentation, so participation does not require the owner to write code.

## Branches and commits

- Keep `main` in a reviewable state.
- Use short-lived feature branches once application development starts.
- Prefer conventional commit prefixes such as `docs:`, `feat:`, `fix:`, `test:` and `chore:`.
- Keep unrelated changes in separate commits.

## Definition of done

A change is done when its acceptance criteria are met, relevant automated checks pass, documentation is updated and safety or accessibility implications have been considered.

## Decision records

Material choices — application stack, content storage, offline update model and assistant architecture — are recorded under `docs/decisions/`.

- [ADR 0001: Use Expo and React Native for the application](decisions/0001-expo-react-native.md)

## Selected development baseline

- Expo with React Native and strict TypeScript
- Expo Router for iOS, Android and optional web navigation
- Jest and React Native Testing Library for component behavior
- GitHub Actions for formatting, linting, type checking and tests
- EAS development and preview builds when installable device testing begins

Exact dependency versions will be selected and committed with the v0.1 scaffold.

## Proposed quality gates

- Formatting and linting
- Strict TypeScript checks
- Unit and component tests
- Accessibility checks for core flows
- Android and iOS device-level verification
- Responsive web smoke tests for the portfolio preview
- Dependency and secret scanning
- Content-schema validation once clinical content is introduced

## Supported review workflow

The owner can review progress through GitHub pull requests, screenshots, a web preview and later installable Android/iOS preview builds. Store releases, developer accounts and signing credentials remain separate, explicitly approved release steps.

## Content contributions

Clinical content changes require traceable sources and review metadata. A software review alone does not make content clinically approved.
