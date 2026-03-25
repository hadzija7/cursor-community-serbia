# Slides Engine (Optional)

This folder contains a reusable slide engine for workshop sessions.

## How to use

1. Create a slide deck file in `modules/slides/content/`.
2. Export an array of slides matching `Slide` from `modules/slides/types.ts` (optional: add `titleSize: 'large'` for title slides).
3. Add a **route layout** (`layout.tsx` next to `[id]/page.tsx`) that wraps children in `SlideLayout` with a unique `storageKey` and `totalSlides` per deck — keeps the shell mounted so fullscreen survives slide changes.
4. Add `[id]/page.tsx` using `SlidePage` (slide body only).
5. Optional: export `generateStaticParams` from `[id]/page.tsx` returning `{ id: '1' }` … for each slide so builds list every path.

After adding a **new** `app/.../[deck]/` folder, restart `next dev` (Turbopack sometimes does not register brand-new route segments until restart). If a deck URL still 404s, stop the server, run `rm -rf .next`, then `pnpm dev` again.

## Components

- `SlidePage.tsx` - shared page renderer (deck, totalSlides, id from route)
- `SlideLayout.tsx` - keyboard/button navigation, full-screen toggle (deck root via Fullscreen API); render from deck **layout**, not from `SlidePage`
- `SlideContent.tsx` - slide content renderer
- `CodeBlock.tsx` - copyable code blocks
- `PromptBlock.tsx` - copyable prompt blocks
- `DiagramSlide.tsx` - inline SVG diagram renderer

Ambassadors can skip this module entirely if they only need the community website pages.
