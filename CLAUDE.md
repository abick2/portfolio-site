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
- **The `t-*`, `glass-*`, `.photo-lift` and `sq-*` classes are UNLAYERED CSS,
  so they beat every Tailwind utility** regardless of specificity — Tailwind v4
  puts utilities in `@layer utilities`, and unlayered always wins. Two
  consequences that both fail silently: `text-[1.25rem]` on a `.t-title`
  element does nothing (use an inline `style`), and `hover:shadow-[…]` on a
  `.glass-*` / `.photo-lift` surface does nothing (use the `.lift-*` classes in
  `globals.css`). Check the built stylesheet in `out/_next/static/chunks/*.css`
  before believing a utility applied.
- **Tailwind v4 compiles `-translate-y-*` and `scale-*` to the separate
  `translate` / `scale` CSS properties**, not `transform`. So
  `transition-[transform,…]` animates nothing and the effect snaps — name
  `translate,scale` in an arbitrary transition list. (`transition-transform` is
  fine; v4 expands it to all four.) For the same reason, read `translate` /
  `scale` — not `transform` — when measuring a hover in devtools or puppeteer.
- **`npm run lint` was already failing on `main`** before the redesign branch:
  `biome.json` pins schema 2.3.14 while `^2.5.12` is installed and the newer
  formatter disagrees. Don't read a formatting diff as someone's edit.
- **Test overflow with a real `node_modules`, not a symlink.** Turbopack
  refuses a `node_modules` symlink that points outside the project root, so a
  git-worktree build needs `cp -Rc node_modules <worktree>/` (APFS clone,
  ~2s).

## Workflow preferences

- **Investigate, don't guess.** Reproduce with real measurements before claiming
  a cause — the fluid work has burned multiple rounds on confident wrong stories.
  Say explicitly what is CONFIRMED versus SUSPECTED.
- Ask clarifying questions up front on ambiguous requirements rather than
  assuming.
- Terminate every background process (dev servers especially) before finishing.
- Token usage is tracked per session: `npm run tokens` prints it,
  `node scripts/token-usage.mjs --write` appends to `TOKEN-LOG.md`.
- Commits are the user's call — do not commit or push unless asked. "Use a new
  branch" does imply committing there; it does not imply pushing.
- When `biome check --write` is run over the whole tree, it reformats files the
  task never touched. Split that churn into its own commit so the real diff
  stays readable, and prove it is formatting-only by re-running `biome format`
  on the original and diffing.
- Design-handoff copy is not automatically correct. Check it against the rest of
  the page before shipping it — the About paragraph asserted a current job the
  roadmap on the same screen contradicts.
