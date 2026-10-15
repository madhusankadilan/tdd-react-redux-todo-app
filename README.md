# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Product

What the app does and why is defined in the **[Product Requirements Document](docs/product/PRD.md)**. It covers goals, user stories with acceptance criteria, functional and non-functional requirements, the data model, out-of-scope items and open questions. Business and product documents live in `docs/product/`.

## Documentation

| Document | What it covers |
|---|---|
| [PRD](docs/product/PRD.md) | What we build and why: user stories, requirements, data model |
| [Design](docs/design/README.md) | PNG exports of the design system and all app screens (source: Penpot) |
| [Architecture overview](docs/architecture/overview.md) | Layers, data flow, state shape, persistence, testability seams |
| [Architecture Decision Records](docs/architecture/adr/) | Why each major technical choice was made |
| [Testing strategy](docs/engineering/testing-strategy.md) | Test levels, TDD workflow, mocking and snapshot policy, coverage, CI gates |
| [Contributing](CONTRIBUTING.md) | Setup, workflow, branch and commit rules, PR checklist |

## License

[MIT](LICENSE)

## Design system

The app is built on a small, separate design system in `src/design-system/`. The app consumes it, but it never depends on the app. **Storybook** is its showcase and documentation.

```
src/design-system/
  tokens/        # Design tokens as CSS custom properties (--dc-*) + typed TS exports
  foundations/   # Storybook docs: Colors, Typography, Spacing, Radius, Elevation
  components/    # Button, Input, Textarea, ...
  index.ts       # Public API: the only entry point the app imports from
```

### Principles
- **Tokens first:** every color, font, spacing value, radius and shadow is a token (`--dc-color-primary-main`, `--dc-space-2`, ...). Component styles use tokens only, never hard-coded values.
- **Separate layer:** the design system has no business logic and no Redux, and never imports app code. The app imports it only through `index.ts`, so it could be extracted into its own package later.
- **Accessible by default:** components are keyboard-accessible, use semantic HTML, and are checked with automated accessibility tests.
- **Test-driven:** each component is built test-first, like the rest of the app.

### Storybook

```bash
npm run storybook        # Run locally at http://localhost:6006
npm run build-storybook  # Static build
```

| Section | Contents |
|---|---|
| `Foundations/*` | Colors, typography, spacing, radius, elevation, all generated from the tokens |
| `Components/*` | One entry per component, with auto-generated docs and every variant, size and state |
| `Patterns/*` | Compositions of components (optional) |

### Component definition of done
- Tests written first: unit, accessibility, and a small snapshot
- A story for every variant, size and state, with interaction tests where the component is interactive
- Typed props with JSDoc, so the docs show descriptions
- Token-only styling
- Exported from `src/design-system/index.ts`

### Visual design

