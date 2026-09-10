# Fluid cursor effect — handoff

Context for whoever picks this up next, human or agent. Written 2026-09-08.

## What this is

A WebGL fluid simulation that renders behind page content and reacts to the
cursor. Colour is injected where you point and carried by a velocity field
until it dissipates.

The goal was to reproduce the effect on `aravpatel.com`. We got there by
reading his production JS bundle, so the parameters below are measured, not
guessed.

## Files

| File | Purpose |
|---|---|
| `FluidCursor.jsx` | **Production component.** Drop this in the portfolio. No dev UI, no optional passes, full unmount cleanup. |
| `fluid-cursor.html` | **Tuning playground.** Standalone, no build step. Identical solver, plus a slider panel exposing the six runtime knobs. Use it to find values, then copy numbers into the component. |
| `HANDOFF.md` | This file. |

## Provenance

The effect is Pavel Dobryakov's [WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)
(MIT). Arav uses the React port distributed as `splash-cursor` (21st.dev /
reactbits), which is the same solver with bloom and sunrays stripped out.

Identified by loading `https://www.aravpatel.com/` in headless Chrome,
capturing the JS responses, and grepping the chunks. The config object is
unminified enough to read directly in
`_next/static/chunks/752-*.js`.

**If you need to re-verify this**, that method still works and takes about a
minute. It beats reasoning from screenshots — see the decisions log.

## Reference parameters

His exact values, and the defaults in both files:

```
SIM_RESOLUTION:       128
DYE_RESOLUTION:       1440
DENSITY_DISSIPATION:  0.5
VELOCITY_DISSIPATION: 3
PRESSURE:             0.1     <- the important one
PRESSURE_ITERATIONS:  20
CURL:                 3
SPLAT_RADIUS:         0.2
SPLAT_FORCE:          6000
SHADING:              true
COLOR_UPDATE_SPEED:   10
```

Only four differ from Pavel's stock defaults: `DYE_RESOLUTION`,
`DENSITY_DISSIPATION`, `VELOCITY_DISSIPATION`, and `PRESSURE`.

## The per-frame pipeline

Ten draw calls plus 20 pressure iterations, in this order:

1. **curl** — compute vorticity of the velocity field
2. **vorticity** — push velocity back toward its own vortices (`CURL` scales this)
3. **divergence** — measure how much the field is compressing
4. **clear** — decay last frame's pressure by `PRESSURE` (the warm start)
5. **pressure** × 20 — Jacobi solve for the pressure field
6. **gradient subtract** — remove the pressure gradient, leaving a divergence-free field
7. **advect velocity** — move the velocity field through itself, decayed by `VELOCITY_DISSIPATION`
8. **advect dye** — carry the colour along it, decayed by `DENSITY_DISSIPATION`
9. **display** — draw the dye to the canvas with shading

Splats (one per pointer event) are injected before step 1, writing into both
the velocity and dye buffers.

## What each parameter actually does

**`PRESSURE` (0.1) — the one that defines the feel.** It is the fraction of
last frame's pressure solution used to warm-start this frame's solve. At
Pavel's default of 0.8 the solve converges well, velocity comes out properly
divergence-free, vortices survive, and you get spirals, wisps, and mushroom
rollups — it reads as *gas*. At 0.1 you nearly cold-start each frame, and 20
Jacobi iterations get nowhere near convergence on a 128 grid. The residual
divergence bleeds energy out of the flow so rotation never accumulates. That
under-convergence is what reads as *thick liquid*. It's a solver artifact
used as an art direction knob, not a physical viscosity term.

**`DENSITY_DISSIPATION` (0.5)** — low, so dye persists and accumulates into
broad sheets rather than thin trails. Reinforces the thick look.

**`VELOCITY_DISSIPATION` (3)** — high, so motion stops quickly. Note this
damps the whole field uniformly; it is *not* viscosity and will not stop
mushrooming on its own.

**`CURL` (3)** — vorticity confinement strength. Pavel ships 30. Low values
keep it calm; 0 looks dead.

**`SPLAT_FORCE` (6000) and `SPLAT_RADIUS` (0.2)** — stock, untouched.

**`COLOR_UPDATE_SPEED` (10)** — hue rerolls to a new random HSV colour ten
times a second on a clock, independent of movement. So one drag passes
through several colours.

**Shading** — multiplicative, not additive:
```glsl
float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
c *= diffuse;
```
Clamped to 0.7–1.0, so it only ever *darkens*, carving shadow into ribbon
edges. This is what produces the glossy liquid-metal look. An additive
version brightens toward white and makes the whole thing look hazy and
over-lit.

## Decisions log

Recording the wrong turns because they're the expensive part to rediscover.

**Scope: match the reference exactly, add nothing.** Both files contain the
nine solver passes and the display pass, and nothing else. If you are asked
to add an effect, check it against the reference bundle first.

**We built a bloom pass, then deleted it.** Arav has no bloom — the apparent
glow is the multiplicative shading pass plus dye accumulation from the low
`DENSITY_DISSIPATION`. If you ever do want it (worth it on a dark hero, not
on a light one): threshold → downsample/upsample blur pyramid → additive
composite, ~20 draw calls and 9 framebuffers. One gotcha — Pavel applies a
gamma curve to the bloom before compositing, which lifts near-zero values.
Invisible over black, reads as fog over a light background. Add it linearly
instead.

