# Hackathon sponsor operations — decision memo

**Status:** Phase 0 — organize (do not publish new participant copy yet)  
**Event:** Cursor Hackathon Serbia · Belgrade · 12 September 2026 · 1 day  
**Registration (already live):** [Luma](https://luma.com/ghvnbjlx)  
**Story page (already live):** `/hackathon` — hero, highlights, Convex prize track, sponsor logo marquee, “become a sponsor” form  
**Last updated:** 2026-08-17  
**Participant cheat sheet:** [`docs/hackathon/sponsor-cheat-sheet.md`](../../hackathon/sponsor-cheat-sheet.md)  
**Visual preview:** `/hackathon/stack` (landing `/hackathon` unchanged)

This memo decides **where hackathon operations live**. It does not design pixels or change the site. The cheat sheet is the first participant-facing draft of the stack story.

---

## Recommendation (one model)

**Hybrid, site-led story + Luma registration + a thin day-of ops layer. Do not stand up Devfolio (or DoraHacks / Devpost) for this event unless submissions or multi-track judging become unmanageable.**

Keep Luma as the only registration system. Keep the hackathon mini-site (`/hackathon` now, `hackathon.cursorserbia.com` when DNS is attached) as the public story layer (why come, who sponsors, confirmed prizes, SDLC / “what to use for what” cheat sheet). Keep credit codes, mentor help, and last-minute instructions in a day-of channel (Discord or Slack — **TBD which**). Keep submissions and judging as light as the day allows: in-person demo + a short form (Google Form / Notion) unless volume or sponsor-track rules force a platform.

**Why this, not the alternatives**

| Option | Verdict for this event |
|--------|------------------------|
| Website-only | Too weak for registration (already on Luma) and for day-of codes / help. |
| Luma-only | Fine for RSVP; bad for a durable SDLC map, prize tracks, and a cheat sheet people can reopen on their laptop. |
| Devfolio (or similar) as the hub | High setup and participant-education cost for a **1-day local** Cursor hack. Pays off when you need structured project pages, remote judging, many prize tracks, and automated credit claim. We do not have that complexity locked yet. |
| Hybrid (this memo) | Matches what already exists. Adds a story + cheat-sheet layer without inventing a second registration product. |

**Tradeoffs of the recommended model**

- **Wins:** One RSVP URL, one branded story URL, no new account wall for participants, organizers stay in tools they already use (Luma, site `content/hackathon.ts`, Sheets).
- **Costs:** Submissions and judging will be manual. Credit redemption will be a human process (announce code → sponsor dashboard). Sponsor tracks beyond Convex/Daytona need a written rule, not a platform feature.
- **Risk:** If Superteam (or another sponsor) later **requires** Devfolio / a specific submission portal, revisit Phase 2. Until then, do not pre-build it.

Cursor is the **host / build tool**, not a sponsor. Do not put Cursor in the sponsor marquee or credit table.

---

## 1. Jobs to be done

Three audiences. Split **before the event** vs **hack day**.

### Participants

| When | They need |
|------|-----------|
| Before | Date, place, register (Luma), who is sponsoring, **confirmed** prizes, “is this for me?”, what to install / sign up for in advance. |
| Hack day | One cheat sheet: which sponsor covers which SDLC stage, 2–3 use cases each, **how to claim credits**, who to ask, when demos are, how to submit. Fast to scan on a phone. |

They do **not** need a second registration product, a long marketing page of unconfirmed credits, or five URLs that disagree.

### Organizers

| When | They need |
|------|-----------|
| Before | A single source of truth for sponsor facts (confirmed vs TBD). A checklist to lock credits, codes, prize tracks, mentors. A publish rule: never invent amounts. |
| Hack day | Attendance list (Luma), credit-code distribution, mentor roster, demo order, judging sheet, announcement snippets. |

### Sponsors

| When | They need |
|------|-----------|
| Before | Logo + one-liner on the public page, a prize or credit mention if they paid for it, a path for new sponsors (`/hackathon` form → Sheets). |
| Hack day | Participants actually **use** the product (docs link + mentor + credit). Optional: a “best use of X” track with a clear eligibility rule. After: usage / winner list they can announce. |

**Implication:** the website is for **story and confirmed facts**. Luma is for **who is coming**. The day-of channel is for **codes and help**. A submission tool is only for **what shipped**.

---

## 2. What belongs where

Channels in play:

| Channel | Role | Already true? |
|---------|------|----------------|
| **This website `/hackathon`** | Public story, confirmed prizes, sponsor logos, later SDLC / cheat sheet | Yes — landing + form |
| **Luma** | Registration, calendar, check-in, event description + link back to site | Yes — `ghvnbjlx` |
| **Devfolio / DoraHacks / Devpost** | Project hub, tracks, remote judging | No — do not add in Phase 0–1 |
| **Discord or Slack (TBD)** | Day-of help, credit codes, mentor @mentions | TBD — pick one before Phase 1 publish |
| **Printed 1-pager / PDF** | Table cheat sheet at desks; same facts as the site | Not yet — generate from the locked source of truth |
| **Google Form / Notion (TBD)** | Demo submission + judging notes | Not yet |
| **Sponsor dashboards** | Redeem credits / coupons | External — we only publish **how** |
| **LinkedIn / announcements** | Sponsor reveals | Already used (e.g. Daytona) |
| **Organizer source of truth** | Confirmed vs TBD facts | This plan + a private sheet (see §5) |

### Artifact × channel matrix

| Artifact | Website | Luma | Devfolio etc. | Discord/Slack | Print/PDF | Form/Notion | Sponsor dashboard |
|----------|:-------:|:----:|:-------------:|:-------------:|:---------:|:-----------:|:-----------------:|
| Registration / RSVP | Link only | **Primary** | No | Remind | No | No | No |
| Date / venue | Mirror (Luma sync already) | **Primary** | No | Remind | Yes | No | No |
| Sponsor logos | **Primary** (marquee) | Optional mention | Only if platform exists | Emoji/pins | Yes | No | No |
| Confirmed prize tracks | **Primary** (`hackathonPrizes`) | Short blurb + link | Only if platform exists | Pin | Yes | Judges use | No |
| Unconfirmed credits | **Do not publish** | Do not publish | — | “Coming” only if asked | No | No | — |
| SDLC map + use cases | **Primary** (Phase 1+) | Link only | No | Pin link | **Yes** (same content) | No | No |
| Tech cheat sheet | Same page or `/hackathon` section | Link | No | Pin | **Yes** | No | Docs links |
| Credit redemption how-to | Short “how” once codes exist | No | No | **Primary** (codes) | Optional | No | **Redeem here** |
| Mentor help | “Mentors on site” | No | No | **Primary** | Table + table # | No | No |
| Submissions | Link to form | No | Only if we later adopt | Remind | No | **Primary** (Phase 1 default) | No |
| Judging | No | No | Only if adopted | Private judges channel | Scorecard | **Primary** | No |
| New sponsor applications | **Primary** (existing form) | No | No | No | No | Sheets inbox | No |
| Announcements | Optional recap later | Updates | No | Live | No | No | Sponsor posts |

**Rule:** each artifact has **one primary**. Other channels only link or repeat a subset.

---

## 3. Platform choice (1-day local Cursor hack)

### Website-only (extend `/hackathon`)

- **Fit:** Story, prizes, later cheat sheet. Content already lives in `content/hackathon.ts`.
- **Miss:** Check-in, waitlist, calendar invites, day-of codes.
- **Use as:** story layer, not the whole OS.

### Luma-only

- **Fit:** Registration is already there; community already knows the URL.
- **Miss:** Long structured cheat sheet, prize-track cards, SDLC picture. Luma descriptions rot and are hard to version.
- **Use as:** RSVP + check-in only. Description should point at `/hackathon`.

### Devfolio (or DoraHacks / Devpost) as participant hub

**Benefits:** project pages, track tags (“uses Convex”), submission deadline, judging accounts, a familiar “hackathon platform” for some sponsors, a place to attach credit claim flows.

**Costs for this event:**

- Second account + second mental model for a **one-day, in-person** room.
- Organizer time: event setup, tracks, judges, support (“I can’t submit”).
- Split source of truth with Luma (who registered vs who submitted).
- Overkill while we have **two confirmed prize stories** (Convex cash track, Daytona credits) and **three sponsors with TBD credits** (ElevenLabs, Firecrawl, Render; Convex participant coupons also TBD).

**When to reopen Devfolio:** 3+ judged sponsor tracks, remote or async demos, or a sponsor **contractually** requires it (watch Superteam / similar). Until then: no.

### Hybrid (recommended)

```
Luma          →  come / check in
/hackathon    →  understand the stack, prizes, later cheat sheet
Day-of chat   →  codes, mentors, schedule changes
Short form    →  “what we built” + demo slot (if needed)
Print 1-pager →  same cheat sheet, offline
```

No new platform until a concrete job (submissions at scale, remote judging) appears.

---

## 4. Recommended information architecture

**Do not design UI now.** If the site stays the story layer, this is the IA to implement later.

### Hackathon mini-site (tabs on `/hackathon`, optional subdomain)

Implemented: Overview / Stack / Prizes / Sponsor tabs. Same app; `hackathon.*` host rewrites to these routes. Local preview: `http://hackathon.localhost:<port>/`. **DNS (2026-08-17):** user-complete — `hackathon.cursorserbia.com` is attached to this Vercel project with TLS; `NEXT_PUBLIC_HACKATHON_SITE_URL` is set for Production + Preview. Next deploy step: commit and ship the local tabbed-site/middleware so the subdomain root rewrites and `/hackathon` on the main host redirects.

Suggested future sections (order):

1. **Hero** — already: when / where / duration, Register (Luma), optional Sponsor CTA.
2. **What to expect** — already: highlights.
3. **Prizes** — already: confirmed tracks only. Add Daytona winner credits here **only after** we decide they are a published prize track vs “overall winners also get Daytona credits” (see TBD below).
4. **Sponsor stack / SDLC** — *not built yet.* One picture: Research → Execute → Backend → Experience → Deploy, mapped to Firecrawl → Daytona → Convex → ElevenLabs → Render. Each tile: one-liner, 2–3 use cases, **confirmed** “what you get,” docs link.
5. **Logos** — existing marquee (social proof). Can stay below the stack so logos are not the only sponsor story.
6. **Become a sponsor** — existing form. Keep; it is organizer inbound, not participant ops.

Optional later, **not** Phase 1: `/hackathon/stack` or a printable `/hackathon/cheat-sheet` route. Prefer a PDF export of the same content over a second page.

### Keep off the site

| Data | Where |
|------|--------|
| RSVP list, tickets, check-in | Luma |
| Coupon codes, claim links | Discord/Slack + verbal kickoff (codes expire / get abused if parked on a public page) |
| Raw TBD credit negotiations | Private organizer sheet |
| Judging scores | Private form / sheet |
| Superteam (not on site) | Stay off public IA until confirmed |

### Luma event page (minimal)

- Title, time, venue, Register.
- 3–5 lines + **link to `/hackathon`** for prizes and stack.
- Do not duplicate a full cheat sheet on Luma.

### Day-of 1-pager (print + PDF)

Same SDLC row + “claim credits here” + mentor table. Generated from the locked facts, not a third rewrite.

---

## 5. Operating cadence — confirm before publishing numbers

**Publish rule:** if it is not in the private “confirmed” column, it does not go on the site, Luma, or print.

### Private source of truth (create in Phase 0)

One sheet (or Notion DB), one row per org:

| Field | Notes |
|-------|--------|
| Org | ElevenLabs, Firecrawl, Render, Convex, Daytona; Superteam = pipeline only |
| Role | Sponsor vs host (Cursor = host) |
| Public logo on site? | Already yes for the five |
| Prize track? | Category name, places, currency vs credits, eligibility (“must use X”) |
| Participant perk | Amount, unit, who gets it (all / winners / students) |
| Redemption | Code, landing URL, expiry, per-person vs per-team |
| Public free tier (fallback) | May mention as “start here” **without** calling it a hackathon gift |
| Mentor | Name, handle, hours on site |
| Docs / start URL | One link |
| Status | `confirmed` / `tbd` / `out` |
| Owner + last asked | Date |

### Confirm with each party before Phase 1 numbers go live

**Daytona (partially confirmed)**  
Confirmed: $100 platform credits for every participant; winners $3,000 / $2,000 / $1,000 credits.  
Still ask: redemption path (code vs email list vs dashboard grant); whether winner credits are **overall** 1st/2nd/3rd or a “best use of Daytona” track; mentor on site; docs URL to print.

**Convex (partially confirmed)**  
Confirmed: Best app that uses Convex — 1st 100.000 RSD, 2nd 50.000 RSD.  
Still ask: participant coupon / Pro code (often exists for hacks — **TBD, do not invent**); eligibility (“must use Convex” already implied); mentor; whether they want a Discord channel.

**ElevenLabs**  
Ask: participant credits or prize track; if none, we may later say “free signup credits” as public tier only, not as our gift. Mentor? Voice-agent vs TTS focus for the cheat sheet?

**Firecrawl**  
Ask: event credit pack vs “use free / keyless 1k” as public tier only. Prize track? Mentor / MCP tip for Cursor?

**Render**  
Ask: participant credits (other hacks often ~$50 — **do not publish that number for us**). Prize track (e.g. must deploy on Render)? Mentor?

**Superteam**  
Pipeline only. Not on the site. If they land, ask whether they **require** a specific submission platform before we change the hybrid model.

**Cursor (host)**  
Not a sponsor. Decide separately: any Cursor Pro / merch for winners — **TBD**, out of sponsor table.

### Cadence

| When | Action |
|------|--------|
| Now (Phase 0) | Sheet + this model. Email/Slack each sponsor with the ask list above. |
| When a row flips to `confirmed` | Update sheet; **do not** auto-publish until a Phase 1 bundle. |
| Phase 1 freeze | Publish only confirmed prizes + logos + (optional) SDLC without fake credits. |
| Ongoing | One owner for “can we say this in public?” |
| Week of event | Codes into Discord/Slack, not the website. Print 1-pager from frozen copy. |
| Day-of | Kickoff: stack picture + how to claim. Mentors at tables. |
| After | Winners + thank-you posts; recap on site later. |

---

## 6. Phased rollout

### Phase 0 — Organize (now)

- This memo is the operating model.
- Create the private confirmed/TBD sheet.
- Ask sponsors (checklist in §5).
- Pick day-of chat (Discord vs Slack) and submission tool (Form vs Notion) — both **TBD**.
- **No site UI work. No new prize rows. No invented credits.**

### Phase 1 — Publish confirmed facts only

When ready to change the product (later execution):

- Site: keep logos + Convex track; add Daytona **only** in the form they confirmed (participant $100 + winner credits, with the track-vs-overall question answered).
- Optional: SDLC / cheat sheet on `/hackathon` using **technologies and use cases** (those are product facts) and **only confirmed perks**.
- Luma: short description + link to `/hackathon`.
- Public free tiers may appear as “start building today,” never as “we give you $X” unless confirmed.
- Superteam stays off the page.

### Phase 2 — Lock remaining credits

- Fill ElevenLabs / Firecrawl / Render / Convex coupon rows.
- Then: redemption how-to in chat; one-line updates on the cheat sheet; print refresh.
- Revisit Devfolio **only** if tracks/submissions demand it.

---

## Confirmed vs TBD (do not invent)

**On site today**

- Sponsors (logos): ElevenLabs, Firecrawl, Render, Convex, Daytona.
- Prize track: Convex — Best app that uses Convex — 100.000 / 50.000 RSD.

**Confirmed, not fully reflected as a prize track yet**

- Daytona: $100 credits all participants; winner credits $3k / $2k / $1k.  
  **TBD:** overall winners vs Daytona track; redemption mechanism.

**TBD — do not publish amounts**

- ElevenLabs event credits or prize track.
- Firecrawl event credits or prize track.
- Render event credits or prize track.
- Convex participant coupons.
- Superteam as a sponsor.
- Discord vs Slack.
- Submission/judging tool.
- Whether Daytona winner credits appear in `#prizes` as their own track.

**Public free tiers (not our gift)** — may be mentioned later as onboarding, not as hackathon bounty: ElevenLabs signup credits, Firecrawl free/keyless monthly credits, Render free tier, Convex free for small teams, Daytona free compute on their site. Verify wording with each brand before Phase 1.

---

## Working SDLC picture

Participant-facing version: [`docs/hackathon/sponsor-cheat-sheet.md`](../../hackathon/sponsor-cheat-sheet.md). Organizer summary below.

| Stage | Job on hack day | Sponsor | Typical use (examples) |
|-------|-----------------|---------|------------------------|
| Research | Get live web data into the app | Firecrawl | RAG over docs, research agent, scrape + extract |
| Execute | Run AI-generated / untrusted code safely | Daytona | Coding agent, evals, code interpreter |
| Backend | Persist state, auth, realtime | Convex | Chat, live dashboard, agent memory |
| Experience | Voice / audio UX | ElevenLabs | Voice agent, TTS demo, STT |
| Deploy | Public URL for the demo | Render | Web service, static site, Postgres |

**Overlap to explain (not a problem):** Convex can host a lot of backend without Render; Render is for shipping a conventional demo URL. Daytona is **not** production hosting — it is the isolated runtime. Cursor is how people write the app.

**Example recipes** (for the later cheat sheet, not for the site today):

1. Voice research agent — Firecrawl + Convex + ElevenLabs  
2. Coding agent — Daytona + Convex  
3. Live ops dashboard — Firecrawl + Convex + Render  

---

## Decision log

| Decision | Choice |
|----------|--------|
| Operating model | Hybrid: Luma RSVP + `/hackathon` story + day-of chat + light form |
| Devfolio now | No |
| Separate `/hackathon/sponsors` page | No in Phase 1; anchors on `/hackathon` |
| Publish TBD credits | No |
| Superteam on site | No until confirmed |
| Cursor in sponsor list | No (host) |
| Next product change | After Phase 0 asks return and a Phase 1 freeze is called |

**Next action:** send the §5 ask list to Daytona, Convex, ElevenLabs, Firecrawl, and Render; create the private status sheet; pick Discord vs Slack.
