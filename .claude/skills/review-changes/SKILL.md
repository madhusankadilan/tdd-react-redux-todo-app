---
name: review-changes
description: Review the current changes before committing or opening a PR. Covers uncommitted changes (staged, unstaged and untracked), or the current branch compared with main. Scans for secrets and personal data, checks security, and checks this project's practices (TDD and tests, design system rules, TypeScript and Redux conventions, git workflow, docs), then gives a ready-or-blocked verdict. Use it when the user asks for a code review, a pre-commit check, or "review my changes" or "review this branch", and before every commit or PR.
---

# Review changes

You review the changes in this repository and report findings. **This is read-only:** don't edit, stage, commit or fix anything unless the user asks you to after seeing the report.

## Step 1: Choose the scope

Arguments (optional): `uncommitted`, `branch [base]` or `auto` (the default).

- **`uncommitted`:** everything not yet committed (staged + unstaged + untracked, excluding gitignored files). Use before a commit.
- **`branch [base]`:** commits on this branch since it split from `base` (default `main`). Use before a PR.
- **`auto`:** `uncommitted` if `git status --porcelain` shows anything, otherwise `branch`.

Then gather the facts:

```bash
git rev-parse --abbrev-ref HEAD                     # current branch
git status --short                                  # what's changed
# uncommitted:
git diff HEAD --stat ; git diff HEAD                # tracked changes
git ls-files --others --exclude-standard            # untracked files (read them)
# branch:
git log --oneline main..HEAD                        # commits to review
git diff main...HEAD --stat ; git diff main...HEAD  # changes since the branch point
```

If you're on `main` with no uncommitted changes, there's nothing to review: say so and stop.
If the diff is large, read it file by file. Don't skip files.

## Step 2: Run the scanner (secrets, personal data, forbidden files)

```bash
python3 .claude/skills/review-changes/scripts/scan_changes.py <uncommitted|branch|auto> [base]
```

- **What it checks:** the lines the changes add (and untracked files in full) for secrets (cloud keys, tokens, private keys, credentials in URLs, hard-coded passwords), personal data (non-example email addresses, local machine paths, phone numbers), forbidden files (`.env`, keys, `.claude/settings.local.json`, `.mcp.json`, `.idea/`, `*.iml`, `.DS_Store`), and files over 1 MB.
- **Every scanner finding is a blocker** until you've checked it. Look at the context: a value in a test fixture, docs placeholder or regex pattern may be a false positive. Say why you dismissed it.
- **Never print a full secret.** Quote the masked value from the scanner.
- **The scanner isn't enough on its own.** Also read the diff for things patterns miss: real names in test data, internal URLs, screenshots containing personal information, cloud resource names or account details in config.

## Step 3: Run the project checks

Run whatever is available, and report results honestly (failures included):

```bash
npm run lint            # ESLint, zero warnings allowed
npx tsc -b              # type-check (app and config code)
npx vitest run          # unit + component + integration tests
```

If `node_modules` is missing, say the checks were skipped and why. Don't install packages without asking. Don't run E2E or Storybook builds unless the user asks.

## Step 4: Review the diff

Read the project rules first: `.claude/CLAUDE.md`, `docs/engineering/testing-strategy.md`, `docs/architecture/overview.md`, and `CONTRIBUTING.md`. Then check each area.

### A. Security
- **XSS:** `dangerouslySetInnerHTML`, `innerHTML` / `outerHTML`, `document.write`, user input rendered as HTML or as URLs (`href` with `javascript:`).
- **Code execution:** `eval`, `new Function`, `setTimeout` with a string argument.
- **External links:** `target="_blank"` without `rel="noopener noreferrer"`.
- **Untrusted data:** `JSON.parse` of localStorage or other external data without validation and error handling (PRD US-13 requires safe fallback).
- **Sensitive data stored client-side:** anything beyond task data in localStorage.
- **Dependencies:** new or changed entries in `package.json`. Is each one needed, maintained and reputable? Is the lockfile updated in the same change? Flag `postinstall` scripts and unusual sources (git URLs, tarballs).
- **CI and Docker:** secrets echoed into logs, `pull_request_target` misuse, unpinned third-party actions, overly broad permissions, secrets baked into images.

