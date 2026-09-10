# Hackathon Specification

## Overview

Hackathon mini-site with tabs (Overview, Guide, Mentors, Prizes, Stack). Served at `/hackathon` on the community host, and at the root of `hackathon.cursorserbia.com` when that subdomain is attached.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-09-10 |

## Page layout

Inspired by conference landing patterns (e.g. TUM Blockchain Conference): full-width hero with gradient orange glow, scannable fact cards (when / where / duration), stat-style highlight grid, and section eyebrow labels. Palette stays on Cursor black (`cursor-bg`), white (`cursor-text`), and orange (`cursor-accent-orange`).

## Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/hackathon` | Overview tab (hero, highlights, tech partners marquee, community partners, special thanks) |
| `/hackathon/guide` | Guide tab: purpose, rules, day agenda, judging criteria, hacker guidelines, optional idea sparks (build anything allowed) |
| `/hackathon/mentors` | Mentors and judges tab; published judges appear in the Judges section |
| `/hackathon/stack` | Stack tab: expertise group panels + card modal |
| `/hackathon/prizes` | Prizes tab |
| `/hackathon/submit` | Project submission form (checked-in Google-auth hackers only) |
| `/hackathon/projects` | Public projects gallery — community leaderboard (top 3), cards, judge scores, community favorites |
| `/hackathon/sponsor` | Redirects to Overview `#special-thanks` (bookmarks / `hackathon.*` `/sponsor` rewrite) |
| `/api/hackathon/event` | GET live date/location from Luma (static fallback) |
| `/api/hackathon/sponsor` | POST sponsorship applications |
| `/api/hackathon/submit` | GET existing submission for prefill; POST upsert (auth + Luma `checked_in`; GitHub URL shape only) |
| `/api/hackathon/projects` | GET public gallery list with community favorites + viewer favorite/score state; judge aggregates gated |
| `/api/hackathon/projects/review` | POST upsert judge score 1–10 (env-gated judge emails); response is the caller's score only |
| `/api/hackathon/projects/favorite` | POST toggle community favorite (max 3 per signed-in user) |
| `/api/hackathon/projects/final-top3` | POST confirm/override final judge top 3 (judges/admins; only after all-rated) |
| `/api/auth/[...nextauth]` | Google OAuth sign-in/sign-out (NextAuth.js v5) |
| `/api/hackathon/attendee-status` | GET Luma guest status for authenticated user |
| `/api/hackathon/claim-credits` | POST claim sponsor credit code (requires check-in) |

On host `hackathon.*` (e.g. `hackathon.cursorserbia.com` or `hackathon.localhost`), `middleware.ts` rewrites `/` → `/hackathon`, `/stack` → `/hackathon/stack`, `/submit` → `/hackathon/submit`, `/projects` → `/hackathon/projects`, and so on. Community chrome is replaced by `HackathonSiteHeader` tabs.

When `NEXT_PUBLIC_HACKATHON_SITE_URL` is set, `/hackathon` on the main domain redirects to that host. Do not set the env until the Vercel domain is live.

### Key Components

