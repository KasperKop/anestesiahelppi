# AnestesiaHelppi

AnestesiaHelppi is a portfolio project for designing a mobile-first checklist and quick-reference application for anesthesia nursing.

> [!IMPORTANT]
> This repository is an educational software project under development. It is not a medical device, a source of treatment instructions, or a substitute for local clinical guidelines and professional judgment.

## Vision

The goal is to explore how a calm, fast and accessible user interface could support anesthesia nurses in preparing for recurring workflows. The first versions focus on software design, usability and transparent content governance — not patient-specific decision-making.

## Planned capabilities

- Native iOS and Android application from a shared codebase
- Mobile-first checklists for recurring workflows
- Searchable, source-linked reference content
- A personal memory bank for organizing saved, source-linked answers
- Offline access to reviewed content
- Clear content versioning and clinical review status
- Optional web preview for portfolio review
- Later, a constrained source-based assistant for information retrieval

## Project status

**Runnable prototype.** The repository contains an Expo, React Native and TypeScript application with a weight selector and weight-card view. A web preview is built and published automatically when main changes.

## Web preview

[Open AnestesiaHelppi](https://kasperkop.github.io/anestesiahelppi/)

The preview is published by `.github/workflows/pages.yml` after each push to `main`. For first-time setup, select **Settings → Pages → Build and deployment → Source → GitHub Actions**, then run **Actions → Publish web preview → Run workflow**. The link becomes available after the first successful deployment.

To preview locally with Node.js 24:

```sh
npm ci
npm run web
```

For the Pages build, the workflow sets `GITHUB_PAGES=true`. `app.config.js` exports static HTML for each route and sets `/anestesiahelppi` as the base URL only for that build. Local development and native builds keep their normal paths.

## Roadmap

| Phase | Outcome |
| --- | --- |
| v0.1 | Runnable Expo prototype for iOS, Android and web preview |
| v0.2 | Versioned checklist content model and reviewed example content |
| v0.3 | Searchable reference library with source metadata |
| v0.4 | Constrained, source-based assistant prototype |
| v1.0 | Tested native mobile release candidate with offline support |

## Technology direction

The application will use Expo, React Native and strict TypeScript. This provides a shared implementation for iOS and Android while retaining an optional web preview. See [ADR 0001](docs/decisions/0001-expo-react-native.md) for the alternatives, trade-offs and distribution constraints.

The project owner directs product decisions and tests visible builds. Coding, automated checks and technical documentation are handled through the implementation workflow.

## Documentation

- [Product concept](docs/concept.md)
- [MVP user journeys](docs/user-journeys.md)
- [UI and interaction guidelines](docs/ui-guidelines.md)
- [Roadmap](docs/roadmap.md)
- [Clinical safety principles](docs/clinical-safety.md)
- [Development approach](docs/development.md)
- [Architecture decisions](docs/decisions/0001-expo-react-native.md)
- [Initial backlog](docs/backlog.md)

## Portfolio goals

This project is intended to demonstrate product discovery, accessible cross-platform mobile development, safety-aware healthcare design, test automation and transparent technical decision-making.

## Working language

The product and clinical content are primarily planned in Finnish. Technical documentation may use English when it improves accessibility for an international portfolio audience.

## License

No license has been selected yet. Until one is added, all rights are reserved.
