# CLAUDE.md

## What this project is

A reference project that shows how test-driven development is done in a real industry codebase. The feature set is deliberately simple (a todo app), so the focus stays on engineering practice: testing at every level, clean architecture and tooling.

- **Stack:** React 19, Redux (Redux Toolkit), TypeScript 6, Vite 8.
- **Tooling:** Vitest 5 + React Testing Library 16, Storybook 10, ESLint 10 with a flat config (`eslint.config.js`), Prettier 3. Node.js 24 LTS (see `.nvmrc`); `package.json` `engines` lists the supported range.
- **Frontend only.** There is no backend. **Redux is the single source of truth** for state while the app runs, and the tasks state is **persisted to localStorage** through a persistence adapter (`lib/persistence`), which saves on change and loads on startup. See ADR-0002 and `docs/architecture/overview.md`.

**Product requirements** live in `docs/product/PRD.md`: user stories (US-n), functional requirements (FR-n), non-functional requirements, the data model and open questions. It's the source of truth for *what* to build. Use its acceptance criteria as the basis for tests, reference the US/FR ids in issues and PRs, and update the PRD (with a changelog entry) when scope changes. Keep business and product documents in `docs/product/`, not in code folders.

**Other key docs:**
- `CONTRIBUTING.md`: the human-facing workflow. Keep it in sync with the git workflow below.
- `docs/architecture/overview.md`: the target architecture and layer rules.
- `docs/architecture/adr/`: decision records. Write a new ADR, using the template in its README, whenever you make a significant or hard-to-reverse technical decision. Never edit an accepted ADR; supersede it instead. ADR-0009 (feature-based folders) is **Proposed**. Until it's accepted, keep the current folder structure.
- `docs/engineering/testing-strategy.md`: what to test at which level, the mocking policy, the snapshot policy, coverage, and CI gates. It's the detailed version of the testing section below.
- `docs/engineering/dependencies.md`: packages held back below their latest version or pinned exactly, with the reasons.

The project is MIT-licensed (`LICENSE`).

## Why it exists

It's a showcase. Every piece of code should be something you could point to as "this is how it's done properly": readable, typed, tested, and following current best practices. When choosing between quick and exemplary, choose exemplary, and keep it simple. Industry standard doesn't mean over-engineered.

## How we work: TDD

1. **Red:** write a failing test that describes the behavior.
2. **Green:** write the minimum code that makes it pass.
3. **Refactor:** clean up while the tests stay green.

Write the tests before (or together with) the implementation. Don't add untested behavior. When fixing a bug, first write a test that reproduces it.

## Testing strategy

| Level | Tool | What it covers | Location |
|---|---|---|---|
| Unit | Vitest | Pure functions, utils, Redux reducers/slices, selectors | Next to the source file: `*.test.ts` |
| Component | Vitest + React Testing Library + user-event | One component rendered on its own: rendering, props, user events | `Component.test.tsx` next to the component |
| Integration | Vitest + RTL with a real Redux store | Containers/pages wired to the store; user flows across components | `*.test.tsx` next to the container/page |
| Snapshot | Vitest `toMatchSnapshot` / inline snapshots | Stable presentational output only. Keep snapshots small and intentional | Alongside component tests |
| Visual / docs | Storybook (+ interactions addon) | Component states and interaction tests | `Component.stories.tsx` |
| E2E | Cypress | Full user journeys in a real browser against the built app | `cypress/e2e/*.cy.ts` |

Other quality checks the project should cover: accessibility (prefer role-based queries, consider `jest-axe`/`cypress-axe`), coverage thresholds (`@vitest/coverage-v8`), linting, and type checking in CI.

