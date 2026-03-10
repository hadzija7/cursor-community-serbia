# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **Next.js 16** community website template (Cursor Ambassador Evergreen) — a purely frontend, static-content site with no database or backend services. All content lives in `content/` directory as TypeScript/JSON files.

### Dev commands

Standard scripts are in `package.json`:

- **Dev server**: `pnpm dev` (port 3000)
- **Build**: `pnpm build`
- **Tests**: `pnpm test` (Vitest + jsdom + @testing-library/react)
- **Lint**: `pnpm lint` (runs `next lint`)

### Known issues

- **`pnpm lint` does not work**: Next.js 16 removed the `next lint` CLI command. The `pnpm lint` script will fail. If you need to lint, run `eslint` directly, though there may be compatibility issues with `eslint-config-next@16` and ESLint 8's legacy config format.
- **One pre-existing test failure**: The `i18n > persists locale selection in localStorage` test fails due to duplicate DOM elements. This is not caused by environment setup.

### Environment notes

- **Node.js 20** is required (matches CI). Managed via `nvm`.
- **pnpm 10.13.1** is the package manager, activated via `corepack enable && corepack prepare pnpm@10.13.1 --activate`.
- The `pnpm.onlyBuiltDependencies` field in `package.json` allows build scripts for `esbuild`, `sharp`, and `unrs-resolver` — these are required for Vitest, Next.js image optimization, and module resolution respectively.
- No Docker, database, or external services are needed for local development.
