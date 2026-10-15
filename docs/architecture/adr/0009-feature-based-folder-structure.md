# 0009. Feature-based folder structure

- **Status:** Proposed
- **Date:** 2026-10-15

## Context
The current code is organised by type (`components/`, `containers/`, `pages/`), which came from the original kanban layout. As features grow, code for one feature (slice, selectors, components, tests) gets spread across many folders. The Redux Toolkit docs recommend grouping by feature.

## Decision
Organise `src/` by feature:

```
src/
  app/             # store, typed hooks, providers, App shell
  design-system/   # tokens, components (ADR-0006)
  features/
    tasks/         # slice, selectors, components, tests, index.ts (public API)
    notifications/
  lib/             # framework-free helpers: persistence, clock, id
  test/            # shared test utilities, fakes, builders
```

Rules:
- A feature exposes its public API through `index.ts`. Other features import only from there.
- Lint enforces these boundaries (see the [architecture overview](../overview.md#3-layers-and-dependency-rules)).

## Alternatives considered
- **Keep the type-based folders:** familiar, but one change touches many folders, and the boundaries between features are implicit.
- **Pages-only structure:** works for routing-heavy apps. This app has one main screen.

## Consequences
- Everything for one feature lives in one place, so it's easy to find, test and delete.
- Requires moving existing files. This should happen as part of the Option B rebuild (TDD-22/23/24/37/38) rather than as a separate big move.
- `CLAUDE.md` and `CONTRIBUTING.md` need their folder sections updated once this is accepted.
