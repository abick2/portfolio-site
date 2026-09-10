import FluidCursor from "./FluidCursor";

/**
 * The full-viewport background: a blurred image with the fluid simulation
 * composited over it.
 *
 * Layering — all three are `position: fixed`, all at z-index 0, so DOM order is
 * what stacks them. Page content sits above at z-10.
 *
 *   1. blurred image (or the gradient mesh fallback)
 *   2. a paper-toned veil that keeps text legible over any photo
 *   3. the fluid canvas, pointer-events: none
 *
 * To use a real photo, drop it at /public/images/backdrop.jpg and set
 * BACKDROP_IMAGE below. Until then the mesh stands in — the handoff notes
 * either works, since the fluid composites over whatever is behind it.
 */

/** Set to a path like "/images/backdrop.jpg" to use a photo instead of the mesh. */
const BACKDROP_IMAGE: string | null = null;

export default function Backdrop() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0"
        style={
          BACKDROP_IMAGE
            ? {
                backgroundImage: `url(${BACKDROP_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                // Scaled up so the blur does not pull transparent edges inward.
                filter: "blur(64px) saturate(125%)",
                transform: "scale(1.15)",
              }
            : {
                background: `
                  radial-gradient(60% 55% at 12% 18%, oklch(0.88 0.09 285 / 0.85), transparent 70%),
                  radial-gradient(55% 50% at 88% 12%, oklch(0.89 0.08 350 / 0.75), transparent 68%),
                  radial-gradient(70% 60% at 72% 88%, oklch(0.90 0.07 240 / 0.8), transparent 72%),
                  radial-gradient(50% 45% at 30% 78%, oklch(0.92 0.06 200 / 0.7), transparent 70%),
                  var(--color-paper)
                `,
              }
        }
      />

      {/* Keeps body copy readable whatever the backdrop is doing underneath. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.97 0.008 260 / 0.55), oklch(0.97 0.008 260 / 0.78))",
        }}
      />

      <FluidCursor />
    </>
  );
}
