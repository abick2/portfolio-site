"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot scroll reveal.
 *
 * Sections fade and rise the first time they come into view, and then stay put
 * — scrolling back up does not replay the page, because an entrance that
 * repeats stops reading as an entrance.
 *
 * NEVER wrap the hero in this. The CSS animates `opacity` and `transform`, and
 * either one creates a stacking context, which isolates blending and silently
 * kills the `.knockout` mix-blend effect in `globals.css`.
 */
export default function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // Reduced motion, or a browser without IntersectionObserver: skip straight
    // to the end state rather than leaving the section hidden.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // A little margin off the bottom so the reveal has started by the time
      // the section is properly on screen, rather than firing under the fold.
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div ref={ref} className={className} data-reveal={shown ? "in" : "out"}>
      {children}
    </div>
  );
}
