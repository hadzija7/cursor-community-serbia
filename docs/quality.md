# Quality Scorecard

Living scorecard for Cursor Community Serbia. Update after each phase.

## Domain Grades

| Domain        | Spec | Code | Tests | Review | Overall |
|---------------|------|------|-------|--------|---------|
| Web UI        | C    | B    | C     | -      | C       |
| Hackathon     | B    | B    | B     | -      | B       |
| Content Config| C    | B    | C     | -      | C       |
| Mailing List  | C    | B    | C     | -      | C       |
| Education     | C    | B    | -     | -      | C       |
| Slides        | C    | B    | -     | -      | C       |

**Grade scale:** A (production-ready), B (functional), C (exists), D (partial), F (not started)

## Architectural Layers

| Layer          | Grade | Notes                                    |
|----------------|-------|------------------------------------------|
| Error handling | C     | Basic try/catch; API returns errors      |
| Security       | C     | Env vars for secrets; no hardcoded keys |
| Observability  | D     | Vercel Analytics; no structured logging |
| Performance    | B     | Next.js optimizations; static where possible |
| CI             | D     | No CI config in repo                     |
| Documentation  | B     | README, this scaffold                    |

## Known Gaps

- [x] Unit tests for upcoming events API and Luma mapping
- [x] Unit tests for hackathon Luma date/location sync (`/api/hackathon/event`)
- [x] Unit tests for subscribe API (webhook + optional Luma import)
- [ ] E2E or UI property tests
- [ ] CI pipeline (lint, test, build)
- [ ] Structured error boundaries

## Score History

