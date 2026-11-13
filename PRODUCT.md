# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally — the site must not tilt toward either:

- **People evaluating Andrew** — hiring managers and recruiters, usually
  arriving from LinkedIn, a resume link or a referral.
- **His professional network** — colleagues, collaborators and contacts who
  want the fuller picture of who he is, with no particular role in play.

Both come for the same thing: who Andrew is beyond a job history.

## Product Purpose

Andrew Bickford's personal portfolio, built as a "living resume" instead of a
CV. Work history, personal projects and hobbies (travel, running, triathlon,
food) get equal weight.

**Success means the visitor remembers him as more than a CV.** Contact,
LinkedIn connections and use of a live project are welcome, but they are not
the measure. A visit that leaves a distinct impression of the person counts as
a success even if the visitor does nothing.

## Positioning

Andrew as a *connector* and *translator* between worlds: defense/intelligence
and commercial software/consulting, engineers and customers. The page should
show this, not assert it. The roadmap's route (NRO → Deloitte → IBM → NRO)
crosses between the two tracks on purpose, and the projects and hobbies are
the evidence of range. A previous "Claims" section that stated the thesis
outright was cut because it told visitors what to conclude before showing them
anything.

## Operating Context

- Visitors browse on desktop and phone, often clicking in from LinkedIn or a
  resume.
- Home scroll: Hero → Work roadmap (`#career`) → Project grid (`#work`) →
  hobbies with the personal intro (`#play`) → Footer.
- Detail pages: `/projects/<slug>` and `/play/<slug>`. The home scroll holds
  teasers and the detail lives on these pages.
- Three projects link to live sites (venture portfolio, triathlon training,
  Blacksburg road coverage), and their covers are screenshots of those sites.

## Capabilities and Constraints

- Pure static export (Next.js 16, `output: "export"`), with no server, database
  or env vars.
- The WebGL fluid backdrop is the signature element and runs behind all
  content. Its parameters are governed by `reference-material/HANDOFF.md`.
- **Defense/intelligence work:** broad, unclassified, public-safe descriptions
  are fine. Andrew reviews anything specific before it ships. Never invent
  programs, outcomes or numbers for NRO roles.
- **Open / undecided:** most copy is still placeholder and marked `TODO` in
  `src/data/profile.ts` and `src/data/experience.ts`: the lede, About,
  roadmap summaries and highlights, and the two internship titles. Treat these
  as unconfirmed rather than as product truth.

## Brand Commitments

- Name: Andrew Bickford. Contact: email, GitHub (`abick2`), LinkedIn, Strava.
- Voice: plain-spoken and personal. Show, don't claim.
- The fluid simulation stands for the argument itself: separate colours mixing
  in a shared field. It is not decoration.

## Evidence on Hand

- Work history: `src/data/experience.ts` (orgs and periods are real; summaries
  are placeholder).
- Projects: `src/data/projects.ts`. These are venture portfolio, triathlon
  training, racing drone, Blacksburg road coverage, Gaggia Classic mods and
  edge AI for drone detection, with covers in `public/`.
- Hobbies: `src/data/play.ts`, `src/data/athletics.ts` (race results, PRs) and
  `src/data/travel.ts` (visited countries, filled on the map).
- No testimonials, endorsements, press or metrics exist. Do not fabricate any.

## Product Principles

1. **Show the range, don't state it.** Evidence (the route, the projects, the
   hobbies) carries the thesis, and copy never pre-empts it.
2. **The person outweighs the résumé.** Hobbies and projects are as important
   as job history, not an appendix to it.
3. **Teasers on the scroll, depth on the detail page.** Each home section
   invites, and the tables, maps and lists live on `/play/<slug>` or
   `/projects/<slug>`.
4. **Both audiences, one page.** An evaluator and a curious contact should both
   leave with the same clear impression. Don't split the experience.
5. **Truthful by default.** No invented claims or numbers, and defense work
   stays at public-safe generality.

## Accessibility & Inclusion

- Reduced motion is honoured site-wide. The hero liquify, the name scale and
  the nav wordmark fill all hold still under `prefers-reduced-motion`.
- No horizontal overflow down to 320px wide.
