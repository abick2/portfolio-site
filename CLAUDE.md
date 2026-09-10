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
