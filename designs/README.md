# Cursor Community Serbia — Design

Pencil.dev (`.pen`) design for the Cursor Community Serbia UI. Use this to iterate on layout and components visually before implementing in code.

## Current Design

The design mirrors the live site structure:

- **Navbar** — Logo/title, nav links (Upcoming Events, Past Events, Subscribe)
- **Hero** — Bento grid placeholder (photo grid)
- **Countdown Card** — Featured event, countdown blocks, Register CTA
- **Content Area** (centered, max-width ~672px):
  - **Ambassadors** — Card grid with avatar, name, role
  - **Upcoming Events** — Event list with Register buttons
  - **Past Events** — Past events section
  - **Partners** — Hosting partners
  - **Footer** — Tagline, links (All Events, Subscribe, Education, Community)

## Style Guide

The design uses a terminal-inspired dark theme:

- **Backgrounds:** `#0C0C0C` (page), `#171717` (cards)
- **Text:** `#E5E5E5` (primary), `#A3A3A3` (secondary)
- **Accent:** `#22C55E` (CTAs, active states)
- **Borders:** `#252525`, `#1F1F1F`

## How to Use

1. **Open in Pencil**
   - Ensure the Pencil MCP server / Pencil.dev integration is enabled
   - Open this design via Cursor or the Pencil app

2. **Modify on the Go**
   - Edit layout, copy, spacing, and components in Pencil
   - Use `get_screenshot` (via MCP) to preview changes
   - Sync design tokens with `tailwind.config` if you change colors

3. **Implement Changes**
   - Use Pencil’s design as reference when updating `app/` and `components/`
   - Keep `content/` and this design in sync for events, ambassadors, partners

## File Location

Pencil files are typically stored in the Pencil workspace. To work with a copy inside this repo:

- Create `cursor-community-ui.pen` here via Pencil’s **Save As** (or equivalent)
- Or keep the design in the Pencil workspace and reference this README when implementing