### B. Tests and TDD
- **Tests for every behavior change:** each source change has tests at the right level (see the testing strategy's "what goes where"). Flag behavior that isn't tested.
- **Bug fixes:** each one includes a test that reproduces the bug.
- **Test quality:**
  - Queries by role or label.
  - `userEvent.setup()`, not `fireEvent`.
  - No real timers, random ids or dates.
  - Fresh store per test via `renderWithProviders`.
  - Tests check behavior, not implementation details.
  - Snapshots are small and intentional.
- **Traceability:** story-level tests reference PRD ids (`US-n`).

### C. Code and architecture
- **TypeScript:** strict, no `any`, props typed with a `Props` type.
- **React:** function components, no business logic in components.
- **Redux Toolkit:** `createSlice`, typed hooks, memoized selectors, side effects kept out of reducers.
- **Design system:**
  - App code imports only from `src/design-system/index.ts`.
  - The design system never imports app code or the store.
  - No hard-coded colors, sizes or shadows in component CSS. Look for hex colors, `px` values or `rgba(` outside the token files.
  - New components have stories covering every variant.
- **Folder structure** matches CLAUDE.md and ADR-0009: Redux setup goes in `store/`, and feature code (slices, selectors, feature components) in `features/<name>/`, not in the old `containers/`.
- **Accessibility:** semantic elements, labels, keyboard support, focus management, roles for dialogs and alerts.
- **General quality:** dead code, leftover `console.log`, commented-out code, TODOs without an issue, duplication, unclear names.

### D. Git workflow
- **Branch:** not `main`, and named `feature/TDD-<n>-short-description`.
- **Commits** (branch scope): format `[TDD-<n>][NEW|CHG] Message`. Each commit is one logical change, with no leftover work-in-progress commits ("wip", "fix typo", "fix lint" should be squashed into the commit they fix). No attribution lines the project doesn't use.
- **Staging:** no unrelated changes mixed in. Suggest splitting if the diff covers several issues.
- **Deletions:** check that they're intentional, and that nothing still references a deleted file (e.g. workflows referencing deleted config).

### E. Docs
- **Product behavior changed:** the PRD is updated, with a changelog entry.
- **Significant technical decision:** a new ADR.
- **Architecture, testing rules or workflow changed:** the matching doc is updated (overview, testing strategy, CONTRIBUTING, CLAUDE.md, README).

## Step 5: Report

Use this structure. Be specific: every finding has a `file:line` (or file), what's wrong, why it matters, and a concrete fix.

```markdown
## Review: <scope> (<N> files)

**Verdict:** ⛔ Blocked | ⚠️ OK with fixes recommended | ✅ Ready to commit/PR

### Blockers (must fix before committing)
| # | Area | Location | Problem | Fix |
|---|---|---|---|---|

### Should fix
| # | Area | Location | Problem | Fix |

### Suggestions (nice to have)
- ...

### What's done well
- Specific good practices followed in this change (tests first, clear naming, a11y, etc.)

### Checks
| Check | Result |
|---|---|
| Secrets / personal data scan | clean / N findings |
| Lint | pass / fail / skipped (reason) |
| Type-check | ... |
| Tests | ... |

### Commands run
(every command, in order, per CLAUDE.md)
```

**Severity guide:**
- **Blocker:** any real secret or personal data; a forbidden file; a security vulnerability; failing lint, types or tests; untested behavior change; a commit straight to `main`.
- **Should fix:** convention violations (hard-coded colors, `any`, `fireEvent`, deep imports), missing docs for a scope change, wrong branch or commit format.
- **Suggestion:** readability, naming, small refactors.

End with the next step and **wait for the user's answer**:
- **If there are blockers:** offer to fix them.
- **If it's ready:** present the commit plan (each commit message with its full list of added / modified / deleted files) and **ask the user to review and approve it**. Never commit or push without explicit approval of that exact list (see "Commit and push only with the user's approval" in `.claude/CLAUDE.md`).
