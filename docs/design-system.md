# Website design system — Cursor Community Serbia

Canonical reference for visual language, tokens, and implementation patterns for the marketing site (`app/`, `components/`). For **Figma MCP workflow and agent rules**, see [`.cursor/rules/figma-design-system.mdc`](../.cursor/rules/figma-design-system.mdc). To **create a new Figma file** by importing this site, see [`figma-capture.md`](figma-capture.md). For **slide decks**, see `specs/slides.md` and `modules/slides/`.

## Principles

1. **Tokens first** — Surfaces, text, and borders use the `cursor.*` Tailwind palette. Avoid new arbitrary hex values; extend `tailwind.config.ts` when adding a deliberate semantic color, and note it here.
2. **Dark-first** — Default chrome matches `cursor-bg` / `cursor-text` (see `app/globals.css`).
3. **Content + i18n** — User-visible copy comes from `content/locales/` via `useI18n()` / `t()` unless the surface is explicitly non-translated.
4. **Reuse before inventing** — Check `components/` and `specs/web-ui.md` before adding parallel patterns.

## Tech stack (UI)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router, React 19 |
| Styling | Tailwind CSS 3 utilities (`tailwind.config.ts`, `app/globals.css`) |
| Motion | Framer Motion where siblings already animate |
| Icons | `lucide-react` for UI chrome; brand marks from `public/` or Figma MCP assets |

## Color tokens

Defined in `tailwind.config.ts` under `theme.extend.colors.cursor`. Use Tailwind classes, not inline hex, for theme surfaces.

| Token | Hex / value | Typical use |
|-------|-------------|-------------|
| `cursor-bg` | `#14120b` | Page background, default shell |
| `cursor-bg-dark` | `#0f0d06` | Deeper panels, cards |
| `cursor-surface` | `#1c1a12` | Elevated surfaces |
| `cursor-surface-raised` | `#262318` | Stronger elevation |
| `cursor-text` | `#edecec` | Primary text |
| `cursor-text-secondary` | 75% opacity | Secondary text |
| `cursor-text-muted` | 55% opacity | Tertiary / hints |
| `cursor-text-faint` | 35% opacity | Placeholders, disabled feel |
| `cursor-border` | 8% white | Default borders |
| `cursor-border-emphasis` | 15% white | Hover / focus borders |
| `cursor-overlay` | 5% white | Subtle overlays |
| `cursor-accent-*` | see config | Semantic accents (blue, green, red, purple, yellow, orange) |
| `cursor-accent-*-bg` | rgba variants | Tinted accent backgrounds |

**Legacy note:** Some components still use `#1B1913` for card shells. It is visually close to `cursor-surface` (`#1c1a12`). Prefer `bg-cursor-surface` (or `bg-cursor-bg-dark`) in new work; migrate legacy hex when touching those files.

## Typography

| Role | Implementation |
|------|----------------|
| Body | `font-sans` → CursorGothic (`@font-face` in `app/globals.css`) |
| Mono | `font-mono` → Berkeley Mono stack (`:root --font-mono`) |
| Display / brand | `font-cursor` (same family as sans in practice) |
| BSRU | `font-bsru` for specific brand typography |
| Thai | `font-thai` (Thasadith from Google Fonts) |

Sizes and weights: use Tailwind `text-*`, `font-medium`, `font-bold` consistent with neighboring sections (e.g. section titles `text-2xl`–`text-4xl` on homepage).

## Spacing, radius, and layout

- **Spacing:** Tailwind default scale (`p-4`, `gap-6`, `space-y-10`, etc.). Common horizontal padding for page sections: `px-6`.
- **Radius:** `rounded-md` for compact controls and small cards; `rounded-lg` for primary cards, galleries, modals; `rounded-xl` for prominent panels (e.g. subscribe). Avatars / logos: `rounded-full` where appropriate.
- **Content width:** Route-dependent — e.g. `max-w-3xl` for focused copy (`app/page.tsx`, education), `max-w-5xl` for recaps, `max-w-6xl` in slides layout. Center with `mx-auto` where used.
- **Breakpoints:** Standard Tailwind `sm:`, `md:`, `lg:`; align new blocks with adjacent components.

## Motion

- Prefer existing utilities: `animate-fade-in`, `animate-slide-up` from `tailwind.config.ts`.
- For staged entrance, follow `HeroHeader` / section patterns with Framer Motion (`motion.*`, modest duration ~0.5s).

## Component map

| Path | Role |
|------|------|
| `components/Navbar.tsx` | Top navigation |
| `components/HeroHeader.tsx` | Hero + bento grid |
| `components/UpcomingEvents.tsx`, `PastEvents.tsx` | Events |
| `components/AmbassadorSection.tsx` | Ambassadors |
| `components/Partners.tsx` | Partners |
| `components/SubscribeForm.tsx` | Mailing form |
| `components/EventRecap.tsx`, `PhotoGallery.tsx`, … | Recap-specific UI |
| `app/*/page.tsx` | Page composition |

Full route list: `specs/web-ui.md`.

## Assets

- **Repo static files:** `public/images/`, `public/fonts/`, `public/education/`.
- **Next.js:** Use `next/image` for raster when appropriate; local paths from `/…`.
- **Figma MCP:** Use tool-provided asset URLs (including localhost during dev); persist to `public/images/` when the asset must ship with the repo.

## Icons

- Import named icons from `lucide-react` (tree-shake friendly).
- For brand-specific marks from design files, use exported SVG/PNG rather than approximating with Lucide.

## Accessibility

- Prefer semantic elements (`button`, `a`, headings hierarchy).
- Preserve or add focus styles (`focus:ring-*`, `focus:outline-none` only when replacing with visible ring).
- Match contrast of existing `cursor-text` on `cursor-bg` / surfaces for new text.

## Extending the system

1. Add colors under `cursor` in `tailwind.config.ts`.
2. Update this document with the new semantic name and usage.
3. Update `.cursor/rules/figma-design-system.mdc` if agent workflow or token rules change.
4. Run `pnpm lint` and `pnpm build` after token or global style changes.

## Related docs

- `docs/architecture.md` — Repo map and systems
- `specs/web-ui.md` — Web UI specification
- `.cursor/rules/figma-design-system.mdc` — Figma / Pencil implementation rules for agents