- `app/hackathon/page.tsx` — Overview tab (hero, highlights, marquee, special thanks)
- `app/hackathon/guide/page.tsx` — Guide tab
- `app/hackathon/mentors/page.tsx` — Mentors and judges tab
- `app/hackathon/stack/page.tsx` — Stack tab
- `app/hackathon/prizes/page.tsx` — Prizes tab
- `app/hackathon/submit/page.tsx` — Project submission tab
- `app/hackathon/projects/page.tsx` — Public projects gallery tab
- `app/hackathon/sponsor/page.tsx` — Redirect to Overview `#special-thanks`
- `app/hackathon/layout.tsx` — Route metadata + `HackathonSiteHeader`; OG/Twitter share image is `hackathonConfig.ogImage` (`/images/og-grok-bot-hackathon.jpg`)
- `components/HackathonSiteHeader.tsx` — Hackathon-only chrome and tabs (Overview / Guide / Mentors / Prizes / Stack / Submit / Projects); brand is full-circle `/grokbot.svg` mark + “Grok Bot Serbia Hackathon”
- `components/HackathonGuide.tsx` — Purpose, rules, agenda, judging & criteria, guidelines, and optional idea sparks
- `components/HackathonProjectSubmitForm.tsx` — Project submission form (login / check-in gates + fields)
- `components/HackathonProjectsGallery.tsx` — Gallery list, community leaderboard, judge panel, favorite/score actions, empty + preview states
- `components/HackathonProjectCard.tsx` — Project card (embed, live/GitHub links, private my-score / award labels, controls)
- `components/HackathonCommunityLeaderboard.tsx` — Top 3 by community favorite counts
- `components/HackathonJudgePanel.tsx` — Judge progress, aggregate top 3 / needs-decision, final top-3 confirm
- `components/HackathonPeople.tsx` — Mentor, host, and judge cards (`/hackathon/mentors`)
- `middleware.ts` — Subdomain rewrite + optional main-host redirect
- `lib/hackathon-site.ts` — Host detection and public hrefs
- `lib/hackathon-checkin.ts` — Shared Luma `checked_in` gate (credit claims + project submit + community favorites)
- `lib/hackathon-judges.ts` — Parse `HACKATHON_JUDGE_EMAILS` / `HACKATHON_ADMIN_EMAILS` and gate scoring + final top 3
- `lib/github-repo.ts` — GitHub URL parse (`github.com/owner/repo` shape); optional public-repo helper unused by submit
- `lib/project-submission.ts` — Field validation for project submissions
- `lib/project-gallery.ts` — Score bounds, favorite cap, average aggregate, community leaderboard, judge all-rated / top-3 / Convex awards
- `lib/demo-embed.ts` — YouTube / Loom embed resolution for demo recordings
- `components/HackathonHero.tsx` — Full-width hero with date/location/duration cards and CTAs; animated ink Grok Bot orb (`/bloub-cercle-neutre-encre-anime.svg` via `mascotPeekImage`) sits under the tagline on mobile and beside the title from `sm` up
- `components/HackathonHighlights.tsx` — Stat-style highlight grid (TUM-inspired)
- `components/HackathonPrizes.tsx` — Prize tracks with per-place cards (above sponsors)
- `components/SponsorMarquee.tsx` — Tech partner and community partner marquees (Startit, Superteam Balkan, ABC BootCamps, JigJoy, Kosmonaut)
- `components/HackathonSpecialThanks.tsx` — Overview special thanks (Startit hosting, Superteam Balkan community support)
- `components/HackathonSponsorshipForm.tsx` — Sponsorship application form (API still available; not shown on Overview)
- `components/HackathonSponsorStack.tsx` — Expertise group panels + compact card modal (`/hackathon/stack`)
- `content/hackathon.ts` — Static fallback copy, Luma URL, prize tracks, sponsor logos, stack profiles, stat cards
- `lib/hackathon-details.ts` — Resolve date/location from Luma slug with static fallback
- `lib/use-hackathon-details.ts` — Client hook polling `/api/hackathon/event`

### Sponsor Marquee

- Full-bleed horizontal band with duplicated sponsor list for seamless loop
- Constrained to page content width (`max-w-3xl`); rounded border container with edge fade masks
- `app/globals.css` `sponsor-marquee-track` animation (continuous left-to-right tunnel); respects `prefers-reduced-motion`
- Sponsor data uses existing `Partner` type from `lib/types.ts`

## Backends (sponsorship form)

### Postgres (recommended)

- Table: `hackathon_sponsor_applications` in `db/schema.sql`
- Table: `hackathon_project_submissions` in `db/schema.sql` (one row per attendee email; upsert on resubmit)
- Table: `hackathon_project_reviews` — one score (1–10) per judge email per submission (`UNIQUE(judge_email, submission_id)`); peer scores never returned to other judges
- Table: `hackathon_project_favorites` — community favorites (`UNIQUE(user_email, submission_id)`); API enforces max 3 per checked-in user + Luma check-in gate
- Table: `hackathon_judge_final_top3` — confirmed final places 1–3 (`PRIMARY KEY(place)`, `UNIQUE(submission_id)`). Created by `pnpm db:setup` (was previously only in `db/schema.sql`).
- Env: `POSTGRES_URL` or `DATABASE_URL`

### Webhook

- Env: `HACKATHON_SPONSOR_WEBHOOK_URL` (optional dedicated endpoint)
- Falls back to `MAILING_LIST_WEBHOOK_URL` when dedicated URL is unset
- Payload: `{ companyName, contactName, email, website, message, source, community, submittedAt }`
- Optional auth: `HACKATHON_SPONSOR_API_KEY` or `MAILING_LIST_API_KEY` in `x-api-key` header

### Google Sheets (via Apps Script)

Recommended team inbox: keep the branded form, append rows to a Sheet with a Google Apps Script web app.

