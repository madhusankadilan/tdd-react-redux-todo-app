# 0007. Penpot as the design tool

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
The project needs a proper design file for its design system and screens: components, variants, tokens, and exports. The original mockups were in Figma. The project should stay free to maintain, and designs should be editable with AI assistance (through MCP).

## Decision
We use **Penpot** (free cloud plan). The file **"Design System"** in the Penpot project "TDD Todo App" is the source of truth, with pages *Foundations*, *Components* and *App Screens*. Earlier explorations stay in `Archived — …` pages.

## Alternatives considered
- **Figma:** the industry standard, but its free plan has limits, and its MCP integration is mainly for reading designs into code rather than creating them.
- **Design only in code (Storybook):** no space for exploring layouts before building.
- **Static images or SVGs in the repo:** not editable as components, and no tokens or variants.

## Consequences
- Free, open-source and open format. Tokens, components and variants map cleanly to code.
- Version history on the free plan is limited (7 days), so important states are exported (PNG / `.penpot`) into the repo when needed.
- Fewer people know Penpot than Figma, though the concepts transfer directly.
