# Slides (Optional)

## Overview

Optional workshop slide engine for Cursor Community events. Can be skipped if the community only needs the website and education materials.

## Architecture

- **Routes:** `app/slides/[id]/page.tsx` (example deck), `app/education/productivity-with-ai/[id]/page.tsx` (main presentation)
- **Content:** `modules/slides/content/` — deck files export Slide arrays
- **Components:** `modules/slides/components/` — SlideLayout, SlideContent, CodeBlock, PromptBlock, DiagramSlide

## Data Model

```ts
interface Slide {
  id: number
  title: string
  content: ReactNode
}
```

## Usage

1. Create a deck in `modules/slides/content/` (e.g. `productivity-with-ai-deck.tsx`).
2. Export `Slide[]` and `totalSlides`.
3. Add route `app/education/[deck]/page.tsx` (redirect to `/1`) and `[deck]/[id]/page.tsx` (render deck).
4. Add entry to `educationResources` in `content/education.ts` if presenting in education section.

## Decks

- `example-deck.tsx` — Template (served at `/slides/[id]`, `/education/test`)
- `productivity-with-ai-deck.tsx` — Productivity, AI evolution, Cursor (served at `/education/productivity-with-ai`)

## Verification

- [ ] Route serves slides with navigation
- [ ] Example deck renders correctly
- [ ] Productivity deck renders at `/education/productivity-with-ai`
