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
- **`biome.json` pins schema 2.3.14 while `^2.5.12` is installed.** This used to
  leave `npm run lint` failing on `main`; as of 2026-09-14 the tree is clean and
  lint passes, so a formatting failure now means a real unformatted edit — often
  the user's, made in their editor. Format the file, don't assume it is noise.
- **Mosaic card shapes are set by `min-h`, not by `aspect-[4/3]`.** The
  min-height is taller than the ratio at every width, so it wins: a `unit` card
  is ~355x352 (square) and the `tall` card is ~355x932. The tall one also
  depends on what it is sitting beside, so **reordering `projects` changes it**.
  Never size a cover image to the class — measure the built page.
- **`sips` has an inefficient JPEG encoder** (~0.44 bytes/px at q70, and its
  quality scale is not libjpeg's). To resize or re-encode a photo, drive
  Chrome's encoder through puppeteer with an `OffscreenCanvas` +
  `convertToBlob` — same tool that already screenshots. It also bakes EXIF
  orientation into the pixels, which removes a whole class of surprise. `sips`
  on this machine cannot write WebP at all.
- **`object-position` does nothing on an image cut to its frame's exact ratio.**
  If a cover needs to be nudgeable, shoot it a few percent off the frame's
  shape on purpose so there is something to slide.
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
- **The user edits files in their own editor while you work.** Before
  committing, read `git diff` and look for changes you did not make — this
  session `src/data/experience.ts` and a hobby cover swap in `play.ts` appeared
  mid-task. Commit their work separately from yours rather than folding it in.
- Design-handoff copy is not automatically correct. Check it against the rest of
  the page before shipping it — the About paragraph asserted a current job the
  roadmap on the same screen contradicts.

## Image pipeline

- `node scripts/site-preview.mjs [name]` re-captures the live-site screenshots
  used as project covers. Run it when one of those sites is redesigned, or when
  a mosaic reorder changes a card's shape.
- Every image can be re-cropped by hand: `position` (any CSS `object-position`
  value) on `ProjectImage` in `src/data/projects.ts` and on `GalleryFrame` in
  `src/data/play.ts`. Applied inline, because Tailwind cannot compile a class it
  only sees at runtime.
- Size new photos against measured render width, not against the file. Large
  photos ship at 1.5x, which is invisible on photographs and halves the bytes.
