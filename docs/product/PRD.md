# Product Requirements Document: TDD Todo App

| | |
|---|---|
| **Status** | Draft v0.2 |
| **Last updated** | 2026-10-15 |
| **Owner** | Project maintainer |
| **Design** | Penpot file "Design System" → pages *Foundations*, *Components*, *App Screens* (Option B) |
| **Tracking** | GitHub Projects board "TDD Todo App", milestones M1–M4 |

---

## 1. Overview

The TDD Todo App is a single-user task manager that runs entirely in the browser. Users add tasks, move them through a simple workflow (**To do → In progress → Done**), and see their progress at a glance.

The product is deliberately small, because its real purpose is to be a **reference implementation**: it shows how a production-quality frontend is built with test-driven development, a design system, and current industry practices. Every feature exists to demonstrate how it is specified, designed, tested and shipped, not just to work.

## 2. Problem and goals

### Problem
Most todo-app examples show *what* to build but not *how* a professional team builds it. They skip requirements, design systems, testing levels, accessibility, CI and workflow. Developers learning TDD have no realistic, end-to-end example to study.

### Product goals
1. **G1: Useful task management.** A user can capture, organise and complete tasks quickly, with no account and no setup.
2. **G2: Exemplary engineering.** Every feature is built test-first and covered at the right testing level: unit, component, integration, snapshot, visual and E2E.
3. **G3: Consistent, accessible UI.** The UI is built only from a documented design system, and it meets WCAG 2.2 AA.
4. **G4: Traceability.** Every requirement in this document maps to a GitHub issue (`TDD-<n>`), a design screen, and tests.

