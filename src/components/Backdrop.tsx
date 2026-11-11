"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FluidCursor from "./FluidCursor";

/**
 * The fluid simulation, home hero only. It fades out on scroll and its render
 * loop pauses once invisible. The wrapper's opacity makes it a stacking context
 * of its own, which is fine; the content side must never become one.
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

/** 1 at the top, 0 once the hero has scrolled away. Runs under reduced motion too, so the still fallback fades as well. */
function useHeroFade(): number {
  const [fade, setFade] = useState(1);

  useEffect(() => {
    let last = -1;
    const onScroll = () => {
      const p = window.scrollY / (window.innerHeight * 0.8);
      // Fully visible for the first 30%, then out by 100%.
      const next = Math.max(0, Math.min(1, 1 - (p - 0.3) / 0.7));
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