| Date       | Change                          |
|------------|----------------------------------|
| 2026-08-24 | Hackathon Stack: Add to Cursor uses `cursor://` MCP deeplink so the install tab no longer auto-closes |
| 2026-08-24 | Exa tech-partner logo: official icon + “exa” wordmark on a white pad |
| 2026-08-24 | Hackathon tech partners + Stack: Wispr Flow, Exa, Netlify, Fal.ai with confirmed participant credits |
| 2026-08-24 | ABC BootCamps: official overlapping mark on white pad at `h-10` (same as Superteam) |
| 2026-08-24 | Superteam Balkan community logo: transparent PNG, no black JPEG frame, sized like Startit |
| 2026-08-24 | Hackathon community partners: added ABC BootCamps, JigJoy, Kosmonaut |
| 2026-08-24 | Hackathon Overview: community partners use the same scrolling marquee as tech partners |
| 2026-08-24 | Hackathon: tech companies labeled Tech partners; community orgs stay Community partners |
| 2026-08-24 | Hackathon Overview: community partners (Startit, Superteam Balkan) below sponsors |
| 2026-08-24 | Hackathon Stack: Add to Cursor MCP install on each sponsor modal |
| 2026-08-24 | Hackathon Stack: flat sponsor cards with area labels (no nested panels) |
| 2026-08-24 | Hackathon Guide slimmed to why / team / numbered timeline / topics |
| 2026-08-24 | Hackathon Mentors tab (`/hackathon/mentors`): Nick Tomić first; judges section empty until announced |
| 2026-08-24 | Hackathon Guide tab (`/hackathon/guide`) for purpose, solo-or-pair, shipping defaults; Daytona prize track on Prizes |
| 2026-08-17 | Hackathon Overview hosts the sponsor form (`#become-a-sponsor`); header tabs are Overview / Prizes / Stack; hero Stack CTA removed |
| 2026-08-17 | Hackathon tabbed mini-site + `hackathon.*` subdomain rewrite (DNS still added in Vercel) |
| 2026-08-17 | Hackathon sponsor stack preview at `/hackathon/stack` (grouped expertise cards; landing unchanged) |
| 2026-08-14 | Hackathon sponsors: added Daytona official wordmark; removed Cursor from marquee (host) |
| 2026-08-08 | Open Graph / Twitter share image set to Cursor Serbia logo (`/images/og-cursor-serbia.jpg`); `metadataBase` defaults to cursorserbia.com |
| 2026-08-05 | Hackathon static fallback: Belgrade, September 12, 2026 (aligned with Luma `ghvnbjlx`) |
| 2026-08-05 | Hackathon prizes section above sponsors: Convex track (Best app that uses Convex; 1st 100.000 RSD, 2nd 50.000 RSD) |
| 2026-08-04 | Hackathon sponsors: added Convex logo to marquee |
| 2026-07-29 | Hackathon sponsor API: fall through to webhook when Postgres insert fails (missing table); Sheets path unblocked |
| 2026-07-29 | Hackathon sponsorship Google Sheets inbox: Apps Script webhook template + setup docs (`HACKATHON_SPONSOR_WEBHOOK_URL`) |
| 2026-07-09 | Hackathon date/location synced from public Luma event page (`/api/hackathon/event`); static fallback retained |
| 2026-07-08 | Hackathon page UI: TUM-inspired hero, stat highlights, orange accent palette refresh |
| 2026-07-08 | Hackathon sponsors: added ElevenLabs, Firecrawl, Render logos to marquee |
| 2026-07-08 | Hackathon page (`/hackathon`): sponsor marquee animation, sponsorship form, Postgres + webhook API |
| 2026-07-07 | Content: Cafe Cursor Belgrade Summer Edition recap (`cafe-cursor-belgrade-summer-2026`); Luma cursor-belgrade; 2 Drive recap videos + interview; 8 gallery photos |
| 2026-07-07 | Recap UI: unified 2-column video grid for recap + interview cards; Drive videos use native `<video>` with iframe fallback |
| 2026-05-27 | Content: Cursor Meetup Novi Sad May 26, 2026 — Memclaw presentation in `extraPresentations` (Presentation section) https://youtu.be/ynhKwdcadMA |
| 2026-05-27 | Content: Cursor Meetup Novi Sad May 26, 2026 recap — gallery swapped to JPEG Drive uploads (replaced CR3 originals) |
| 2026-05-27 | Content: Cursor Meetup Novi Sad May 26, 2026 recap (`cursor-meetup-novisad-may-2026`); Luma jn59jzyp; Memclaw presentation; 10 gallery photos |
| 2026-05-17 | YouTube recap metadata: cache key bumped (`youtube-video-metadata-v2`) + per-video `revalidateTag` helper so updated video descriptions (e.g. Aleks “SDLC with Cursor”) refetch from YouTube |
| 2026-05-17 | Recap UI: **Video Recap** section for `videoUrl`; **Presentation** only for `extraPresentations[]`; `getRecapYoutubeSections` in `lib/recap-youtube.ts` |
| 2026-05-17 | Content: Cursor Coworking Day Belgrade recap (`cursor-coworking-belgrade-1`); Luma 9tlvu6ij; recap video https://youtu.be/ApGre9Btaq0 |
| 2026-04-14 | Homepage: Past Events recap grid (3 columns on large screens, ~80% viewport width); static upcoming fallback uses future-dated `events` when `status: upcoming` list is empty |
| 2026-04-10 | Thumbnails: past-event + recap OG/schema use first gallery photo; YouTube cards use player maxres / same CDN URLs as watch page |
| 2026-04-10 | Content: Novi Sad Dec 2025 recap — presentation `videoUrl` https://youtu.be/Wpup2C1oPWY |
| 2026-04-09 | Content: Cursor Meetup Novi Sad Dec 23, 2025 recap (`cursor-meetup-novisad-dec-2025`); Luma udbedo7b (attendees corrected to 100) |
| 2026-04-09 | Hub201 event date corrected to 2026-04-07 (recap + `events.ts`) |
| 2026-04-09 | Recap YouTube grid: `getRecapYoutubePresentationCards` + `lib/youtube-metadata.ts` (player response, cached); cards side-by-side on md+ |
| 2026-04-09 | Recap `extraPresentations[]` for additional YouTube recordings (Hub201: second session link) |
| 2026-04-09 | Recap presentation: optional `videoThumbnailUrl` (poster + click-to-play for YouTube); Hub201 recap uses Drive image |
| 2026-04-09 | Content: Cursor Belgrade Hub201 recap (`cursor-belgrade-hub201-1`) + past event; Luma yvpg9ijv |
| 2026-04-03 | Content: Cafe Cursor Cannes recap (`cafe-cursor-cannes-1`) + past event entry |
| 2026-03-27 | Coworking Day deck: brainstorming slide + Obsidian/Cursor PKM build idea (8 slides) |
| 2026-03-25 | Education: Coworking Day deck (`coworking-day-deck.tsx`, `/education/coworking-day`) |
| 2026-03-24 | Subscribe API: optional Luma `import-people` for calendar sync; tests |
| 2026-03-23 | Recap `videoUrl`: presentation section + YouTube watch URL normalization |
| 2026-03-21 | Live Luma upcoming events sync + tests |
| 2026-03-21 | Recap gallery lightbox: keyboard ArrowLeft/ArrowRight to browse photos |
| 2026-03-21 | Recap `interviews[]` + YouTube embed helper; Niš coworking recap content |
| 2026-03-13 | Initial scaffold; grades set    |
