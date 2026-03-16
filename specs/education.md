# Education Section Specification

## Overview

Educational content section at `/education` listing presentations and PDFs for the community.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-03 |

## Architecture

- **Page:** `app/education/page.tsx` — lists resources from `content/education.ts`
- **Static assets:** `public/education/` — HTML presentations, PDFs

## Resource Types

- `presentation` — HTML slides (e.g. reveal.js)
- `guide` — PDFs (e.g. Cursor Cheat Sheet)
- `article`, `video` — future types

## Current Resources

| ID | Title | File |
|----|-------|------|
| ai-in-business | AI in Business | `public/education/ai-in-business.html` |
| cursor-cheat-sheet | Cursor Cheat Sheet | `public/education/cursor-cheat-sheet-en.pdf` |

## Adding a Resource

1. Add file to `public/education/` if static.
2. Add entry to `educationResources` in `content/education.ts`.

## Verification

- [ ] Education page lists all resources
- [ ] Links open correctly (HTML in tab, PDF in new tab)
- [ ] Presentation uses Cursor Serbia theme
