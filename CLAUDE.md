@AGENTS.md

# Project notes

Static Next.js 16 portfolio site with a WebGL fluid backdrop. Read `handoff.md`
for full project state, and `reference-material/HANDOFF.md` before touching any
fluid-simulation parameter.

## Gotchas that will cost you a round if you rediscover them

- **`next lint` no longer exists** (removed in Next 16). This project uses
  **Biome**, not ESLint — `eslint-config-next` depends on `typescript-eslint`,
  which refuses to load under TypeScript 7. Run `npm run lint`.
- **Never call `loseContext()` when tearing down `FluidCursor`.** The WebGL
  context belongs to the `<canvas>` element; React Strict Mode remounts onto the
  same node, so losing the context bricks it permanently and silently.
- **`layout.tsx`'s content wrapper must not have a `z-index`.** It would create
  a stacking context, which isolates blending and kills the hero effect.
- **Measure the fluid by screenshot, never by canvas pixel readback.**
  `preserveDrawingBuffer: false` means `getImageData` returns empty even when
  the effect is rendering perfectly. Use `node scripts/shot.mjs`.
- **`isMobile: true` in puppeteer hides horizontal overflow** — Chrome expands
  the layout viewport to fit content, so `scrollWidth === innerWidth` reads
  clean at 320px when the page genuinely overflows. Test overflow without it.
- **`aspect-ratio` + `min-height` with no definite width inflates the width.**
  This caused page-wide horizontal scroll. Add `w-full`.
- **Lightning CSS strips the unprefixed `backdrop-filter`.** A hand-written
  `backdrop-filter` in `globals.css` is rewritten to `-webkit-backdrop-filter`
  *only*, and Chrome then applies nothing — `.glass-1/2/3` currently render as
  flat tint, not frosted glass. Tailwind's `backdrop-blur-*` utilities emit both
  spellings, so use those. Verify with
  `getComputedStyle(el).backdropFilter !== "none"`.
- **`shot.mjs --full` cannot photograph anything below the fold any more.**
  puppeteer's fullPage capture never scrolls, so no `IntersectionObserver`
  fires and every `[data-reveal]` section comes out blank. Use
  `scripts/shot-section.mjs`, which scrolls first.
- **`backdrop-filter` is dropped entirely under SwiftShader**, so headless
  screenshots can never confirm a blur. Check it headful.
- **`biome-ignore` must be the single comment line immediately above the node.**
  A multi-line `//` rationale above it, or the comment sitting on an attribute
  rather than the JSX element, both silently produce "suppression has no effect".
- **Page width lives in `--shell-max` / `--shell-pad`, not in class names.**
  Every full-width band uses `.shell`; there is no `max-w-6xl` left in `src/`.
  Change the two tokens in `globals.css`, not fourteen components. If you raise
  `--shell-max`, raise the `t-hero` cap with it — the headline clamps out and
  will otherwise just gain dead space rather than growing.
- **Do not run `biome check --write` across `src/`.** It rewrites real tokens in
  `FluidCursor.jsx` (not just whitespace) — the file is a vendored port and the
  diff is unreviewable. Format the files you actually touched, by name.

- **`focus()` into an `inert` subtree silently does nothing.** The lightbox
  marks every non-current slide inert, so restoring focus to the thumbnail you
  *opened* from drops the visitor on `<body>` as soon as they have arrowed
  away. Restore to the current slide's trigger instead.

- **`?fluiddebug=1`** on any URL shows which branch the fluid took. Use it for
  device debugging.

## Workflow preferences

- **Investigate, don't guess.** Reproduce with real measurements before claiming
  a cause — the fluid work has burned multiple rounds on confident wrong stories.
  Say explicitly what is CONFIRMED versus SUSPECTED.
- Ask clarifying questions up front on ambiguous requirements rather than
  assuming.
- Terminate every background process (dev servers especially) before finishing.
- Token usage is tracked per session: `npm run tokens` prints it,
  `node scripts/token-usage.mjs --write` appends to `TOKEN-LOG.md`.
- Commits are the user's call — do not commit or push unless asked.