1. Create a Google Sheet; tab name `Applications` (or match `SHEET_NAME` in the script).
2. Optional header row: `submittedAt | companyName | contactName | email | website | message | source | community`
3. Paste [`scripts/hackathon-sponsor-google-sheet.gs`](../scripts/hackathon-sponsor-google-sheet.gs) into Extensions → Apps Script; set `SECRET`.
4. Deploy as Web app (Execute as: Me, Who has access: Anyone).
5. Set env: `HACKATHON_SPONSOR_WEBHOOK_URL=https://script.google.com/macros/s/.../exec?key=YOUR_SECRET`
6. Omit `HACKATHON_SPONSOR_API_KEY` for this path — Apps Script reads `?key=` instead of `x-api-key`.

Delivery uses `lib/post-webhook.ts` so Apps Script 302 redirects keep the POST body, and JSON `{ ok: false }` is treated as failure when Sheets is the only backend.

Postgres can stay configured; webhook notify runs after a successful insert (notify failures are logged, not surfaced). If the DB insert fails (e.g. missing table) and a webhook URL is set, the request falls through to the webhook so Sheets still receives the row. Create the table with `pnpm db:setup`.

## Content

Edit `content/hackathon.ts` for:

- Event title (`Grok Bot Serbia Hackathon`), tagline, `mascotImage` / `headerMark` (full-circle `/grokbot.svg`), `mascotPeekImage` (animated ink orb `/bloub-cercle-neutre-encre-anime.svg`), duration, and **Luma URL** (source of truth for live sync)
- Static fallback `date` / `displayDate` / `location` (Belgrade, September 12, 2026 — used when Luma is unreachable)
- Highlights grid (`hackathonStats`)
- Prize tracks (`hackathonPrizes`: Convex cash for overall judge top 3 — 80.000 / 50.000 / 20.000 RSD; Kosmonaut coworking (community voting) — 15 / 10 / 5 entries per teammate on the top 3 teams, use within 3 months, claimed on their platform; Daytona credits $3,000 / $2,000 / $1,000 plus $100 for every participant (judge panel); ABC BootCamps — 50% / 40% / 30% scholarships to ABC Silicon Valley 2027 (judge panel))
- Hacker guide (`hackathonGuidePurpose`, `hackathonGuideRulesIntro`, `hackathonGuideRules`, `hackathonGuideAgenda`, `hackathonGuideJudging`, `hackathonGuideJudgingCriteria`, `hackathonGuideSteps`, `hackathonGuideTopicsIntro`, `hackathonGuideTopics`) — source for `/hackathon/guide`
- Mentors, hosts, and judges (`hackathonMentors`, `hackathonHosts`, `hackathonJudges`) — source for `/hackathon/mentors`
- Tech partner logos (`hackathonSponsors`: Firecrawl, Render, Convex, Daytona, Wispr Flow, Exa, Fal.ai, Wonder, x.ai) — Overview heading is **Tech partners**
- Community partners (`hackathonCommunityPartners`: Startit, Superteam Balkan, ABC BootCamps, JigJoy, Kosmonaut) — Overview, below tech partners
- Superteam Balkan uses a transparent PNG wordmark (`/images/partners/superteam-balkan.png`) at `h-10` (a step above Startit’s `h-8`) so the old JPEG black frame does not show on the dark marquee. ABC uses the official overlapping ABC + BOOTCAMP mark (`abc-bootcamps.png`) on a white pad (`logoBg: '#ffffff'`) at `h-10` so the dark wordmark stays readable on the dark marquee
- Sponsor stack (`hackathonSdlcStages`, `hackathonSponsorProfiles` including `mcp`, recipes, picks) — source for `/hackathon/stack` and `docs/hackathon/sponsor-cheat-sheet.md`

### Sponsor stack tab

