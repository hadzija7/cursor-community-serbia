# Slides Engine (Optional)

This folder contains a reusable slide engine for workshop sessions.

## How to use

1. Create a slide deck file in `modules/slides/content/`.
2. Export an array of slides matching `Slide` from `modules/slides/types.ts` (optional: add `titleSize: 'large'` for title slides).
3. Add a route using the shared `SlidePage` component with a unique `storageKey` per deck.

## Components

- `SlidePage.tsx` - shared page renderer (deck, totalSlides, storageKey)
- `SlideLayout.tsx` - keyboard and button navigation, full-screen toggle (deck root via Fullscreen API)
- `SlideContent.tsx` - slide content renderer
- `CodeBlock.tsx` - copyable code blocks
- `PromptBlock.tsx` - copyable prompt blocks
- `DiagramSlide.tsx` - inline SVG diagram renderer

Ambassadors can skip this module entirely if they only need the community website pages.
