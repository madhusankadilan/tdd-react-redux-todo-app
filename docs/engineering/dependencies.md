# Dependencies

All dependencies are kept on their latest versions. This page lists the exceptions: packages that are **held back** below their latest major, or **pinned** to an exact version, with the reason and when to revisit. `package.json` can't hold comments, so the reasons live here.

Related: [CONTRIBUTING](../../CONTRIBUTING.md) · [Testing strategy](testing-strategy.md)

## Held back

| Package | Version in use | Latest | Why | Lift when | Tracked in |
|---|---|---|---|---|---|
| `typescript` | `~6.0.3` | 7.x | typescript-eslint doesn't support TypeScript 7 yet. `typescript-eslint@8.71.2` declares `"typescript": ">=4.8.4 <6.1.0"`, so installing 7 fails with a peer-dependency conflict, and forcing it would run an unsupported combination. TypeScript 7 is the compiler rewritten in Go, and tools that use TypeScript's JavaScript API (typescript-eslint, Storybook's React docgen) need to adapt to it. | typescript-eslint's peer range includes TypeScript 7, and Storybook's docgen works with it | TDD-43 |

The `~` range allows 6.0.x patch releases only, matching typescript-eslint's `<6.1.0` limit. TypeScript 6.0 is the bridge release to 7: it deprecates the options that 7 removes, and the project type-checks on it without deprecation warnings.

## Pinned to an exact version

| Package | Version | Why |
|---|---|---|
| `prettier` | `3.9.10` | Prettier recommends an exact pin, because even minor releases can change formatting. Everyone, and CI, must format identically. Upgrade it on purpose, in its own commit, together with any reformatting it causes. |

## Checking for updates

```bash
npm outdated          # what's behind; only the packages listed above should appear
npm audit             # known vulnerabilities
```

When you hold back or pin a package, add it to this page with its reason and a tracking issue. When you lift a hold, remove its row.
