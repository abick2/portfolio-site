# Handoff

**Date:** 2026-09-14
**Branch:** `redesign/name-and-field` (4 commits ahead of `main`, **not pushed**)
**Last commit:** `86a40e7` — Direction A redesign

## What this is

A personal portfolio site for Andrew Bickford, built as a "living resume" rather
than a CV: work history, personal projects, and hobbies (travel, running,
triathlon, food) given equal weight. The positioning it argues is that he is a
*connector* and *translator* between worlds — defense/intelligence and
commercial consulting, engineers and customers. That thesis drives the design,
not just the copy.

The signature element is a WebGL fluid simulation running behind all content and
reacting to the cursor. It is treated as the argument, not wallpaper: separate
colours mixing in a shared field, with the hero name composited *through* it.

## Stack

- **Next.js 16.3.4** (App Router, Turbopack) / **React 19.3** / **TypeScript 7**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/app/globals.css`
- **Biome** for lint/format (NOT ESLint — see gotchas)
- **d3-geo + topojson-client + world-atlas** for the travel map
- **puppeteer-core** (dev only) for the QA screenshot harness
- `output: "export"` — pure static site, no server, no database, no env vars.

## This session: the Direction A redesign

Implemented `design_handoff_portfolio_redesign/README.md` ("Name and Field").
That folder is now gitignored — it is design reference, not source.

### Home page structure (new)

```
Nav
Hero                       #top     Hero.tsx      (client)
Work experience roadmap    #career  Roadmap.tsx
Things I built (mosaic)    #work    ProjectMosaic.tsx
My life away from…         #play    PlayRows.tsx  (client)
Numbers                             Numbers.tsx   → PRTable ×2
Places                              Places.tsx    → WorldMap
About                      #about   About.tsx
Footer
```

**Deleted:** `Weave.tsx` (→ Roadmap), `PlayTiles.tsx` (→ PlayRows), `Claims.tsx`
(section cut). **Added:** `Roadmap`, `PlayRows`, `Numbers`, `Places`,
`DeeperLink`, `src/hooks/useScrollProgress.ts`.

**Anchor rename:** the mosaic moved from `#projects` to `#work`; the roadmap is
`#career`. `Weave` used to own `#work`. All internal links updated.

### Key behaviours

- **Hero liquify.** One scroll value `p` (0→1 over `innerHeight * 0.8`) drives:
  goo `stdDeviation` 0→13, name `scale` 1→0.56, an ink stream 0→40vh, the photo
  tile fading out by `p≈0.28`, the lede/CTAs by `p≈0.33`, and the nav wordmark
  filling 0→100%. Shared via `useScrollProgress()`; held at 0 under reduced
  motion.
- **Nav wordmark** fills from the bottom with a `background-clip: text` gradient
  — **only on `/` and only when motion is allowed**. Elsewhere it is solid ink,
  because an unfilled wordmark is the site's own name at 12% opacity.
- **Hero photo tile** cycles portrait → 4 hobby covers every 2800ms, driven
  imperatively through refs (no state, no re-render, no `src` binding).
- **Roadmap** array order IS the route (NRO → Deloitte → IBM → NRO) and is
  deliberately not chronological. Crossings are *derived* (`track` differs from
  the previous stop), so the spine gradient can never disagree with the order.
- **Hobby carousels** are native scroll-snap; the arrows are a `scrollBy` on top.

## Bugs found and fixed this session

1. **Hover shadows were silently dead across the whole site.** `.glass-*` and
   `.photo-lift` set `box-shadow` from **unlayered** CSS, and unlayered rules
   beat anything in `@layer utilities` regardless of specificity — so every
   `hover:shadow-[…]` utility on a glass or photo surface lost. Fixed with
   `.lift-sm/md/lg/xl` classes in `globals.css`. Confirmed in the built
   stylesheet, not assumed.
2. **The same cascade rule kills `t-*` size overrides.** `text-[1.25rem]` on a
   `.t-title` element does nothing. Every type override in the redesign is an
   inline `style` for this reason (Nav wordmark, roadmap column header, small
   mosaic card title, hobby row heading).
3. **`transition-[transform,box-shadow]` animated nothing.** Tailwind v4
   compiles `-translate-y-*` and `scale-*` to the separate `translate` and
   `scale` CSS properties, so the lifts snapped. Use
   `transition-[translate,scale,box-shadow]`. (`transition-transform` is fine —
   v4 expands it to `transform, translate, scale, rotate`.)
4. **Horizontal scroll at 320px** from the footer email button (a single long
   token setting the page's min-width) and from `PRTable`'s 280px min-content
   table inside a padded panel. Footer padding is now clamped and the button
   wraps; the table scrolls itself in a focusable region.
5. **Heading-outline breaks.** `PRTable` and `WorldMapView` each emitted an
   `h2` that read as a sibling of the section heading above it once they landed
   on the home page. Both now take a `headingLevel` prop.

## Verification performed

- No horizontal overflow at **13 widths × 4 pages** (320–1920).
- Blend-ancestor chain walked in-browser at **6 scroll positions**: zero
  stacking contexts between a `.knockout` word and `<body>` at rest.
- Every liquify ramp hits its specified endpoint exactly (scale 0.56, stream
  360px = 40vh at 900px, wordmark 100%).
- All hover states measured: pill −4px, roadmap card −8px, project card −14px +
  scale 1.015, each with its designed shadow.
- Reduced motion: filter `none`, no scale, wordmark solid.
- Every commit on the branch builds and typechecks.

## Known gaps / next steps

1. **Do not push blind.** The branch is local. `origin` exists
   (`github.com/abick2/portfolio-site`) but nothing here has been pushed.
2. **Three AA contrast failures.** `--color-commercial` (#c4407a) on paper is
   4.29:1, under the 4.5 floor, in the roadmap column header, the mobile dot
   legend, and the paper numeral inside a commercial marker. Darkening to
   `#bc3e75` gives 4.58:1 and is a ~4% shift. **Left as-is deliberately** — it
   is a signature colour and the handoff froze the palette. Documented at the
   token in `globals.css`.
3. **Job titles in the roadmap are the handoff's guesses**, not real
   (`src/data/experience.ts`).
4. **"Go deeper on work experience" points at LinkedIn** as a stand-in; there is
   no work-experience page. The roadmap cards are `<article>`, not links, for
   the same reason — wrap them in `<Link>` once a destination exists.
5. **Hobby carousels have empty frames** (`src.: null` + a `placeholder` label)
   waiting on real photography. Travel 3 frames, running 3, triathlon 2, food 2.
6. **Every string in `src/data/` is still placeholder-grade.** PRs say `0:00:00`,
   travel pins are invented cities, project bodies say "Placeholder".
7. `profile.claims` and `profile.elsewhere` are kept but **not rendered**.
8. Mobile fluid still unverified on a real device (`?fluiddebug=1`).
9. No OG image, sitemap, or analytics.
10. On mobile the roadmap's commercial cards keep their accent border on the
    *right* (away from the spine), matching the prototype's CSS. Arguably it
    should flip to the spine-facing side; left faithful to the reference.
