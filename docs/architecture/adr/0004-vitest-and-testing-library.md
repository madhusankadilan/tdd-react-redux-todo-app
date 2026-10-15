# 0004. Vitest + React Testing Library for unit, component and integration tests

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
TDD needs a fast feedback loop: tests that re-run in milliseconds on every save. The app is built with Vite, and tests should exercise components the way users do.

## Decision
- **Vitest** runs unit, component and integration tests in `jsdom`, sharing Vite's config and transforms.
- **React Testing Library** with **user-event** renders components and simulates real user interactions.
- **jest-dom** matchers (`toBeInTheDocument`, `toBeDisabled`, …) are loaded in `src/setup.ts`.
- **Coverage** uses `@vitest/coverage-v8`, with thresholds enforced (see the [testing strategy](../../engineering/testing-strategy.md)).

## Alternatives considered
- **Jest:** the long-time standard, but it needs extra Babel/ESM/TypeScript setup with Vite, and it's slower to start. Vitest offers a Jest-compatible API anyway.
- **Enzyme:** encourages testing implementation details, and it's unmaintained for modern React.

## Consequences
- One config and one toolchain for app and tests. Watch mode is fast enough for real red → green cycles.
- Jest knowledge transfers directly (`describe`, `it`, `expect`, `vi.fn()`).
- jsdom isn't a real browser, so layout and visual behavior are covered by Storybook visual tests and Cypress instead.