### Testing conventions
- Import test helpers from `src/utils/test-utils.tsx` (re-exports RTL, vitest, `userEvent`, and a custom `render`). Extend the custom `render` to wrap a Redux `<Provider>` with a fresh store per test (e.g. `renderWithProviders(ui, { preloadedState })`).
- Prefer queries in this order: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId`.
- Test behavior, not implementation. Don't assert on internal state or private functions.
- Use `userEvent.setup()` rather than `fireEvent`.
- Group tests with `describe` blocks (e.g. "Initial Render", "Event Handling"), and give each test a name that describes the behavior.
- Tests must be deterministic: no real timers or random IDs without mocking/injecting them.

## Design system

The app is built on a small, separate design system: tokens and components that the app consumes but that never depend on the app. Storybook is its showcase and documentation.

- **Location:** `src/design-system/`. **This folder doesn't exist yet.** It's the planned location, created in TDD-30 (folder and public API) and TDD-31 (tokens). Until then, the existing components are in `src/components/`. It's kept separate from app code so it could be extracted into its own package later.
  ```
  src/design-system/
    tokens/          # Design tokens as CSS custom properties (tokens.css) + typed TS exports
    foundations/     # Storybook MDX docs: Colors, Typography, Spacing, Elevation, Iconography
    components/      # Button, Input, Textarea, ... (one folder per component, same layout as below)
    index.ts         # Public API: everything the app is allowed to import
  ```
- **Tokens first:** colors, font families/sizes/weights/line-heights, spacing scale, radii, shadows, breakpoints, and z-index all live in tokens. Component CSS uses `var(--dc-*)` only, with **no hard-coded colors, sizes or shadows**. Token names use the `--dc-` prefix, matching the `dc-` class prefix (e.g. `--dc-color-primary-main`, `--dc-space-2`, `--dc-font-size-md`).
- **Typography:** Plus Jakarta Sans (to be loaded in `.storybook/preview-head.html` and `index.html`; they currently load Roboto), with a defined type scale exposed as tokens: Page heading 30, Drawer heading 24, Task title 15/600, Body 15, Small 14, Caption 13, plus label styles.
- **Shape:** buttons and pills are fully rounded (`radius.full`), cards and rows use `radius.md` (12px), and inner controls use `radius.sm` (8px).
- **Boundaries:**
  - Design system code never imports from `containers/`, `pages/`, or the Redux store, and has no business logic.
  - App code imports design system pieces only through `src/design-system/index.ts`, never deep paths.
- **Storybook structure:** `Foundations/*` (tokens docs), `Components/*` (one entry per component, `tags: ['autodocs']`), and optionally `Patterns/*` for compositions. Every component story covers all variants, sizes and states (hover, disabled, error, loading), and has `play` interaction tests where it's interactive.
- **Definition of done for a design system component:** tests first (unit + a11y + small snapshot), a story covering every variant, typed props with JSDoc (so autodocs shows descriptions), token-only styling, keyboard-accessible, and exported from `index.ts`.
- **Visual reference:** the Penpot file **"Design System"** (Penpot project "TDD Todo App") is the source of truth for both the design system and the app screens. The chosen direction is **Option B**. The active pages are:
  - **Foundations:** colors (primary indigo, success, warning, danger, neutrals, status colors), typography, spacing and radius.
  - **Components:** Button (Primary / Secondary / Danger / Danger link × Small / Medium), Checkbox, Status Pill, Filter Pill, Snackbar, Status Picker, Status Menu, Row Actions Menu, Confirm Dialog, Add Task Bar, Task Row, Empty State (`Filter`: All / To do / In progress / Done), and Annotation (`Tone`: Note / Decision; documentation-only sticky notes, not product UI).
  - **App Screens:** 16 screens, in a grid of x = col×2000, y = row×1200, 3 per row. Each screen has Annotation notes in the column to its right that explain interactions and decisions.
    - 01 Task list
    - 02 Task details drawer
    - 03 Change status from the list
    - 04 Delete: confirmation dialog
    - 05–10 Success and failure results for add, move and delete
    - 11 Filtered view
    - 12 Empty state: In progress
    - 13 Row actions menu (⋯)
    - 14–16 Empty states: All (first run), To do, Done

  Pages named `Archived — …` hold the earlier Option A (kanban board) exploration and the pre-component Option B draft. They're kept for history; don't build from them. Option A's library items are filed under `Archived A`.

  Its token set `core` uses the same names as the code tokens (`color.primary.main` ↔ `--dc-color-primary-main`, `color.status.in-progress.bg` ↔ `--dc-color-status-in-progress-bg`, `space.4` ↔ `--dc-space-4`), so keep them in sync. When Claude edits Penpot through MCP, the user must have the file open and connected (File → MCP Server → Connect).
- **App design (Option B):** the app is a single task list, with these parts:
  - **Header:** "My tasks" with counts.
  - **Add Task Bar:** an inline input plus an "Add task" button. Enter also adds the task.
  - **Filter pills:** All / To do / In progress / Done, each with a count.
  - **Task rows:** a checkbox (ticking it marks the task Done), the title, date and author, a status pill that opens a status menu, and a ⋯ menu.
  - **Opening a task:** clicking anywhere on a row (or pressing Enter on a focused row) opens the drawer. The checkbox, status pill and ⋯ have their own actions.
  - **Row actions (⋯):** a menu with "Open details" and "Delete". Status changes stay on the status pill.
  - **Details drawer:** a side drawer with a status picker (any status in one click), the description, and "Delete task".
  - **Delete:** always asks first, in a centered **confirmation dialog** (Cancel / Delete), whether started from the drawer or the ⋯ menu.
  - **Snackbars:** add, move and delete results are shown in a bottom-center snackbar. Success snackbars disappear after a few seconds, and **only status changes offer Undo**, because they're one click and easy to do by accident. Add and delete don't: an added task can just be deleted, and delete was already confirmed. Error snackbars offer Retry and stay until dismissed.
  - **Empty states:** each filter has its own message, plus a first-run state when there are no tasks at all.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # tsc -b (type-check) + vite build
npx tsc -b             # Type-check only: app and config code (runs in CI)
npm run lint           # ESLint (max-warnings 0)
npm run format         # Prettier: format all code and config (not Markdown)
npm run format:check   # Prettier: fail on unformatted files (runs in CI)
npm test               # Vitest (watch mode)
npx vitest run         # Vitest single run
npm run coverage       # Vitest with coverage
npm run storybook      # Storybook on :6006
```

## Project structure

Current structure. `src/` will be reorganised by feature if ADR-0009 is accepted.
```
src/
  components/         # Button, Input, Textarea today. Moves to design-system/ in TDD-30.
  containers/         # Feature-level components grouped by page (home/, login/). Old kanban layout, to be replaced.
  pages/              # Route-level pages composed from containers.
  utils/              # Helpers (getClassNames) and test-utils.
  data.ts             # Domain types (ITask, IStatus, StatusList).
  setup.ts            # Vitest setup (jest-dom matchers).
  (design-system/)    # PLANNED, not created yet (TDD-30): tokens, foundations docs, components. No Redux, no app imports.
docs/
  product/            # Business and product documents (PRD), kept separate from code.
  architecture/       # overview.md (layers, data flow, state shape) + adr/ (Architecture Decision Records).
  engineering/        # testing-strategy.md and other engineering process docs.
  design/             # PNG exports of the Penpot design (foundations, components, screens) + README gallery.
cypress/              # E2E specs, fixtures, support.
.storybook/           # Storybook config.
docker/, Dockerfile   # nginx config and Dockerfile for a static image (no deploy pipeline right now).
.claude/              # Claude Code: CLAUDE.md, settings + safety hook, skills, agents, Penpot helpers.
```
The design source of truth is the Penpot file "Design System". `docs/design/` only holds PNG snapshots of it.

Each component lives in its own folder:
```
Button/
  Button.tsx
  Button.test.tsx
  Button.stories.tsx
  styles.css
  index.ts        # re-export default
```

## Code conventions
- TypeScript strict mode. Avoid `any`, and type props with a `Props` type.
- TypeScript configs: `tsconfig.json` only references `tsconfig.app.json` (browser code: `src/`, `.storybook/preview.ts`) and `tsconfig.node.json` (config that runs in Node: `vite.config.ts`, `.storybook/main.ts`). `tsc -b` checks both. When you add a TypeScript file outside `src/`, add it to the matching config, or it won't be type-checked.
- Functional components only. Destructure props with defaults.
- CSS classes are built with `getClassNames(base, modifiers, custom)`, which produces BEM-like `dc-<base>` / `dc-<base>-<modifier>` names. Use plain CSS files per component.
- Prettier: `tabWidth: 3`. It formats code and config, not Markdown (ADR-0010). Run `npm run format` before committing; CI fails on unformatted files.
- Redux: Redux Toolkit (`createSlice`, `configureStore`), typed hooks (`useAppDispatch`, `useAppSelector`), and memoized selectors. Keep slices in a feature folder alongside their tests.

## Working with Claude
- **Show every shell command.** Especially in auto mode, the user wants to see all Bash commands that ran. At the end of each response that ran commands, include a "Commands run" section listing each command in a code block, in order, with a short note on what it did. Include commands that failed. For long scripts, show the script's path and summarize what it does.

- **Penpot design work goes to the `penpot-designer` subagent** (`.claude/agents/penpot-designer.md`), run in the background, so the user doesn't have to wait in the main chat. Give it a self-contained brief: what to design, which page, and decisions already made. When it reports back, relay its summary to the user and update docs (CLAUDE.md, README, PRD) yourself if needed. Its helper library is `.claude/penpot/helpers.js`; keep that file and the agent's rules up to date when you learn new Penpot quirks. Don't edit Penpot from the main chat while the agent is running.

- **Destructive commands are blocked** by a PreToolUse hook (`.claude/hooks/guard-destructive-commands.py`) plus deny rules in `.claude/settings.json`. Don't try to work around a block. Tell the user what you wanted to run and let them run it.
- Because force-pushing is blocked, clean up a feature branch's history **before** its first push. If it has to be re-squashed after pushing, `git push --force-with-lease` to the feature branch asks the user for approval.

- **Never commit or push secrets or personal data.** This repo is public. Before every commit, review the staged diff (`git diff --cached`) and stop if it contains any of these:
  - Secrets: API keys, tokens, passwords, private keys, `.env` files, AWS credentials or account IDs, connection strings.
  - Personal data: email addresses, phone numbers, real names in test data or fixtures, local machine paths (e.g. `/Users/<name>/...`).
  - Personal or machine-specific config: `.claude/settings.local.json`, `.mcp.json` (local IDE ports), `.idea/`, `*.iml`.
  Secrets belong in GitHub Actions secrets, never in code. Use obviously fake data in tests (e.g. `jane@example.com`). If something sensitive is already committed, tell the user. Don't try to rewrite history yourself.
- Stage files by name (`git add <path>`), never `git add .` or `git add -A`, so nothing unintended slips in.
- **Commit and push only with the user's approval. This is a hard rule; never skip it.** Before every commit, in this order:
  1. **Review locally:** run the `review-changes` skill (uncommitted scope) and fix any blockers. Don't commit while it reports blockers, unless the user explicitly accepts a specific finding.
  2. **Present the commit plan:** for each planned commit, show the exact commit message and **the full list of files** in it (added / modified / deleted), plus the review result.
  3. **Ask the user to review and approve.** Then stop and wait. Don't stage-and-commit "while waiting", and don't treat earlier approvals, approval of a plan, or "go ahead with all of it" as approval for a commit the user hasn't seen.
  4. **Commit only after explicit approval** of that list. If anything changes after approval (new files, different grouping), present it again.
  5. **Push only with approval.** If the user didn't approve pushing together with the commits, ask again before pushing. Before opening a PR, run `review-changes` with `branch` scope.

  The safety hook enforces this too: every `git commit` and `git push` triggers an approval prompt, even in auto mode.

## Task tracking
- Tasks are GitHub Issues, managed on the GitHub Projects board "TDD Todo App" (https://github.com/users/madhusankadilan/projects/5, project number 5, owned by `madhusankadilan`).
- Labels mark the kind of work: `feature`, `bug`, `test`, `ci`, `chore`, `docs`.
- Milestones: `M1 - Foundation`, `M2 - Design system`, `M3 - Todo features`, `M4 - Quality & CI`.
- Board fields: Status (Backlog → Todo → In Progress → In Review → Done), Priority (P0–P2), Size (S/M/L). Move an issue to In Progress when work starts.
- Task IDs use the `TDD-` prefix plus the issue number: issue `#12` is `TDD-12`. An autolink reference in the repo settings turns `TDD-<num>` into a link to the issue.

## Git workflow
- **Never commit directly to `main`.** Every piece of work goes on a feature branch: `feature/TDD-<issue-number>-short-description` (e.g. `feature/TDD-12-todo-slice`).
- Commit as often as needed while working on the branch.
- When the feature is finished, **clean up the history before the first push**: squash work-in-progress commits ("wip", "fix typo", "fix lint") so that **each remaining commit is one logical change**. A small feature usually ends up as one commit. Larger work can keep several commits, grouped by concern (e.g. "remove old config", "add docs", "update README"). Then push and open a pull request to `main` (`gh pr create --base main`).
- **PR:** the title summarises the change (with a single commit, it matches the commit message). The body lists the commits and includes `Closes #<issue-number>`. The closing keyword only works with `#<num>`, not `TDD-<num>`.
- **Merging:** PRs are merged with **Rebase and merge**, never Squash and merge, so each logical commit lands on `main` as-is in a linear history. The user merges; Claude never does.
- Commit message format: `[TDD-<issue-number>][TYPE] Message`
  - `NEW`: something new (feature, component, test suite, tooling).
  - `CHG`: a change to something that already exists (fix, refactor, update).
  - Examples: `[TDD-12][NEW] Add todo slice with add/remove reducers`, `[TDD-15][CHG] Fix button disabled state`.

## Current state (as of 2026-10)
The project is early-stage scaffolding:
- All libraries were upgraded to their latest versions in TDD-42, **except TypeScript**, which stays on 6.0 because typescript-eslint doesn't support TypeScript 7 yet (its peer range is `<6.1`). TDD-43 tracks the move to 7. Held-back and pinned packages, and why, are listed in `docs/engineering/dependencies.md`. Keep it up to date when you hold back or pin a package.
- `main` is green since TDD-45: format check, lint, type-check, tests and build all pass. CI (`.github/workflows/ci.yml`, job "Quality gate") runs them on every PR and push to `main` since TDD-26. Keep it green.
- Redux / Redux Toolkit / react-redux are **not installed yet**.
- Cypress is configured (`cypress.config.ts`) but **not in `package.json`**. The sample spec points at `localhost:3000`, but Vite serves on `5173`.
- The only tests are the `getClassNames` unit tests (`src/utils/components/css.test.ts`). The old empty and commented-out test files were removed in TDD-45. Components have no tests yet; Button gets them in TDD-7.
- `Input` and `Textarea` only have `index.ts` stubs.
- The design system is designed in Penpot but not built in code yet. Components live in `src/components/`. `Button/styles.css` hard-codes the old MUI-like palette (primary/secondary/success/info/warning/error × contained/outlined/text), which no longer matches the design. It gets replaced by the Option B Button variants and tokens. The Button story is titled `Example/Button`.
- The existing containers (`home/SideBar`, `Content`, `Status`, `Item`) follow the old kanban layout and will be replaced by the Option B list + drawer layout.
- **CI has no deploy step.** The old AWS ECR/ECS deploy workflow and its task definition were removed in TDD-39, because the task definition contained AWS account details. Deployment will be decided later. Storybook, E2E and visual-regression gates are added by their own tasks (TDD-27, TDD-29, TDD-34). A `Dockerfile` with nginx config (`docker/nginx`) still exists for building a static image.