### Non-goals
- No backend, accounts, sync or collaboration (see [Out of scope](#9-out-of-scope)).
- No competition with full productivity tools like Todoist or Linear. The feature set stays intentionally small.

## 3. Users

| Persona | Description | What they need |
|---|---|---|
| **Task user** | Someone managing their personal tasks in the browser | Add tasks fast, see what's in progress, mark things done, undo mistakes |
| **Learner / reviewer** (primary audience of the showcase) | A developer studying the codebase to learn TDD and frontend practices | Clear requirements → design → tests → code traceability; readable, idiomatic code |

## 4. User stories

Each story's acceptance criteria are the basis for its tests.

### Adding tasks
- **US-1: Add a task.** As a user, I want to type a title and press Enter (or click **Add task**), so I can capture a task in one step. → TDD-23 · Screens 01, 05
  - A new task appears at the **top** of the list with status **To do**, today's date and its author.
  - The input clears after a successful add, and a success snackbar says "Task added". It has **no Undo**: an unwanted task can simply be deleted.
  - Empty or whitespace-only titles can't be added: the button is disabled and Enter does nothing.
- **US-2: Keep my text if adding fails.** As a user, if saving fails, I want my text kept and a way to retry. → TDD-38 · Screen 06
  - An error snackbar says the task couldn't be added and offers **Retry**. The typed title stays in the input.

### Viewing and filtering
- **US-3: See all my tasks.** As a user, I want a single list of tasks with clear status, so I know what's left. → TDD-24 · Screen 01
  - The header shows "My tasks" and "N tasks · M done".
  - Each row shows a checkbox, title, created date · author, status pill, and a ⋯ menu.
  - Completed tasks show a ticked checkbox and a struck-through, muted title.
- **US-4: Filter by status.** As a user, I want to filter by To do / In progress / Done, so I can focus. → TDD-24 · Screen 11
  - Filter pills **All / To do / In progress / Done** show live counts. The selected pill is highlighted.
- **US-5: Empty states.** As a user, when a filter has no tasks, I want a helpful message instead of a blank page. → TDD-24 · Screens 12, 14–16
  - Each filter has its own message: All when there are no tasks at all (first run), To do, In progress, Done.
  - Counts in the filter pills stay correct (e.g. "To do 0" while other statuses still have tasks).

### Changing status
- **US-6: Change status from the list.** As a user, I want to change a task's status without opening it. → TDD-24 · Screen 03
  - Clicking the status pill opens a menu with all three statuses. The current one is ticked.
  - Choosing a status moves the task immediately. **Any status can move to any other.**
- **US-7: Complete with one click.** As a user, I want to tick a task's checkbox to mark it Done. → TDD-24
  - Ticking sets the status to **Done**. Unticking a Done task sets it back to **To do**.
- **US-8: See the result and undo it.** As a user, I want confirmation that a move worked, and a way to undo it, because status changes are a single click and easy to make by accident. → TDD-38 · Screens 07, 08
  - On success, a snackbar says "‹title› moved to ‹status›" and offers **Undo**, which restores the previous status.
  - On failure, an error snackbar offers **Retry**, and the task keeps its previous status.

### Task details
- **US-9: View task details.** As a user, I want to open a task and see its full details. → TDD-37 · Screen 02
  - Clicking anywhere on a row, or pressing Enter on a focused row, opens a side drawer. The checkbox, status pill and ⋯ keep their own actions and don't open it.
  - The drawer shows the title, "Created ‹date› by ‹author›", a **status picker** and the description.
  - The drawer closes with ✕, Close, a click on the overlay, or **Escape**. Focus returns to the row.
- **US-10: Change status in the details.** As a user, I want to change status from the drawer in one click. → TDD-37 · Screen 02

### Deleting
- **US-11: Delete a task safely.** As a user, I want to delete a task, with a confirmation so I don't lose it by accident. → TDD-37 · Screen 04
  - **Delete task** in the drawer, or **Delete** in the row's ⋯ menu, opens a centered **confirmation dialog**: "Delete this task?", with the task's title, "This can't be undone", and Cancel / Delete buttons.
  - Cancel or Escape closes the dialog without deleting. Delete removes the task and closes the drawer.
- **US-12: See the delete result.** → TDD-38 · Screens 09, 10
  - On success, a snackbar says "‹title› deleted". There's **no Undo**, because the delete was already confirmed.
  - On failure, an error snackbar offers **Retry**, and the task stays in the list.
- **US-14: Row actions menu.** As a user, I want each row's ⋯ button to give me its actions, including by keyboard. → TDD-24 · Screen 13
  - ⋯ opens a menu with **Open details** (same as clicking the row) and **Delete** (opens the confirmation dialog from US-11).
  - Status changes aren't repeated in this menu. They stay on the status pill.

### Persistence
- **US-13: Keep my tasks.** As a user, I want my tasks to still be there when I reload the page. → TDD-25
  - Tasks are saved in the browser (localStorage) and restored on load.
  - Corrupt or missing data falls back to an empty list without crashing.

## 5. Functional requirements

| ID | Requirement | Priority | Stories |
|---|---|---|---|
| FR-1 | Create a task from a title (1–200 characters, trimmed). New tasks get a unique id, `status: todo`, `createdAt` and `createdBy` | Must | US-1 |
| FR-2 | List all tasks, newest first, with title, date, author, status | Must | US-3 |
| FR-3 | Filter by status with live counts per filter | Must | US-4 |
| FR-4 | Change status from the list (status menu), the checkbox, and the drawer (status picker); any-to-any transitions | Must | US-6, 7, 10 |
| FR-5 | Task details drawer with keyboard and focus management | Must | US-9 |
| FR-6 | Delete with a confirmation dialog, from the drawer or the row's ⋯ menu | Must | US-11, 14 |
| FR-7 | Result notifications: success (auto-dismiss ~5 s) and error (persistent, Retry) | Should | US-1, 2, 8, 12 |
| FR-8 | Undo for status changes only (not add or delete) | Should | US-8 |
| FR-9 | Persist to localStorage; recover from corrupt or missing data | Must | US-13 |
| FR-10 | Empty state per filter, plus a first-run state | Should | US-5 |
| FR-12 | Row actions menu (⋯): Open details, Delete | Should | US-14 |
| FR-11 | Edit a task's title and description | Could | see Open questions |

## 6. Data model

```ts
type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  id: string;          // generated (injectable for deterministic tests)
  title: string;       // 1–200 chars, trimmed
  description: string; // may be empty
  status: TaskStatus;
  createdAt: string;   // ISO 8601 (injectable clock for tests)
  createdBy: string;   // display name, see Open questions
}
```

State lives in Redux Toolkit (a `tasks` slice with memoized selectors) and is persisted to localStorage under a versioned key (e.g. `tdd-todo-app/v1`).

## 7. Non-functional requirements

| Area | Requirement |
|---|---|
| **Accessibility** | WCAG 2.2 AA. Every action is keyboard-operable, focus is visible, and the drawer is a labelled dialog with a focus trap. Success snackbars use `role="status"` and errors use `role="alert"`. Automated axe checks run in component tests and E2E |
| **Quality** | Test-first for all behavior. Coverage ≥ 80% (lines, branches, functions, statements), enforced in CI. Lint and typecheck must pass with zero warnings |
| **Testing levels** | Unit (slice, selectors, utils), component (RTL), integration (real store), snapshot (small, presentational), Storybook interaction and visual regression, Cypress E2E for every user story |
| **Design consistency** | UI is built only from design-system components and tokens. No hard-coded colors, sizes or shadows |
| **Performance** | Interactive in under 2 s on a mid-range laptop. Handles 500 tasks without noticeable lag. Initial JS bundle under 200 KB gzipped |
| **Browser support** | Latest two versions of Chrome, Firefox, Safari and Edge. Desktop first (1440px designs); usable down to 360px wide |
| **Reliability** | Persistence failures never crash the app. They surface as error snackbars with Retry |
| **Privacy** | No data leaves the browser: no analytics, no network calls |

## 8. Design

- **Source of truth:** the Penpot file "Design System".
  - **Foundations:** tokens.
  - **Components:** 10 components.
  - **App Screens:** 16 screens, 01–16, each with notes next to it explaining interactions and decisions.
- **Direction:** Option B, a single list with filter pills, an inline add bar, a details drawer, and a status menu and picker. The earlier kanban-board exploration (Option A) is archived in the same file.
- **Style:** Plus Jakarta Sans, indigo primary (`#5B4CF0`), pill-shaped buttons and status pills, 12px rounded cards.

| Screen | Covers |
|---|---|
| 01 Task list | US-3 |
| 02 Task details | US-9, US-10 |
| 03 Status menu | US-6 |
| 04 Delete confirmation dialog | US-11 |
| 05 / 06 Add success / failure | US-1, US-2 |
| 07 / 08 Move success (with Undo) / failure | US-8 |
| 09 / 10 Delete success / failure | US-12 |
| 11 Filtered view | US-4 |
| 12 Empty state: In progress | US-5 |
| 13 Row actions menu (⋯) | US-14 |
| 14 / 15 / 16 Empty states: All (first run), To do, Done | US-5 |

## 9. Out of scope

- Backend, API, user accounts, authentication, multi-user or sync
- Due dates, reminders, priorities, tags, subtasks, search
- Drag-and-drop reordering
- Native mobile apps, offline service worker, internationalisation (English only)

## 10. Success metrics

Because this is a showcase, success is measured mostly by engineering quality:

| Metric | Target |
|---|---|
| User stories with an automated E2E test | 100% |
| Unit and component coverage | ≥ 80%, enforced in CI |
| Automated accessibility violations (axe) | 0 |
| Lighthouse accessibility score | 100 |
| Components with a story covering all variants | 100% |
| Requirements traceable to issue → design → test | 100% |

## 11. Release plan

| Milestone | Scope |
|---|---|
| **M1 - Foundation** | Redux store, test utilities, Cypress, coverage thresholds, cleanup |
| **M2 - Design system** | Tokens, Foundations docs, Option B components in code and Storybook, visual regression, published Storybook |
| **M3 - Todo features** | US-1 to US-13: add, list, filter, status changes, drawer, delete, notifications, persistence |
| **M4 - Quality & CI** | CI quality gate, E2E in CI, accessibility checks, Storybook interaction tests |

## 12. Open questions

| # | Question | Notes |
|---|---|---|
| Q1 | **Who is "Created by"?** There are no accounts. | Options: a fixed "You", a name set once in settings, or drop the field |
| Q2 | **How is the description written?** The add bar only takes a title. | Suggested: an editable description field in the drawer (FR-11) |
| Q3 | **Keep the login page?** `containers/login` exists from the template. | No accounts are planned, so the suggestion is to remove it |
| Q4 | **Keep issues #9–#11** (Table, Table testing, Form testing)? | Not part of Option B. Close them, or keep them as extra showcase components |
| ~~Q5~~ | ~~Undo and confirmation both on delete?~~ | **Resolved (v0.2):** delete uses a confirmation dialog only. Undo is offered only for status changes |

## 13. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-10-15 | 0.1 | First draft, based on Option B designs and the existing GitHub issues |
| 2026-10-15 | 0.2 | The delete confirmation is now a dialog (US-11, FR-6). Undo is only on status changes (FR-8; US-1 and US-12 updated). Added the row actions menu (US-14, FR-12), empty states per filter plus first run (US-5, FR-10), and the rule for which parts of a row open the drawer (US-9). Q5 resolved |
