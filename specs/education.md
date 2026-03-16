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
- **Presentations:** Slide engine at `app/education/[deck]/[id]/` (e.g. productivity-with-ai)
- **Static assets:** `public/education/` — PDFs, legacy HTML

## Resource Types

- `presentation` — Slide engine decks or HTML (e.g. reveal.js)
- `guide` — PDFs (e.g. Cursor Cheat Sheet)
- `article`, `video` — future types

## Current Resources

| ID | Title | Location |
|----|-------|----------|
| productivity-with-ai | Productivity with AI & Cursor | `/education/productivity-with-ai` (slide engine) |
| cursor-cheat-sheet | Cursor Cheat Sheet | `public/education/cursor-cheat-sheet-en.pdf` |

## Adding a Resource

1. Add file to `public/education/` if static.
2. Add entry to `educationResources` in `content/education.ts`.

## Verification

- [ ] Education page lists all resources
- [ ] Links open correctly (HTML in tab, PDF in new tab)
- [ ] Presentation uses Cursor Serbia theme