- Route: `/hackathon/stack` (Stack tab)
- Flat 2-column grid of sponsor cards (not a linear pipeline). Area label lives on the card (e.g. Host / infra, Voice input); details open in a modal
- Each modal has an **Add to Cursor** button (title row) that uses the official `cursor://anysphere.cursor-deeplink/mcp/install` deeplink (same tab — do not open `https://cursor.com/en/install-mcp`, which auto-closes). Configs live on `hackathonSponsorProfiles[].mcp` and are encoded by `lib/cursor-mcp-install.ts`
- Cursor is host, not a sponsor. Wispr Flow is a tech partner (dictation into Cursor)
- Confirmed perks only: Daytona $100 coupon (claim via `CREDIT_CODE_DAYTONA`, redeem in app.daytona.io Billing) + winner credits (Best app that uses Daytona); Convex cash for overall judge top 3 (80.000 / 50.000 / 20.000 RSD); Kosmonaut coworking for top 3 teams (15 / 10 / 5 entries per teammate, use within 3 months, claim on kosmonaut.rs); ABC BootCamps scholarships for top 3 (50% / 40% / 30% to ABC Silicon Valley 2027); Wispr Flow 3 months Pro (claim via `CREDIT_CODE_WISPR` after check-in); Exa $50 credits each; Fal.ai $50 credits each (claim via `CREDIT_CODE_FAL`); Wonder Pro for all participants; Render promo credits for every checked-in participant (claim via `CREDIT_CODE_RENDER` after check-in; redeem at dashboard.render.com Billing → Credit Balance); SpaceXAI / x.ai ~$35 API credits per Console team (claim via `CREDIT_CODE_XAI` after check-in; redeem at console.x.ai Billing; does not work for Grok Bot)
- Stack path starts with **Grok Bot** (Editor / host; Cursor works too), then Firecrawl, Exa, Wonder, Daytona, Convex, Wispr, Fal.ai, x.ai, Render
- Marketing copy prioritizes Grok Bot; Cursor remains supported and named where the product action is Cursor-specific (MCP install deeplink, Cursor Pro referral, Origin)
- Stack area cards also cover Exa (Search / web), Wonder (Design / UI), Wispr Flow (Voice input), Fal.ai (Generate / media), x.ai (API / models), and Render (Host / infra). Wispr has no public MCP install URL — desktop app only. x.ai is Console API key only (no MCP install). Wonder MCP is `https://mcp.wonder.so/mcp` (OAuth after install)
### Guide tab

- Route: `/hackathon/guide` (Guide tab)
- Briefing: why, rules (eligibility list), day agenda, judging & winners (19 Sep + criteria), numbered guidelines timeline, optional idea sparks
- Rules: team size 1–3; public/open-source repo; only work built during the hackathon is judged; public live demo URL required; short video demo required
- Agenda: 10:30 intro & welcome → 11:00 hacking starts (optional workshops; relaxed network/build) → 17:00–19:00 optional demo showcase → 19:00 submission deadline (hacking ends) → 19:00–19:30 community voting → 19:30–21:00 pizza party (doors close at 9 PM)
- Judging: winners announced 19 September (≈ one week later); criteria are innovation (primary), working product, problem & solution clarity, execution, impact potential
- Timeline: Stack → mentors → Grok Bot → partner MCPs → public repo (GitHub, Origin, or another platform) → deploy live demo URL → 3-minute demo → submit form by 7 PM (submit step links to `/hackathon/submit`)
- Topics are **optional suggestions**, not required tracks — hackers may build anything. Three published verticals: FinTech agents (payments on blockchain or traditional rails), Gaming / visual & art, Personal assistant (flights + voice UX)
- Types: `HackathonGuideCopy` / `HackathonGuideListItem` / `HackathonGuideStep` / `HackathonGuideTopic` / `HackathonGuideAgendaItem` in `lib/types.ts`

### Mentors and judges tab

