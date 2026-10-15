# 0002. Frontend-only app with localStorage persistence

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
The project's purpose is to showcase frontend engineering and TDD (see the [PRD](../../product/PRD.md)). A backend would add infrastructure, hosting cost and a second codebase without serving that purpose. Users still expect their tasks to survive a page reload (US-13).

## Decision
The app runs entirely in the browser, with no backend, API or accounts. Tasks are persisted to `localStorage` through a small adapter in `lib/persistence`, under a versioned key (`tdd-todo-app/v1`). The adapter is injected into the store setup, so tests can replace it with an in-memory or failing fake.

## Alternatives considered
- **A backend (Node, a BaaS like Firebase or Supabase):** realistic, but out of scope, costly, and it shifts focus away from frontend practices.
- **IndexedDB:** more capacity and async, but more complex than a small task list needs.
- **No persistence:** fails US-13 and makes the app feel like a toy.

## Consequences
- No network code, so no loading states or API error handling. Failures only come from storage (full, blocked, corrupt), and those are still tested (US-2, 8, 12).
- Data stays on one device and browser. Sync and multi-user are out of scope.
- If a backend is ever added, it goes behind the same adapter interface, so features don't change.
