# Contributing

Thanks for your interest in the TDD Todo App! This project is a reference for how a frontend team builds software test-first, so the *way* work is done matters as much as the result. Please read this guide before opening a pull request.

## Before you start

- **What to build** is defined in the [PRD](docs/product/PRD.md): user stories (`US-n`), functional requirements (`FR-n`) and acceptance criteria.
- **How it's built** is described in the [architecture overview](docs/architecture/overview.md), the [ADRs](docs/architecture/adr/) and the [testing strategy](docs/engineering/testing-strategy.md).
- **What it looks like** is defined in the Penpot file "Design System" and in Storybook. See the README's *Design system* section.
- **Work is tracked** on the GitHub Projects board "TDD Todo App". Every change starts from an issue.

## Local setup

**Prerequisites:** Node.js 24 LTS (the version in `.nvmrc`; run `nvm use`), and npm. Node 22.22 or later also works.

```bash
git clone https://github.com/madhusankadilan/tdd-react-redux-todo-app.git
cd tdd-react-redux-todo-app
npm ci
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm test` | Vitest in watch mode (use it while doing TDD) |
| `npx vitest run` | Run all unit, component and integration tests once |
| `npm run coverage` | Tests with a coverage report (thresholds are enforced) |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run build` | Type-check and production build |
| `npm run storybook` | Storybook at http://localhost:6006 |

## Workflow

### 1. Pick an issue
Choose an issue from the board, assign yourself, and move it to **In Progress**. If the work isn't covered by an issue, open one first and link it to the relevant PRD story.

### 2. Create a feature branch
Never commit to `main`.

```bash
git checkout -b feature/TDD-<issue-number>-short-description
# e.g. feature/TDD-23-add-task-bar
```

### 3. Work test-first
Follow red → green → refactor:

1. **Red:** write a failing test that describes the behavior from the acceptance criteria.
2. **Green:** write the minimum code to make it pass.
3. **Refactor:** clean up while the tests stay green.

- **Bug fixes** start with a test that reproduces the bug.
- **Untested behavior isn't accepted.**
- **Which test goes where:** see the [testing strategy](docs/engineering/testing-strategy.md).

### 4. Commit
Commit as often as you like while working. Before opening the PR, **clean up the history**: squash work-in-progress commits ("wip", "fix typo", "fix lint") so that **each remaining commit is one logical change**. A small feature usually becomes one commit. Larger work can keep several commits grouped by concern. Every commit uses this format:

```
[TDD-<issue-number>][NEW|CHG] Short description
```

- `NEW`: something new (a feature, component, test suite, tooling).
- `CHG`: a change to something that exists (a fix, refactor, update).

Examples:
- `[TDD-23][NEW] Add task bar with Enter-to-add`
- `[TDD-31][CHG] Move Button styles to design tokens`

### 5. Open a pull request
- **Base:** target `main`.
- **Title:** the PR title summarises the change. With a single commit, it's the same as the commit message.
- **Merging:** PRs are merged with **Rebase and merge** (not Squash and merge), so each logical commit lands on `main` unchanged, in a linear history.
- **Description:** include `Closes #<issue-number>` and the PRD ids it implements (e.g. `US-1, FR-1`).
- **Screenshots:** add them for UI changes.
- **Board:** move the issue to **In Review**.

### PR checklist
- [ ] Tests were written first and cover the acceptance criteria
- [ ] `npx vitest run`, `npm run lint` and `npm run build` pass locally
- [ ] Coverage thresholds still pass (`npm run coverage`)
- [ ] UI uses only design-system components and tokens, with no hard-coded colors or sizes
- [ ] New or changed components have Storybook stories covering every variant and state
- [ ] Keyboard and screen-reader behavior checked, and accessibility tests pass
- [ ] The PRD, ADRs or docs are updated if scope or architecture changed
- [ ] No secrets, personal data or machine-specific files in the diff

## Code guidelines

- **TypeScript:** strict mode, no `any`. Type component props with a `Props` type.
- **React:** function components only. Keep business logic in Redux slices and selectors, not in components.
- **State:** Redux Toolkit (`createSlice`, typed `useAppDispatch` / `useAppSelector`, memoized selectors).
- **Design system:** app code imports from `src/design-system` only through its `index.ts`. The design system never imports app code.
- **Formatting:** Prettier (tab width 3). Linting: ESLint with zero warnings.
- **Test data:** use obviously fake data (`jane@example.com`, "Jane"). Never use real personal data.

## Documentation

| Change | Update |
|---|---|
| New or changed product behavior | [PRD](docs/product/PRD.md), with a changelog entry |
| Significant technical decision | A new [ADR](docs/architecture/adr/) |
| New layer, folder or data flow | [Architecture overview](docs/architecture/overview.md) |
| New testing tool or rule | [Testing strategy](docs/engineering/testing-strategy.md) |

## Security

Never commit secrets (API keys, tokens, `.env` files, cloud account IDs) or personal data. This repository is public. If you find a security problem, please report it privately to the maintainer instead of opening a public issue.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