- Route: `/hackathon/mentors` (Mentors tab)
- Three sections in order: hosts (published), mentors (published), judges (published as they lock)
- Cards use a 1-column grid on small screens and 2 columns from `md` up
- First mentor: Nick Tomić — CTO and builder; short SaaS / AI GTM bio (no 350-founder research sentence); ask about GTM; X `dropoutsanta`, LinkedIn `nicktomic`. Second: Miodrag Vilotijević — co-founder and CEO of JigJoy, creator of Mozaik (open-source AI agent runtime); ask about code quality, startup insights, and product positioning; photo `public/images/hackathon/miodrag-vilotijevic.jpg` (`photoPosition: top`); X `Mijuraaa`, LinkedIn `miodrag-vilotijevic`. Third: Miodrag Todorović — co-founder of JigJoy; builds tools for running AI agents in production (Mozaik Cloud, baro, JigJoy agent workflows); ask about multi-agent architectures, Grok Bot, shipping a weekend demo; photo `public/images/hackathon/miodrag-todorovic.jpg` (`photoPosition: center`); X `lotus_sbc`, LinkedIn `lotus015`. Fourth: Alexandra Borisova — SRE & Infra Leader; short Typeable DevOps/SRE bio (AWS, Kubernetes, observability; agentic harnesses); ask about SRE/platform, AWS/K8s, observability, IaC/CI/CD; photo `public/images/hackathon/alexandra-borisova.jpg` (`photoPosition: center`); LinkedIn `princessfruittt` (no public X). Fifth: Dušan Radivojević — Head of AI & Platform, Wonder; AI-native design platform bridging design and code; ask about design and AI; photo `public/images/hackathon/dusan-radivojevic.jpg` (`photoPosition: center`); X `radivojevic_1`, LinkedIn `dusan-g-radivojevic`
- Hosts: Aleksandar Hadžibabić and Goran Petković — SpaceXAI ambassadors; photos and socials match homepage ambassadors. Vladimir Hristov — Embedded Software Engineer transitioning into AI, building tools for processing technical documentation; photo `public/images/hackathon/vladimir-hristov.jpg` (`photoPosition: top`); LinkedIn `vladimir-hristov-6645011a3` (no public X). All hosts share help copy: “Whatever you need, we are here to help.”
- Judges: Ben Kim — founder, investor & community builder; Codex and SpaceX ambassador; photo `public/images/hackathon/ben-kim.jpg` (`photoPosition: center`); X `benkimbuilds`, LinkedIn `benkimbuilds`. Milan Lazarević — software engineer & ML specialist (CV, edge AI, LLMs, agents, RAG; optimized inference / real-time apps); photo `public/images/hackathon/milan-lazarevic.jpg` (`photoPosition: center`); X `MrLaki5`, LinkedIn `mrlaki5`. Agrim Singh — AI adoption at SpaceXAI and regional community lead for SEA/Singapore; teaches at Code with AI, runs 65 Labs; whisky guru and DJ; photo `public/images/hackathon/agrim-singh.jpg` (`photoPosition: center`); X `agrimsingh`, LinkedIn `agrims`. Marija Mladenović — lead product designer & angel investor; 15 years in product/design (fintech, crypto, gaming, AI); Solflare trading and privacy; photo `public/images/hackathon/marija-mladenovic.jpg` (`photoPosition: top`); X `MarijaHolt`, LinkedIn `marijamladenovic`
- Mentor and judge photos in `public/images/hackathon/`; ambassador host photos reuse `public/images/ambassadors/`; additional hosts may use `public/images/hackathon/`
- Types: `HackathonPerson` in `lib/types.ts`

### Prizes section

- Rendered on the Prizes tab (`#prizes`)
- One track group per sponsoring prize category; place cards show place + amount only (sponsor name lives on the track header logo); optional `note` for track rules or participation perks
- Types: `HackathonPrizeTrack` / `HackathonPrizePlace` in `lib/types.ts`

### Live date & location from Luma

- `hackathonConfig.lumaUrl` (e.g. `https://luma.com/ghvnbjlx`) drives sync
- Server: `fetchLumaEventBySlug` reads the public Luma event page (no API key); `resolveHackathonDetails` merges date/location onto static copy
- Client: `useHackathonDetails` polls `/api/hackathon/event` every 5 minutes (same pattern as upcoming events)
- Title, tagline, mascot image, and duration stay content-owned so marketing copy does not flip with Luma’s event name
- Homepage promo card (`HackathonPromoCard`) can show `hackathonConfig.mascotImage` next to the title (same full-circle `/grokbot.svg` as the header)
- Overview hero shows `hackathonConfig.mascotPeekImage` (animated ink orb `/bloub-cercle-neutre-encre-anime.svg`) under the tagline on mobile (compact, in flow) and beside the title from `sm` up; header mark + Stack Grok Bot card keep static full-circle `/grokbot.svg`

Hero CTAs: Register on Luma (external Luma event link) and View on Luma (when already registered/checked in). Google login is navbar-only. Overview ends with **Special thanks** (`#special-thanks`) for Startit (hosting) and Superteam Balkan (long-term community support) — logo treatment matches community partners. Legacy `/hackathon/sponsor` redirects to that section. Guide, Mentors, and Stack are header tabs only.

## Hacker Auth (Google OAuth)

Hackathon attendees sign in with Google via NextAuth.js v5 (JWT strategy, no DB adapter). The hero primary CTA is "Register on Luma"; the navbar shows "Log in". After sign-in the header shows the user's email and Luma status badge (Checked in / Registered / Not registered).

### Components

- `lib/auth.ts` — NextAuth config with Google provider
- `app/api/auth/[...nextauth]/route.ts` — Route handler
- `components/SessionProvider.tsx` — Client-side session provider (wraps hackathon layout)
- `components/HackerAuthButton.tsx` — Login button / profile dropdown / status badge
- `lib/use-hacker-status.ts` — Client hook fetching `/api/hackathon/attendee-status`

### Luma status check

`/api/hackathon/attendee-status` uses the authenticated user's email to query the Luma guests list API (`GET /v1/events/guests/list`). A guest is `checked_in` if any `event_tickets[].checked_in_at` is set, `registered` if `approval_status` is `approved` without check-in, or `not_found` otherwise.

### Credit claiming

