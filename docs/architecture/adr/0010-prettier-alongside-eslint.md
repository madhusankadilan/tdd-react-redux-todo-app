# 0010. Prettier for formatting, alongside ESLint

- **Status:** Accepted
- **Date:** 2026-10-18

## Context
The project needs one consistent code style that nobody has to argue about or fix by hand in review. Prettier was installed with a `.prettierrc` (`tabWidth: 3`), but nothing ran it, so files drifted.

ESLint no longer formats code. It deprecated its formatting rules in v8.53 and removed them from core, and recommends a dedicated formatter. The options were to add a formatter next to ESLint, to bring formatting rules back into ESLint through a plugin, or to replace both tools.

## Decision
**ESLint checks code quality and Prettier formats code, as two separate tools.**

- `npm run lint` runs ESLint: bugs, Rules of Hooks, TypeScript rules, Storybook rules.
- `npm run format` (`prettier --write .`) formats, and `npm run format:check` (`prettier --check .`) fails on unformatted files. CI runs `format:check`.
- Prettier is pinned to an exact version (see [dependencies](../../engineering/dependencies.md)), so everyone formats identically. Upgrading it is a deliberate change, in its own commit with any reformatting it causes.
- **Scope: code and config, not Markdown.** Prettier formats TypeScript, JavaScript, CSS, JSON, HTML and YAML. Markdown docs (`*.md`) are excluded in `.prettierignore`: Prettier pads every table column to the widest cell, and our docs use tables with long cells, so rows become very wide and editing one cell rewrites the whole table in the diff.
- No glue packages: `typescript-eslint`'s recommended config has no formatting rules, so the tools don't conflict and `eslint-config-prettier` isn't needed.

## Alternatives considered
- **Also format Markdown:** consistent, but table padding makes the docs harder to edit and review (see Decision).
- **ESLint only, with `@stylistic/eslint-plugin`:** one tool, formatting via `eslint --fix`. It's less widely used than Prettier and needs a long list of style rules to configure and maintain.
- **Biome (replaces both):** much faster, one tool. It doesn't cover all the lint rules we rely on (React hooks only partly, Storybook rules not at all), so we'd still need ESLint.
- **`eslint-plugin-prettier` (Prettier run as an ESLint rule):** reports formatting as lint errors. It's slower and noisy in editors, and Prettier's docs advise against it.

## Consequences
- Formatting is automatic and never discussed in review. The most widely used setup, which fits a showcase project.
- Two tools and two scripts instead of one.
- A one-time `prettier --write .` reformats the existing code in its own commit, so later diffs only show real changes.
- Editors should format on save with Prettier. Contributors who don't still get caught by CI.
