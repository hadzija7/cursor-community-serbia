# Slides (Optional)

## Overview

Optional workshop slide engine for Cursor Community events. Can be skipped if the community only needs the website and education materials.

## Architecture

- **Routes:** `app/slides/[id]/page.tsx` (example deck), `app/education/productivity-with-ai/[id]/page.tsx` (main presentation)
- **Layouts:** `app/slides/layout.tsx` and `app/education/productivity-with-ai/layout.tsx` wrap slide pages with `SlideLayout` so the shell **stays mounted** when `[id]` changes — **browser fullscreen persists** across slide navigation (client-side route changes only swap page content).
- **Content:** `modules/slides/content/` — deck files export Slide arrays
- **Components:** `modules/slides/components/` — SlideLayout, SlideContent, SlidePage, CodeBlock, PromptBlock, DiagramSlide
- **Slide chrome:** `SlideLayout` bottom bar includes prev/next, dot indicators, slide counter, and a **full screen** control (Fullscreen API on the deck root; click no-ops if `requestFullscreen` is missing). Press Esc to exit full screen. Current slide index comes from the URL (`useParams().id`), not from props.

## Data Model

```ts
interface Slide {
  id: number
  title: string
  content: ReactNode
  notes?: string
  titleSize?: 'large' | 'normal'  // 'large' for title-slide heading
}
```

## Usage

1. Create a deck in `modules/slides/content/` (e.g. `productivity-with-ai-deck.tsx`).
2. Export `Slide[]` and `totalSlides`.
3. Add `app/education/[deck]/layout.tsx` wrapping `SlideLayout` (unique `storageKey` + `totalSlides` per deck) so chrome persists across slides.
4. Add route `app/education/[deck]/page.tsx` (redirect to `/1`) and `[deck]/[id]/page.tsx` (render deck via `SlidePage` — slide body only, no `SlideLayout` in the page).
5. Add entry to `educationResources` in `content/education.ts` if presenting in education section.

## Decks

- `example-deck.tsx` — Template (served at `/slides/[id]`)
- `productivity-with-ai-deck.tsx` — Productivity, AI evolution, Cursor (served at `/education/productivity-with-ai`)

## Verification

- [ ] Route serves slides with navigation
- [ ] Example deck renders correctly
- [ ] Productivity deck renders at `/education/productivity-with-ai`
