# 0008. Single list + details drawer UX (Option B)

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
Two directions were designed in Penpot:
- **Option A:** a kanban board with three columns, a sidebar form, a popup per status move, and toasts.
- **Option B:** a single list with filter pills, an inline add bar, a status menu and picker, a side drawer, and snackbars.

## Decision
We build **Option B**. Option A stays archived in the Penpot file for reference.

## Alternatives considered
- **Option A (kanban):** shows workflow stages at a glance. But each status move needed its own popup, moves were limited to one step at a time, and the layout doesn't adapt well to narrow screens.
- **A mix** (A's board with B's status picker): possible, but it adds a second layout to build and test for little gain.

## Consequences
- **Any status is one click away** (status menu, checkbox, or drawer picker), with any-to-any transitions (PRD FR-4).
- One list with filters maps cleanly to memoized selectors, so it's simpler to build and test.
- The old kanban containers (`SideBar`, `Content`, `Status`, `Item`) get replaced.
- Progress is less visual than columns. The header counts and filter pill counts make up for it.
