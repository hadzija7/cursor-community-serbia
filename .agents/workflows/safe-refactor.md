# Safe Refactor Workflow

## Purpose

Refactor with low risk of regressions.

## Steps

1. **Identify scope** — What is being refactored and why.
2. **Check tests** — Ensure tests exist or add minimal coverage first.
3. **Change in small steps** — One logical change per commit/step.
4. **Run tests after each step** — `pnpm test`
5. **Update specs** — If behavior or structure changed, update specs.
6. **Verify UI** — Manually check affected pages.

## When to Use

- Renaming files or exports.
- Extracting components or modules.
- Restructuring content or config.