The designs are made in [Penpot](https://penpot.app), a free, open-source design tool, in the file **"Design System"**. It covers the foundations, the components, and 16 app screens, each with notes explaining its interactions and decisions.

| | |
|---|---|
| Layout | A single task list with filter pills (All / To do / In progress / Done), an inline "Add task" bar, and a side drawer for task details |
| Status changes | A status picker in the drawer, or a status menu straight from a task row. Any status is one click away |
| Feedback | Bottom-center snackbars for add, move and delete results. Only status changes offer **Undo**, and errors offer **Retry**. Deleting always asks first, in a confirmation dialog |
| Style | Plus Jakarta Sans font, indigo primary color (`#5B4CF0`), pill-shaped buttons and status pills, 12px rounded cards |
| Components | Button, Checkbox, Status Pill, Filter Pill, Snackbar, Status Picker, Status Menu, Row Actions Menu, Confirm Dialog, Add Task Bar, Task Row, Empty State |

An earlier kanban-board exploration (Option A) is kept in the file under `Archived — …` pages, to show how the direction was chosen. **PNG exports** of the foundations, components and all screens are in [`docs/design/`](docs/design/README.md). The design system work is tracked in milestone **M2 - Design system**.

## Claude Code setup

This project is set up for [Claude Code](https://claude.com/claude-code), an AI coding assistant. Its configuration lives in the `.claude/` folder.

| File | Purpose | Committed |
|---|---|---|
| `.claude/CLAUDE.md` | Project instructions Claude loads every session: what the project is, TDD workflow, testing strategy, conventions, git workflow, and rules | Yes |
| `.claude/settings.json` | Shared settings: permission deny rules and the safety hook | Yes |
| `.claude/hooks/guard-destructive-commands.py` | Safety hook that checks every shell command before it runs | Yes |
| `.claude/skills/review-changes/` | `/review-changes` skill: reviews uncommitted changes or the branch vs `main` (secrets and personal-data scan, security, tests, conventions, git workflow) and gives a verdict | Yes |
| `.claude/agents/penpot-designer.md` | Subagent that does Penpot design work in the background | Yes |
| `.claude/penpot/helpers.js` | Helper library the Penpot agent loads in Penpot | Yes |
| `.claude/settings.local.json` | Personal, machine-specific settings | No (gitignored) |

### Rules Claude follows

- **TDD:** write a failing test first, make it pass, then refactor. Bug fixes start with a test that reproduces the bug.
- **Git workflow:**
  - Never commit to `main`. Work on `feature/TDD-<issue>-short-description` branches.
  - When a feature is done, squash the work-in-progress commits so each commit is one logical change, then open a PR to `main`. PRs are merged with **Rebase and merge**.
  - Commit format: `[TDD-<issue>][NEW] Message` for new things, `[TDD-<issue>][CHG] Message` for changes.
  - PR descriptions include `Closes #<issue>`. Claude never merges PRs; that's done by a person.
- **Task tracking:** tasks are GitHub Issues on the "TDD Todo App" GitHub Projects board, grouped into milestones M1–M4. `TDD-12` autolinks to issue #12.
- **No secrets or personal data:**
  - The staged diff is reviewed before every commit.
  - Files are staged by name, never `git add .`.
  - Secrets go in GitHub Actions secrets only, and tests use obviously fake data.
- **Transparency:** every shell command Claude runs is listed at the end of its response.
- **Review before committing:** `/review-changes` runs before every commit and PR. Blockers (secrets, personal data, failing checks, untested changes) stop the commit.
- **Human approval for commits and pushes:** after the review, Claude lists every planned commit with its files and waits. It only commits or pushes once a person has reviewed and approved that list. The safety hook asks for approval on every `git commit` and `git push`.

### Command restrictions

Every shell command passes through the safety hook (`guard-destructive-commands.py`). Deny rules in `settings.json` act as a backup.

**Blocked: never runs**

| Area | Commands |
|---|---|
| GitHub repo | `gh repo delete / archive / rename / transfer`, `gh repo edit --visibility` |
| GitHub data | `gh project delete / item-delete / field-delete`, `gh issue delete / transfer`, `gh label delete`, `gh release delete` |
| GitHub CI | `gh secret delete`, `gh variable delete`, `gh run delete`, `gh cache delete` |
| GitHub other | `gh pr merge`, `gh api -X DELETE` / `--method DELETE` |
| Git remote | `git push --force` / `-f` / `+refspec`, `git push --delete` / `:branch`, pushing directly to `main` or `master` |
| Git local | `git branch -D`, `git reset --hard`, `git clean -f`, `git checkout -- .`, `git restore .`, `git stash drop / clear`, `git tag -d` |
| System | `sudo`, `chmod -R`, `chown -R` |
| AWS | `aws ecs/ecr delete-*`, `batch-delete-image`, `deregister-*`, `aws ecs update-service` |

**Asks for approval first, even in auto mode**

| Command | Why it's allowed with approval |
|---|---|
| `rm -rf` | Routine cleanup such as `node_modules` or `dist` |
| `git rebase` | Updating a feature branch from `main` |
| `git push --force-with-lease` (feature branches only) | Cleaning up a PR's commits after review. Force-pushing to `main` is always blocked |
| `git commit`, `git push` | Every commit and push needs a person's approval after reviewing the file list |

When a command is blocked, Claude says what it wanted to run and leaves it to a person.

**Changing the rules:** edit the `DENY` / `ASK` lists in `.claude/hooks/guard-destructive-commands.py`. Inside Claude Code, run `/hooks` to review or disable the hook.

The hook matches command patterns, so it's a safety net, not a guarantee. Review what Claude does, especially in auto mode.
