# Handoff

**Date:** 2026-09-14 (second session)
**Branch:** `site-previews-and-image-weight` (2 commits ahead of `main`, **not pushed**)
**Last commit:** `69c5028` — Correct the roles on the career roadmap

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

## Session 1: the Direction A redesign

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

## Bugs found and fixed in session 1

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

## Session 2: live-site previews, crop control, image weight

### Project covers are now screenshots of the live sites

Three projects link out to something running — venture portfolio, triathlon
training, Blacksburg road coverage. Each now leads with a capture of that
site's own landing page, and the detail page's hero image is itself a link to
the site (hover reveals a `venture-sim.vercel.app ↗` pill; the pill is
hover-only because all three sites put their nav in the top-right of the shot,
where a permanent badge read as part of the screenshot).

`scripts/site-preview.mjs` takes them. Re-run it when one of those sites is
redesigned; pass a name to do just one:

```
node scripts/site-preview.mjs            # all three
node scripts/site-preview.mjs coverage   # just one
```

**Two shots per site**, because the two frames a cover lands in crop it very
differently, and the edges of a screenshot are what carry the logo and the nav:

| suffix   | frame                          | shot at                       |
| -------- | ------------------------------ | ----------------------------- |
| `-cover` | the mosaic card                | the card's own measured shape |
| `-hero`  | the detail page's 16/9 frame   | exactly 16/9, so nothing crops |

`coverWide` (optional on `ProjectImage`) is what the detail page reaches for,
falling back to `cover`. Both images render `object-top`, so whatever a frame
does crop comes off the bottom — a screenshot is read from the top.

### Mosaic reordered

Now venture → triathlon → drone / coverage (tall) → gaggia → edge AI. The spans
still resolve exactly against the six-column grid — measured on the built page
at 1440/1280/1100, no gaps, no horizontal overflow:

```
row 1   [ unit 2 ][ unit 2 ][ unit 2 ]
row 2   [ tall 2 ][ wide          4 ]
row 3   [   ↑    ][ wide          4 ]
```

Reordering moved the `tall` card from 355x827 to 355x932, which is why the
coverage capture was re-shot. **Any future reorder needs the same check.**

### Manual crop dial on every image

`position` — optional on `ProjectImage` (`src/data/projects.ts`) and on
`GalleryFrame` (`src/data/play.ts`) — takes any CSS `object-position` value and
is applied as an inline style:

```ts
cover: { src: "…", alt: "…", position: "58% 0%" }  // higher = image moves left
```

Inline rather than a Tailwind class because Tailwind cannot compile a class it
only sees at runtime. The two hard-coded portraits (`About.tsx`, `Hero.tsx`)
carry the same dial as a literal `object-center` class with a comment.

**It only bites where the image is off-ratio from its frame.** The coverage
capture was originally cut to the card's exact ratio, so `position` could not
move it at all; the shot is now deliberately ~5% wider than the frame to leave
something to slide. More headroom than that and the crop starts eating the
sidebar's left padding and clipping the "Blacksburg" title.

### Uploaded photos downsized

Four camera JPEGs totalling **7.2 MB** came in at up to 4032px for frames that
render at 355–1104 CSS px. Now **900 KB**, sized against measured render width:

| file                          | was            | now         |
| ----------------------------- | -------------- | ----------- |
| `projects/racing-drone.jpeg`  | 4032px, 2.8 MB | 1656px, 290 KB |
| `projects/gaggia-pic.jpeg`    | 4032px, 2.5 MB | 1656px, 198 KB |
| `hobbies/running-cover.jpeg`  | 3600px, 1.1 MB | 1400px, 169 KB |
| `hobbies/triathlon-cover.jpeg`| 1024px, 464 KB | 1024px, 241 KB |

`portrait/profile_pic.jpg` was already right-sized (900px for an 838px need)
and was left alone. Large photos are at 1.5x rather than 2x — the same call the
site-preview heroes make, and invisible on photographs.

Verified before/after that Chrome reports **identical** rendered ratios
(0.750 and 1.333), so no crop moved. EXIF orientation is now baked into the
pixels rather than carried as a tag.

### Bug fixed: the running photo never showed

`src/data/play.ts` referenced `"running-cover.jpeg"` with no directory prefix,
so it resolved against the document URL and 404'd at `/running-cover.jpeg`.
Every other gallery entry is root-absolute. The file itself was always fine.

## Verification performed (session 1)

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
3. ~~Job titles in the roadmap are guesses.~~ **Resolved** — real titles and
   dates landed in `src/data/experience.ts` (commit `69c5028`). The `summary`
   and `highlights` on each role are still `"Placeholder"`.
4. **"Go deeper on work experience" points at LinkedIn** as a stand-in; there is
   no work-experience page. The roadmap cards are `<article>`, not links, for
   the same reason — wrap them in `<Link>` once a destination exists.
5. **Hobby carousels still have empty frames** (`src: null` + a `placeholder`
   label) waiting on real photography. Running and triathlon now have their
   first frame; travel and food are still fully placeholder.
   **`/play/running/` renders no gallery at all** — `src/app/play/[slug]/page.tsx`
   never renders `area.gallery`, so a hobby cover does not reach the detail
   page. Pre-existing; worth wiring up now that real photos exist.
6. **Most strings in `src/data/` are still placeholder-grade.** Travel pins are
   invented cities and several project bodies say "Placeholder". The three
   live-site projects now have real covers but their `body` copy is still thin.
7. `profile.claims` and `profile.elsewhere` are kept but **not rendered**.
8. Mobile fluid still unverified on a real device (`?fluiddebug=1`).
9. No OG image, sitemap, or analytics.
10. On mobile the roadmap's commercial cards keep their accent border on the
    *right* (away from the spine), matching the prototype's CSS. Arguably it
    should flip to the spine-facing side; left faithful to the reference.
11. **Dead placeholder SVGs** left on disk and still generated by
    `scripts/make-placeholders.mjs`: `hobbies/running-cover.svg`,
    `hobbies/triathlon-cover.svg`, `projects/gaggia-cover.svg`,
    `projects/drone-build-cover.svg`. Nothing references them.
12. **Full-resolution originals of the four downsized photos are not in the
    repo.** They were backed up only to this session's scratchpad, which is
    temporary. Keep masters somewhere durable before the scratch dir is reaped.