Checked-in attendees can claim sponsor credit codes on the Stack page. Claim Credits is shown only for sponsors that issue a shared code (`isCreditClaimSponsor` — Daytona, Exa, Fal, Wispr, Wonder, Firecrawl, Render, x.ai). Convex is prize-only (no claim button). The Grok Bot (host editor) modal shows **two** claim lanes ($20 and $50 Cursor credits).

- **Shared codes** (Daytona, Exa, Firecrawl, Wonder, Wispr Flow, Render, x.ai, …): stored as env vars (`CREDIT_CODE_DAYTONA`, `CREDIT_CODE_EXA`, `CREDIT_CODE_WISPR`, `CREDIT_CODE_RENDER`, `CREDIT_CODE_XAI`, etc.). Every claimant gets the same value; claims are recorded in `hackathon_credit_claims`. Daytona claim UI shows Billing redeem steps (app.daytona.io → Billing → paste → Redeem). Render claim UI shows dashboard.render.com/billing redeem steps (Credit Balance → Enter promo code → Apply). x.ai claim UI shows console.x.ai Billing redeem steps (and a client-built `?coupon=` deep link from the claimed code only). Do not publish Wispr / Fal referral URLs in page copy — they are returned only after check-in.
- **Cursor $20 unique pool**: stored in `hackathon_referral_codes` (`sponsor_id = cursor`). Claim assigns the next unclaimed row (idempotent per email). Setup tip: redeem $20 → upgrade to Pro → log in to Grok Bot.
- **Cursor $50 unique pool**: stored in a **separate** table `hackathon_grok_bot_referral_codes` (legacy table name). Claim via `sponsorId: "cursor-50"` (idempotent per email). Seed with `pnpm db:seed:grok-bot-referrals` from gitignored `db/data/grok-bot-referrals.csv` (see `.example`).
- The Grok Bot (host editor) Stack modal shows **two** claim lanes so hackers can take both Cursor credit pools ($20 and $50).
- `/api/hackathon/claim-credits` verifies Luma check-in, then returns the code for the requested pool / shared sponsor
- Seed Cursor $20 links with `pnpm db:seed:cursor-referrals` from the gitignored `db/data/cursor-referrals.txt` (see `.example`; never commit live URLs)

### Project submissions

Checked-in attendees submit one project for judging via `/hackathon/submit` (header **Submit** tab). Demo recording is a URL only (YouTube / Loom / similar) — no file upload.

**Access control** (same gate as credit claims via `lib/hackathon-checkin.ts`):

| Client state | UI | API |
|--------------|----|-----|
| Not signed in | Google login CTA | `401 Not authenticated` |
| Signed in, Luma `registered` | Check-in-first message | `403` with clear check-in message |
| Signed in, Luma `not_found` | Register on Luma CTA | `403` |
| Signed in, Luma `checked_in` | Form | Accepts POST |

**Fields:** project title (short), project description (multi-line), public GitHub repo URL, demo recording URL (3–5 min helper text), live demo http(s) URL — all required. Optional **teammates** (max **2**; teams are 1–3 including the submitter): each slot is a **display name** + **email**. Empty slots allowed for solo. Server rejects more than 2, invalid emails, missing names, duplicates, and the submitter’s own email. Names are shown on the public gallery; emails stay private (judge/admin API only).

**GitHub validation:** URL must parse as `github.com/owner/repo` (shape only via `parseGitHubRepoUrl`). No live GitHub API public-repo check on submit. Canonical `owner/repo` is unique across teams.

**Persistence:** table `hackathon_project_submissions` in `db/schema.sql` / `pnpm db:setup`. Columns include `teammate_emails TEXT[]` and `teammate_names TEXT[]` (parallel arrays, default `{}`). One row per **team** (submitter `UNIQUE(email)`); an email may appear on at most one row as submitter **or** listed teammate. Listed teammates who open Submit load and **update the same row** (owner email does not change). Resubmit upserts fields (including teammates) and bumps `updated_at`. Unique index on `lower(github_url)`.

**Prefill:** `GET /api/hackathon/submit` (same auth + check-in gate) returns the caller's team row (as submitter **or** listed teammate) or `null`. The Submit form loads it once and fills fields; CTA becomes **Update project** when a row exists. Teammate viewers see a banner naming the original submitter.

**One project per team:** `POST` rejects (409) if any proposed member is already on another submission, or if the GitHub repo is already used by another team.

**Components / routes:**

- `app/hackathon/submit/page.tsx` + `components/HackathonProjectSubmitForm.tsx`
- `GET` / `POST /api/hackathon/submit`
- `lib/project-submission.ts`, `lib/project-team.ts`, `lib/github-repo.ts`

