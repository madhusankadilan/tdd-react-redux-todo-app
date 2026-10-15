# 0006. In-repo design system with CSS custom-property tokens

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
The UI must be consistent, accessible, and match the Penpot designs. A design system is also one of the practices this project demonstrates.

## Decision
- The design system lives in `src/design-system/` (tokens, components, docs). It's **separate from app code** and could be extracted into a package later.
- **Tokens** are CSS custom properties with a `--dc-` prefix (e.g. `--dc-color-primary-main`). They mirror the Penpot token set `core`, with a typed TS export for stories and tests.
- Components use **plain CSS files with tokens only**: no hard-coded colors, sizes or shadows.
- The app imports the design system only through `src/design-system/index.ts`. The design system never imports app code, and lint enforces both rules.
- **Storybook** is the living documentation: `Foundations/*` and `Components/*`.

## Alternatives considered
- **A component library (MUI, Chakra, Mantine):** fast, but it hides the design-system work this project wants to show, and it fights the custom Option B style.
- **Tailwind CSS:** great for speed, but utility classes spread design decisions across markup instead of named, reusable components and tokens.
- **CSS-in-JS (styled-components, Emotion):** adds runtime cost and tooling, and isn't needed for a small system.
- **A separate package or repo now:** premature. Clear boundaries inside one repo give the same discipline with less overhead.

## Consequences
- Re-theming means changing token values, not components.
- Tokens must be kept in sync with Penpot by hand. A drift test checks the CSS and TS token exports against each other.
- Extracting the system into its own package later is straightforward because of the import boundary.
