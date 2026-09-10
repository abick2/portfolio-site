# Handoff

**Date:** 2026-09-10
**Last commit:** `a26e9c5` (initial commit, local only — no remote configured)

## What this is

A personal portfolio site for Andrew Bickford, built as a "living resume" rather
than a CV: work history, personal projects, and hobbies (travel, triathlon,
running, food) given equal weight. The positioning it argues is that he is a
*connector* and *translator* between worlds — defense/intelligence and
commercial consulting, engineers and customers. That thesis drives the design,
not just the copy.

The signature element is a WebGL fluid simulation running behind all content and
reacting to the cursor. It is treated as the argument, not wallpaper: separate
colours mixing in a shared field, with the hero headline composited *through* it.

## Stack

- **Next.js 16.3.4** (App Router, Turbopack) / **React 19.3** / **TypeScript 7**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/app/globals.css`
- **Biome** for lint/format (NOT ESLint — see gotchas)
- **d3-geo + topojson-client + world-atlas** for the travel map
- **puppeteer-core** (dev only) for the QA screenshot harness
- `output: "export"` — pure static site, no server, no database, no env vars.
  Deploys to Vercel/Netlify/Cloudflare Pages/GitHub Pages as plain files.

## Structure

```
src/app/         layout, page, globals.css, not-found, icon.svg, apple-icon.png
  projects/[slug]/   6 static project pages
  play/[slug]/       travel · triathlon · running · food
src/components/  Backdrop, FluidCursor(.jsx + .d.ts), Nav, Hero, Claims,
                 Weave, ProjectMosaic, PlayTiles, About, Footer,
                 WorldMap (server) + WorldMapView (client), PRTable
src/data/        profile, experience, projects, athletics, travel, play
scripts/         make-placeholders.mjs, shot.mjs (QA harness), token-usage.mjs
reference-material/  FluidCursor source + HANDOFF.md (fluid provenance)
```

All content lives in `src/data/*.ts`. Components hardcode nothing.

## Bugs fixed this session

1. **Fluid rendered nothing in dev.** The reference component called
   `WEBGL_lose_context.loseContext()` on unmount. A context belongs to the
   `<canvas>` element, not the component, and React Strict Mode remounts onto
   the *same* node — so the teardown permanently bricked it and every draw call
   no-oped silently. Removed. Do not reinstate.
2. **Hero blend did nothing.** `mix-blend-mode: multiply` outputs
   `backdrop x source`; with near-black ink it is mathematically incapable of
   tinting. Switched to `difference` with a white source. Contrast measured at
   18.45:1 under maximum dye accumulation.
3. **Dev-indicator error** was a `404 /favicon.ico`. Added `icon.svg` and
   `apple-icon.png`.
4. **No linting at all.** `next lint` was removed in Next 16 and the `lint`
   script failed with a nonsense path error. Six `eslint-disable` comments were
   inert placebos. Now Biome.
5. **`JSX.Element` in `FluidCursor.d.ts`** did not resolve under React 19 types;
   `skipLibCheck` was hiding it.
6. **404 page emitted two `<title>` elements.** Added `not-found.tsx`.
7. **Weave tracks never ran parallel** — `md:col-start-*` pins the column but
   not the row, so every role got its own row with the opposite column empty.
   Restructured into segments split at each crossing.
8. **Mosaic did not resolve at `lg`** — a zero-height row and a 2-column orphan
   hole. Reordered `projects` so the `tall` card no longer starts the last row.
9. **Card titles were clipped out of existence** at 320px and 640px — the glass
   panel is absolutely positioned inside `overflow-hidden`.
10. **Horizontal scroll at ≤370px** from a `shrink-0` crossing label.
11. **Fluid on mobile**: framebuffers leaked on every resize (22 textures became
    174 over 20 resizes, zero deletes); portrait dye buffer was *larger* than
    desktop (72 MB vs 53 MB); no WebGL1 fallback; no context-loss handler;
    reduced-motion rendered a blank page.
12. **Accessibility**: heading-level skips, sub-AA contrast on chips and
    `.t-small` over dye, 11px map hit targets, no Escape on the mobile menu, no
    skip link, `aria-pressed` misuse, missing row headers.

## Non-obvious decisions

- **`layout.tsx` content wrapper has NO `z-index`, deliberately.** Any z-index
  creates a stacking context, and that isolates blending — it would break the
  hero's `mix-blend-mode`. Plain `relative` still stacks above the fixed
  backdrop by DOM order.
- **Glass opacity is a contrast control, not just a look.** The fluid canvas
  composites above the paper veil, so dye tints the ground behind every panel.
  Raising `.glass-*` white percentages is what keeps small text legible.
- **`w-full` on mosaic cards is load-bearing.** With only `min-h` and
  `aspect-ratio`, the ratio resolves against the height and inflates the width.
- **`corner-shape: squircle` is progressive**, with a `border-radius` fallback.
- **Fluid parameters are measured, not guessed** — see
  `reference-material/HANDOFF.md` before touching any of them. `PRESSURE: 0.1`
  is what makes it read as thick liquid rather than gas.

## Known gaps / next steps

1. **Push to a remote.** The repo is initialized and committed locally, but no
   remote exists, so nothing is backed up off this machine. Create a GitHub repo
   and `git remote add origin … && git push -u origin main`.
2. **Every string in `src/data/` is placeholder.** No real job history, race
   times, or travel. Job titles say "Placeholder Title", PRs say `0:00:00`, and
   the travel pins are invented cities. This is the biggest blocker to shipping.
3. **No real images.** The 22 files in `public/images/` are generated gradient
   placeholders from `scripts/make-placeholders.mjs`.
4. **Mobile fluid is fixed but unverified on the real device.** Load
   `?fluiddebug=1` on the phone; the badge names the exact branch taken. Also
   worth checking Settings → Accessibility → Motion → Reduce Motion.
5. **Map pins should become HTML buttons** overlaid on the SVG — better
   screen-reader semantics and CSS-pixel hit targets.
6. **AI/knowledge-base feature** deferred by request during the initial build.
7. **Hero copy says "Move your cursor"**, which is wrong on a phone.
8. No OG image, sitemap, or analytics.
