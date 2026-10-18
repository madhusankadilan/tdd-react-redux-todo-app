# Architecture Decision Records

An ADR records one significant decision: the context, what was decided, and the consequences. ADRs are **immutable once accepted**. To change a decision, write a new ADR that supersedes the old one, and update the old one's status.

| # | Decision | Status |
|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-frontend-only-with-localstorage.md) | Frontend-only app with localStorage persistence | Accepted |
| [0003](0003-redux-toolkit-for-state.md) | Redux Toolkit for state management | Accepted |
| [0004](0004-vitest-and-testing-library.md) | Vitest + React Testing Library for unit, component and integration tests | Accepted |
| [0005](0005-cypress-for-e2e.md) | Cypress for end-to-end tests | Accepted |
| [0006](0006-in-repo-design-system-with-css-tokens.md) | In-repo design system with CSS custom-property tokens | Accepted |
| [0007](0007-penpot-as-design-tool.md) | Penpot as the design tool | Accepted |
| [0008](0008-list-and-drawer-ux.md) | Single list + details drawer UX (Option B) | Accepted |
| [0009](0009-feature-based-folder-structure.md) | Feature-based folder structure | Proposed |
| [0010](0010-prettier-alongside-eslint.md) | Prettier for formatting, alongside ESLint | Accepted |

## When to write an ADR

Write one when a decision:
- is hard or costly to reverse (a framework, state management, persistence, folder structure)
- picks one option over reasonable alternatives that someone might later question
- changes a rule other contributors must follow

## Template

Copy this into `NNNN-short-title.md` (next free number, kebab-case title):

```markdown
# NNNN. Title

- **Status:** Proposed | Accepted | Superseded by [NNNN](NNNN-....md)
- **Date:** YYYY-MM-DD

## Context
What problem or force makes this decision necessary?

## Decision
What we decided, stated plainly.

## Alternatives considered
- **Option A:** why not
- **Option B:** why not

## Consequences
What becomes easier, what becomes harder, and any follow-up work.
```