### Projects gallery, judging, and community votes

Public gallery at `/hackathon/projects` (header **Projects** tab). Anyone can browse cards; check-in is **not** required to view. Builds on existing `hackathon_project_submissions` (does not reimplement submit).

**Card contents:** title, short description, submitter name (when present), optional teammate **display names** (never emails), embedded YouTube/Loom demo when `demo_recording_url` resolves (else external link), prominent live demo link, optional GitHub link, favorite count (highlighted when the viewer favorited it). Judge averages are **not** shown to the public while scoring. After judging completes with a clear or confirmed top 3, winning cards show Convex cash award labels (80.000 / 50.000 / 20.000 RSD). Teammate emails are included in the gallery API only for judges/admins.

**Judge score privacy:**

- Each judge only ever receives **their own** `myScore` in API responses — never peer scores
- `averageScore` / `reviewCount` are null / 0 for everyone until **all-rated**, and then only for judges/admins
- Public gallery does not leak review counts or averages during voting

**All-rated (strict):** every email in `HACKATHON_JUDGE_EMAILS` has a row in `hackathon_project_reviews` for **every** submission. Empty judge list or empty gallery → not complete.

**Aggregate top 3:** arithmetic **mean** of all judge scores per project (1–10), rounded to one decimal for display. Ranking uses averages only.

**Clear unique top 3:** `avg(1st) > avg(2nd) > avg(3rd)` and (no 4th project or `avg(3rd) > avg(4th)`). When clear after all-rated, provisional top 3 + Convex awards may surface. Title / submission time are **never** used to invent final placement.

**Ties:** if averages do not yield a unique 1st/2nd/3rd, status is `needs_decision` — no auto tie-break. Judges (`HACKATHON_JUDGE_EMAILS`) or admins (`HACKATHON_ADMIN_EMAILS`) set final places via `POST /api/hackathon/projects/final-top3` into `hackathon_judge_final_top3`.

**Convex cash awards (final top 3):** 1st **80.000 RSD**, 2nd **50.000 RSD**, 3rd **20.000 RSD** — cash prize split across overall winners by judge panel. Shown on Prizes (`Overall winners (judge panel)`), judge panel, and winning project cards. Not claimable `CREDIT_CODE_*` promo codes. Separate from community favorites.

**Judges (env-gated):**

- `HACKATHON_JUDGE_EMAILS` — comma-separated Google emails, case-insensitive
- Only signed-in users whose email is in that list see score controls and can `POST /api/hackathon/projects/review`
- One review per judge per project (upsert on `UNIQUE(judge_email, submission_id)`)
- Score must be an integer 1–10 (`CHECK` + API validation)
- Progress: “rated X of Y projects” in the judge panel
- Saving a score updates the card and progress in place (no full gallery reload); aggregates refresh in the background

**Community favorites:**

- Checked-in, signed-in users can favorite / unfavorite via `POST /api/hackathon/projects/favorite`
- Requires Google login **and** Luma `checked_in` (same gate as submit / credit claims via `assertCheckedIn`); otherwise `403` with `code: NOT_CHECKED_IN`
- Hard cap: **3 favorites per user** across all projects; enforced in the UI (client pre-check) and atomically in Postgres (`pg_advisory_xact_lock` + conditional `INSERT`); a 4th returns `409` with `code: FAVORITE_CAP` and a clear message
- Unauthenticated visitors see the gallery plus a login CTA for voting; signed-in but not checked-in users see a check-in message

**Community leaderboard (Projects page):**

- Shows the **top 3** projects by community favorite count (real aggregates from `hackathon_project_favorites`, not mock data)
- Each slot shows project title + vote count
- Tie-break when counts are equal: **earlier `submitted_at`**, then **title A–Z** (fills exactly 3 slots; documented in UI copy)
- Helper: `rankCommunityLeaderboard` in `lib/project-gallery.ts`; UI: `components/HackathonCommunityLeaderboard.tsx`
- Stays separate from judge scoring

**Local UI preview (dev only):** `/hackathon/projects?preview=1` loads a single official fixture card (Cursor Serbia Community) without Postgres; add `&judge=1` to mock judge score controls. Prefer live DB data when available — do not add mock submissions to the fixture list.

**Components / routes:**

- `app/hackathon/projects/page.tsx` + `components/HackathonProjectsGallery.tsx` + `components/HackathonProjectCard.tsx` + `components/HackathonCommunityLeaderboard.tsx` + `components/HackathonJudgePanel.tsx`
- `GET /api/hackathon/projects`, `POST /api/hackathon/projects/review`, `POST /api/hackathon/projects/favorite`, `POST /api/hackathon/projects/final-top3`
- `lib/hackathon-judges.ts`, `lib/project-gallery.ts`, `lib/demo-embed.ts`

