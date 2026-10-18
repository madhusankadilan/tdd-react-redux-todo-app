# 0009. Feature-based folder structure

- **Status:** Accepted
- **Date:** 2026-10-18 (proposed 2026-10-15)

## Context
The current code is organised by type (`components/`, `containers/`, `pages/`), which came from the original kanban layout. As features grow, code for one feature (slice, selectors, components, tests) gets spread across many folders. The Redux Toolkit docs recommend grouping by feature.

## Decision
Organise `src/` by feature:

```
src/
  store/           # Redux store setup and typed hooks
  design-system/   # tokens, components (ADR-0006)
  features/
    tasks/         # slice, selectors, components, tests, index.ts (public API)
    notifications/
  lib/             # framework-free helpers: persistence, clock, id
  test/            # shared test utilities, fakes, builders
  App.tsx          # App shell
  main.tsx         # entry point: creates the store, renders <Provider> and <App />
```

Rules:
- A feature exposes its public API through `index.ts`. Other features import only from there.
- `store/` only holds Redux setup. It imports each feature's reducer, and features import only its typed hooks and types.
- These boundaries are described in the [architecture overview](../overview.md#3-layers-and-dependency-rules). Until a lint rule enforces them, code review does.

## Alternatives considered
- **Keep the type-based folders:** familiar, but one change touches many folders, and the boundaries between features are implicit.
- **Pages-only structure:** works for routing-heavy apps. This app has one main screen.
- **`app/` for the store, hooks, providers and App shell** (the official Redux template's convention): recognisable, but the name doesn't say the store is in it. `store/` names exactly what's inside, and the App shell stays at the `src/` root.

## Consequences
- Everything for one feature lives in one place, so it's easy to find, test and delete.
- Requires moving existing files. This should happen as part of the Option B rebuild (TDD-22/23/24/37/38) rather than as a separate big move. Until then, the old `components/`, `containers/` and `pages/` folders exist next to the new ones.
- New code goes into the new structure. The first was the Redux setup (`store/`) and the tasks feature (`features/tasks/`) in TDD-49.
- `CLAUDE.md` and the architecture overview describe the folders, and are updated along with this decision.
