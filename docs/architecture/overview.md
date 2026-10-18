# Architecture overview

This document describes how the TDD Todo App is structured: its layers, data flow, state shape and the rules between them. It describes the **target architecture**. The [Current state vs target](#current-state-vs-target) section lists what still has to change in the code.

Related: [PRD](../product/PRD.md) · [ADRs](adr/) · [Testing strategy](../engineering/testing-strategy.md)

## 1. Context

```mermaid
flowchart LR
  User((User)) -->|uses| App["TDD Todo App<br/>(React SPA in the browser)"]
  App -->|reads / writes| LS[("localStorage")]
  Dev((Developer)) -->|builds, tests| Repo["GitHub repo<br/>+ CI"]
  Repo -->|deploys static build| Host["Static host"]
```

- The app is a **single-page application** that runs entirely in the browser ([ADR-0002](adr/0002-frontend-only-with-localstorage.md)).
- There is **no backend and no network traffic** at runtime. Tasks are stored in `localStorage`.
- The build output is static files (HTML, JS, CSS) that any static host can serve.

## 2. Tech stack

| Concern | Choice | ADR |
|---|---|---|
| UI | React 19 + TypeScript (strict) | — |
| Build / dev server | Vite | — |
| State | Redux Toolkit + react-redux | [0003](adr/0003-redux-toolkit-for-state.md) |
| Unit, component, integration tests | Vitest + React Testing Library + user-event | [0004](adr/0004-vitest-and-testing-library.md) |
| End-to-end tests | Cypress | [0005](adr/0005-cypress-for-e2e.md) |
| Design system | In-repo, CSS custom properties (tokens) + React components, documented in Storybook | [0006](adr/0006-in-repo-design-system-with-css-tokens.md) |
| Design tool | Penpot | [0007](adr/0007-penpot-as-design-tool.md) |
| UX direction | Single list + details drawer (Option B) | [0008](adr/0008-list-and-drawer-ux.md) |
| Code organisation | Feature-based folders | [0009](adr/0009-feature-based-folder-structure.md) |
| Linting / formatting | ESLint (code quality) + Prettier (formatting), separate tools | [0010](adr/0010-prettier-alongside-eslint.md) |

## 3. Layers and dependency rules

```mermaid
flowchart TD
  Shell["App.tsx, main.tsx<br/>App shell, entry point"] --> Store
  Shell --> Features
  Store["store/<br/>store setup, typed hooks"] --> Features
  Features["features/<br/>tasks, notifications"] --> DS["design-system/<br/>tokens + components"]
  Features --> Lib["lib/<br/>persistence, clock, id"]
  Store --> Lib
```

| Layer | Contains | May import from | Must not import from |
|---|---|---|---|
| `App.tsx`, `main.tsx` (`src/` root) | App shell and layout; the entry point creates the store and renders `<Provider>` | `store/`, `features/`, `design-system/` | — |
| `store/` | Store setup, `RootState` / `AppDispatch` types, typed hooks | Feature reducers, `lib/` | Feature components |
| `features/<name>/` | A slice, selectors, feature components (containers) and tests for one feature | `design-system/`, `lib/`, `store/` (typed hooks and types only) | Other features' internals (use their public `index.ts`) |
| `design-system/` | Tokens, presentational components, stories | Nothing in the app | `store/`, `features/`, `lib/` |
| `lib/` | Framework-free helpers: the persistence adapter, clock, id generator | — | React, Redux, features |

These rules are checked in code review for now. The plan is to enforce them with ESLint `no-restricted-imports`, so a boundary violation fails lint.

## 4. Data flow

```mermaid
sequenceDiagram
  participant U as User
  participant C as Feature component
  participant S as Redux store (tasks slice)
  participant P as Persistence (lib/persistence)
  participant N as Notifications slice

  U->>C: Types a title, presses Enter
  C->>S: dispatch(addTask({ title }))
  S-->>C: New state (selectors re-run)
  S->>P: Store subscriber saves the tasks state
  alt save succeeds
    C->>N: dispatch(notify({ kind: "success", message: "Task added", undo }))
  else save fails
    S->>S: Roll back to the previous state
    C->>N: dispatch(notify({ kind: "error", message: "Couldn't add…", retry }))
  end
  N-->>U: Snackbar (role=status or role=alert)
```

- **One-way flow:** components dispatch actions, reducers compute the next state, and components read state only through **memoized selectors**.
- **Side effects stay out of reducers.** Saving happens in one place, a store subscriber or listener middleware that calls the persistence adapter.
- **Undo** keeps the previous version of the changed task, so it can be restored.

## 5. State shape

```ts
interface RootState {
  tasks: {
    ids: string[];                      // newest first
    entities: Record<string, Task>;     // createEntityAdapter
    filter: 'all' | TaskStatus;
    selectedId: string | null;          // task open in the drawer
  };
  notifications: {
    queue: Array<{
      id: string;
      kind: 'success' | 'error';
      message: string;
      action?: 'undo' | 'retry';
    }>;
  };
}
```

`Task` and `TaskStatus` are defined in the [PRD data model](../product/PRD.md#6-data-model).

Key selectors:
- `selectVisibleTasks`: tasks filtered by the current filter.
- `selectCounts`: the count for each status, plus all.
- `selectSelectedTask`: the task open in the drawer.

## 6. Persistence

- **Adapter:** `lib/persistence` exposes a small interface:
  ```ts
  interface TaskStorage { load(): Task[] | null; save(tasks: Task[]): void }
  ```
- **Default implementation:** uses `localStorage` under a versioned key (`tdd-todo-app/v1`).
- **Corrupt or missing data:** `load()` returns `null` and the app starts with an empty list (US-13).
- **Save failures** (storage full or blocked) are thrown as errors and surfaced as error snackbars with Retry (US-2, 8, 12).
- **Testability:** the adapter is passed into the store setup, so tests use an in-memory fake, including one that fails on purpose.

## 7. Testability seams

These are the points where tests replace real dependencies, to keep every test deterministic:

| Seam | Production | In tests |
|---|---|---|
| Storage | `localStorage` adapter | In-memory fake (or a failing fake) |
| Clock | `() => new Date()` | Fixed date |
| Id generator | `crypto.randomUUID` | Sequential ids (`task-1`, `task-2`) |
| Store | `setupStore()` | `setupStore(preloadedState)` per test, via `renderWithProviders` |

## 8. Target folder structure

```
src/
  store/                # store.ts, hooks.ts, index.ts
  design-system/        # tokens/, foundations/, components/, index.ts
  features/
    tasks/              # tasksSlice.ts, selectors.ts, components/ (TaskList, AddTask, TaskDrawer…), index.ts
    notifications/      # notificationsSlice.ts, Snackbars.tsx, index.ts
  lib/                  # persistence/, clock.ts, id.ts
  test/                 # test-utils (renderWithProviders, fakes, builders)
  App.tsx
  main.tsx
```

## Current state vs target

| Area | Today | Target |
|---|---|---|
| State | Redux Toolkit store with a `tasks` slice (`taskAdded` only) and typed hooks; a single store, `setupStore()` still to come (TDD-49) | Redux Toolkit store with `tasks` and `notifications` slices (TDD-49, TDD-22) |
| Folders | New code in `store/` and `features/tasks/`; the old `components/`, `containers/`, `pages/` (kanban layout) remain | `store/`, `features/`, `design-system/`, `lib/` ([ADR-0009](adr/0009-feature-based-folder-structure.md)) |
| Components | Button with the old MUI-like palette in `src/components/` | Option B components in `src/design-system/` (TDD-30, TDD-31) |
| Persistence | None | `lib/persistence` adapter (TDD-25) |
| E2E | Cypress config only, not installed | Cypress installed and running in CI (TDD-18, TDD-27) |
| CI | Format, lint, type-check, tests with coverage and build on every PR (TDD-26) | Plus coverage thresholds (TDD-19), Storybook (TDD-29) and E2E (TDD-27) |
