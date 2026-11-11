"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FluidCursor from "./FluidCursor";

/**
 * The fluid simulation, on the home page's first screen only.
 *
 * It used to run behind every paragraph and photograph on the site, which is
 * what made it distracting: it competed with the pictures. Now it belongs to
 * the title wall. It fades out over the first 80% of a viewport of scroll, and
 * once it is fully transparent the render loop stops, so it costs nothing
 * while the visitor is looking at anything else.
 *
 * The wrapper is `fixed` and sits beneath the content by DOM order. Its
 * opacity makes it a stacking context of its own, which is fine — the hero
 * name blends with the composited result. What must never happen is a
 * stacking context on the CONTENT side, between the name and this.
 */
export default function Backdrop() {
  const pathname = usePathname();
  const fade = useHeroFade();

  if (pathname !== "/") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ opacity: fade }}
    >
      <FluidCursor paused={fade === 0} />
    </div>
  );
}

/**
 * 1 at the top of the page, 0 once the hero has mostly scrolled away.
 *
 * Runs under reduced motion too. There the canvas shows a still field, and
 * if it never faded it would sit behind the whole page. Fading on scroll is
 * the visitor's own movement, not animation.
 */
function useHeroFade(): number {
  const [fade, setFade] = useState(1);

  useEffect(() => {
    let last = -1;
    const onScroll = () => {
      const p = window.scrollY / (window.innerHeight * 0.8);
      // Fully visible for the first 30%, then out by 100%.
      const next = Math.max(0, Math.min(1, 1 - (p - 0.3) / 0.7));
      // A threshold, not a throttle: about one render per 1% of opacity.
      if (Math.abs(next - last) > 0.01 || (next === 0 && last !== 0)) {
        last = next;
        setFade(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return fade;
}
