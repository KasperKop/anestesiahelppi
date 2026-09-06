# ADR 0001: Use Expo and React Native for the application

- **Status:** Accepted
- **Date:** 2026-09-06
- **Decision owners:** Project owner and implementation agent

## Context

AnestesiaHelppi must run on both iOS and Android. The project owner will direct the product, review prototypes and test builds but will not participate in coding. The implementation therefore needs one maintainable codebase, straightforward device previews, strong automated testing and a credible path to native distribution.

The application also needs touch interactions, offline-capable personal stacks, accessible navigation and room for later platform features. It must remain possible to show a web-based portfolio preview without making the web version the primary clinical-context experience.

## Decision drivers

- One shared implementation for iOS and Android
- Low operational burden for a non-coding project owner
- Fast installation and review on physical devices
- Native-quality touch, gesture and accessibility primitives
- Local/offline data storage
- Automated unit and component testing
- A clear path to TestFlight and Google Play distribution
- Strong portfolio value without unnecessary native build complexity

## Considered options

### 1. Expo with React Native and TypeScript — selected

Expo provides a production-grade React Native framework for Android, iOS and web. Expo Router supplies file-based cross-platform navigation. Development builds and EAS Build can create installable Android and iOS packages in the cloud, reducing the need to maintain native projects or own a Mac during routine development.

**Advantages**

- Shared TypeScript codebase for Android and iOS
- Native components and mobile interaction model
- Physical-device previews early in development
- Cloud builds and a documented store-publication path
- Mature routing, storage and testing options
- Optional web output for portfolio demonstrations
- Escape hatch to native modules when genuinely required

**Trade-offs**

- Native release processes still require platform testing and signing.
- Apple App Store and Google Play publication require their respective developer accounts.
- Expo/EAS adds a framework and optional hosted-service dependency.
- Some platform-specific behavior will still require separate iOS and Android handling.

### 2. Progressive Web App with React and Vite — rejected as the primary platform

A PWA would be easy to deploy and open through a URL, but installation, offline behavior, navigation gestures and platform integration differ between iOS and Android. Those differences add user guidance and testing burden. A web preview remains useful, but the product should not depend on browser installation behavior.

### 3. Separate SwiftUI and native Android applications — rejected

Separate native applications provide maximum platform control but create two codebases, two UI implementations and substantially more maintenance. This is disproportionate for a solo portfolio project and would slow visible product progress.

### 4. Flutter — rejected

Flutter also supports a shared mobile codebase and is technically viable. Expo was selected because React Native uses familiar TypeScript, provides a strong web-preview route, offers an agent-friendly ecosystem and follows the React Native project's recommended framework approach.

## Selected stack

- **Application framework:** Expo with React Native
- **Language:** TypeScript with strict type checking
- **Navigation:** Expo Router
- **Local persistence:** Expo SQLite when the memory bank is introduced
- **Unit and component testing:** Jest through `jest-expo` and React Native Testing Library
- **Formatting and static checks:** Prettier, ESLint and TypeScript
- **Builds:** Local Expo development initially; EAS development/preview builds when device distribution begins
- **Continuous integration:** GitHub Actions for deterministic checks; no store publication automation in v0.1

Exact package versions will be locked when the scaffold is created rather than frozen in this decision record.

## Development and review model

The implementation agent creates code, tests, documentation and pull requests. The project owner provides product direction and evaluates visible behavior through screenshots, web previews or installable device builds. No coding knowledge is required from the project owner, but product and clinical-content decisions remain human decisions.

Routine development can occur on Windows. Android can be tested locally or on a physical device. iOS native builds can be produced through EAS cloud infrastructure; final iOS quality still requires testing on an iPhone or iOS simulator/device environment.

## Distribution boundary

The first milestone is a locally runnable prototype, not a public app-store release. Later distribution may use:

1. Development or preview builds for private testing
2. TestFlight for iOS testing
3. Internal or closed testing on Google Play
4. Public stores only after safety, privacy and content-governance reviews

Store publication will require separate Apple and Google developer memberships, signing credentials, store metadata and user approval for those external actions.

## Consequences

The roadmap shifts from a PWA-first implementation to a universal Expo application. Web remains a useful secondary portfolio surface. The v0.1 scaffold must run on Android, iOS and web where practical, but native mobile behavior takes priority when platform compromises are necessary.

No clinical content, dose calculation or patient-specific functionality is introduced by this decision.

## Validation plan

The scaffold issue must demonstrate:

- successful TypeScript and lint checks
- a passing component test
- the home screen rendering through the Expo development workflow
- documented Android, iOS and web verification status
- no collection of patient data or secrets

## References

- [React Native: use a framework to build React Native apps](https://reactnative.dev/blog/2024/06/25/use-a-framework-to-build-react-native-apps)
- [Expo: create a universal Android, iOS and web app](https://docs.expo.dev/tutorial/introduction/)
- [Expo Router introduction](https://docs.expo.dev/router/introduction/)
- [Expo development and native build workflow](https://docs.expo.dev/workflow/overview/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo unit testing with Jest](https://docs.expo.dev/develop/unit-testing/)
