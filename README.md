# Portfolio site

Andrew Bickford's portfolio: a static Next.js 16 site, hung like a gallery,
with a WebGL fluid effect on the home hero. No database, no serverless
functions, no environment variables.

```bash
npm run dev        # http://localhost:3000
npm run build      # static export into ./out
npm run lint       # Biome
npm run lint:fix   # Biome, applying safe fixes
```

## Where things live

| Path | Holds |
|---|---|
| `src/data/` | All content: profile, roles, projects, hobbies, race times, travel |
| `src/components/` | Page sections and shared pieces (`Frame`, `Section`, `ExternalLink`) |
| `src/app/globals.css` | Design tokens and type classes |
| `public/images/` | Photographs and live-site screenshots |
| `PRODUCT.md`, `DESIGN.md` | Who the site is for, and the visual system |

An image `src` of `null` renders as a "Photo to come" frame. Every image takes
an optional `position` (any CSS `object-position`) to adjust its crop.

## Scripts

- `node scripts/shot.mjs <url> <out.png> [w] [h] [--full]` screenshots a page.
  Measure the fluid this way; canvas pixel readback returns empty.
- `node scripts/image-audit.mjs` (after a build) finds images that are too big
  or too small for their frames.
- `node scripts/image-resize.mjs --max <px> <files…>` re-encodes through Chrome.
- `node scripts/site-preview.mjs [name]` re-shoots the live-site covers.

## Notes

- **Biome, not ESLint.** `next lint` is gone in Next 16, and
  `eslint-config-next` will not load under TypeScript 7.
- **The fluid** is derived from
  [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)
  (MIT); keep the footer credit. Add `?fluiddebug=1` to any URL to see which
  rendering path it took.
- **Deploying:** the build output is static files, so any static host works.
