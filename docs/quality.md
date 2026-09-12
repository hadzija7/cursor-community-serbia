# Quality Scorecard

Living scorecard for Cursor Community Serbia. Update after each phase.

## Domain Grades

| Domain        | Spec | Code | Tests | Review | Overall |
|---------------|------|------|-------|--------|---------|
| Web UI        | C    | B    | C     | -      | C       |
| Hackathon     | B+   | B+   | B+    | -      | B+      |
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
| 2026-09-12 | Hackathon Showcase tab: 12 ten-minute demo slots 17:00–19:00; team name books the next open slot (`hackathon_showcase_slots`) |
| 2026-09-12 | Hackathon project card: TypeScript build failed on `embed.href` (union not narrowed); external watch link uses the recording URL |
| 2026-09-12 | Hackathon Guide agenda: 13:00 Build with Solana (Nemanja Šćepanović); 14:00 lunch break |
| 2026-09-12 | Hackathon project cards: full description scrolls in a short box; YouTube thumbnail posters fall back to the Grok Bot demo poster |
| 2026-09-10 | Hackathon Guide agenda: Hacking Starts at 11:00; workshops at 12:00 Mozaik, 12:30 Wonder, 16:00 ABC Bootcamp Experience |
| 2026-09-10 | Hackathon final top 3: confirm/override is admin-only; no provisional top-3 cards; cash stays on Prizes only; published cards show place only |
| 2026-09-10 | Hackathon submit: admin can close/reopen the form (`hackathon_submissions_gate`); POST returns 409 while closed |
| 2026-09-10 | Judge scoring: explicit finish lock; peer votes/winners after all judges finish; public awards only after admin publish |
| 2026-09-10 | Hackathon judges score without Luma check-in; gallery no longer waits on Luma; checked-in judges get scoring + community favorites |
| 2026-09-10 | Hackathon judge scores: save updates the card in place (no full gallery reload); aggregates refresh silently |
| 2026-09-10 | Hackathon: `pnpm db:setup` now creates `hackathon_judge_final_top3` (gallery GET was warning that the relation did not exist) |
| 2026-09-10 | Hackathon submit: teammate display names on gallery (emails private); one project per team (membership uniqueness + unique GitHub); listed teammates update the same row |
| 2026-09-10 | Hackathon submit: `noValidate` + `color-scheme: dark` so required-field errors use in-page copy instead of an unreadable native tooltip |
| 2026-09-10 | Hackathon people cards: local photos use `unoptimized` so new files are not blocked by Hobby Image Optimization 402 |
| 2026-09-10 | Hackathon mentors: replaced Dušan Radivojević photo with close-up portrait (`public/images/hackathon/dusan-radivojevic.jpg`, 800×800, center crop) |
| 2026-09-10 | Hackathon submit: GET prefill for existing row; removed live GitHub public-repo API check (shape only) |
| 2026-09-10 | Hackathon Overview: removed become-a-sponsor form; added Special thanks (Startit hosting, Superteam Balkan community support); `/hackathon/sponsor` → `#special-thanks` |
| 2026-09-10 | Hackathon: removed Netlify from tech partners, Stack cards/MCP, credit claim map, and sponsor cheat sheet |
| 2026-09-10 | Hackathon Guide agenda: demo showcase 17:00–19:00; submission deadline 19:00; community voting 19:00–19:30; pizza party 19:30–21:00 (event close folded into pizza) |
| 2026-09-09 | Hackathon Guide: Guidelines allow GitHub/Origin/other for repo hosting + deploy live URL step; optional workshops during hacking |
| 2026-09-09 | Hackathon Guide: Team → Rules (1–3 people, open source, what counts, live URL, video demo); Judging expands with innovation-first criteria under 19 Sep winners |
| 2026-09-09 | Hackathon Stack: Render promo credits claimable via `CREDIT_CODE_RENDER` after check-in; redeem at dashboard.render.com Billing → Credit Balance (code never in repo) |
| 2026-09-08 | Hackathon mentors: added Alexandra Borisova (SRE & Infra Leader; Typeable; AWS/K8s/observability; photo `public/images/hackathon/alexandra-borisova.jpg`, center crop; LinkedIn `princessfruittt`) |
| 2026-09-09 | Hackathon mentors: added Dušan Radivojević (Head of AI & Platform, Wonder; AI-native design platform bio; ask about design and AI; photo `dusan-radivojevic.jpg`; X `radivojevic_1`, LinkedIn `dusan-g-radivojevic`) |
| 2026-09-10 | Hackathon Projects: community leaderboard top 3 by real favorite counts (tie-break: earlier submit, then title); favorites require Luma check-in; fixed favoriteCount double-count after insert; client + API max-3 cap |
| 2026-09-09 | Hackathon Guide agenda: intro & welcome moved to 10:30; hacking starts at 11:00 |
| 2026-09-09 | Hackathon mentors: Miodrag Vilotijević bio → CEO/Mozaik open-source runtime; ask about code quality, startup insights, product positioning |
| 2026-09-08 | Hackathon Judges: published Marija Mladenović on `/hackathon/mentors` (lead product designer & angel investor; Solflare; photo `public/images/hackathon/marija-mladenovic.jpg`; X `MarijaHolt`, LinkedIn `marijamladenovic`) |
| 2026-09-08 | Hackathon Judges: published Agrim Singh on `/hackathon/mentors` (AI adoption, SpaceXAI; SEA/Singapore community; photo `public/images/hackathon/agrim-singh.jpg`; X `agrimsingh`, LinkedIn `agrims`) |
| 2026-09-08 | Hackathon tech partners + Stack: SpaceXAI / x.ai (`id: xai`) ~$35 Console API credits via `CREDIT_CODE_XAI` after check-in; redeem at console.x.ai Billing (code never in repo) |
| 2026-09-07 | Hackathon Stack: Convex is prize-only — no Claim Credits button or participant coupon perk |
| 2026-09-07 | Hackathon Wispr Flow: 3 months Pro claimed via `CREDIT_CODE_WISPR` after check-in (referral URL not on the Stack card) |
| 2026-09-07 | Hackathon mentors: added Miodrag Todorović (JigJoy co-founder; Mozaik Cloud / baro / agent workflows; photo `miodrag-todorovic.jpg`, center crop; X `lotus_sbc`, LinkedIn `lotus015`) |
| 2026-09-07 | Hackathon mentors: added Miodrag Vilotijević (JigJoy / Mozaik; short DDD / category design / positioning bio; X + LinkedIn) |
| 2026-09-07 | Hackathon hosts: added Vladimir Hristov (embedded → AI; technical documentation tools; LinkedIn only); all hosts share “Whatever you need, we are here to help.” |
| 2026-09-07 | Hackathon Overview hero mascot is animated ink orb SVG (`/bloub-cercle-neutre-encre-anime.svg`) |
| 2026-09-06 | Hackathon Guide: day agenda + judging (19 Sep winners); three optional idea sparks (FinTech / gaming-art / personal assistant); build-anything framing |
| 2026-09-04 | Hackathon credits UI: dual pools labeled $20 / $50 Cursor credits (not Grok Bot); claim key `cursor-50` for the second pool |
| 2026-09-04 | Hackathon credits: separate `hackathon_grok_bot_referral_codes` pool; Stack Grok Bot modal lets checked-in hackers claim both Cursor Pro and Grok Bot referrals |
| 2026-09-04 | Hackathon: full-circle `/grokbot.svg` mark on Overview hero + Stack Grok Bot card (same as header); hosts bio → SpaceXAI ambassadors; Nick bio shortened for card height |
| 2026-09-04 | Hackathon Judges: published Ben Kim on `/hackathon/mentors` (`hackathonJudges`, photo `public/images/hackathon/ben-kim.jpg`) |
| 2026-09-04 | Hackathon projects gallery: `/hackathon/projects` cards; judge scores via `HACKATHON_JUDGE_EMAILS` (avg aggregate); community favorites capped at 3 |
| 2026-09-04 | Hackathon project submissions: `/hackathon/submit` + `POST /api/hackathon/submit`; auth + Luma check-in gate; public GitHub verify; demo recording as URL; upsert per email |
| 2026-09-07 | Hackathon submit: optional teammate emails (max 2; teams 1–3); `teammate_emails` on submissions |
| 2026-09-07 | Hackathon: removed ElevenLabs from tech partners / Stack; Fal credits claim via `CREDIT_CODE_FAL` |
| 2026-09-03 | Hackathon header uses `/grokbot.svg` with expanded viewBox so the full circle mark is not clipped |
| 2026-09-03 | Hackathon header uses cropped Grok Bot wordmark lockup + “Serbia Hackathon”; silk bg clipped in a rounded chip |
| 2026-09-03 | Hackathon brand: header shows Grok Bot Serbia Hackathon; marketing copy prioritizes Grok Bot; hero mascot stays in flow on mobile |
| 2026-09-02 | Hackathon prizes: ABC BootCamps scholarships (50% / 40% / 30% to ABC Silicon Valley 2027); Daytona claim shows Billing redeem tip via `CREDIT_CODE_DAYTONA` |
| 2026-09-01 | Hackathon Mentors tab: Hosts first, then mentors, then judges; person cards 2-col from `md` |
| 2026-09-01 | Hackathon Mentors tab: Hosts section (Aleksandar Hadžibabić, Goran Petković from ambassadors); Nick Tomić X + LinkedIn |
| 2026-09-01 | Hackathon OG/Twitter share image is Grok Bot poster (`og-grok-bot-hackathon.jpg`) so Telegram no longer uses the community Cursor thumbnail |
| 2026-09-01 | Hackathon rebranded to Grok Bot Serbia Hackathon; Grok Bot mascot sits next to the title on homepage promo + Overview hero |
| 2026-08-25 | Hackathon tech partners + Stack: Wonder (Design / UI; Pro for all participants; MCP at mcp.wonder.so) |
| 2026-08-25 | Section headers share `SectionEyebrow` (orange small-caps); Past Events, Hosting Partners, Featured, and Education match Ambassadors / Upcoming Events |
| 2026-08-25 | Homepage: ambassadors heading is orange eyebrow only; upcoming events uses the same orange subtitle + card styling |
| 2026-08-25 | Ambassador photo: Aleksandar Hadžibabić uses new Cursor-shirt portrait (`aleks-cursor.jpg`) |
| 2026-08-25 | Homepage ambassadors: fixed doubled “Cursor” title; section uses hackathon-style orange eyebrow, cards, and hover accents |
| 2026-08-25 | Content: Cafe Cursor Belgrade August recap (`cafe-cursor-belgrade-aug-2026`); Luma cursor-belgrade-august; Drive recap video + 12 gallery photos from Cafeteria Battery |
| 2026-08-24 | Hackathon prizes: place cards show place + amount only (no repeated sponsor name) |
| 2026-08-24 | Hackathon prizes: Kosmonaut coworking for top 3 teams (15 / 10 / 5 entries per teammate, use within 3 months, claim on kosmonaut.rs), listed below Convex cash |
| 2026-08-24 | Content: Cursor Meetup Novi Sad Aug 20, 2026 recap (`cursor-meetup-novisad-aug-2026`); Luma kd163iko; Drive recap video + 9 gallery photos from Creative Space 75 |
| 2026-08-24 | Hackathon Stack: Add to Cursor uses `cursor://` MCP deeplink so the install tab no longer auto-closes |
| 2026-08-24 | Exa tech-partner logo: official icon + “exa” wordmark on a white pad |
| 2026-08-24 | Hackathon tech partners + Stack: Wispr Flow, Exa, Fal.ai with confirmed participant credits |
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
