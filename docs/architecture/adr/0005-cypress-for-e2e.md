# 0005. Cypress for end-to-end tests

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
Every PRD user story should have an automated end-to-end test in a real browser, against the production build. A Cypress config already exists in the repo from the original setup.

## Decision
We use **Cypress** for E2E tests in `cypress/e2e/`, run headless in CI against `vite preview` (the production build). Accessibility checks run with `cypress-axe`.

## Alternatives considered
- **Playwright:** faster, built-in multi-browser and parallel runs, and a strong choice today. It wasn't chosen because Cypress was already configured and its interactive runner is very approachable for learners. Switching later would be a reasonable new ADR.
- **No E2E, only integration tests:** misses real-browser issues (layout, focus, storage) and the "full journey" proof per story.

## Consequences
- Readable, story-shaped specs with a time-travel debugger for learners.
- E2E runs are slower than unit tests, so they're kept to one journey per story, with details tested at lower levels.
- Mostly Chromium-family runs in CI. Cross-browser coverage is limited compared with Playwright.
