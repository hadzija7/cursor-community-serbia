# Slides (Optional)

## Overview

Optional workshop slide engine for Cursor Community events. Can be skipped if the community only needs the website and education materials.

## Architecture

- **Route:** `app/slides/[id]/page.tsx`
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

1. Create a deck in `modules/slides/content/`.
2. Export `Slide[]` and `totalSlides`.
3. Point `app/slides/[id]/page.tsx` to the deck.
4. Remove links to `/slides/*` from content if not used.

## Verification

- [ ] Route serves slides with navigation
- [ ] Example deck renders correctly
