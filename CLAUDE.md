@AGENTS.md

# Project notes

Static Next.js 16 portfolio site. `PRODUCT.md` says who it is for, and
`DESIGN.md` records the visual system (the "gallery hang"): read both before
design work. Fluid parameter meanings live in `src/components/FluidCursor.d.ts`.

## Gotchas that will cost you a round if you rediscover them

- **`next lint` no longer exists** (removed in Next 16). This project uses
  **Biome**, not ESLint — `eslint-config-next` depends on `typescript-eslint`,
  which refuses to load under TypeScript 7. Run `npm run lint`.
- **Never call `loseContext()` when tearing down `FluidCursor`.** The WebGL
  context belongs to the `<canvas>` element; React Strict Mode remounts onto the
  same node, so losing the context bricks it permanently and silently.
- **Nothing between the hero `<h1>` and the fluid canvas may create a stacking
  context** — no `z-index` on `layout.tsx`'s wrapper, no transform/filter/sticky
  on the hero. It isolates the `.knockout` blend and the name goes blank.
- **Measure the fluid by screenshot, never by canvas pixel readback.**
  `preserveDrawingBuffer: false` means `getImageData` returns empty even when
  the effect is rendering perfectly. Use `node scripts/shot.mjs`.
- **`isMobile: true` in puppeteer hides horizontal overflow** — Chrome expands
  the layout viewport to fit content, so `scrollWidth === innerWidth` reads
  clean at 320px when the page genuinely overflows. Test overflow without it.
- **Full-page screenshots miss lazy images.** Scroll the page through before
  capturing, or every `loading="lazy"` frame comes out empty.
- **`aspect-ratio` + `min-height` with no definite width inflates the width.**
  This caused page-wide horizontal scroll once. Add `w-full`.
- **`?fluiddebug=1`** on any URL shows which branch the fluid took. Use it for
  device debugging.
- **The `t-*` type classes live in `@layer components`**, so a Tailwind utility
  on the same element wins (`t-section text-[2rem]` works). Anything added to
  `globals.css` outside a layer would beat every utility silently — keep new
  classes in `@layer components`.
- **Tailwind v4 compiles `-translate-y-*` and `scale-*` to the separate
  `translate` / `scale` CSS properties**, not `transform`. So
  `transition-[transform,…]` animates nothing and the effect snaps — name
  `translate,scale` in an arbitrary transition list. (`transition-transform` is
  fine; v4 expands it to all four.)
- **`biome.json` pins schema 2.3.14 while `^2.5.12` is installed.** Lint passes
  on a clean tree, so a formatting failure means a real unformatted edit — often
  the user's, made in their editor. Format the file, don't assume it is noise.
- **`sips` has an inefficient JPEG encoder** and cannot write WebP here. Resize
  through Chrome with `scripts/image-resize.mjs`.
- **`object-position` does nothing on an image cut to its frame's exact ratio.**
  If a cover needs to be nudgeable, shoot it a few percent off the frame's
  shape on purpose so there is something to slide.
- **Test overflow with a real `node_modules`, not a symlink.** Turbopack
  refuses a `node_modules` symlink that points outside the project root, so a
  git-worktree build needs `cp -Rc node_modules <worktree>/` (APFS clone).

## Workflow preferences

- **Investigate, don't guess.** Reproduce with real measurements before claiming
  a cause. Say explicitly what is CONFIRMED versus SUSPECTED.
- Ask clarifying questions up front on ambiguous requirements rather than
  assuming.
- Terminate every background process (dev servers especially) before finishing.
- Commits are the user's call — do not commit or push unless asked. "Use a new
  branch" does imply committing there; it does not imply pushing.
- When `biome check --write` is run over the whole tree, it reformats files the
  task never touched. Split that churn into its own commit so the real diff
  stays readable.
- **The user edits files in their own editor while you work.** Before
  committing, read `git diff` and look for changes you did not make. Commit
  their work separately from yours rather than folding it in.
- Copy in the data files is the user's. Flag typos or weak lines; don't
  silently rewrite them.
- **The home scroll carries teasers; detail lives on the detail page.** Each
  hobby on the home page gets ONE figure as an invitation; tables, maps and pin
  lists belong on `/play/<slug>`. Before a home section grows a second level of
  detail, check whether the hobby page already renders it.

## Image pipeline

- **`/image-review` runs the whole check** — audit, downsize, verify, report.
  Use it whenever photos are added, or before a push.
- `node scripts/image-audit.mjs` (after `npm run build`) measures every image
  against the device pixels its frame needs, at a desktop and a phone viewport,
  and prints the resize command for anything wasteful.
- `node scripts/image-resize.mjs --max <px> <files…>` re-encodes through Chrome
  and leaves a `<file>.orig` beside each one. Don't commit the `.orig` files.
- `node scripts/site-preview.mjs [name]` re-captures the live-site screenshots
  used as project covers (4:3 cover, 16:9 hero).
- Every image can be re-cropped with `position` (any CSS `object-position`) in
  `src/data/projects.ts` and `src/data/play.ts`. `src: null` renders as "Photo
  to come".
- Size new photos against measured render width, not against the file. Large
  photos ship at 1.5x, which is invisible on photographs and halves the bytes.