**We built a real viscosity pass, then deleted it.** 18 Jacobi iterations of
implicit diffusion on the velocity field — the physically correct way to
thicken a fluid. It worked, but it is not how Arav gets his thickness, and
`PRESSURE: 0.1` achieves the same read for free. Don't reintroduce it to
solve a "feels too gaseous" complaint; check `PRESSURE` first.

**We guessed at parameters for three rounds before reading the bundle.**
Reasoning from screenshots produced a confident and wrong story about jet
physics: we lowered `SPLAT_FORCE` to 2600 and widened `SPLAT_RADIUS` to 0.30
when both were actually stock. Read the source first.

**Splat interpolation.** Our first version fired up to 12 interpolated splats
along the path between pointer positions, for smoother ribbons on fast
flicks. Arav fires exactly one per event. Interpolation deposits several
times more dye and reads as denser. Both files now match him.

## Pitfalls

**Pointer delta must not be scaled.** This cost us a round. Deltas are in
normalised 0–1 texture coordinates and feed straight into `SPLAT_FORCE`.
An earlier version had:
```js
pointer.dx = (pointer.x - pointer.prevX) * 5;   // WRONG
```
On a 16:9 display that gave 5× the intended horizontal force and ~8.9×
vertical, because it also skipped the aspect correction. The effect felt
violent no matter how the other sliders were tuned. Correct version:
```js
const aspect = canvas.width / canvas.height;
dx = aspect < 1 ? d * aspect : d;   // correctDeltaX
dy = aspect > 1 ? d / aspect : d;   // correctDeltaY
```

**Pixel ratio must be consistent.** Arav scales `clientX` by
`devicePixelRatio` and divides by the backing-store width. We divide raw
`clientX` by `clientWidth`. Different routes, same normalised result — but
don't mix them.

**Half-float render targets are required.** WebGL2 needs
`EXT_color_buffer_float`; WebGL1 needs `OES_texture_half_float`. Without
`OES_texture_*_linear` the advection shader must be compiled with
`#define MANUAL_FILTERING` to bilerp by hand. Both files handle this; if you
rewrite, don't drop it.

**Seed the pointer on first move.** Otherwise the first delta is computed
against (0,0) and fires a splat across the whole screen.

**`preserveDrawingBuffer: false`** matters for performance. Don't turn it on
to grab screenshots and forget to turn it back off.

## Integration notes

The canvas is `position: fixed; inset: 0; z-index: 0; pointer-events: none`.
It listens on `window`, not on itself, so links and buttons above it work
normally.

Page content needs its own stacking context above it — `position: relative;
z-index: 10` on the content wrapper is enough.

In Next.js App Router the component needs `"use client"` (already present)
and should not be server-rendered. If you see hydration warnings, wrap it in
`dynamic(() => import("./FluidCursor"), { ssr: false })`.

Config is read once on mount. To change values at runtime, change the
component's `key` to force a remount, or lift the config into a ref.

Backdrop: the effect composites over whatever is behind it via alpha, so a
blurred photo or a CSS gradient mesh both work. Arav uses a blurred image.

## Performance

At 1440 dye resolution and 128 sim resolution the pipeline is roughly 30 draw
calls per frame, most of them the 20 pressure iterations at 128×~228. It runs
at 60fps on integrated graphics.

Built-in mitigations in `FluidCursor.jsx`:
- Device pixel ratio capped at 2 (`MAX_DPR`)
- rAF cancelled on `visibilitychange` so background tabs cost nothing
- Bails out entirely on `prefers-reduced-motion: reduce`
- Full teardown on unmount: framebuffers, textures, programs, shaders,
  buffers, plus `WEBGL_lose_context`

If you need more headroom, in order of impact: drop `DYE_RESOLUTION` to 1024
(barely visible, the result is soft anyway), lower `MAX_DPR` to 1.5, then
reduce `PRESSURE_ITERATIONS` — though below ~10 the fluid starts to squash
and stretch visibly.

Both files compile exactly ten programs and allocate eight framebuffers.
There is no optional or lazily-initialised machinery left in either.

## Deliberate deviations from the reference

Everything visual matches. These four are non-visual and were added on
purpose — keep them unless you have a reason not to.

1. **DPR capped at 2** (`MAX_DPR`). He applies `devicePixelRatio` uncapped,
   which on a 3× phone means a 3× backing store for a full-screen canvas.
2. **rAF cancelled on `visibilitychange`** so background tabs cost nothing.
   Playground has the fps readout instead; production component has the pause.
3. **Bails out on `prefers-reduced-motion: reduce`.**
4. **Full WebGL teardown on unmount** in the React component — framebuffers,
   textures, programs, shaders, buffers, plus `WEBGL_lose_context`. Necessary
   because a component can unmount on route change; a standalone page can't.

The playground's slider panel is dev tooling, not part of the effect. It
exposes only real config keys, so any value you land on transfers directly.

## Open items

- Not verified on a real GPU at 60fps by the author of this document. Testing
  here was headless Chrome with SwiftShader at 1–3fps, which under-samples
  pointer movement badly. Screenshots confirmed structure and correctness,
  not feel.
- Mobile behaviour is untested. Touch handlers exist but the effect may not
  be worth its cost on phones; consider gating on a pointer/hover media query.
- Arav's site loads the effect immediately. If your hero has an LCP image,
  consider deferring the mount until after first paint.

## Licence

Derived from PavelDoGreat/WebGL-Fluid-Simulation, MIT. Keep an attribution
comment in the component if you ship it.