### Env vars

| Variable | Purpose |
|----------|---------|
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | NextAuth JWT signing secret (`openssl rand -base64 32`) |
| `CREDIT_CODE_*` | Shared per-sponsor promo codes (e.g. `CREDIT_CODE_DAYTONA`, `CREDIT_CODE_EXA`, `CREDIT_CODE_RENDER`, `CREDIT_CODE_XAI`) |
| `HACKATHON_JUDGE_EMAILS` | Comma-separated judge emails allowed to score projects 1–10 |
| `HACKATHON_ADMIN_EMAILS` | Optional admins who can set/confirm final judge top 3 |

## Subdomain (Vercel + DNS)

The app is ready for `hackathon.cursorserbia.com`. Creating the hostname is a dashboard step:

1. Vercel → this project → **Settings → Domains → Add** → `hackathon.cursorserbia.com`.
2. If the apex already uses Vercel nameservers, wait until the domain is **Valid**.
3. Otherwise add a CNAME at the DNS host: name `hackathon`, value `cname.vercel-dns.com`.
4. After it is green, set Vercel env `NEXT_PUBLIC_HACKATHON_SITE_URL=https://hackathon.cursorserbia.com` and redeploy.
5. Local preview without DNS: `http://hackathon.localhost:3001/` (Chrome/Firefox treat `*.localhost` as loopback).

## Verification

- [ ] `/hackathon` loads the Overview tab (hero, highlights, marquee, special thanks)
- [ ] Tabs switch to Guide, Mentors, Prizes, Stack, Submit, and Projects (no Sponsor tab)
- [ ] `/hackathon/mentors` shows Hosts (Aleksandar, Goran, Vladimir Hristov; 2-col from `md`), then Mentors (Nick, Miodrag Vilotijević, Miodrag Todorović, Alexandra Borisova, Dušan Radivojević), then Judges (Ben Kim, Milan Lazarević)
- [ ] `/hackathon/guide` shows purpose, rules, agenda, judging (19 Sep winners + criteria), guidelines, and three optional idea sparks
- [ ] Guide submit step links to `/hackathon/submit`
- [ ] `/hackathon/submit` shows login CTA when signed out; check-in message when registered; form when checked in
- [ ] `/hackathon/submit` prefills from `GET /api/hackathon/submit` when a row exists (submitter or listed teammate); CTA says Update project
- [ ] `POST /api/hackathon/submit` rejects unauthenticated and not-checked-in callers; one project per team (membership + unique GitHub); listed teammates update the same row
- [ ] `/hackathon/projects` cards show teammate **names**, never emails
- [ ] GitHub URL must be a `github.com/owner/repo` link (shape only; no live public-repo API check)
- [ ] `/hackathon/projects` lists submission cards (or empty state); embeds YouTube/Loom when possible
- [ ] `/hackathon/projects` shows community leaderboard top 3 by favorite count (ties: earlier submit, then title)
- [ ] Judge score controls only for emails in `HACKATHON_JUDGE_EMAILS`; upsert 1–10; peers never see each other’s scores
- [ ] After all-rated, clear averages yield provisional top 3; ties show needs-decision + final-top3 API
- [ ] Final top 3 cards show Convex cash 80.000 / 50.000 / 20.000 RSD awards
- [ ] Checked-in users can favorite up to 3 projects; 4th blocked in UI and returns clear API cap error
- [ ] Favoriting requires Luma check-in (403 when registered / not found)
- [ ] `/hackathon/sponsor` redirects to Overview `#special-thanks`
- [ ] Overview `#special-thanks` shows Startit (hosting) and Superteam Balkan (community support) with logos
- [ ] `http://hackathon.localhost:<port>/` rewrites to the Overview tab
- [ ] `http://hackathon.localhost:<port>/submit` rewrites to the Submit tab
- [ ] `http://hackathon.localhost:<port>/projects` rewrites to the Projects tab
- [ ] Date/location update when Luma event changes (or fall back to static)
- [ ] Marquee animates smoothly and pauses on hover
- [ ] `POST /api/hackathon/sponsor` still accepts applications (form not on Overview)
- [ ] Postgres path stores applications
- [ ] Webhook path forwards payload
- [ ] Google Sheets Apps Script receives a test row when `HACKATHON_SPONSOR_WEBHOOK_URL` is set
- [ ] `/hackathon/stack` shows expertise group panels; card click opens a compact modal
